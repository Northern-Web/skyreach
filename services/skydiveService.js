const { Jump } = require('./../models/jump.model');
var moment = require('moment');

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
}
module.exports = { SkydiveService };