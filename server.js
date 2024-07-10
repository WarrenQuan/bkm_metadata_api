const express = require('express');
const { getOpenAIDescriptionFromImage, getClaudeDescriptionFromImage, getGoogleGeminiDescriptionFromImage } = require('./generate_metadata');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

/**
 * Middleware to validate the presence of an API key and image URL in the request.
 * 
 * @param {Object} req - The request object containing headers and body.
 * @param {Object} res - The response object used to send responses to the client.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Object} - A 400 status code with an error message if validation fails.
 */
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

/**
 * Handler function to process image descriptions based on the specified model.
 * 
 * @param {string} model - The model to be used for generating the description.
 * @param {Object} req - The request object containing the API key and image URL.
 * @param {Object} res - The response object used to send the description back to the client.
 * @returns {Promise<void>} - Sends the generated description or an error message as a JSON response.
 */
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
      case 'claude-3-5-sonnet-20240620':
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

/* -------------- ROUTES --------------  */

/**
 * Route to generate a description using the GPT-4o model.
 */
app.post('/api/generate-description/gpt-4o', validateRequest, (req, res) => {
  generateDescription('gpt-4o', req, res);
});

/**
 * Route to generate a description using the GPT-4 Turbo model.
 */
app.post('/api/generate-description/gpt-4-turbo', validateRequest, (req, res) => {
  generateDescription('gpt-4-turbo', req, res);
});

/**
 * Route to generate a description using the Gemini 1.5 Flash model.
 */
app.post('/api/generate-description/gemini-1.5-flash', validateRequest, (req, res) => {
  generateDescription('gemini-1.5-flash', req, res);
});

/**
 * Route to generate a description using the Claude 3 model.
 */
app.post('/api/generate-description/claude-3', validateRequest, (req, res) => {
  generateDescription('claude-3-5-sonnet-20240620', req, res);
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
