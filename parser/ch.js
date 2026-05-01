const axios = require('axios');
const cheerio = require('cheerio');

async function parseWithCheerio(url) {

    const { data } = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 5000 
    });

    const $ = cheerio.load(data);
    
    return {
        title: $('title').text().trim() || 'Без заголовка',
        h1: $('h1').first().text().trim() || null,
        structure: $.html()
    };
}

module.exports = { parseWithCheerio };