const axios = require("axios")

const config = require("./config.json")

function join(access_token, user_id, guild_id) {
    axios.put(`https://discordapp.com/api/v6/guilds/${guild_id}/members/${user_id}`, {
        "access_token": access_token
    }, { headers: {"Authorization": `Bot ${config.bot_token}`} }).then((resp) => {
        if(resp.status == 201 || resp.status == 204) {
            console.log(resp.data)
            return true;
        } else {
            console.log(resp.data)
            // TODO: Check if access token expired
            // https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-refresh-token-exchange-example
            return false;
        }
    }, (error) => {
        console.log(error)
        return false;
    });
}