const puppeteer = require('puppeteer');

async function parseWithPuppeteer(url) {
    const browser = await puppeteer.launch({
        headless: "new",
        executablePath: 'F:\\Program Files\\Vids\\Sec.exe',
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled' 
        ] 
    });

    try {
        const page = await browser.newPage();
        
        // Маскировка под обычный браузер
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        const result = await page.evaluate(() => {
            // Ищем H1 или альтернативные заголовки для 4pda
            const h1Element = document.querySelector('h1') || 
                              document.querySelector('.maintitle') || 
                              document.querySelector('.post-title');
            
            return {
                title: document.title,
                h1: h1Element ? h1Element.innerText.trim() : 'H1 не найден'
            };
        });

        return `📄 ${result.title}\n📰 H1: ${result.h1}`;
    } catch (err) {
        console.error('Ошибка Puppeteer:', err.message);
        return '❌ Ошибка при попытке открыть страницу через браузер';
    } finally {
        await browser.close();
    }
}

module.exports = { parseWithPuppeteer };