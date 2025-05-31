const Discord = require("discord.js");
const fs = require('fs');
const intents = new Discord.Intents();
    intents.add(Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING, Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS);
const Wedgi = new Discord.Client({intents: intents});
const Token = 'Your token here, or you can setup a .env file.';
const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'user', 'password', {
    host:'localhost',
    dialect:'sqlite',
    logging: false,
    storage: 'database.sqlite'
})
const wedgieSettings = sequelize.define('wedgieSettings',{
    chanceToSpeak: Sequelize.INTEGER,
    racism:        Sequelize.BOOLEAN,
    gid:           Sequelize.STRING
});

let file = '';
let order = 2;                                                          
let beginnings = [];
let stringArr = [];
let ngrams = {}; 

function compileMessages(){
    beginnings = [];
    try{
        let text = stringArr.join(' ');
        text = text.replace(/s.reply/g, '')
        let strArr = text.split(' ');
        for(let i = 0; i <= strArr.length - order; i++){
            let gram = '';
            for(let j = 0; j < order; j++){
                gram += `${strArr[j + i]} `;
            }
            if(!ngrams[gram]){
                ngrams[gram] = [];
                beginnings.push(gram);
            }
            let pushString = '';
            for(let j = 0; j <= order - 1; j++){
                pushString += `${strArr[i + order + j]} `;
            }
            ngrams[gram].push(pushString);
        }
        return 1;
    }catch(e){
        console.log(e);
        return 0;
    }
}

async function SendMessage(message, ngrams){
    if(!ngrams){
        console.log('Empty'); 
        return;
    } 
    try{
        let currentGram = beginnings[Math.floor(Math.random() * beginnings.length)];    //Generating the message.
        let result = currentGram;
        let len = Math.floor(Math.random() * 12) + 4;
        for(let i = 0; i < len; i++){
            let possibilities = ngrams[currentGram];
            let size = possibilities.toString().split(',');
            let next = possibilities[Math.floor(Math.random() * size.length)];
            result += next;
            currentGram = next;
            let endChance = Math.floor(Math.random() * 2);
            if(!currentGram) break;
            if(currentGram.match(/[?.!]/g) && endChance < 1){
                console.log('Complete Sentence.');
                break;
            };
        };
        result = result.replace(/ↈ/g, '\n');
        return message.channel.send(`${result}`);
    }catch(e){
        console.log(e);
    };
}

Wedgi.on('ready', async () =>{ 
    wedgieSettings.sync();
    file = fs.readFileSync('./messages.txt','utf-8',(e,) =>{
        if(e){
            console.log(e);
        };
    });
    if(file){
        console.log('File successfully loaded upon startup.');
    }; 
    setInterval(async function(){
        let date = new Date;
        let minutes = date.getMinutes();
        let hours = date.getHours();
        if(minutes == 0 && hours == 0){
            file = fs.readFileSync('./messages.txt','utf-8',(e) =>{
                if(e){
                    return console.log(e);
                };
            });
            if(file){
                console.log('Time is 00:00. File successfully reloaded.');
                let arr = file.split('\n');
                for(let i = 0; i < arr.length ; i++){
                    let cmsg = arr[i];
                    stringArr.push(cmsg);
                    i++;
                };
                console.log(`${stringArr.length} message in total. Compiling messages...`);
                let success = compileMessages();
                if(success){
                    console.log("Messages compiled, ready to use.");
                }else{
                    console.log("Messages failed.");
                }
            }else{
                console.log('Error trying to load the file. Fix it or some shit.');
            }
        };
    },60 * 1000);
    setInterval(()=>{
        let statusArr = [
            {name: "AVENGED SEVENFOLD", type: "LISTENING"},
            {name: "Memory Leak Simulator", type: "PLAYING"},
            {name: "with deez nuts lole.", type: "PLAYING"},
            {name: "Heavenly", type: "LISTENING"},
            {name: "System of a Down", type: "LISTENING"},
            {name: "Amorous", type: "PLAYING"},
            {name: "this cesspool of doddering degenerates.", type: "LISTENING"},
            {name: "this cesspool of doddering degenerates.", type: "WATCHING"},
            {name: "Rack 2 Walkthrough pt 17.", type: "WATCHING"},
            {name: "KoboldKare", type: "PLAYING"},
            {name: "Heat (VR)", type: "PLAYING"},
            {name: "Mercenary", type: "LISTENING"},
            {name: "FA's constant stream of terrible art.", type: "WATCHING"},
            {name: "Amorous Zenith cutscene (hot) on PornHub.com", type: "WATCHING"},
            {name: "Nevermore", type: "LISTENING"},
            {name: "CODE TUTORIALS BECAUSE MY CREATOR SUCKS", type: "WATCHING"},
            {name: "hot gay porn.", type: "WATCHING"},
            {name: "with your mom in bed.", type: "PLAYING"},
            {name: "some good fucking music.", type: "LISTENING"},
            {name: "your mom :wholesome:", type: "LISTENING"},
            {name: "boob playlist on YouTube.com", type: "WATCHING"},
            {name: "my sanity drain by the day.", type: "WATCHING"},
            {name: "you breathe.", type: "LISTENING"},
            {name: "by NONE of the rules", type: "PLAYING"},
            {name: "a hotdog eating competition.", type: "COMPETING"},
            {name: "Clint's Reptiles.", type: "WATCHING"},
            {name: "with fire.", type: "PLAYING"},
            {name: "HotGayHornyDragons.ca", type: "WATCHING"},
            {name: "the inevitable game of being the evolutionary best.", type: "COMPETING"},
            {name: "the 'most useless bot' competition.", type: "COMPETING"},
            {name: "Reginald bleed out on the floor.", type: "WATCHING"}
        ]
        let win = Math.floor(Math.random() * statusArr.length)
        Wedgi.user.setPresence({activities: [{name: statusArr[win].name, type: statusArr[win].type}], status: 'online'})
    }, 1000 * 60 * 15);
    Wedgi.user.setPresence({activities: [{name: 'by NONE of the rules.', type: 'PLAYING'}], status: 'online'})
    console.log('Wedgi is online.');   
    let arr = file.split('\n');
    for(let i = 0; i < arr.length; i++){
        let cmsg = arr[i];
        stringArr.push(cmsg);
        i++;
    };
    arr = arr.join('\n')
    console.log(`${stringArr.length} message in total.`);

    let initialCompile = null
    console.log("Compiling messages...");
    initialCompile = compileMessages();
    let compileStatus = (initialCompile) ? 'Success' : 'Failed';
    console.log(`Initial compile status: ${compileStatus}`);
});

Wedgi.on('messageCreate', async(message) =>{
    if(message.author.bot){
        return;
    }
    if(message.author.id == '252529231215460353' && message.content == 'wej.restart'){
        message.reply("Restarting...").then( () =>{
            process.exit();
        })
    }
    let msg = message.content.replace(/[\n]/g, 'ↈ')
    if(message.content.length > 1 && !message.channel.nsfw){
        if(!message.content.toLocaleLowerCase().match(/wej.me/g) || message.content.match(/<@909978405888475197>/g)){
            fs.appendFile('./messages.txt', `${msg}\n${message.author.id}\n`, (e) =>{
                if(e){
                    console.log(e);
                };
            });
        }
    };
    let con = message.content.toLocaleLowerCase();
    let settings = await wedgieSettings.findOne({where: {gid: message.guild.id}});
    if(settings){
        let perms = message.member.permissions.toArray();
        let pFlag = perms.includes('ADMINISTRATOR')
        if(con.startsWith('wej.set') && pFlag){  //Shittily impemented command system.
            let wejSetArgs = message.content.substr(8);
                wejSetArgs = wejSetArgs.split(' ').shift();
                if(wejSetArgs.match(/r=[0-1]/g)){
                    let rArg = wejSetArgs.replace(/[a-zA-Z\=]/g,'');
                    let rFlag = (rArg == 1) ? true : false;
                    try{
                        await settings.update({racism: rFlag});
                        return message.channel.send(`Updated settings for \`${message.guild.name}\`. Racism is now ${rFlag}.`)
                    }catch(e){
                        return console.log(e);
                    };
                }else if(wejSetArgs.match(/c=\b([1-9]|[0-9][0-9]|[0-9][0-9][0-9]|1000)\b/g)){
                    let cArg = wejSetArgs.replace(/[a-zA-Z\=]/g,'');
                    try{
                        settings.update({chanceToSpeak: cArg});
                        let percent = settings.dataValues.chanceToSpeak / 10
                        return message.channel.send(`Updated settings for \`${message.guild.name}\`. Chance to speak is now ${percent}%`)
                    }catch(e){
                        return console.log(e);
                    };
                };
        }else if(con.startsWith('wej.me')){
            let arr = file.split('\n');
            let userMessageList = [];
            try{
                let msgArr = message.content.toLocaleLowerCase().slice(7).split(/ +/);
                let targetUser = await FindMember(message, msgArr)|| message.author;
                for(let i = 0; i < arr.length; i++){
                    let authorScanId = arr[i+1];
                    if(authorScanId == targetUser){
                        userMessageList.push(arr[i]);
                    };
                };
            }catch(e){
                console.log(e);
            };
            let randomMessage = Math.floor(Math.random() * userMessageList.length);
            console.log(userMessageList.length);
            let finalMessage = userMessageList[randomMessage];
            return message.channel.send(finalMessage);
        }
        if(message.content.toLocaleLowerCase().startsWith('wej.inv')){
            return message.channel.send('https://discord.com/oauth2/authorize?client_id=909978405888475197&scope=bot&permissions=8');
        };
        let chance = settings.dataValues.chanceToSpeak;     //Start of the markov stuff.
        let outcome = Math.floor(Math.random() * 1000);
    if(outcome < chance || message.content.toLocaleLowerCase().match('wedginald') || message.mentions.has(Wedgi.user) || message.content.toLocaleLowerCase().match('wigger')){
        message.channel.sendTyping().then(() =>{
        let copyMessageChance = Math.floor(Math.random() * 3);
        if(copyMessageChance < 1){
            let rMessage = Math.floor(Math.random() * stringArr.length / 2);
            let cMessage = stringArr[rMessage * 2];
            console.log('message copied');
            return message.channel.send(cMessage)
        }
        SendMessage(message, ngrams);
    })
        };
    }else{
        return console.log(`Could not find table for guild ${message.guild.name} (ID = ${message.guild.id})`);
    };
});

Wedgi.on('guildCreate',async (guild) => {
    let table = await wedgieSettings.findOne({where: {gid: guild.id}})
    if(!table){
        table = await wedgieSettings.create({
            chanceToSpeak:      5,
            racism:             1,
            gid:                guild.id,
        });
        let sChannel = guild.systemChannel;
        if(sChannel){
            return sChannel.send(`you made a huge mistake lmao`);
        };
    }else{
        let sChannel = guild.systemChannel;
        if(sChannel){
            return sChannel.send(`oh hey ive been here before`);
        };
    };
});

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));
Wedgi.login(Token);

async function FindMember(base, target){
    let tFinal = target.toString().replace(/,/g,' ');
    if(!tFinal) return null;
    let user;
    let h = await base.mentions.members.first();
    if(h){
        return h;
    }
    h = await base.guild.members.fetch();
    user = h.find(m => m.id == tFinal || m.user.username.toLowerCase().startsWith(tFinal));
    if(user){
        return user;
    }
    else{
        user = h.find(m => m.user.username.toLowerCase().match(tFinal) || m.nickname != null && m.nickname.toLowerCase().match(tFinal));
    }
    if(!user){
        return null
    }
    return user
}