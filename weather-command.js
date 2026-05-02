const axios = require('axios');

async function getWeather(city) {
    try{
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru&format=json`;
        const geoRes = await axios.get(geoUrl);

        if(!geoRes.data.results || geoRes.data.results.length === 0){
            throw new Error('❌ Некорректный город');
        }

        const {latitude, longitude, name, country} = geoRes.data.results[0];

        const weatherUrl     = 
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&wind_speed_unit=ms`;
        const weatherRes     = await axios.get(weatherUrl);
        const currentWeather = weatherRes.data.current;

        const weatherDesc = {
            0: 'Ясно ☀️',
            1: 'Преимущественно ясно 🌤', 
            2: 'Переменная облачность ⛅️',
            3: 'Пасмурно ☁️',
            45: 'Туман 🌫', 
            48: 'Иней 🌫',
            51: 'Морось 🌦', 
            61: 'Небольшой дождь 🌧', 
            71: 'Снег ❄️',
            95: 'Гроза ⚡️'
        };

        const stats = weatherDesc[currentWeather.weather_code] || 'Непонятно';

        return `
        🌍 ${name} (${country})
        🌡 Температура: ${Math.round(currentWeather.temperature_2m)}°C
        ☁️ Ощущается: ${Math.round(currentWeather.apparent_temperature)}°C
        📝 ${stats}
        💧 Влажность: ${currentWeather.relative_humidity_2m}%
        💨 Ветер: ${currentWeather.wind_speed_10m}
        `;
    } catch (error) {
    console.error(error);
    if (error.message.includes('❌')) {
        throw error;
    }
    throw new Error(error.message === "❌ Город не найден" ? error.message : "⚠️ Ошибка сервиса Open-Meteo");
  }
};

module.exports = {getWeather};