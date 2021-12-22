
const Discord = require("discord.js");
const fs = require("fs");
const fsp = require("fs/promises");
const { randomInt } = require("crypto");
const ytdl = require('ytdl-core');
const notifier = require("node-notifier");
const ffmpeg = require("ffmpeg-static");
const opus = require("@discordjs/opus");
const {
    prefix,
    token,
    me,
    pluralkit,
    kevin
} = require('./config.json');

require("discord-reply");

const pathToFfmpeg = require("ffmpeg-static");
const { resolve } = require("dns");
const { send } = require("process");

const client = new Discord.Client();

const queue = new Map();

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

/*client.on('voiceStateUpdate', (oldMember, newMember) => {
    if (newMember.channel == null) return;
    else if (!client.guilds.cache.get(serverID).members.cache.get(me).voice && newMember.channel.guild.id == serverID && oldMember.channel != newMember.channel
    && newMember.channel.joinable && newMember.member.id != me) {
        notifier.notify({
            title: "Discord",
            message: newMember.member.user.username + " just joined " + newMember.channel.name,
            icon: "C:\\Users\\jones\\AppData\\Local\\Discord\\app.ico",
            sound: true,
            wait: false
        });
    }
})*/

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
            message.channel.send("Hi " + dadJoke + ", I'm Abott!");
        }
        else if (lowerMessage.indexOf("i’m ") != -1) {
            console.log("Told a dad joke to @" + message.author.tag + " at " + currentDate.toLocaleTimeString("en-gb"));
            const dadJoke = message.content.slice(lowerMessage.indexOf("i’m") + 4);
            message.channel.send("Hi " + dadJoke + ", I'm Abott!");
        }
        else if (lowerMessage.indexOf(" im ") != -1 || lowerMessage.startsWith("im")) {
            console.log("Told a dad joke to @" + message.author.tag + " at " + currentDate.toLocaleTimeString("en-gb"));
            const dadJoke = message.content.slice(lowerMessage.indexOf("im") + 3);
            message.channel.send("Hi " + dadJoke + ", I'm Abott!");
        }
        else if (lowerMessage.indexOf("i am ") != -1) {
            console.log("Told a dad joke to @" + message.author.tag + " at " + currentDate.toLocaleTimeString("en-gb"));
            const dadJoke = message.content.slice(lowerMessage.indexOf("i am") + 5);
            message.channel.send("Hi " + dadJoke + ", I'm Abott!");
        }
        
        var profanities = new Array();
        profanities = ["fuck", "shit", "bitch", "dick", "cunt", "f u c k", "piss", "hoe", "slag", "shite", "whore", "fag", "faggot", "tranny", "trannies", "cum"];
        var i;
        for (i = 0; i < profanities.length; i++){
            if (lowerMessage.indexOf(profanities[i]) != -1) {
                console.log("@" + message.author.tag + " said a profanity at " + currentDate.toLocaleTimeString("en-gb"));
                message.lineReply("**PROFANITIES!**");
                break;
            }
        }
    }
    /*else if (lowerMessage.indexOf("grey") != -1) {
        notifier.notify({
            title: "Discord",
            message: "@" + message.author.username + "#" + message.author.discriminator + " mentioned you in " + "#" + message.channel.name + ", " + message.guild.name,
            icon: "C:\\Users\\jones\\AppData\\Local\\Discord\\app.ico",
            sound: true,
            wait: false
        });
    }
    else if (lowerMessage.indexOf("mood") != -1) {
        console.log("@" + message.author.username + "#" + message.author.discriminator + " said \"mood\"..." + " at " + currentDate.toLocaleTimeString("en-gb"));
        message.guild.members.cache.get(client.user.id).setNickname("i hate " + message.author.username);
        message.reply("shush dumbass-");
    }*/
    
    if (message.content.indexOf(prefix) != 0) return;

    const noPrefix = message.content.slice(prefix.length);
    const command = noPrefix.split(" ").shift().toLowerCase()
    const justArgs = noPrefix.slice(command.length + 1);

    try {
        var serverQueue = queue.get(message.guild.id);
    }
    catch (err) { ; }

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
        
        // TODO: fix this mess
        case "leaderboard":
            fs.writeFileSync(".\\leaderboard.txt", "");

            let userlist = fs.readdirSync(".\\user_info");
            //console.log(userlist);
            //console.log("");
            var sortedlist = new Array();

            for (i = 0; i < userlist.length; i++) {
                //console.log("i loop");
                if (sortedlist.length == 0){
                    sortedlist.splice(0, 0, userlist[i]);
                    //console.log("this bit");
                }
                else {
                    for (k = 0; k <= sortedlist.length; k++) {
                        //console.log("k loop");
                        try {
                            if (Number(String(fs.readFileSync(".\\user_info\\" + userlist[i])).split(/\n/)[0])
                                <= Number(String(fs.readFileSync(".\\user_info\\" + sortedlist[k])).split(/\n/)[0])) {
                                sortedlist.splice(k, 0, userlist[i]);
                                /*console.log(i);
                                console.log(userlist.length);
                                console.log(k);
                                console.log(sortedlist.length);
                                console.log(Number(String(fs.readFileSync(".\\user_info\\" + userlist[i])).split(/\n/)[0]));
                                console.log(Number(String(fs.readFileSync(".\\user_info\\" + sortedlist[k])).split(/\n/)[0]));
                                console.log(sortedlist);
                                console.log("added to sorted list");
                                console.log("");*/
                                break;
                            }
                        }
                        catch (err) {
                            sortedlist.splice(k, 0, userlist[i]);
                            /*console.log(i);
                            console.log(userlist.length);
                            console.log(k);
                            console.log(sortedlist.length);
                            console.log(Number(String(fs.readFileSync(".\\user_info\\" + userlist[i])).split(/\n/)[0]));
                            console.log(Number(String(fs.readFileSync(".\\user_info\\" + sortedlist[k])).split(/\n/)[0]));
                            console.log(sortedlist);
                            console.log("added to sorted list");
                            console.log("");*/
                            break;
                        }
                        /*console.log(i);
                        console.log(userlist.length);
                        console.log(k);
                        console.log(sortedlist.length);
                        console.log(Number(String(fs.readFileSync(".\\user_info\\" + userlist[i])).split(/\n/)[0]));
                        console.log(Number(String(fs.readFileSync(".\\user_info\\" + sortedlist[k])).split(/\n/)[0]));
                        console.log(sortedlist);
                        console.log("");*/
                    }
                }
            }

            for (i = sortedlist.length - 1; i >= 0; i--) {
                //console.log("new loop " + i);
                let userID = sortedlist[i].substring(0, sortedlist[i].length - 4);
                //console.log(userID);
                
                //var user = getUserFromMessageAndID(message, userID);
                try{
                    var splitcontents = String(fs.readFileSync(".\\user_info\\" + sortedlist[i])).split(/\n/);
                    var pingcount = splitcontents[0];
                    var usertag = splitcontents[1];
                    
                    fs.appendFileSync("leaderboard.txt", (sortedlist.length - i) + ": @" + usertag + " | " + pingcount + "\n");
                }
                catch (e){
                    console.error(e);
                }
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
            if (isNumber(question.charAt(1))) {
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
        
        case "play":
            execute(message, serverQueue);
            break;
        
        case "skip":
            skip(message, serverQueue);
            break;
        
        case "stop":
            stop(message, serverQueue);
            break;
        
        case "leave":
            try {
                message.guild.me.voice.connection.disconnect();
            }
            catch (err) {
                message.channel.send("*I have to be in a voice channel for that command to work*");
            }
            break;

        case "join":
            try {
                message.member.voice.channel.join();
            }
            catch (err) {
                message.channel.send("*You must join a voice channel before using that command*");
            }
            break;
        
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

async function execute(message, serverQueue) {
    const args = message.content.slice("play".length + 2);

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(
            "*You must be in a voice channel to play music*"
        );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "*I do not have the required permissions to perform this action*"
        );
    }

    try {
        var songInfo = await ytdl.getInfo(args);
    }
    catch (err) {
        message.channel.send("*Please enter a Youtube URL to play a song*");
        return;
    }
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };

    if (!serverQueue) {
        // Creating the contract for our queue
        const queueContract = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };
        // Setting the queue using our contract
        queue.set(message.guild.id, queueContract);
        // Pushing the song to our songs array
        queueContract.songs.push(song);

        try {
            // Here we try to join the voicechat and save our connection into our object.
            var connection = await voiceChannel.join();
            queueContract.connection = connection;
            // Calling the play function to start a song
            play(message.guild, queueContract.songs[0]);
        } catch (err) {
            // Printing the error message if the bot fails to join the voicechat
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send("*An error has occurred*");
        }
    }
    else {
        serverQueue.songs.push(song);
        return message.channel.send(`**${song.title}** was added to the queue!`);
    }
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        console.log("Stopped playing")
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    console.log(`Started playing: ${song.title}`);
    serverQueue.textChannel.send(`Started playing: **${song.title}**`);
}

function skip(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "*You must be in a voice channel to stop the music*"
        );
    if (!serverQueue)
        return message.channel.send("*There was no song for me to skip*");
    serverQueue.connection.dispatcher.end();
    console.log("Song skipped");
}

function stop(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "*You must be in a voice channel to stop the music*"
        );

    if (!serverQueue)
        return message.channel.send("*There was no song for me to stop*");

    serverQueue.songs = [];

    try {
        serverQueue.connection.dispatcher.end();
        console.log("Stopped playing");
    }
    catch (err) {
        console.log("There was an error whilst trying to disconnect the dispatcher, but I've ignored it.");
    }
}

// Returns true if number, returns false otherwise
function isNumber(str) {
    if (str.length == 1 && str.match(/[0-9]/)) {
        return true;
    }
    else {
        return false;
    }
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