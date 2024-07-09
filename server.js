const express = require('express');
const { getOpenAIDescriptionFromImage } = require('./openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/generate-description/gpt-4o', async (req, res) => {
  const OPENAI_VISION_MODEL = 'gpt-4o';
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  try {
    const description = await getOpenAIDescriptionFromImage(imageUrl, OPENAI_VISION_MODEL);
    res.json(description);
  } catch (error) {
    res.status(500).json({ error: 'Error generating description' });
  }
});

app.post('/api/generate-description/gpt-4-turbo', async (req, res) => {
    const OPENAI_VISION_MODEL = 'gpt-4-turbo';
    const { imageUrl } = req.body;
  
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }
  
    try {
      const description = await getOpenAIDescriptionFromImage(imageUrl, OPENAI_VISION_MODEL);
      res.json(description);
    } catch (error) {
      res.status(500).json({ error: 'Error generating description' });
    }
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
