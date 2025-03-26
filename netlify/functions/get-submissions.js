const fetch = require('node-fetch');
const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });




exports.handler = async () => {
  // 1. Lấy comments từ Netlify Forms
  const formsRes = await fetch(`https://api.netlify.com/api/v1/sites/${process.env.SITE_ID}/submissions`, {
    headers: {
      'Authorization': `Bearer ${process.env.NETLIFY_TOKEN}`
    }
  });
  const comments = await formsRes.json();

  // 2. Lấy ảnh từ Cloudinary
  const imagesRes = await cloudinary.api.resources({
    type: 'upload',
    prefix: 'user_uploads/'
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      comments: comments.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        message: c.message,
        photo_url: c.photo_url
      })),
      images: imagesRes.resources.map(img => ({
        url: img.secure_url,
        public_id: img.public_id,
        related_comment: findCommentForImage(comments, img.secure_url)
      }))
    })
  };
};

function findCommentForImage(comments, imageUrl) {
  const comment = comments.find(c => c.photo_url === imageUrl);
  return comment ? `${comment.name} (${comment.email})` : null;
}



async function getCloudinaryImages(comments) {
  const result = await cloudinary.api.resources({
    type: 'upload',
    prefix: 'user_uploads/' // Thay bằng prefix bạn dùng
  });
  
  return result.resources.map(img => ({
    url: img.secure_url,
    public_id: img.public_id,
    related_comment: findCommentForImage(comments, img.secure_url)
  }));
}

function findCommentForImage(comments, imageUrl) {
  const comment = comments.find(c => c.photo_url === imageUrl);
  return comment ? `${comment.name} (${comment.email})` : null;
}