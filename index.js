const { default: axios } = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const token = '6137447895:AAGfEAjpJyb0dRw9HEfQTO20bIP0m2VxyUQ';
const bot = new TelegramBot(token, { polling: true });
require('dotenv').config();

const LOCAL_DATA = new Map();

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Hello, I'm ASTRO AI You can use /help to see more information.`);
});

bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Use / ask any question in chat 
   ---------------------------------
   Website: https://astroai.io`);
});

bot.onText(/\/ask/, async (msg) => {
    const chatId = msg.chat.id;
    let message = msg.text.toLowerCase();

    console.log(`${msg.from.first_name}:`, message);
    
    //if(message === "/start" || message === "/help") return;

    if (message.length > 0) {
        try {
            if(!checkDefaultMessage(chatId, message)){
                let response = await axios.post("https://zenithereum.vercel.app/api/chat", {
                    message: message,
                }).then(res => res.data);
    
                bot.sendMessage(chatId, response.data);
            }
        } catch (error) {
            bot.sendMessage(chatId, "Something went wrong, please try again!");
            const url = `https://media4.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif?cid=6c09b952s062aubgt7fapxtfo3i58kh15p8kd260gp6ghqky&rid=giphy.gif&ct=g`;
            bot.sendPhoto(chatId, url);
        }
    } else {
        bot.sendMessage(chatId, "Please enter something!");
        const url = `https://media4.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif?cid=6c09b952s062aubgt7fapxtfo3i58kh15p8kd260gp6ghqky&rid=giphy.gif&ct=g`;
        bot.sendPhoto(chatId, url);
    }
})

const checkDefaultMessage = (chatId, message) => {
    if (message.length > 0 && (message.includes("your name") || message.includes("who are you")) || message.includes("yo name") || message.includes("u name") || message.includes("who r u")) {
        bot.sendMessage(chatId, "My name is ASTRO AI");
        return true;
    }

    if (message.length > 0 && message.includes("your website")) {
        bot.sendMessage(chatId, "My website is https://astroai.io");
        return true;
    }

//     if (message.length > 0 && message.includes("your twitter")) {
//         bot.sendMessage(chatId, "My Twitter is https://twitter.com/zenithereumai.");
//         return true;
//     }

    if (message.length > 0 && (message === "hi" || message === "hello")) {
        bot.sendMessage(chatId, "Hi, can I help you?");
        return true;
    }

    return false;
}
