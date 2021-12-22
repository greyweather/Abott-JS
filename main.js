const Discord = require("discord.js");
const fs = require("fs");
const { randomInt } = require("crypto");
const {
    prefix,
    token,
    me,
    pluralkit,
    kevin,
    profanitylist
} = require('./config.json');

require("discord-reply");

const client = new Discord.Client();

var dadMode = false;

// Log when online
client.once("ready", () => {
    console.log("Abott is online!");
    
    var dadModeNum = Number(fs.readFileSync(".\\dadmode.txt"));
    switch (dadModeNum) {
        case 0:
            dadMode = false;
            console.log("dadMode automatically set to false");
            break;
        case 1:
            dadMode = true;
            console.log("dadMode automatically set to true");
            break;
        default:
            console.log("The contents of the dadmode.txt file were invalid");
            break;
    }
});

process.on("unhandledRejection", error => {
    console.error("Unhandled promise rejection:", error)
});

// When a message is sent anywhere, check against commands
client.on("message", message => {
    const lowerMessage = message.content.toLowerCase();
    var currentDate = new Date();

    if (message.author.bot && message.author.id != pluralkit || message.author.id == kevin) { return; }
    else if (lowerMessage.indexOf("pinging") != -1) {
        console.log("Pong-ed @" + message.author.tag + " at " + currentDate.toLocaleTimeString("en-gb"));
        message.lineReply("ponging");
        RecordPingPong(message.author.id, message.author.tag);
    }
    else if (lowerMessage.indexOf("pingu") != -1) {
        console.log("Pong-ed @" + message.author.tag + " at " + currentDate.toLocaleTimeString("en-gb"));
        message.lineReply("pongu");
        RecordPingPong(message.author.id, message.author.tag);
    }
    else if (lowerMessage.indexOf("ping") != -1) {
        console.log("Pong-ed @" + message.author.tag + " at " + currentDate.toLocaleTimeString("en-gb"));
        message.lineReply("pong");
        RecordPingPong(message.author.id, message.author.tag);
    }
    else if (dadMode) {
        if (lowerMessage.indexOf("i'm ") != -1) {
            console.log("Told a dad joke to @" + message.author.tag + " at " + currentDate.toLocaleTimeString("en-gb"));
            const dadJoke = message.content.slice(lowerMessage.indexOf("i'm") + 4);
            if (dadJoke == "abott") {
                SpidermanMeme(message);
            }
            else{
                message.lineReply("Hi " + dadJoke + ", I'm Abott!");
            }
        }
        else if (lowerMessage.indexOf("i’m ") != -1) {
            console.log("Told a dad joke to @" + message.author.tag + " at " + currentDate.toLocaleTimeString("en-gb"));
            const dadJoke = message.content.slice(lowerMessage.indexOf("i’m") + 4);
            if (dadJoke == "abott") {
                SpidermanMeme(message);
            }
            else{
                message.lineReply("Hi " + dadJoke + ", I'm Abott!");
            }
        }
        else if (lowerMessage.indexOf(" im ") != -1 || lowerMessage.startsWith("im")) {
            console.log("Told a dad joke to @" + message.author.tag + " at " + currentDate.toLocaleTimeString("en-gb"));
            const dadJoke = message.content.slice(lowerMessage.indexOf("im") + 3);
            if (dadJoke == "abott") {
                SpidermanMeme(message);
            }
            else{
                message.lineReply("Hi " + dadJoke + ", I'm Abott!");
            }
        }
        else if (lowerMessage.indexOf("i am ") != -1) {
            console.log("Told a dad joke to @" + message.author.tag + " at " + currentDate.toLocaleTimeString("en-gb"));
            const dadJoke = message.content.slice(lowerMessage.indexOf("i am") + 5);
            if (dadJoke == "abott") {
                SpidermanMeme(message);
            }
            else {
                message.lineReply("Hi " + dadJoke + ", I'm Abott!");
            }
        }

        for (i = 0; i < profanitylist.length; i++){
            if (lowerMessage.indexOf(profanitylist[i]) != -1) {
                console.log("@" + message.author.tag + " said a profanity at " + currentDate.toLocaleTimeString("en-gb"));
                message.lineReply("**PROFANITIES!**");
                break;
            }
        }
    }

    else if (lowerMessage.indexOf("me when") != -1) {
        console.log("@" + message.author.tag + " said \"me when\"..." + " at " + currentDate.toLocaleTimeString("en-gb"));
        message.guild.members.cache.get(client.user.id).setNickname(message.author.username + " is stinky");
        message.lineReply("s h u t");
    }
    
    if (message.content.indexOf(prefix) != 0) return;

    const noPrefix = message.content.slice(prefix.length);
    const command = noPrefix.split(" ").shift().toLowerCase()
    const justArgs = noPrefix.slice(command.length + 1);

    // Switch statement for commands
    switch (command) {
        case "playing":
            if (message.author.id == me) {
                const status = justArgs;
                client.user.setActivity(status);
            }
            break;
        
        case "time":
            message.channel.send(currentDate.toLocaleTimeString("en-gb"));
            break;
        
        case "leaderboard":
            fs.writeFileSync(".\\leaderboard.txt", "");

            let userlist = fs.readdirSync(".\\user_info");
            var sortedlist = new Array();

            for (i = 0; i < userlist.length; i++) {
                if (sortedlist.length == 0){
                    sortedlist.splice(0, 0, userlist[i]);
                }
                else {
                    for (k = 0; k <= sortedlist.length; k++) {
                        try {
                            if (Number(String(fs.readFileSync(".\\user_info\\" + userlist[i])).split(/\n/)[0])
                                <= Number(String(fs.readFileSync(".\\user_info\\" + sortedlist[k])).split(/\n/)[0])) {
                                sortedlist.splice(k, 0, userlist[i]);
                                break;
                            }
                        }
                        catch (err) {
                            sortedlist.splice(k, 0, userlist[i]);
                            break;
                        }
                    }
                }
            }

            for (i = sortedlist.length - 1; i >= 0; i--) {
                try{
                    var splitcontents = String(fs.readFileSync(".\\user_info\\" + sortedlist[i])).split(/\n/);
                    var pingcount = splitcontents[0];
                    var usertag = splitcontents[1];
                    
                    fs.appendFileSync("leaderboard.txt", (sortedlist.length - i) + ": @" + usertag + " | " + pingcount + "\n");
                }
                catch (err){ console.error(err); }
            }

            const leaderboardMessage = new Discord.MessageEmbed()
                .setColor('#FFD100')
                .setTitle("Global Abott Leaderboard")
                .setAuthor('grey', null, 'https://github.com/greyweather')
                .setDescription(fs.readFileSync(".\\leaderboard.txt"))
                .setTimestamp()
                .setFooter('bot may not be completely functional');

            message.channel.send(leaderboardMessage);
            
            break;
        
        case "dice":
            const diceFaces = justArgs;
            const castFaces = Number(diceFaces);
            if (diceFaces.length == 0 || !Number.isSafeInteger(castFaces) || castFaces == 0) return;

            const diceNumber = randomInt(1, castFaces + 1);
            if (String(diceNumber).indexOf("8") == 0) {
                message.channel.send("You rolled an " + String(diceNumber) + "!");
            }
            else {
                message.channel.send("You rolled a " + String(diceNumber) + "!");
            }

            if (diceFaces.indexOf("8") == 0) {
                console.log("I rolled an " + diceFaces + "-sided dice, and got " + diceNumber + "!");
            }
            else {
                console.log("I rolled a " + diceFaces + "-sided dice, and got " + diceNumber + "!");
            }

            break;
        
        case "maths":
            const question = justArgs;
            if (isNumber(question.charAt(0))) {
                try {
                    var answer = eval(question);
                    message.channel.send(String(answer));
                    break;
                }
                catch (err) {
                    console.log("Math error... " + String(question));
                    break;
                }
            }
            else {
                break;
            }
        
        case "dadmode":
            if (message.author.id == me) {
                switch (justArgs) {
                    case "true":
                        dadMode = true;
                        message.channel.send("dadMode now set to true");
                        console.log("dadMode set to true");
                        fs.writeFileSync(".\\dadmode.txt", String(1));
                        break;
                    
                    case "false":
                        dadMode = false;
                        message.channel.send("dadMode now set to false");
                        console.log("dadMode set to false");
                        fs.writeFileSync(".\\dadmode.txt", String(0));
                        break;
                    default:
                        break;
                }
            }
            if (justArgs == "") {
                message.channel.send("dadMode is currently set to " + String(dadMode));
            }
            else if (message.author.id != me) {
                message.lineReply("*Only user @" + client.users.cache.get(me).tag + " can use that command!*");
            }
            break;
        
        case "pongcount":
            message.lineReply("You have \"ping\"-ed me " + fs.readFileSync(".\\user_info\\" + message.author.id + ".txt")
                + " times, and I've replied with \"pong\" to every single one of them!");
            break;
        
        default:
            message.channel.send("*Please type a valid command*");
            console.log("@" + message.author.username + "#" + message.author.discriminator + " typed an invalid command")
            break;
    }
})

// Returns true if number, returns false otherwise
function isNumber(str) {
    if (str.length == 1 && str.match(/[0-9]/)) {
        return true;
    }
    else {
        return false;
    }
}

function SpidermanMeme(message) {
    message.lineReply("No, that's me silly!");
}

// Saves the number of times a user has said "ping" in a file formatted as: [insert ID].txt
function RecordPingPong(user, usertag) {
    var usersSaved = fs.readdirSync(".\\user_info");
    if (usersSaved.find(element => element == user + ".txt")) {
        currentCounter = Number(String(fs.readFileSync(".\\user_info\\" + user + ".txt")).split("\n")[0]);
        currentCounter++;
        fs.writeFileSync(".\\user_info\\" + user + ".txt", String(currentCounter) + "\n" + usertag);
    }
    else {
        fs.writeFileSync(".\\user_info\\" + user + ".txt", String(1) + "\n" + usertag);
    }
}

client.login(token);