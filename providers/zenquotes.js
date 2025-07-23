const axios = require('axios');

async function getFraseZenQuotes() {
  try {
    // 1. Busca frase original (inglês)
    const { data } = await axios.get('https://zenquotes.io/api/today');
    const quote = data[0].q;
    const author = data[0].a;

    // 2. Traduz para português
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

    // 3. Monta mensagem pronta
    return {
      author,
      original: quote,
      translated: quotePT,
      discordFormatted: {
        embeds: [
          {
            title: "☀️ Frase motivacional do dia",
            description: `> Já dizia o mestre **${author}**:\n> _"${quotePT}"_\n\n> 🔁 Tradução livre com a benção do Google Tradutor 😅\n> 🧠 Inspire-se e compartilhe nos canais, vai que muda o dia de alguém!`,
            color: 16753920
          }
        ]
      },
      plainText: `🧠 Já dizia o mestre *${author}*:\n_"${quotePT}"`
    };
  } catch (err) {
    console.error('Erro ao buscar/traduzir frase ZenQuotes:', err.message);
    return null;
  }
}

module.exports = { getFraseZenQuotes };