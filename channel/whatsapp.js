async function sendWhatsAppMessage(client, to, message) {
  if (!client) throw new Error('Cliente WhatsApp não inicializado.');

  console.log(`📨 Enviando mensagem para ${to}...`);
  await client.sendMessage(to, message);

  const agora = new Date().toLocaleString('pt-BR');
  console.log(`✅ ${agora} | Mensagem enviada para ${to}`);
}

module.exports = {
  sendWhatsAppMessage,
};
