const { Client, GatewayIntentBits } = require('discord.js');
const shortid = require('shortid');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent] });

const mongoose = require('mongoose');
const shortVal = shortid.generate();

mongoose.connect('mongodb://localhost:27017/testdb').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

const userSchema = require('./schema').user;
const urlShortId = require('./schema').urlShortId;
const tokenAuth = mongoose.model('token', userSchema); 
const urlShortIdMod = mongoose.model('urlShortId', urlShortId);

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
    if (message.content.startsWith('create')) {
        const url = message.content.split('create ')[1];
        urlShortIdMod.create({ originalUrl: url, shortId: shortVal }).then(() => {
            console.log('URL shortened and saved to database');
        }).catch((err) => {
            console.error('Error saving URL to database:', err);
        });
        message.reply({
            content: `Generating shorturl for : ${url}`
        })
        return message.reply({
            content : `Short URL for ${url} is: http://short.url/${shortVal}`
        });
    }
    message.reply({
        content: 'Hello, I am a bot!'
    });
});

