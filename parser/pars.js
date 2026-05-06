const { parseWithCheerio } = require('./ch');
const { parseWithPuppeteer } = require('./pup');

async function parseUrl(url) {
    
    try {
        console.log(`Запуск Cheerio для: ${url}`);
        const result = await parseWithCheerio(url);
        
        if (result.h1) {
            return `📄 Заголовок: ${result.title}\n📰 H1: ${result.h1}`;
        }

        console.log('Cheerio не нашел H1, но получил доступ. Возвращаю заголовок и структуру...');
        return `📄 Заголовок: ${result.title}\n📰 H1: Не найден\n\n⬇️ Структура (фрагмент):\n${result.structure.substring(0, 500)}...`;

    } catch (e) {
        console.log(`Cheerio заблокирован или ошибка: ${e.message}. Запускаю Puppeteer...`);
        try {
            return await parseWithPuppeteer(url);
        } catch (pupError) {
            console.error('Ошибка Puppeteer:', pupError.message);
            return `❌ Ошибка:\nCheerio: ${e.message}\nBrowser: Не установлен (выполните npx puppeteer browsers install chrome)`;
        }
    }
}

module.exports = { parseUrl };