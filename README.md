# authed
 
Authed is a discord authentication/backup discord bot that uses [Discord's OAuth2](https://discord.com/developers/docs/topics/oauth2) in order to authenticate members and save their `access_token`. Having the user's access token allows the application to make certain requests to the API on their behalf, restricted to whatever scopes were requested. In this case, to join servers for the user.

# Table of Contents

- [Setup](#setup)
  - [Database](#database)
  - [Discord Application \& Bot](#discord-application--bot)
  - [Dependencies](#dependencies)
- [Usage](#usage)
- [TO DO](#to-do)

# Setup

## Database

Authed uses [MongoDB](https://www.mongodb.com/) for it's database. You will need an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/) and create a Cluster. Also create a database (inside the cluster) and a collection (inside the database). Other ways to store the database, such as locally, are possible with some changes to the code.

Next edit `mongodb_url`, `mongodb_database` and `mongodb_collection` at `config.json` with the uri of the cluster connection (starting with `mongodb+srv://`), the name you gave the database and the name you gave the collection that will store the information on the users.

The stored information is the user's `discord id`, their `access token` and their `refresh token`, find out more about these [here](https://discord.com/developers/docs/topics/oauth2).

## Discord Application & Bot

After setting up the database you need to configure both the discord application and the bot. Firstly head over to [Discord Developer Portal](https://discord.com/developers/applications) and create a new application and a bot for it.

Fill `config.json` with the Application ID in `application_id`, and all the others. `redirect_url` and `success_url` are set to point to `http://localhost:8080/`, assuming you're running on localhost. Change those to your domain if you are hosting it to the outside world.

## Dependencies

With the terminal open on the main Authed folder, simply run `npm i` and all dependencies will be insstalled.

# Usage

In order to actually use Authed you will firstly need to launch the web server using `node server.js`. In it's current version, Authed will only be waiting for connections coming to `http://localhost:8080/`, or your domain if that has been changed and will be storing the `discord id`, `access token` and `refresh token` of discord users who authenticate with their account. A verify bot that verifies users after authenticating will be added with the next update.

The `join.js` script has everything that is needed to add a user to a server through their `access token`, only needing `join([access_token], [user_id], [guild_id])` to be added to the end of it. Ina  future update, a CLI based panel will also be added to add a specific amount of users to a server, retrieving their `access token`s from the database.

# TO DO
- Actual verification bot
- CLI based panel for adding members to a server
- Check if access tokens are expired and renewing them if so