const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
require('dotenv').config();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/getWeather', async (req, res) => {
    const cities = req.body.cities.split(',');
    const apiKey = process.env.KEY;
    try {
        const weatherData = await Promise.all(
            cities.map(async (city) => {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
                return {
                    city,
                    temperature: response.data.main.temp,
                    description: response.data.weather[0].description,
                };
            })
        );
        res.render('weather', { weatherData });
    } catch (error) {
        res.render('error', { error: 'Error fetching weather data. Please check your input.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
