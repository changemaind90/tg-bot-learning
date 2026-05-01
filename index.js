require("dotenv").config();
const { getWeather }      = require("./weather-command");
const { getBitcoinPrice } = require("./bitcoin-price");
const { parseUrl }        = require("./parser/pars");

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true, baseApiUrl: process.env.BASE_URL_API });
console.log("БОТ ЗАПУЩЕН!...");
bot.on("polling_error", (err) => console.log(err.code));

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendSticker(
    chatId,
    "https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/192/3.webp",
  );
  bot.sendMessage(
    chatId,
    "Команды: \nПогода: /погода Москва\nКурс валют: /btc",
  );
});

bot.onText(/\/(weather|погода)\s*(.*)/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const city   = match[2].trim();

  if (!city) {
    return bot.sendMessage(
      chatId,
      "Пожалуйста, укажите город. \nПример: /погода Санкт-Петербург или /weather Sain-Petersburg",
    );
  }

  try {
    const report = await getWeather(city);
    bot.sendMessage(chatId, report);
  } catch (error) {
    bot.sendMessage(chatId, `❌ ${error.message}`);
  }
});

bot.onText(/\/btc/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        const price = await getBitcoinPrice();
        const text = `💰BTC ${price}`;
        
        bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    } catch (error) {
        bot.sendMessage(chatId, 'Не удалось получить цену. Попробуй позже.');
    }
});

bot.onText(/\/parse\s*(.*)/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const url    = match[1].trim();

  if (!url) {
    return bot.sendMessage(
      chatId,
      "❗ Пример: /parse https://example.com"
    );
  }

  try {
    const result = await parseUrl(url);
    bot.sendMessage(chatId, result);
  } catch (error) {
    bot.sendMessage(chatId, `❌ Ошибка парсинга`);
  }
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `📌 Команды:
          ⛅ /погода Москва   — погода 
          🌩️ /weather Moscow — погода 
          🪙 /btc — курс BTC
          🖥️ /parse https://google.com — тест-парсинг сайта `,
  );
});
