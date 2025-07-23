require('dotenv').config();
const qrcode = require('qrcode-terminal');
const { getFraseZenQuotes } = require('./providers/zenquotes');
const { getFraseGPT } = require('./providers/gpt');
const { sendWhatsAppMessage } = require('./channel/whatsapp');
const { sendDiscordMessage } = require('./channel/discord');

// Define canal: 'whatsapp' ou 'discord'
const canal = process.env.CHANNEL || 'whatsapp';
const provider = process.env.QUOTE_PROVIDER || 'zenquotes';

console.log('🟡 Iniciando bot... Aguardando conexão com o canal...');
console.log(`📡 Provider selecionado: ${provider}`);
console.log(`📨 Enviando via canais: ${canal}`);

async function enviarFrase(frase) {
  if (canal === 'whatsapp') {
    const numeroDestino = process.env.WHATSAPP_NUMBER || '553185294769@c.us';
    await sendWhatsAppMessage(client, numeroDestino, frase);
  } else if (canal === 'discord') {
    await sendDiscordMessage(frase);
  } else {
    console.error('❌ Canal de envio inválido. Use "whatsapp" ou "discord".');
  }
}

async function obterFrase() {
  return provider === 'gpt' ? await getFraseGPT() : await getFraseZenQuotes();
}

if (canal === 'whatsapp') {
  const { Client, LocalAuth } = require('whatsapp-web.js');

  global.client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
  });

  client.on('qr', (qr) => {
    console.log('\n📱 ESCANEIE O QR ABAIXO COM O CELULAR:\n');
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', async () => {
    console.log('✅ Bot conectado ao WhatsApp!');
    const frase = await obterFrase();
    if (!frase) return console.error('❌ Frase não encontrada');
    const msg = `🧠 Já dizia o mestre *${frase.author}*:\n_"${frase.translated}"_`;
    await enviarFrase(msg);
  });

  client.initialize();
} else if (require.main === module) {
  obterFrase()
    .then(frase => {
      if (!frase) {
        console.error('❌ Frase não encontrada');
        process.exit(1);
      }
      const msg = `🧠 Já dizia o mestre *${frase.author}*:\n_"${frase.translated}"_`;
      return enviarFrase(msg);
    })
    .then(() => {
      process.exit(0); // Finaliza com sucesso
    })
    .catch(err => {
      console.error('❌ Erro ao buscar ou enviar frase:', err.message);
      process.exit(1); // Finaliza com erro
    });
}