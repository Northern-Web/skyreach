const processFile = require("../middleware/upload");
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: "./gcs_service_account.json" });
const publicBucket = storage.bucket("skyreach-public-assets");

const upload = async (req, res) => {
    
  };
  
  const getListFiles = async (req, res) => {
    
  };
  
  const download = async (req, res) => {
    
  };
  
  module.exports = {
    upload,
    getListFiles,
    download,
  };