// netlify/functions/check-preset.js
const cloudinary = require('cloudinary').v2;

exports.handler = async () => {
  try {
    const preset = await cloudinary.api.upload_preset('glk_upload');
    return {
      statusCode: 200,
      body: JSON.stringify(preset)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message,
        details: "Kiểm tra API Key/Secret trong Environment Variables"
      })
    };
  }
};