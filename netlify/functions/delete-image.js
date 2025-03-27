const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary (bắt buộc)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

exports.handler = async (event) => {
  // Parse input data with error handling
  let input;
  try {
    input = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON input" })
    };
  }

  const { publicId, action = 'remove_tag', tag = 'contribute' } = input;

  try {
    if (action === 'delete') {
      // Completely delete image
      await cloudinary.uploader.destroy(publicId, {
        invalidate: true // Clear CDN cache
      });
    } else {
      // Just remove the tag
      await cloudinary.uploader.remove_tag(tag, [publicId]);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        action,
        publicId
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Cloudinary operation failed",
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};