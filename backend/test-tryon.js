require('dotenv').config({ path: 'e:/AI Virtual Clothing Try-On System demo/AI Virtual Clothing Try-On System/backend/.env' });
const axios = require('axios');
const fs = require('fs');

async function testTryOn() {
  const apiKey = process.env.LIGHTX_API_KEY;
  // I will just use two generic URLs hosted online or the ones generated above to test the endpoint format
  try {
     const tryonResponse = await axios.post('https://api.lightxeditor.com/external/api/v2/aivirtualtryon', {
        imageUrl: 'https://cdn.pixabay.com/photo/2015/01/08/18/29/entrepreneur-593358_1280.jpg', // dummy person
        styleImageUrl: 'https://cdn.pixabay.com/photo/2016/11/22/21/35/apparel-1850804_1280.jpg' // dummy cloth
      }, {
        headers: { 'x-api-key': apiKey }
      });
      console.log("TRYON SUCCESS:", JSON.stringify(tryonResponse.data, null, 2));
  } catch(e) {
      console.error("TRYON ERROR:", e.response ? e.response.data : e.message);
  }
}
testTryOn();
