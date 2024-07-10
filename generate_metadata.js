const { OpenAI } = require('openai');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const MAX_TOKENS = 250;
const promptText = `As an art historian and accessibility expert, generate two distinct texts: ALT TEXT and LONG DESCRIPTION. The texts must adhere to accessibility guidelines, ensuring the description is inclusive and provides an equitable digital experience for all users, including those with disabilities.
Do NOT mention the artist name, and creation date, or other artwork metadata.  ONLY describe the image. Start with the most important element of the image. Exclude repetitive information. Avoid phrases like "image of", "photo of", unless the medium is crucial. Avoid jargon and explain specialized terms. Transcribe any text within the image. Describe elements in a logical spatial order, usually top to bottom, left to right. Use familiar color terms and clarify specialized color names. Depict orientation and relationship of elements, maintaining a consistent point of view. Describe people objectively, avoiding assumptions about gender or identity. Use neutral language and non-ethnic terms for skin tone. Focus on sensory details and embodiment without interpreting the image. For infographics, prioritize the clarity of crucial information. Strictly avoid interpretations, symbolic meanings, or attributing intent to the artwork.   
SPECIFIC GUIDELINES FOR ALT TEXT: Be concise, aiming for around fifteen words, and forming a complete sentence only if necessary.    
SPECIFIC GUIDELINES FOR LONG DESCRIPTION: Long descriptions can be anywhere from a couple of sentences to a paragraph, written in complete sentences. Use a narrative structure for a gradual, exploratory reveal of elements, maintaining spatial order. Provide detailed, factual visual information. Focus on physical attributes and composition.`;

require('dotenv').config();


async function getClaudeDescriptionFromImage(apiKey, imageUrl, modelVersion) {
  try {
    const payload = {
      model: modelVersion,
      max_tokens: MAX_TOKENS,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'url',
                url: imageUrl
              }
            },
            {
              type: 'text',
              text: prompt
            }
          ]
        }
      ]
    };

    const response = await axios.post('https://api.anthropic.com/v1/messages', payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      }
    });

    return response.data.content[0].text;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function getGoogleGeminiDescriptionFromImage(apiKey, imageUrl, modelVersion) {
  if (!imageUrl || !apiKey) return;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelVersion});
  const result = await model.generateContent([
  `${promptText} + The image url is ${imageUrl}`]
  );
  console.log(result.response.text());
}

async function getOpenAIDescriptionFromImage(apiKey, imageUrl, modelVersion) {
  if (!imageUrl || !apiKey) return;

  const openai = new OpenAI({
    apiKey: apiKey,
  });  

  try {
    const response = await openai.chat.completions.create({
      model: modelVersion,
      messages: [
        {
          role: 'system',
          content: 'You are an AI language model that provides detailed descriptions of images.',
        },
        {
          role: 'user',
          
          content:[
            {
              "type": "text",
              "text": `${promptText}`
            },
            {
              "type": "image_url",
              "image_url": {
                "url": `${imageUrl}`
              }
            }
          ],
        },
      ],
      max_tokens: MAX_TOKENS,
    });
    const content = response.choices[0].message.content;
    console.log(content)
    return content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
  }
}

// Optional formatting for string
function parseAltTextAndLongDescription(content) {
  const [altText, longDescription] = content.split('LONG DESCRIPTION:');
  return {
    altText: altText.replace('ALT TEXT:', '').trim(),
    longDescription: longDescription.trim(),
  };
}

module.exports = { getOpenAIDescriptionFromImage, getGoogleGeminiDescriptionFromImage, getClaudeDescriptionFromImage};
