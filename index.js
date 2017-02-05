var DiscordJS = require('discord.js');
var config = require('./json/config.json');
var database = require("./database.js");

var bot = new DiscordJS.Client();


bot.on('ready', () => {
    console.log("Ready!");
    database.startFireBase();
});

bot.on("message", msg => {
    if(msg.author.bot) return;
    if (!msg.content.startsWith(config.prefix)) return;

    let command = msg.content.split(" ")[0];
    command = command.slice(config.prefix.length);

    let args = msg.content.split(" ").slice(1);
    var argsLenght = msg.content.split(" ").length - 1;

    if (command == "start") {

        console.log("Args start: " + args);
        console.log("Args lenght: " + argsLenght);
        if (argsLenght < 1 ) {
            msg.channel.sendMessage("Command syntax: " + "`" + config.prefix + command + " <nickname>" + "`");
            return;
        }

        database.writeUserData(msg.author.id, msg.author.username, msg.author.avatarURL, args[0]);
        showUserProfile(msg, msg.author.id, msg.author.username);
        console.log("Saved");

    }
    if (command == "profile") {
        showUserProfile(msg, msg.author.id, msg.author.username);
    }
    if(command == "reset"){
      database.removeUserData(msg.author.id, msg.author.username);
    }
});

bot.login(config.botToken);


function showUserProfile(msg, userId, username) {
    database.getUserData(userId, username, function(firebaseData) {
        if (firebaseData != null) {
            msg.channel.sendMessage("**" + firebaseData.nick + "**" + "```" + "\n\nlevel: " + firebaseData.level + "```");
            console.log("Loaded");
        } else {
            msg.channel.sendMessage("User not defined");
        }
    });
}
