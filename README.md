
# Brooklyn Metadata API

This API provides endpoints to generate descriptions of images using various AI models such as OpenAI's GPT-4, Google's Gemini, and Anthropic's Claude. The API ensures that requests are validated for necessary parameters and processes the image URL to return a descriptive text.

### Endpoints

| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `POST`    | `/api/generate-description/gpt-4o`      | Generates description using GPT-4o                 |
| `POST`   | `/api/generate-description/gpt-4-turbo`  | Generates description using GPT-4-Turbo                              |
| `POST`    | `/api/generate-description/gemini-1.5-flash` | Generates description using Gemini-1.5-Flash                    |
| `POST`  | `/api/generate-description/claude-3`     | Generates description using Claude 3                 |

## Headers

| Header key        | Description                              |
| ----------------- | ---------------------------------------- |
| `x-api-key`          | This header is **required by all endpoints**. It is your specific API Key for the LLM |






        
