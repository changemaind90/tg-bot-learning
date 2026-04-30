const axios = require('axios');

async function getBitcoinPrice() {
    try {
        const bitcoin_url = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`;
        
        const response    = await axios.get(bitcoin_url, {timeout: 5000});
        const data        = response.data;
        const price       = response.data?.bitcoin?.usd;
        console.log(price);
        if (!price) {
         throw new Error('Неверный ответ от API');
        }        
        return price;
    } catch (error) {
        console.error('Ошибка при получении цены BTC:', error.message);
        throw new Error('API CoinGecko недоступен');
    }
}

module.exports = { getBitcoinPrice };
