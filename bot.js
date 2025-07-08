const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

client.on('qr', (qr) => {
    console.log('\n📱 ESCANEIE O QR ABAIXO:\n');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot conectado ao WhatsApp!');
});

// Endpoint para envio em massa
app.post('/enviar', async (req, res) => {
    const { numeros, mensagem } = req.body;

    if (!numeros || !mensagem) {
        return res.status(400).json({ erro: 'Informe "numeros" e "mensagem" no body.' });
    }

    const enviados = [];

    for (const numero of numeros) {
        const whatsappId = numero.replace(/\D/g, '') + '@c.us'; // remove qualquer símbolo e monta id
        try {
            await client.sendMessage(whatsappId, mensagem);
            enviados.push(numero);
            console.log(`📤 Mensagem enviada para ${numero}`);
        } catch (err) {
            console.error(`❌ Erro ao enviar para ${numero}: ${err.message}`);
        }
    }

    res.json({ status: 'ok', enviados });
});

// Inicia o servidor
app.listen(3000, () => {
    console.log('🚀 API rodando em http://localhost:3000');
});

client.initialize();