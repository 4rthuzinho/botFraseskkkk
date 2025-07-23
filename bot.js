const { Client, LocalAuth } = require('whatsapp-web.js');
const { getFraseZenQuotes } = require('./providers/zenquotes');
const qrcode = require('qrcode-terminal');

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

client.on('ready', () => {
    console.log('✅ Bot conectado ao WhatsApp!');
    enviarFrase(); // envia após conexão
});

async function enviarFrase() {
    try {
        const frase = await getFraseZenQuotes();
        if (!frase) throw new Error('Frase não encontrada');

        const msg = `🧠 Já dizia o mestre *${frase.author}*:\n_"${frase.translated}"_`;
        const numeroDestino = '553171829516@c.us';
        await client.sendMessage(numeroDestino, msg);

        const agora = new Date().toLocaleString('pt-BR');
        console.log(`📤 ${agora} | Mensagem enviada para ${numeroDestino}`);
    } catch (err) {
        console.error('❌ Erro ao buscar ou enviar frase:', err.message);
    }
}

client.initialize();