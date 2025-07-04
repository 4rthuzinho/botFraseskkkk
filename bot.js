const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');

// 🟡 Log de início do script
console.log('🟡 Iniciando bot... Aguardando conexão com o WhatsApp...');

// Inicializa cliente com autenticação persistente
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
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
    enviarFrase(); // envia após conexão
});

async function enviarFrase() {
    try {
        const { data } = await axios.get('https://zenquotes.io/api/today');
        const quote = data[0].q;
        const author = data[0].a;
        const {data: translate} = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(quote)}`);
        const quoteTranslate = translate[0][0][0];

        const msg = `🧠 Já dizia o mestre *${author}*:\n_"${quoteTranslate}"_`;

        const numeroDestino = '553185294769@c.us';
        await client.sendMessage(numeroDestino, msg);

        const agora = new Date().toLocaleString('pt-BR');
        console.log(`📤 ${agora} | Mensagem enviada para ${numeroDestino}`);
    } catch (err) {
        console.error('❌ Erro ao buscar ou enviar frase:', err.message);
    }
}

client.initialize();