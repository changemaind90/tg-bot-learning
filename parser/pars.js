const { parseWithCheerio } = require('./ch');
const { parseWithPuppeteer } = require('./pup');

async function parseUrl(url) {
    try {
        return await parseWithCheerio(url);
    } catch (e) {
        console.log('Cheerio не справился, пробуем Puppeteer...');
        return await parseWithPuppeteer(url);
    }
}

module.exports = { parseUrl };