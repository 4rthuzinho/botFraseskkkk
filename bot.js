const { getFraseZenQuotes } = require('./providers/zenquotes');

client.on('ready', async () => {
  console.log('✅ Bot conectado ao WhatsApp!');
  const frase = await getFraseZenQuotes();
  if (frase) {
    await client.sendMessage('553185294769@c.us', frase.plainText);
    console.log('📤 Mensagem enviada:', frase.plainText);
  }
});