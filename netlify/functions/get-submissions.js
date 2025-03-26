const fetch = require('node-fetch');

exports.handler = async () => {
  const siteId = process.env.SITE_ID;
  const token = process.env.NETLIFY_TOKEN;

  const response = await fetch(
    `https://api.netlify.com/api/v1/sites/${siteId}/submissions`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};