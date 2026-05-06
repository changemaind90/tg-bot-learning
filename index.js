require("dotenv").config();
const { getWeather }      = require("./weather-command");
const { getCoinPrice } = require("./bitcoin-price");
const { parseUrl }        = require("./parser/pars");

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true, baseApiUrl: process.env.BASE_URL_API });
console.log("БОТ ЗАПУЩЕН!...");
bot.on("polling_error", (err) => console.log(err.code));

bot.setMyCommands([
  { command: "start", description: "Запустить бота" },
  { command: "help", description: "Показать список команд" },
  { command: "weather", description: "Узнать погоду (на англ.)" },
  { command: "crypto", description: "Курс крипты" },
  { command: "parse", description: "Парсинг сайта" }
]);

bot.setMyDescription({
  description: "👋 Привет! Я бот-помощник.\n\n" +
               "Я умею:\n" +
               "⛅ Узнавать погоду (/weather)\n" +
               "🪙 Курс BTC (/btc)\n" +
               "🖥️ Парсить сайты (/parse)\n\n" +
               "Нажми /start, чтобы начать!"
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendSticker(
    chatId,
    "https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/192/3.webp",
  );
  bot.sendMessage(
    chatId,
    `❓ /help — список всех доступных команд `,
  );
});

bot.onText(/\/(weather|погода)\s*(.*)/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const city = match[2] ? match[2].trim().replace(/-/g, ' ').replace(/\s+/g, ' ') : null;

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

bot.onText(/\/(crypto)\s*(.*)/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const coin = match[2] ? match[2].trim().toLowerCase() : null;

  if (!coin) {
    return bot.sendMessage(
      chatId,
      "Пожалуйста, укажите монету. \nПример: /crypto eth | btc | sol | asd",
    );
  }

  try {
    const report = await getCoinPrice(coin);
    bot.sendMessage(chatId, report);
  } catch (error) {
    bot.sendMessage(chatId, `❌ ${error.message}`);
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
    `📌 Команды:\n
    🪐 /start — приветствие\n
    ⛅ /погода Москва   — погода\n
    🌩️ /weather Moscow — погода\n
    🪙 /crypto btc — курс крипты\n
    🖥️ /parse https://google.com — тест-парсинг сайта\n
    ❓ /help — список всех доступных команд `,
  );
});
