const fetch = require('node-fetch');

async function sendDiscordMessage(mensagem) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('❌ Webhook do Discord não configurado (.env → DISCORD_WEBHOOK_URL)');
    return;
  }

  try {
    const payload = {
      content: mensagem,
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    console.log('✅ Mensagem enviada ao Discord com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao enviar mensagem para o Discord:', err.message);
  }
}

module.exports = { sendDiscordMessage };