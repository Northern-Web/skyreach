const { User }    = require('./../models/user.model');
const { Country } = require('./../models/country.model');
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
const jwt         = require("jsonwebtoken");
const processFile = require("../middleware/upload");
const storage = new Storage({ keyFilename: "./gcs_service_account.json" });
const bucket = storage.bucket("skyreach-user-files");

exports.updateUserAddress = async (req, res, next) => {
    const { streetname1, streetname2, region, zipcode, city, country } = req.body;

    let token = req.cookies["x-access-token"];
    if (!token) {
        return res.status(404).redirect('/page-not-found');
    }
    var decoded    = await jwt.verify(token, process.env.JWT_SECRET);
    var user       = await User.findById(decoded.id);
    const selectedCountry = await Country.findOne({"isoCode": country});

    var newAddress = {
        "streetName1": streetname1,
        "streetName2": streetname2,
        "region":      region,
        "zipCode":     zipcode,
        "city":        city,
        "country":     selectedCountry.name,
        "countryCode": selectedCountry.isoCode
    }

    user.address = newAddress;
    user.save();
    res.status(200).redirect('/members/profile');

}

exports.toggleLogbookSharing = async (req, res, next) => {
    const { isLogbookShared } = req.body;

    let token = req.cookies["x-access-token"];
    if (!token) {
        return res.status(404).redirect('/page-not-found');
    }
    const decoded    = await jwt.verify(token, process.env.JWT_SECRET);
    var user       = await User.findById(decoded.id);

    var newLogbook = {
        "isShared": (isLogbookShared) ? true : false
    }

    user.logbook = newLogbook;
    user.save();
    // Timeout to increase probability of rendering to catch the applied changes
    setTimeout(() => {
        console.log("Delay of 0,4 sec applied when toggle of logbook sharing");
    }, 400);
    res.status(200).redirect('/members/profile');
}

exports.uploadUserDocument = async (req, res, next) => {
    try {
        await processFile(req, res);

        console.log(req.file);
        //console.log(req.file.filename);
    
        if (!req.file) {
          return res.status(400).send({ message: "Please upload a file!" });
        }

        let token = req.cookies["x-access-token"];
        if (!token) {
            return res.status(404).redirect('/page-not-found');
        }
        const decoded  = await jwt.verify(token, process.env.JWT_SECRET);
        const user     = await User.findById(decoded.id);
    
        // Create a new blob in the bucket and upload the file data.
        const blob = bucket.file(`${user.id}/${req.file.originalname}`);
        const blobStream = blob.createWriteStream({
          resumable: false,
        });
    
        blobStream.on("error", (err) => {
          res.status(500).send({ message: err.message });
        });
    
        blobStream.on("finish", async (data) => {
          // Create URL for directly file access via HTTP.
          const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
          );
    
          res.status(200).send({
            message: "Uploaded the file successfully"
          });
        });
    
        blobStream.end(req.file.buffer);
      } catch (err) {
        res.status(500).send({
          message: `Could not upload the file. ${err}`,
        });
      }
}