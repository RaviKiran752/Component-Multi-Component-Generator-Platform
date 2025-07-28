const axios = require('axios');

exports.aiGenerate = async (req, res) => {
  try {
    const { prompt, image } = req.body;
    if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

    const apiKey = process.env.GEMINI_API_KEY;
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    const contents = [
      { parts: [{ text: prompt }] }
    ];
    if (image) {
      contents[0].parts.push({ inline_data: { mime_type: 'image/png', data: image } });
    }

    const geminiReq = { contents };

    const response = await axios.post(url, geminiReq, {
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey
      }
    });

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    let code = '', css = '';
    const codeMatch = text.match(/```(?:tsx|jsx|js|ts)\n([\s\S]*?)```/);
    if (codeMatch) code = codeMatch[1].trim();
    const cssMatch = text.match(/```css\n([\s\S]*?)```/);
    if (cssMatch) css = cssMatch[1].trim();
    res.json({ code, css, raw: text });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: 'AI generation failed', error: err.response?.data || err.message });
  }
}; 