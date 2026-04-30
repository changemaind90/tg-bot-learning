const axios   = require('axios');
const cheerio = require('cheerio');

async function parseWithCheerio(url) {
    const { data } = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    });

    const $ = cheerio.load(data);

    const title = $('title').text();
    const h1 = $('h1').first().text();

    return `📄 Заголовок: ${title}\n📰 H1: ${h1}`;
}

module.exports = { parseWithCheerio };