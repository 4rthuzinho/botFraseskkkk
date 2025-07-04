const makeWASocket = require('@whiskeysockets/baileys').default;
const { useSingleFileAuthState } = require('@whiskeysockets/baileys/lib/Utils/auth-utils');
const { default: axios } = require('axios');
const fs = require('fs');

// Autenticação (vai gerar e salvar session.json)
const { state, saveState } = useSingleFileAuthState('./session.json');

// Inicia conexão com WhatsApp
async function startBot() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('creds.update', saveState);

  // Aguarda conexão
  sock.ev.on('connection.update', (update) => {
    if (update.connection === 'open') {
      console.log('✅ Bot conectado ao WhatsApp!');
    }
  });

  // Exemplo: buscar frase e enviar
  setInterval(async () => {
    try {
      const { data } = await axios.get('https://zenquotes.io/api/today');
      const quote = data[0].q;
      const author = data[0].a;

      const msg = `🧠 Já dizia o mestre *${author}*:\n_"${quote}"_`;

      // Manda a mensagem pra um número (com DDI e DDD sem + ou espaços)
      await sock.sendMessage('5511999999999@s.whatsapp.net', { text: msg });
      console.log('✅ Mensagem enviada:', msg);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err.message);
    }
  }, 3600000); // a cada 1h — pode trocar por cron se preferir
}

startBot();
