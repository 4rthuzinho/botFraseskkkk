require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const { sendWhatsAppMessage } = require('./channel/whatsapp');
const qrcode = require('qrcode-terminal');

// Importa os providers
const { getFraseZenQuotes } = require('./providers/zenquotes');
const { getFraseGPT } = require('./providers/gpt');

console.log('🟡 Iniciando bot... Aguardando conexão com o WhatsApp...');

const client = new Client({
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
  await enviarFrase(); // envia após conexão
});

async function enviarFrase() {
  try {
    // Escolhe provider via .env
    const provider = process.env.QUOTE_PROVIDER || 'zenquotes';
    let frase;
    console.log(`📡 Provider selecionado: ${provider}`);

    if (provider === 'gpt') {
      frase = await getFraseGPT();
    } else {
      frase = await getFraseZenQuotes();
    }

    if (!frase) throw new Error('Frase não encontrada');

    const msg = `🧠 Já dizia o mestre *${frase.author}*:\n_"${frase.translated}"_`;
    const numeroDestino = '553171829516@c.us';

    await sendWhatsAppMessage(client, numeroDestino, msg);
  } catch (err) {
    console.error('❌ Erro ao buscar ou enviar frase:', err.message);
  }
}

client.initialize();