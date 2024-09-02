import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Code IA!'
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (typeof prompt !== 'string' || prompt.length === 0) {
      return res.status(400).send({ error: 'prompt es obligatorio y debe ser una cadena.' });
    }

    await delay(1000);
    
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 1000, // The maximum number of tokens to generate in the completion.
      top_p: 1, // Alternative to sampling with temperature, called nucleus sampling.
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far.
    });

    res.status(200).send({
      bot: response.data.choices[0].message.content
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ error: 'Se ha producido un error al generar la respuesta.' });
  }
});

app.listen(5000, () => console.log('AI server started on http://localhost:5000'));

// be carefull with the api consumption and pricing $0.020 per token
