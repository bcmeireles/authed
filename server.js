const express = require('express');
const btoa = require('btoa');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;

const discord = require("discord.js");

const config = require("./config.json")
const client = new MongoClient(process.env.mongodb_url, {useUnifiedTopology: true});

const app = express();

app.get("/", (req, res) => {
    res.redirect([
        "https://discordapp.com/oauth2/authorize",
        `?client_id=${process.env.application_id}`,
        "&scope=guilds.join",
        "&response_type=code",
        `&callback_uri=${process.env.redirect_url}`
      ].join(''));
});

app.get("/auth", (req, res) => {
    const code = req.query.code;
    const cred = btoa(`${process.env.application_id}:${process.env.client_secret}`);

    axios.post("https://discordapp.com/api/oauth2/token", {
        "client_id": process.env.application_id,
        "client_secret": process.env.client_secret,
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
            let user_id = resp.data.id;
            
            client.connect().then(() => {
                return client.db(process.env.mongodb_database).collection(process.env.mongodb_collection).insertOne({
                    "user_id": user_id,
                    "access_token": access_token,
                    "refresh_token": refresh_token
                }).then(() => {
                    return client.close();
                }).then(() => {
                    axios.put(`https://discordapp.com/api/guilds/${process.env.guild_id}/members/${user_id}/roles/${process.env.verified_role_id}`, {}, {
                        headers: {
                            Authorization: `Bot ${process.env.bot_token}`,
                            "Content-Type": "application/json"
                        }
                    }).then(response => {
                        console.log(`[+] Role added successfully to user ${user_id}`);
                    })
                    .catch(error => {
                        console.error(`[-] Error adding role to user ${user_id}: `, error.message);
                    });
                })
            })      
        }, (err) => {
            console.log(err);
        });
    
    });

    res.redirect(process.env.success_url);

});

app.get("/success", (req, res) => {
    res.send("Authenticated");
});

app.listen(8080, "0.0.0.0", () => {
    console.log("Ready");
});