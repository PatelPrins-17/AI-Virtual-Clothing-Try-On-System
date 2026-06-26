require('dotenv').config({ path: 'e:/AI Virtual Clothing Try-On System demo/AI Virtual Clothing Try-On System/backend/.env' });
const axios = require('axios');
const apiKey = process.env.LIGHTX_API_KEY;

async function testUploadUrl() {
  try {
    const res = await axios.post('https://api.lightxeditor.com/external/api/v2/uploadImageUrl', {
      uploadType: 'imageUrl',
      size: 5000,
      contentType: 'image/jpeg'
    }, {
      headers: { 'x-api-key': apiKey }
    });
    console.log("SUCCESS:", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error("ERROR:", err.response ? err.response.data : err.message);
  }
}
testUploadUrl();
