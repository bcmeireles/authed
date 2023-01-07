const express = require('express');
const btoa = require('btoa');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;

const config = require("./config.json")
const client = new MongoClient(config.mongodb_url, { useUnifiedTopology: true });

const app = express();

app.get("/", (req, res) => {
    res.redirect([
        "https://discordapp.com/oauth2/authorize",
        `?client_id=${config.application_id}`,
        "&scope=identify%20email%20guilds%20guilds.join",
        "&response_type=code",
        `&callback_uri=${config.redirect_url}`
      ].join(''));
});

app.get("/auth", (req, res) => {
    const code = req.query.code;
    const cred = btoa(`${config.application_id}:${config.client_secret}`);

    console.log(code);

    axios.post("https://discordapp.com/api/oauth2/token", {
        "client_id": config.application_id,
        "client_secret": config.client_secret,
        "grant_type": "authorization_code",
        "code": code
    }, {
        headers: {
            "Authorization": `Basic ${cred}`,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).then((resp) => {

        let access_token = resp.data.access_token;
        let refresh_token = resp.data.refresh_token;

        axios.get("https://discordapp.com/api/users/@me", {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        }).then((resp) => {
            console.log(resp.data);
            let user_id = resp.data.id;

            client.connect(err => {
                const collection = client.db(config.mongodb_database).collection(config.mongodb_collection);
                collection.insertOne({
                    "user_id": user_id,
                    "access_token": access_token,
                    "refresh_token": refresh_token
                }, function(err, res) {
                    console.log("Inserted");
                    client.close();
                })
            })
            
        }, (err) => {
            console.log(err);
        });
    
    });

    res.redirect(config.success_url);

});

app.get("/success", (req, res) => {
    res.send("Authenticated");
});

app.listen(8080, "0.0.0.0", () => console.log("Ready"));