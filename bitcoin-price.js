const axios = require('axios');

async function getCoinPrice(coin) {
    const coins = {
            "btc":"bitcoin",
            "eth":"ethereum",
            "sol":"solana",
        }
    const coinId = coins[coin] || coin;
    try {
        const coin_url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;
        
        const response    = await axios.get(coin_url, {timeout: 5000});
        const price       = response.data?.[coinId]?.usd;
        console.log(price);
        if (price === undefined) {
            throw new Error('Монета не найдена');
        }
        return price;
    } catch (error) {
        console.error('Ошибка при получении цены монеты:', error.message);
        throw new Error(error);
    }
}

module.exports = { getCoinPrice };
