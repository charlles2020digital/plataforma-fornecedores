require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

global.botState = 'inicializando'; // 'inicializando', 'qr_pendente', 'autenticado', 'conectado', 'falha', 'desconectado'
global.latestQr = null;
global.connectedNumber = null;
global.connectedName = null;

// Rota principal de Health Check
app.get('/', (req, res) => res.send(`WhatsApp bot status: ${global.botState}`));

// Rota amigável para exibir o QR Code em HTML
app.get('/qr', (req, res) => {
    if (global.botState === 'inicializando') {
        return res.send(`
            <div style="text-align: center; font-family: sans-serif; margin-top: 50px; color: #333;">
                <h1 style="color: #FF9900;">🔄 Inicializando o Bot...</h1>
                <p>Por favor, aguarde de 10 a 30 segundos enquanto abrimos o navegador seguro.</p>
                <p style="color: #666; font-size: 14px;">Esta página se atualiza automaticamente a cada 5 segundos.</p>
                <script>
                    setTimeout(() => { location.reload(); }, 5000);
                </script>
            </div>
        `);
    }

    if (global.botState === 'conectado') {
        const num = global.connectedNumber ? `+${global.connectedNumber}` : 'Carregando...';
        const nome = global.connectedName || '';
        return res.send(`
            <div style="text-align: center; font-family: sans-serif; margin-top: 50px; color: #333;">
                <h1 style="color: #25D366;">✅ WhatsApp Conectado!</h1>
                <div style="background: #f0fff4; border: 2px solid #25D366; border-radius: 12px; display: inline-block; padding: 20px 40px; margin: 20px 0;">
                    <p style="font-size: 14px; color: #555; margin: 0 0 6px;">Número conectado ao robô:</p>
                    <p style="font-size: 28px; font-weight: bold; color: #075E54; margin: 0;">${num}</p>
                    ${nome ? `<p style="font-size: 14px; color: #777; margin: 6px 0 0;">${nome}</p>` : ''}
                </div>
                <p style="color: #555;">O robô está ativo e respondendo mensagens automaticamente.</p>
                <p style="color: #999; font-size: 13px;">Quer trocar de número? Delete a pasta <code>.wwebjs_auth</code> e reinicie o servidor.</p>
                <script>
                    setTimeout(() => { location.reload(); }, 15000);
                </script>
            </div>
        `);
    }

    if (global.botState === 'qr_pendente' && global.latestQr) {
        // Gera o link do QR Code usando a API do Google Charts para renderizar a imagem perfeitamente
        const qrImageUrl = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(global.latestQr)}`;
        
        return res.send(`
            <div style="text-align: center; font-family: sans-serif; margin-top: 50px; color: #333;">
                <h1 style="color: #075E54;">📱 Conectar WhatsApp - Elite Atacado</h1>
                <p>Abra o WhatsApp no seu celular > <b>Aparelhos Conectados</b> > <b>Conectar um Aparelho</b></p>
                <div style="margin: 30px 0;">
                    <img src="${qrImageUrl}" alt="QR Code" style="border: 2px solid #075E54; padding: 15px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
                </div>
                <p style="color: #666; font-size: 14px;">Esta página se atualiza automaticamente a cada 5 segundos.</p>
                <script>
                    setTimeout(() => { location.reload(); }, 5000);
                </script>
            </div>
        `);
    }

    if (global.botState === 'falha') {
        return res.send(`
            <div style="text-align: center; font-family: sans-serif; margin-top: 50px; color: #333;">
                <h1 style="color: #D32F2F;">❌ Falha na Autenticação</h1>
                <p>Houve uma falha na tentativa de login automático.</p>
                <p>O robô tentará reinicializar. Aguarde ou reinicie o servidor manualmente.</p>
                <script>
                    setTimeout(() => { location.reload(); }, 10000);
                </script>
            </div>
        `);
    }

    // Caso de fallback
    return res.send(`
        <div style="text-align: center; font-family: sans-serif; margin-top: 50px; color: #333;">
            <h1 style="color: #777;">⏳ Estado do Bot: ${global.botState}</h1>
            <p>Carregando status do serviço...</p>
            <script>
                setTimeout(() => { location.reload(); }, 5000);
            </script>
        </div>
    `);
});

// Endpoint JSON com status detalhado do bot
app.get('/status', (req, res) => {
    res.json({
        estado: global.botState,
        numero: global.connectedNumber ? `+${global.connectedNumber}` : null,
        nome: global.connectedName || null,
        qr_pendente: global.botState === 'qr_pendente',
    });
});

app.listen(PORT, () => console.log(`Health server listening on port ${PORT}`));

// Inicia o bot de WhatsApp (index.js tem o código principal)
require('./index.js');
