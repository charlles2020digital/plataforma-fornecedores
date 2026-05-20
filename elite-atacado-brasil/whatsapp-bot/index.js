const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { getAIResponse } = require('./ai.js');

// Configura o WhatsApp com salvamento de sessão local e usa o Chrome do usuário
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Mantém um breve histórico de conversa na memória (simplificado)
const chatHistories = {};

client.on('qr', (qr) => {
    console.log('==================================================');
    console.log('📱 ESCANEIE O QR CODE ABAIXO NO SEU WHATSAPP 📱');
    console.log('==================================================');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot da ELITE Atacado Brasil está ONLINE e pronto para vender!');
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
