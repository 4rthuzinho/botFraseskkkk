const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');

// Inicializa cliente com autenticação persistente (salva em .wwebjs_auth/)
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true, // roda em modo servidor
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

client.on('qr', (qr) => {
    console.log('\n📱 ESCANEIE O QR ABAIXO COM O CELULAR:\n');
    const qrcode = require('qrcode-terminal');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot conectado ao WhatsApp!');
    enviarFrase(); // primeira mensagem
});

async function enviarFrase() {
    try {
        const { data } = await axios.get('https://zenquotes.io/api/today');
        const quote = data[0].q;
        const author = data[0].a;
        const msg = `🧠 Já dizia o mestre *${author}*:\n_"${quote}"_`;

        await client.sendMessage('553171829516@c.us', msg);
        console.log('✅ Mensagem enviada:', msg);
    } catch (err) {
        console.error('Erro ao buscar ou enviar frase:', err.message);
    }
}

client.initialize();