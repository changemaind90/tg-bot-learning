const puppeteer = require('puppeteer');

async function parseWithPuppeteer(url) {
    const browser = await puppeteer.launch({
        headless: true
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const result = await page.evaluate(() => {
        return {
            title: document.title,
            h1: document.querySelector('h1')?.innerText
        };
    });

    await browser.close();

    return `📄 ${result.title}\n📰 ${result.h1}`;
}

module.exports = { parseWithPuppeteer };