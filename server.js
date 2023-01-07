const express = require('express');
const btoa = require('btoa');
const axios = require("axios");

const config = require("./config.json")

const app = express();

app.get('/', (req, res) => {
    res.redirect([
        'https://discordapp.com/oauth2/authorize',
        `?client_id=${config.application_id}`,
        '&scope=identify%20email%20guilds%20guilds.join',
        '&response_type=code',
        `&callback_uri=${config.redirect_url}`
      ].join(''));
});

app.get('/auth', (req, res) => {
    const code = req.query.code;
    const cred = btoa(`${config.application_id}:${config.client_secret}`);

    console.log(code);


    const options = 

    axios.post(`https://discordapp.com/api/oauth2/token`, {
        "client_id": config.application_id,
        "client_secret": config.client_secret,
        "grant_type": "authorization_code",
        "code": code
    }, {
        headers: {
            'Authorization': `Basic ${cred}`,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then((resp) => {

        // handle data

    }, (error) => {

        console.log(error);

    });
});

app.listen(8080, "0.0.0.0", () => console.log('Ready'));