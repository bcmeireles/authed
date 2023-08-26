const axios = require("axios")
const config = require("./config.json")
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(config.mongodb_url, {useUnifiedTopology: true});

function join(access_token, refresh_token, user_id, guild_id) {
    axios.put(`https://discordapp.com/api/v6/guilds/${guild_id}/members/${user_id}`, {
        "access_token": access_token
    }, { headers: {"Authorization": `Bot ${config.bot_token}`} }).then((resp) => {
        if(resp.status == 201 || resp.status == 204) {
            return true;
        } else {
            axios.post("https://discord.com/api/v10/oauth2/token", {
                'client_id': config.application_id,
                'client_secret': config.client_secret,
                'grant_type': 'refresh_token',
                'refresh_token': refresh_token
              }, { headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((resp) => {
                console.log(resp.data);
                let new_access_token = resp.data.access_token;
                let new_refresh_token = resp.data.refresh_token;
                client.connect().then(() => {
                    return client.db("authed").collection("users").updateOne({
                        "user_id": user_id
                    }, {
                        $set: {
                            "access_token": new_access_token,
                            "refresh_token": new_refresh_token
                        }
                    }).then(() => {
                        return client.close();
                    }).then(() => {
                        join(new_access_token, new_refresh_token, user_id, guild_id);
                    })
                })
              })
        }
    }, (error) => {
        console.log(error)
        return false;
    });
}