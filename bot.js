

const Discord = require("discord.js");
const client = new Discord.Client();
const request = require("request")

const config = require("./config.json")
const prefix = config.prefix;

var currencyInfo;

function MillisecondsToClock(ms) {
    hours = Math.floor(ms / 3600000),
    minutes = Math.floor((ms % 3600000) / 60000),
    seconds = Math.floor(((ms % 360000) % 60000) / 1000)
        return {
        hours : hours,
        minutes : minutes,
        seconds : seconds,
        clock : hours + " hour(s), " + minutes + " minute(s), " + seconds + " second(s)"
    };
}

client.on("ready", () => {
    console.log("Bot is online");
    client.user.setStatus("online");
    client.user.setGame(config.prefix + "help | Server: " + client.guilds.size );
    exports.totalUsers = `${client.guilds.map(g => g.memberCount)}`;
    exports.TotalServers = `${client.guilds.size}`;
});

client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setGame(config.prefix + "help | Server: " + client.guilds.size);
    exports.totalUsers = `${client.guilds.map(g => g.memberCount)}`;
    exports.TotalServers = `${client.guilds.size}`;
});

client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setGame(config.prefix + "help | Server: " + client.guilds.size);
    exports.totalUsers = `${client.guilds.map(g => g.memberCount)}`;
    exports.TotalServers = `${client.guilds.size}`;
  });

client.on("message", message => {
    var msg = message.content.split(' ');
    switch (msg[0]) {
        case (prefix + "help"):
            message.channel.send({embed: {
                color: 0xff8040,
                fields: [{
                    name: config.prefix + "help",
                    value: "See all the commands"
                },
                {
                    name: config.prefix + "list",
                    value: "See the list of currency's"
                },
                {
                    name: config.prefix + "currency <crypto>",
                    value: "Get information about a currency"
                },
                {
                    name: config.prefix + "info",
                    value: "Information about the bot"
                }]
            }
            });
            break;
        case (prefix + "list"):
        var currencyList = [];
            request.get('https://api.coinmarketcap.com/v1/ticker/', (err, res, body) => {
                var listCurrency = JSON.parse(body);
                for (var i = 0; i < listCurrency.length; i++) {
                    currencyList.push(`${listCurrency[i].id}`);
                }   
                message.channel.send("**Currency list**\n*use these id in the ?currency command*\n\n");     
                message.channel.send(currencyList);

                if (err) { return console.log(err); }
            });
            break;
        case (prefix + "currency"):
            var currency = message.content.split(' ');
            currency.shift();
            currency = currency.join(' ');
            request.get('https://api.coinmarketcap.com/v1/ticker/' + currency + '/', (err, res, body) => {
                currencyInfo = JSON.parse(body);
                if (body.includes("error")) {
                    return;
                } else {
                    if (`${currencyInfo[0].percent_change_1h}`.toString().includes("-")){
                    const embed = new Discord.RichEmbed()
                    .setTitle(`Price of ${currencyInfo[0].name} [${currencyInfo[0].symbol}]`)
                    
                    .setColor(0xff0000)
                    .setDescription("[More info](http://www.coinmarketcap.com/currencies/" + currency+ ")")
                    .setThumbnail("https://files.coinmarketcap.com/static/img/coins/32x32/"+ currency +".png")
                    
                    .addField("\nRank",
                    `${currencyInfo[0].rank}`)
                    .addField("Price USD",
                    `$${currencyInfo[0].price_usd}`)
                    .addField("Price BTC",
                    `\u20BF${currencyInfo[0].price_btc}`)
                    .addField("Change 1h",
                    `${currencyInfo[0].percent_change_1h}%`)
                    .addField("Change 24h",
                    `${currencyInfo[0].percent_change_24h}%`)
                    .addField("Change 7d",
                    `${currencyInfo[0].percent_change_7d}%`);

                    message.channel.send({embed});
                } else {
                    const embed = new Discord.RichEmbed()
                    .setTitle(`Price of ${currencyInfo[0].name} [${currencyInfo[0].symbol}]`)
                    
                    .setColor(0x00ff00)
                    .setDescription("[More info](http://www.coinmarketcap.com/currencies/" + currency+ ")")
                    .setThumbnail("https://files.coinmarketcap.com/static/img/coins/32x32/"+ currency +".png")
                    
                    .addField("\nRank",
                    `${currencyInfo[0].rank}`)
                    .addField("Price USD",
                    `$${currencyInfo[0].price_usd}`)
                    .addField("Price BTC",
                    `\u20BF${currencyInfo[0].price_btc}`)
                    .addField("Change 1h",
                    `${currencyInfo[0].percent_change_1h}%`)
                    .addField("Change 24h",
                    `${currencyInfo[0].percent_change_24h}%`)
                    .addField("Change 7d",
                    `${currencyInfo[0].percent_change_7d}%`);
                    if (err) { return console.log(err); }
                    message.channel.send({embed});
                }
            }
            });
            break;
        case (prefix + "info"):
            message.channel.send({embed: {
                description: "A bot to send you the current value of a specific cryptocurrency.",
                color: 7268675,
                author: {
                  name: "Bot information"
                },
                fields: [
                  {
                    name: "Total users:",
                    value: client.users.size,
                    inline: true
                  },
                  {
                    name: "Total servers:",
                    value: client.guilds.size,
                    inline: true
                  },
                  {
                    name: "Uptime:",
                    value: MillisecondsToClock(client.uptime).clock
                  },
                  {
                    name: "Made By:",
                    value: "<@87156859080814592>",
                    inline: true
                  },
                  {
                    name: "Version",
                    value: "1.0.0",
                    inline: true
                  }
                ]
            }
            });
        break;
    }
});
client.login(config.token);