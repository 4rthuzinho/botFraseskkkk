const axios = require('axios');

async function getFraseZenQuotes() {
  try {
    const { data } = await axios.get('https://zenquotes.io/api/today');
    const quote = data[0].q;
    const author = data[0].a;

    const { data: translation } = await axios.get('https://translate.googleapis.com/translate_a/single', {
      params: {
        client: 'gtx',
        sl: 'en',
        tl: 'pt',
        dt: 't',
        q: quote
      }
    });
    const quotePT = translation[0][0][0];

    return {
      author,
      original: quote,
      translated: quotePT
    };
  } catch (err) {
    console.error('Erro no provider ZenQuotes:', err.message);
    return null;
  }
}

module.exports = { getFraseZenQuotes };