const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
(async () => {
  try {
    const models = await genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }).generateContent('test');
    console.log('Success:', models);
  } catch(e) { console.error('Error:', e); }
})();
