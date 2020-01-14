const express = require('express');
const path = require('path');

const app = express();

const settings = {
    port: process.env.PORT,
    publicDir: path.join(__dirname, '../public'),
};

app.use(express.static(settings.publicDir));

app.listen(settings.port, () => {
    console.log(`Server is up and running on port ${settings.port}!`);
});