const { Jump }    = require('../models/jump.model');
const { format }  = require("util");
const { Storage } = require("@google-cloud/storage");
const { Import }  = require('../models/import.model');
const CountryService = require('./../services/country.service');
const storage     = new Storage({ keyFilename: "./gcs_service_account.json" });
const bucket      = storage.bucket("skyreach-user-files");
const processFile = require("../middleware/upload");
const xlsx        = require('xlsx');
const uuid        = require('uuid');
var moment        = require('moment');

const countryService = new CountryService();

class SkydiveService {

    async GetDashboardStats (user) {
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
            "totalFreefallTime": await this.ConvertSecondsToHours(totalFreefallTime),
            "currentYearFreefallTime": await this.ConvertSecondsToHours(currentYearFreefallTime)
        }
        return stats;
    }

    async CompareRelativeDifference (currentYear, lastYear) {
        var value = (currentYear / lastYear - 1) * 100;
        var percentage = 0;
        if (Number.isNaN(value)) {
          percentage = 0;
        } else {
          percentage = value;
        }
        return percentage;
      }

    async CompareSums(currentYear, lastYear) {
        if (currentYear > lastYear) {
          this.isBetter = true;
        } else {
          this.isBetter = false;
        }
    }

    async ConvertSecondsToHours (seconds) {
        return seconds / 60 / 60;
    }

    async UploadExcel (file, user, res) {
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

    async GetUserSkydives (memberId) {
        if (!memberId) {
            throw new Error('Invalid skydive request.');
        }

        return await Jump.find({"owner": memberId}).sort("-number");
    }

    async GetSkydiveById (id) {
        if (!id) {
            throw new Error('Id was not provided when fetching skydive.');
        }

        return await Jump.findById(id);
    }

    async GetSkydives (query, options) {
        return await Jump.find(query).setOptions(options);
    }

    async RegisterSkydive (id, body) {
        if (!id || !body) {
            throw new Error('Unable to save skydive');
        }

        const { jumpNum, date, aircraft, canopy, country, dz,
            altitude, freefalltime, discipline, cutaway,
            linetwists, progressionJump, description, instructorNotes
        } = body;

        var newCountry = await countryService.GetCountryByCode(country);
        var jumpDate = moment(date).local(true);

        var skydive = new Jump({
            "number": jumpNum,
            "date": jumpDate,
            "aircraft": aircraft,
            "canopy": canopy,
            "location.country": newCountry.name,
            "location.countryCode": newCountry.isoCode,
            "location.dropzone": dz,
            "stats.altitude": altitude,
            "stats.freefalltime": freefalltime,
            "stats.discipline": discipline,
            "stats.isEmergencyProcedure": (cutaway) ? true : false,
            "stats.isLineTwists": (linetwists) ? true : false,
            "stats.isProgressionJump": (progressionJump) ? true : false,
            "description": description,
            "instructorNotes": instructorNotes,
            "owner": id
        });
    
        return skydive.save();
    }
}
module.exports = SkydiveService;