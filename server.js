const express = require('express');
const { getOpenAIDescriptionFromImage, getClaudeDescriptionFromImage, getGoogleGeminiDescriptionFromImage } = require('./generate_metadata');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Handler function to validate API key and image URL
const validateRequest = (req, res, next) => {
  const { imageUrl } = req.body;
  const apiKey = req.headers['x-api-key'];

  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  if (!apiKey) {
    return res.status(400).json({ error: 'API key is required' });
  }

  req.apiKey = apiKey;
  req.imageUrl = imageUrl;
  next();
};

// Handler function to process image descriptions
const generateDescription = async (model, req, res) => {
  try {
    let description;
    switch (model) {
      case 'gpt-4o':
      case 'gpt-4-turbo':
        console.log(model)
        description = await getOpenAIDescriptionFromImage(req.apiKey, req.imageUrl, model);
        break;
      case 'gemini-1.5-flash':
        console.log(model)
        description = await getGoogleGeminiDescriptionFromImage(req.apiKey, req.imageUrl, model);
        break;
      case 'claude-3-sonnet-20240229':
        console.log(model)
        description = await getClaudeDescriptionFromImage(req.apiKey, req.imageUrl, model);
        break;
      default:
        console.log("default")
        description = await getOpenAIDescriptionFromImage(req.apiKey, req.imageUrl, model);
    }
   
    res.json(description);
  } catch (error) {
    res.status(500).json({ error: 'Error generating description' });
  }
};


app.post('/api/generate-description/gpt-4o', validateRequest, (req, res) => {
  generateDescription('gpt-4o', req, res);
});

app.post('/api/generate-description/gpt-4-turbo', validateRequest, (req, res) => {
  generateDescription('gpt-4-turbo', req, res);
});

// TODO: TEST
app.post('/api/generate-description/gemini-1.5-flash', validateRequest, (req, res) => {
  generateDescription('gemini-1.5-flash', req, res);
});

// TODO: TEST
app.post('/api/generate-description/claude-3', validateRequest, (req, res) => {
  generateDescription('claude-3-sonnet-20240229', req, res);
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
