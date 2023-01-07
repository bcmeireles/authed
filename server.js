const express = require('express');

const config = require("./config.json")

app.get('/', (req, res) => {
    res.redirect([
        'https://discordapp.com/oauth2/authorize',
        `?client_id=${config.application_id}`,
        '&scope=identify%20email%20guilds%20guilds.join',
        '&response_type=code',
        `&callback_uri=${config.redirect_url}`
      ].join(''));
});

app.listen(8080, "0.0.0.0", () => console.log('Ready'));