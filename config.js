// netlify/functions/config.js
const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Cấu hình Netlify
const netlifyConfig = {
  siteId: process.env.SITE_ID,
  token: process.env.NETLIFY_TOKEN,
  apiUrl: 'https://api.netlify.com/api/v1'
};

module.exports = {
  cloudinary,
  netlifyConfig
};