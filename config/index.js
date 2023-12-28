const dotenv = require('dotenv').config();

module.exports = {
    port: process.env.PORT,
    database: {
        prodUrl: process.env.DB_PROD_URI,
        devUrl:  process.env.DB_DEV_URI,
        name:    process.env.DB_NAME
    },
    app: {
        name:    process.env.NAME,
        version: process.env.VERSION,
        env:     process.env.APP_ENV,
        baseUrl: process.env.BASE_URL
    },
    authentication: {
        jwtSecret:   process.env.JWT_SECRET,
        tokenExpiry: process.env.TOKEN_EXPIRY_TIME
    },
    googleCloudStorage: {
        userFilesBucked: process.env.GCS_USER_BUCKET
    }
};  