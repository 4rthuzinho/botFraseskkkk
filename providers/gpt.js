const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const frasesUsadasPath = path.join(__dirname, '../frases_usadas.json');

function carregarFrasesUsadas() {
  try {
    return JSON.parse(fs.readFileSync(frasesUsadasPath, 'utf-8'));
  } catch {
    return [];
  }
}

function salvarFraseUsada(frase) {
  const usadas = carregarFrasesUsadas();
  usadas.push(frase);
  fs.writeFileSync(frasesUsadasPath, JSON.stringify(usadas, null, 2));
}

async function getFraseGPT() {
  const frasesUsadas = carregarFrasesUsadas();

  const prompt = `
Gere uma frase motivacional curta (no máximo 200 caracteres), em português, que não repita nenhuma das seguintes frases:
${frasesUsadas.map(f => `- ${f}`).join('\n')}
A frase deve ser positiva, inspiradora e parecer natural.
Retorne apenas a frase, sem aspas, sem autor.
`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
    });

    const frase = completion.data.choices[0].message.content.trim();
    salvarFraseUsada(frase);

    return {
      original: frase,
      author: 'ChatGPT',
      translated: frase // já vem em PT-BR
    };
  } catch (err) {
    console.error('❌ Erro no provider GPT:', err.message);
    return null;
  }
}

module.exports = { getFraseGPT };