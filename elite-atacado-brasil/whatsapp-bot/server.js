require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('WhatsApp bot is running'));

app.listen(PORT, () => console.log(`Health server listening on port ${PORT}`));

// Inicia o bot de WhatsApp (index.js tem o código principal)
require('./index.js');
