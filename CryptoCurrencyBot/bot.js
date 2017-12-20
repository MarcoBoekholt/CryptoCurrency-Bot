const Discord = require("discord.js");
const client = new Discord.Client();
const request = require("request")

const config = require("./config.json")

const prefix = "?";

var currency;

var body;

client.on("ready", () => {
    console.log("Bot is online");
    client.user.setStatus("online");
    client.user.setGame("?help");
});

client.on("message", message => {
    var msg = message.content.split(' ');
    switch (msg[0]) {
        case (prefix + "help"):
            message.channel.sendMessage("Command list :\n```!!media - See help about the media player\n!!botversion - See informations about the bot```");
            break;
        case (prefix + "currency"):
            currency = message.content.split(' ');
            currency.shift();
            currency = currency.join(' ');
            request.get('https://api.coinmarketcap.com/v1/ticker/' + currency + '/', (err, res, body) => {
                let currencyInfo = JSON.parse(body);
                message.channel.send(`Rank: ${currencyInfo[0].rank} \n\nPrice USD: ${currencyInfo[0].price_usd} \nPrice BTC: ${currencyInfo[0].price_btc} \n\nMarket Cap: ${currencyInfo[0].market_cap_usd} \n24h volume: NaN \nMax supply: ${currencyInfo[0].max_supply} \n\nChange 1h: ${currencyInfo[0].percent_change_1h} \nChange 24h: ${currencyInfo[0].percent_change_24h} \nChange 7 days: ${currencyInfo[0].percent_change_7d}`);
                if (err) { return console.log(err); }
            });
            break;
    }
});

client.login("config.token");