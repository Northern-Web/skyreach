const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
const UserService = require('../services/user.service');
const processFile = require("../middleware/upload");
const storage = new Storage({ keyFilename: "./gcs_service_account.json" });
const bucket = storage.bucket("skyreach-user-files");

const userService = new UserService();

exports.createUser = async (req, res) => {
  try {
    const user = await userService.CreateUser(req.body);
    res.status(201).redirect('/');
  } catch (err) {
    console.log(err);
    res.status(400);
  }
}

exports.updateUserLogbook = async (req, res) => {
  try {
    let token    = req.cookies["x-access-token"];
    const member = await userService.GetUserFromToken(token);
    const user   = await userService.UpdateUserLogbook(member.id, req.body);

    // Timeout to increase probability of rendering to catch the applied changes
    setTimeout(() => {
      console.log("Delay of 0,4 sec applied when toggle of logbook sharing");
    }, 400);

    res.status(200).redirect('back');
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
}

exports.updateUserAddress = async (req, res, next) => {
  try {
    let token    = req.cookies["x-access-token"];
    const member = await userService.GetUserFromToken(token);
    const user   = await userService.UpdateUserAddress(member.id, req.body);

    res.status(200).redirect('back');

  } catch (err) {
    console.log(err);
    return res.status(500);
  }
}

exports.uploadUserDocument = async (req, res, next) => {
    try {
        await processFile(req, res);
    
        if (!req.file) {
          return res.status(400).send({ message: "Please upload a file!" });
        }

        const user = await UserService.GetUserFromToken(req.cookies);

    
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

exports.updateUserPassword = async (req, res) => {
  try {
    const token = req.cookies['x-access-token'];
    const member = await userService.GetUserFromToken(token);
    const updatedMember = await userService.UpdateUserPassword(member, req.body);
    console.log('Password was successfully changed.');
    res.redirect('/auth/signout');
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
}