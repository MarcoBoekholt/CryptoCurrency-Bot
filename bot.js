const Discord = require("discord.js");
const client = new Discord.Client();
const request = require("request")

const config = require("./config.json")
const prefix = config.prefix;

client.on("ready", () => {
    console.log("Bot is online");
    client.user.setStatus("online");
    client.user.setGame("?help");
});

client.on("message", message => {
    var msg = message.content.split(' ');
    switch (msg[0]) {
        case (prefix + "help"):
            message.channel.send({embed: {
                color: 0xff8040,
                fields: [{
                    name: "?help",
                    value: "See all the commands"
                },
                {
                    name: "?list",
                    value: "See the list of currency's"
                },
                {
                    name: "?currency <crypto>",
                    value: "Get information about a currency"
                },
                {
                    name: "?info",
                    value: "Information about the bot"
                }]
            }
            });
            break;
        case (prefix + "list"):

            break;
        case (prefix + "currency"):
            var currency = message.content.split(' ');
            currency.shift();
            currency = currency.join(' ');
            request.get('https://api.coinmarketcap.com/v1/ticker/' + currency + '/', (err, res, body) => {
                let currencyInfo = JSON.parse(body);
                const embed = new Discord.RichEmbed()
                .setTitle(`Price of ${currencyInfo[0].name} [${currencyInfo[0].symbol}]`)
                
                .setColor(0xff0000)
                .setDescription("[More info](http://www.coinmarketcap.com/currencies/" + currency+ ")")
                .setThumbnail("https://files.coinmarketcap.com/static/img/coins/32x32/"+ currency +".png")
                
                .addField("\nRank",
                `${currencyInfo[0].rank}`)
                .addField("Price USD",
                `${currencyInfo[0].price_usd}`)
                .addField("Price BTC",
                `${currencyInfo[0].price_btc}`)
                .addField("Change 1h",
                `${currencyInfo[0].percent_change_1h}`)
                .addField("Change 24h",
                `${currencyInfo[0].percent_change_24h}`)
                .addField("Change 7d",
                `${currencyInfo[0].percent_change_7d}`);

                message.channel.send({embed});
                
                if (err) { return console.log(err); }
            });
            break;
        case (prefix + "info"):

        break;
    }
});

client.login(config.token);