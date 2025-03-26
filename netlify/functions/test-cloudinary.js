const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });


exports.handler = async (event, context) => {
  try {
    const result = await cloudinary.api.ping();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Cloudinary connected!", details: result })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Cloudinary error", details: error.message })
    };
  }
};
