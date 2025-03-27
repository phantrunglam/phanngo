const fetch = require('node-fetch');
const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

// Shared utility function

const findCommentForImage = (comments, imageUrl) => {
  // Chuẩn hóa URL để so sánh (bỏ query params nếu có)
  const normalizeUrl = url => url.split('?')[0];
  const targetUrl = normalizeUrl(imageUrl);
  
  return comments.find(c => 
    c.photo_url && normalizeUrl(c.photo_url) === targetUrl
  );
};

exports.handler = async () => {
  // 1. Lấy comments từ Netlify Forms
  const formsRes = await fetch(`https://api.netlify.com/api/v1/sites/${process.env.SITE_ID}/submissions`, {
    headers: {
      'Authorization': `Bearer ${process.env.NETLIFY_TOKEN}`
    }
  });
  const comments = await formsRes.json();

  // 2. Lấy ảnh từ Cloudinary
  // const imagesRes = await cloudinary.api.resources({
  //  type: 'upload',
  //  prefix: 'user_uploads/'
  // });

  // Lấy ảnh theo tag
  const imagesRes = await cloudinary.api.resources_by_tag('contribute', {
    resource_type: 'image',
    max_results: 100
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
        tags: img.tags, // 👈 Có thể dùng để filter thêm
        related_comment: findCommentForImage(comments, img.secure_url)
      }))
    })
  };
};




async function getCloudinaryImages(comments) {
  const result = await cloudinary.api.resources_by_tag('contribute', {
    resource_type: 'image',
    max_results: 100
  });
  
  
  return result.resources.map(img => ({
    url: img.secure_url,
    public_id: img.public_id,
    related_comment: findCommentForImage(comments, img.secure_url)
  }));
}

