const fetch = require('node-fetch');

exports.handler = async () => {
  const res = await fetch(`https://api.netlify.com/api/v1/sites/${process.env.SITE_ID}`, {
    headers: { 'Authorization': `Bearer ${process.env.NETLIFY_TOKEN}` }
  });
  return { statusCode: res.status, body: JSON.stringify(await res.json()) };
};