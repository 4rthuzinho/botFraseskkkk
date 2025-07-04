const { default: makeWASocket, useMultiFileAuthState } = require('@adiwajshing/baileys');
const { default: axios } = require('axios');
const fs = require('fs');

// Autenticação (vai gerar pasta ./auth com arquivos internos)
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    if (update.connection === 'open') {
      console.log('✅ Bot conectado ao WhatsApp!');
    }
  });

  // Envia frase motivacional a cada 1h
  setInterval(async () => {
    try {
      const { data } = await axios.get('https://zenquotes.io/api/today');
      const quote = data[0].q;
      const author = data[0].a;

      const msg = `🧠 Já dizia o mestre *${author}*:\n_"${quote}"_`;

      await sock.sendMessage('5511999999999@s.whatsapp.net', { text: msg });
      console.log('✅ Mensagem enviada:', msg);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err.message);
    }
  }, 3600000);
}

startBot();