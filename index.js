const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent] });

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testdb').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

const userSchema = require('./schema').user;
const tokenAuth = mongoose.model('token', userSchema); 

tokenAuth.findOne({}).then((result) => {
    if (result) {
        const fetchToken = result.token.toString();
        client.login(fetchToken)
    }
}).catch((err) => {
    console.error('Error fetching token:', err);
});

client.on('messageCreate', message => {
    if (message.author.bot) return;
    message.reply({
        content: 'Hello, I am a bot!'
    });
});

