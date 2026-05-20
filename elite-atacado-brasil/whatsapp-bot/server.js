require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let latestQr = null;

// Rota principal de Health Check
app.get('/', (req, res) => res.send('WhatsApp bot is running'));

// Rota amigável para exibir o QR Code em HTML
app.get('/qr', (req, res) => {
    if (!latestQr) {
        return res.send(`
            <div style="text-align: center; font-family: sans-serif; margin-top: 50px; color: #333;">
                <h1 style="color: #25D366;">✅ WhatsApp Conectado!</h1>
                <p>O robô já está ativo e rodando em background.</p>
                <p>Se o bot desconectar, o QR Code reaparecerá aqui.</p>
            </div>
        `);
    }
    
    // Gera o link do QR Code usando a API do Google Charts para renderizar a imagem perfeitamente
    const qrImageUrl = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(latestQr)}`;
    
    res.send(`
        <div style="text-align: center; font-family: sans-serif; margin-top: 50px; color: #333;">
            <h1 style="color: #075E54;">📱 Conectar WhatsApp - Elite Atacado</h1>
            <p>Abra o WhatsApp no seu celular > <b>Aparelhos Conectados</b> > <b>Conectar um Aparelho</b></p>
            <div style="margin: 30px 0;">
                <img src="${qrImageUrl}" alt="QR Code" style="border: 2px solid #075E54; padding: 15px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
            </div>
            <p style="color: #666; font-size: 14px;">Esta página se atualiza automaticamente a cada 15 segundos.</p>
            <script>
                setTimeout(() => { location.reload(); }, 15000);
            </script>
        </div>
    `);
});

// Funções globais compartilhadas com o index.js para atualizar o QR
global.setLatestQr = (qr) => {
    latestQr = qr;
};
global.clearQr = () => {
    latestQr = null;
};

app.listen(PORT, () => console.log(`Health server listening on port ${PORT}`));

// Inicia o bot de WhatsApp (index.js tem o código principal)
require('./index.js');
