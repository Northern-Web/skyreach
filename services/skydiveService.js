const { Jump }    = require('./../models/jump.model');
const { User }    = require("./../models/user.model");
const { format }  = require("util");
const { Storage } = require("@google-cloud/storage");
const { Import }  = require('./../models/import.model');
const storage     = new Storage({ keyFilename: "./gcs_service_account.json" });
const bucket      = storage.bucket("skyreach-user-files");
const processFile = require("../middleware/upload");
const xlsx        = require('xlsx');
const uuid        = require('uuid');
var moment        = require('moment');


class SkydiveService {

    static async GetDashboardStats (user) {
        const currentDate = new Date();
        const lastYear = currentDate.getFullYear() - 1;
        const skydives = await Jump.find({"owner": user.id});
        
    
        const totalDrop = skydives.reduce((accumulator, jump) => {
            accumulator += jump.stats.altitude;
            return accumulator;
        }, 0);

        var currentYearSkydivesCount = 0;
        var lastYearSkydivesCount = 0;
        
        skydives.forEach((skydive) => {
            if (skydive.date.getFullYear() === currentDate.getFullYear()) {
                currentYearSkydivesCount++; 
            }

            if (skydive.date.getFullYear() === lastYear) {
                lastYearSkydivesCount++;
            }
        });

        var currentYearDrop = 0;
        
        skydives.forEach((skydive) => {
            if (skydive.date.getFullYear() == currentDate.getFullYear()) {
            currentYearDrop += skydive.stats.altitude; 
            }
        });

        var totalFreefallTime = 0;
        
        skydives.forEach((skydive) => {
            totalFreefallTime += skydive.stats.freefalltime;
        });

        var currentYearFreefallTime = 0;
        
        skydives.forEach((skydive) => {
            if (skydive.date.getFullYear() == currentDate.getFullYear()) {
            currentYearFreefallTime += skydive.stats.freefalltime; 
            }
        });
    

        var stats = {
            "currentYear": currentDate.getFullYear(),
            "totalSkydives": skydives.length,
            "totalDrop": totalDrop,
            "currentYearSkydives": currentYearSkydivesCount,
            "relativeSkydiveChange": await this.CompareRelativeDifference(currentYearSkydivesCount, lastYearSkydivesCount),
            "isMoreSkydives": await this.CompareSums(currentYearSkydivesCount, lastYearSkydivesCount),
            "currentYearDrop": currentYearDrop,
            "totalFreefallTime": totalFreefallTime,
            "currentYearFreefallTime": currentYearFreefallTime
        }
        return stats;
    }

    static async CompareRelativeDifference (currentYear, lastYear) {
        var value = (currentYear / lastYear - 1) * 100;
        var percentage = 0;
        if (Number.isNaN(value)) {
          percentage = 0;
        } else {
          percentage = value;
        }
        return percentage;
      }

    static async CompareSums(currentYear, lastYear) {
        if (currentYear > lastYear) {
          this.isBetter = true;
        } else {
          this.isBetter = false;
        }
    }

    static async UploadExcel (file, user, res) {
        try {

            const newFileName = uuid.v4();
            const fileType = '.xlsx';
            const gcsPath = `${user.id}/imports/${newFileName}${fileType}`;

            // Create a new blob in the bucket and upload the file data.
            const blob = bucket.file(gcsPath);
            const blobStream = blob.createWriteStream({
            resumable: false,
            });

            blobStream.on("error", (err) => {
                return res.status(500).json({ 
                    success: false,
                    msg: err.message });
              });

            blobStream.on("finish", async (data) => {
               
                var skydiveImport = new Import({
                    "originalFileName": file.originalname,
                    "generatedFileName": newFileName + fileType,
                    "fileType": fileType,
                    "gcsPath": gcsPath,
                    "owner": user.id
                });
                skydiveImport.save();

                return res.status(200).json({
                success: true,
                message: "Uploaded the file successfully"
                });
              });
   
              blobStream.end(file.buffer);



        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                msg: `Could not upload file: ${err}`
            });
        }

    }
}
module.exports = { SkydiveService };