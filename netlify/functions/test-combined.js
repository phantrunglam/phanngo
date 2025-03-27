const cloudinary = require('cloudinary').v2;
const fetch = require('node-fetch');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  
exports.handler = async () => {
  try {
    // Test Cloudinary
    const cloudinaryRes = await cloudinary.api.ping();
    
    // Test Netlify API
    const netlifyRes = await fetch(`https://api.netlify.com/api/v1/sites/${process.env.SITE_ID}`, {
      headers: { 'Authorization': `Bearer ${process.env.NETLIFY_TOKEN}` }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        cloudinary: cloudinaryRes,
        netlify: await netlifyRes.json()
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};