const Discord = require("discord.js");
const config = require("./assets/config.json");

const client = new Discord.Client(); //{fetchAllMembers: true})

const leetTable = require("./assets/leetTable.json").table;
const badWords  = require("./assets/badWords.json");

var varients = [];

function allPossibleCases(arr) {
    if (arr.length === 0) {
      return [];
    } 
      else if (arr.length ===1){
      return arr[0];
      }
      else {
          var result = [];
          var allCasesOfRest = allPossibleCases(arr.slice(1));  // recur with the rest of array
          for (var c in allCasesOfRest) {
          for (var i = 0; i < arr[0].length; i++) {
              result.push(arr[0][i] + allCasesOfRest[c]);
          }
          }
          return result;
      }
}

function generateVarients() {
    badWords.forEach(word => {
        var i = 0;
        var tmp = [];
        word.split('').forEach(letter => {
            tmp.push(leetTable[letter]);
            i++;
        })
        //console.log(tmp);
        var r=allPossibleCases(tmp);
        r.forEach(vari => {
            varients.push(vari);
        })
    })
    
    return(`Generated: ${varients.length} word varients!`);
    
}

console.log(generateVarients());

// Bot status
client
  .on("reconnecting", () => {
    console.warn("reconnecting...");
  })
  .on("disconnect", () => {
    console.warn("disconnected!");
});
client.on("ready", async () => {   
    console.log(`Bot has started in release mode, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);  
    client.user.setActivity(`Trans Rights!`);
});

client.on("message", async message => { 
    //console.log(message.content);
    if (message.author.bot) return;

    var mess = message.content;

    if(mess === "Bad word bot online?" && message.author.id === "299709641271672832") {
        message.reply("Im alive");
    }
    mess = mess.replace(/ /g, "");
    for(var i = 100; i >= 0; i--) {
        mess = mess.replace(".", "");

    }
        varients.forEach(varient => {
        if(mess.includes(varient)) {
            var channeel = message.guild.channels.cache.find(c => c.id == "813594429323083796");


            const helpEmbed = new Discord.MessageEmbed();
            helpEmbed
                .setColor(16726994)
                .setFooter(message.author.username, message.author.avatarURL())
                .setTitle('Bad word said.')
                .addFields(
                    { name: "Channel", value: `<#${message.channel.id}>`, inline: false },
                    { name: "User", value: `<@${message.author.id}>`, inline: false },
                    { name: 'Message', value: `${message.content}`, inline: false },
                    { name: 'Message Stripped', value: `${mess}`, inline: false },
                    { name: 'Word', value: `${varient}`, inline: false },
                    { name: 'Message link', value: `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`, inline: false }
            );
            channeel.send(helpEmbed);
            channeel.send(`<@&716273854594678844>`);
        }
    })
});

client.on("error", function(error){
    console.error(`client's WebSocket encountered a connection error: ${error}`);
});
client.on("warn", function(info){
    console.log(`warn: ${info}`);
});
client.login(config.token);