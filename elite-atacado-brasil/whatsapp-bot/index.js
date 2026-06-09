const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { getAIResponse } = require('./ai.js');

// Configura o WhatsApp com salvamento de sessão local e usa o Chrome correto dependendo do sistema
const puppeteerOptions = {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
};

if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    puppeteerOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
} else if (process.platform === 'win32') {
    puppeteerOptions.executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
}

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: puppeteerOptions
});

// Mantém um breve histórico de conversa na memória (simplificado)
const chatHistories = {};

client.on('qr', (qr) => {
    console.log('==================================================');
    console.log('📱 ESCANEIE O QR CODE ABAIXO NO SEU WHATSAPP 📱');
    console.log('==================================================');
    qrcode.generate(qr, { small: true });
    
    global.botState = 'qr_pendente';
    global.latestQr = qr;
});

client.on('authenticated', () => {
    console.log('🔒 Conectado com sucesso! Carregando dados da sessão...');
    global.botState = 'autenticado';
});

client.on('auth_failure', (msg) => {
    console.error('❌ Falha na autenticação do WhatsApp:', msg);
    global.botState = 'falha';
    global.latestQr = null;
});

client.on('ready', () => {
    const info = client.info;
    const phone = info.wid.user;
    const name = info.pushname || 'Sem nome';
    global.connectedNumber = phone;
    global.connectedName = name;
    global.botState = 'conectado';
    global.latestQr = null;
    console.log('✅ Bot da ELITE Atacado Brasil está ONLINE e pronto para vender!');
    console.log(`📞 Número conectado: +${phone} (${name})`);
});

client.on('disconnected', (reason) => {
    console.log('⚠️ Bot foi desconectado:', reason);
    global.botState = 'desconectado';
    global.latestQr = null;
    
    console.log('🔄 Tentando reinicializar o cliente WhatsApp...');
    client.initialize();
});

client.on('message', async (msg) => {
    // Ignora mensagens de grupos ou do próprio bot
    if (msg.from === 'status@broadcast' || msg.isGroupMsg || msg.from.includes('g.us')) {
        return;
    }

    const chatId = msg.from;
    const userMessage = msg.body;

    console.log(`📩 Nova mensagem de ${msg.from.replace('@c.us', '')}: ${userMessage}`);

    // Inicializa histórico se não existir
    if (!chatHistories[chatId]) {
        chatHistories[chatId] = "";
    }

    // Pega a resposta da IA
    const aiResponse = await getAIResponse(userMessage, chatHistories[chatId]);

    // Atualiza histórico para manter o contexto
    chatHistories[chatId] += `\nCliente: ${userMessage}\nEspecialista: ${aiResponse}`;
    
    // Limita tamanho do histórico (últimas 10 interações) para não estourar o limite de tokens da IA
    const historyLines = chatHistories[chatId].split('\n');
    if (historyLines.length > 20) {
        chatHistories[chatId] = historyLines.slice(historyLines.length - 20).join('\n');
    }

    // Envia a resposta de volta ao cliente
    msg.reply(aiResponse);
});

client.initialize();
