const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/embedded-page', async (req, res) => {
    try {
        const response = await axios.get('https://marcofugaro.github.io/three-projected-material/multiple-projections-instancing.html');
        const $ = cheerio.load(response.data);

        $('.source-fab').remove();

        console.log($.html());
        res.send($.html());
    } catch (error) {
        console.error('Error fetching or modifying the page:', error);
        res.status(500).send('Error fetching or modifying the page');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
