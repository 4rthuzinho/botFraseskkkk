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

// Escolhe provider de frase
async function obterFrase() {
  return provider === 'gpt' ? await getFraseGPT() : await getFraseZenQuotes();
}

// Se canal for WhatsApp, inicializa o client:
if (canal === 'whatsapp') {
  const { Client, LocalAuth } = require('whatsapp-web.js');

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
    const frase = await obterFrase();
    if (!frase) return console.error('❌ Frase não encontrada');
    const msg = `🧠 Já dizia o mestre *${frase.author}*:\n_"${frase.translated}"_`;
    await enviarFrase(msg);
  });

  client.initialize();
} else {
  // Executa diretamente se for outro canal (ex: Discord)
  (async () => {
    const frase = await obterFrase();
    if (!frase) return console.error('❌ Frase não encontrada');
    const msg = `🧠 Já dizia o mestre *${frase.author}*:\n_"${frase.translated}"_`;
    await enviarFrase(msg);
  })();
}
