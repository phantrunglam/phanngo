// netlify/functions/get-submissions.js
const fetch = require('node-fetch');

exports.handler = async () => {
  try {
    const siteId = process.env.SITE_ID;
    const token = process.env.NETLIFY_TOKEN;

    const response = await fetch(
      `https://api.netlify.com/api/v1/sites/${siteId}/submissions`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    if (!response.ok) throw new Error(`Lỗi API: ${response.statusText}`);

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};