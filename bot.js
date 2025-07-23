require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const { sendWhatsAppMessage } = require('./channel/whatsapp');
const { sendDiscordMessage } = require('./channel/discord');

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
    const provider = process.env.QUOTE_PROVIDER || 'zenquotes';
    const canais = process.env.CHANNEL?.split(',').map(c => c.trim()) || ['whatsapp'];

    console.log(`📡 Provider selecionado: ${provider}`);
    console.log(`📨 Enviando via canais: ${canais.join(', ')}`);

    let frase;
    if (provider === 'gpt') {
      frase = await getFraseGPT();
    } else {
      frase = await getFraseZenQuotes();
    }

    if (!frase) throw new Error('Frase não encontrada');

    const msg = `🧠 Já dizia o mestre *${frase.author}*:\n_"${frase.translated}"_`;

    if (canais.includes('whatsapp')) {
      const numeroDestino = '553185294769@c.us';
      await sendWhatsAppMessage(client, numeroDestino, msg);
    }

    if (canais.includes('discord')) {
      await sendDiscordMessage(msg);
    }

  } catch (err) {
    console.error('❌ Erro ao buscar ou enviar frase:', err.message);
  }
}

client.initialize();