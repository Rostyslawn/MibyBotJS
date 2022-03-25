const { Client, MessageEmbed } = require("discord.js");
const config = require("./config");
const help = require("./help");
const mongoose = require("mongoose");
const fs = require("fs");

mongoose.connect("mongodb://localhost:27017/MibyBot");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    language: String,
    balance: Number,
    rolls: Number,
    bonus: Boolean,
    isClosed: Boolean
});

const User = mongoose.model("User", userSchema);

let bot = new Client({
    presence: {
        status: 'online',
        activity: {
            name: `${config.prefix}help`,
            type: 'PLAYING'
        }
    }
});

bot.on('ready', () => console.log(`Bot ${bot.user.tag} started work`));

const prefix = config.prefix;

bot.on('message', (message) => {
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(" ");
    const msg = args.shift().toLowerCase();
    const msgAI = message.author.id;

    let coin;
    let embed;

    const coinOrel = () => {
        User.findOne({username: msgAI}, (err, doc) => {
            if(doc.balance < 20) {
                if(doc.language == "en") {
                    return message.reply("You don't have enough coins");
                } else if(doc.language == "ru") {
                    return message.reply("Не хватает монет на балансе");
                }

                return message.reply("Не вистачає грошей на балансі");
            }

            User.findOneAndUpdate({username: msgAI}, {$inc: {balance: -20}}, {new: true}, (err) => {if(err) console.log(err);});

            coin = Math.floor(Math.random() * 2);

            if(coin == 0) {
                User.findOneAndUpdate({username: msgAI}, {$inc: {balance: 25}}, {new: true}, (err) => {
                    if(doc.language == "en") {
                        embed = new MessageEmbed()
                            .setTitle(`Orel or reshka`)
                            .setColor(0xff0000)
                            .setDescription(`Orel\n You win ;)`);
                    } else if(doc.language == "ru") {
                        embed = new MessageEmbed()
                            .setTitle(`Орел или решка`)
                            .setColor(0xff0000)
                            .setDescription(`Орел\n Ты победил ;)`);
                    } else {
                        embed = new MessageEmbed()
                            .setTitle(`Орел чи рішка`)
                            .setColor(0xff0000)
                            .setDescription(`Орел\n Ти переміг ;)`);
                    }

                    message.channel.send(embed);
                });
            } else {
                User.findOne({username: msgAI}, (err, doc) => {
                    if(doc.language == "en") {
                        embed = new MessageEmbed()
                            .setTitle(`Orel or reshka`)
                            .setColor(0xff0000)
                            .setDescription(`Orel\n You lose :(`);
                    } else if(doc.language == "ru") {
                        embed = new MessageEmbed()
                            .setTitle(`Орел или решка`)
                            .setColor(0xff0000)
                            .setDescription(`Орел\n Ты проиграл :(`);
                    } else {
                        embed = new MessageEmbed()
                            .setTitle(`Орел чи рішка`)
                            .setColor(0xff0000)
                            .setDescription(`Орел\n Ти програв :(`);
                    }

                    message.channel.send(embed);
                });
            }
        });
    }

    const coinReshka = () => {
        User.findOne({username: msgAI}, (err, doc) => {
            if(doc.balance < 20) {
                if(doc.language == "en") {
                    return message.reply("You don't have enough coins");
                } else if(doc.language == "ru") {
                    return message.reply("Не хватает монет на балансе");
                }

                return message.reply("Не вистачає грошей на балансі");
            }

            User.findOneAndUpdate({username: msgAI}, {$inc: {balance: -20}}, {new: true}, (err) => {if(err) console.log(err);});

            coin = Math.floor(Math.random() * 2);

            if(coin == 1) {
                User.findOneAndUpdate({username: msgAI}, {$inc: {balance: 25}}, {new: true}, (err) => {
                    if(doc.language == "en") {
                        embed = new MessageEmbed()
                            .setTitle(`Orel or reshka`)
                            .setColor(0xff0000)
                            .setDescription(`Reshka\n You win ;)`);
                    } else if(doc.language == "ru") {
                        embed = new MessageEmbed()
                            .setTitle(`Орел или решка`)
                            .setColor(0xff0000)
                            .setDescription(`Решка\n Ты победил ;)`);
                    } else {
                        embed = new MessageEmbed()
                            .setTitle(`Орел чи рішка`)
                            .setColor(0xff0000)
                            .setDescription(`Рішка\n Ти переміг ;)`);
                    }

                    message.channel.send(embed);
                });
            } else {
                if(doc.language == "en") {
                    embed = new MessageEmbed()
                        .setTitle(`Orel or reshka`)
                        .setColor(0xff0000)
                        .setDescription(`Reshka\n You lose :(`);
                } else if(doc.language == "ru") {
                    embed = new MessageEmbed()
                        .setTitle(`Орел или решка`)
                        .setColor(0xff0000)
                        .setDescription(`Решка\n Ты проиграл :(`);
                } else {
                    embed = new MessageEmbed()
                        .setTitle(`Орел чи рішка`)
                        .setColor(0xff0000)
                        .setDescription(`Рішка\n Ти програв :(`);  
                } 

                message.channel.send(embed);
            }
        });
    }

    const freeRoll = () => {
        User.findOne({username: msgAI}, (err, doc) => {
            // FREE ROLL \\
            let ranN = Math.floor(Math.random() * 15);
            let strNum = message.content.slice(7);
            let Num = Number(strNum);

            if(message.content.length <= 5) {
                if(doc.language == "en") {
                    return message.reply("Please write number! 0 to 15");
                } else if(doc.language == "ru") {
                    return message.reply("Введите число от 0 до 15");
                }

                return message.reply("Введіть число від 0 до 15");
            } else {
                if(Num > 15) {
                    if(doc.language == "en") {
                        return message.reply("Max number 15!");
                    } else if(doc.language == "ru") {
                        return message.reply("Максимальное число 15!");
                    }
                    
                    return message.reply("Максимальне число 15");
                } else {
                    if(Num == ranN) {
                        if(doc.language == "en") {
                            embed = new MessageEmbed()
                                .setTitle(`Number: ${ranN}`)
                                .setColor(0xff0000)
                                .setDescription(`Your number: ${Num} \n You win ;)`)
                        } else if(doc.language == "ru") {
                            embed = new MessageEmbed()
                                .setTitle(`Число: ${ranN}`)
                                .setColor(0xff0000)
                                .setDescription(`Твое число: ${Num}\n Поздравляю с победой ;)`)
                        } else {
                            embed = new MessageEmbed()
                                .setTitle(`Число: ${ranN}`)
                                .setColor(0xff0000)
                                .setDescription(`Твоє число: ${Num}\n Вітаю з перемогою ;)`)
                        }
                        
                        message.channel.send(embed);
                        User.findOneAndUpdate({username: msgAI}, {$inc: {balance: 30 }}, {new: true}, (err) => {if(err) console.log(err);});
                    } else {
                        if(doc.language == "en") {
                            embed = new MessageEmbed()
                                .setTitle(`Number: ${ranN}`)
                                .setColor(0xff0000)
                                .setDescription(`Your number: ${Num} \n You lose :(`)
                        } else if(doc.language == "ru") {
                            embed = new MessageEmbed()
                                .setTitle(`Число: ${ranN}`)
                                .setColor(0xff0000)
                                .setDescription(`Твое число: ${Num}\n Ты проиграл(я не удивлен :)`)
                        } else {
                            embed = new MessageEmbed()
                                .setTitle(`Число: ${ranN}`)
                                .setColor(0xff0000)
                                .setDescription(`Твоє число: ${Num}\n Ти програв :(`)
                        }

                        message.channel.send(embed);
                    }
                }
            } 
            // FREE ROLL \\
        });
    }

    if(msg == "help") {
        message.reply(help.help.commands);
    } else if(msg == "bug") {
        let bug = message.content.slice(6);
        fs.writeFile("./bugs.log", `bug: ${bug}, author id: ${msgAI}`, err => {if(err) console.log(err)});
    } else if(msg == "registr") {
        new Promise((res, rej) => {
            const user = User.findOne({username: msgAI}).exec();
            res(user);
        })
          .then((val) => {
            if(val) {
                return message.reply("User already registered!");
            }

            User.create({username: msgAI, balance: 0, bonus: true, rolls: 0, isClosed: false, language: "en"}, (err, doc) => {
                if(err) console.log(err);
    
                fs.writeFile("./bugs.log", `NEW USER: ${doc}\n`, err => {if(err) console.log(err)});
                message.reply("Succes! User successfully registered");
            });
        });
    } else {
        new Promise((res, rej) => {
            const user = User.findOne({username: msgAI}).exec();
            res(user);
        })
          .then((val) => {
            if(!val) {
                message.reply("Command is not found or user not registered!");
            } else {
                // MY PROFILE
                if(msg == "myprofile") {
                    new Promise((res, rej) => {
                        const user = User.findOne({username: msgAI}).exec();
                        res(user);
                    })
                      .then((val) => {
                        if(!val) {
                            message.reply("User is not registered!");
                        } else {
                            User.findOne({username: msgAI}, (err, doc) => {
                                // IF BONUS IS TRUE, WRITE TRUE TEXT
                                if(doc.bonus) {
                                    //PROFILE IS CLOSED
                                    if(doc.isClosed) {
                                        if(doc.language == "en") {
                                            message.reply("Your profile:");
                                            embed = new MessageEmbed()
                                                .setTitle(`Profile:`)
                                                .setColor(0xff0000)
                                                .setDescription(`Your balance: ${doc.balance} \n Profile: closed \n if you want free coins write the command: /getbonus`)
                                        } else if(doc.language == "ru") {
                                            message.reply("Твой профиль:");
                                            embed = new MessageEmbed()
                                                .setTitle(`Профиль:`)
                                                .setColor(0xff0000)
                                                .setDescription(`Баланс: ${doc.balance} \n Профиль: закрытый \n Если хочешь взять бонус пропиши команду /getbonus`) 
                                        } else {
                                            message.reply("Твій профіль:");
                                            embed = new MessageEmbed()
                                                .setTitle(`Профіль:`)
                                                .setColor(0xff0000)
                                                .setDescription(`Баланс: ${doc.balance} \n Профіль: скритий \n Якщо хочешь взяти бонус пропиши команду /getbonus`)
                                        }

                                        message.channel.send(embed);
                                    } else { //PROFILE IS OPENED
                                        if(doc.language == "en") {
                                            message.reply("Your profile:");
                                            embed = new MessageEmbed()
                                                .setTitle(`Profile:`)
                                                .setColor(0xff0000)
                                                .setDescription(`Your balance: ${doc.balance} \n Profile: opened \n if you want free coins write the command: /getbonus`)
                                        } else if(doc.language == "ru") {
                                            message.reply("Твой профиль:");
                                            embed = new MessageEmbed()
                                                .setTitle(`Профиль:`)
                                                .setColor(0xff0000)
                                                .setDescription(`Баланс: ${doc.balance} \n Профиль: открытый \n Если хочешь взять бонус пропиши команду /getbonus`) 
                                        } else {
                                            message.reply("Твій профіль:");
                                            embed = new MessageEmbed()
                                                .setTitle(`Профіль:`)
                                                .setColor(0xff0000)
                                                .setDescription(`Баланс: ${doc.balance} \n Профіль: відкритий \n Якщо хочешь взяти бонус пропиши команду /getbonus`)
                                        }

                                        message.channel.send(embed);
                                    }
                                } else { // ELSE BONUS IS FALSE, WRITE FALSE TEXT
                                    // PROFILE IS CLOSED
                                    if(doc.isClosed) {
                                        if(doc.language == "en") {
                                            message.reply("Your profile:");
                                            embed = new MessageEmbed()
                                                .setTitle(`Profile:`)
                                                .setColor(0xff0000)
                                                .setDescription(`Your balance: ${doc.balance} \n Profile: closed`)
                                        } else if(doc.language == "ru") {
                                            message.reply("Твой профиль:");
                                            embed = new MessageEmbed()
                                                .setTitle(`Профиль:`)
                                                .setColor(0xff0000)
                                                .setDescription(`Баланс: ${doc.balance} \n Профиль: закрытый`) 
                                        } else {
                                            message.reply("Твій профіль:");
                                            embed = new MessageEmbed()
                                                .setTitle(`Профіль:`)
                                                .setColor(0xff0000)
                                                .setDescription(`Баланс: ${doc.balance} \n Профіль: скритий`)
                                        }

                                        message.channel.send(embed);
                                    } else { //PROFILE IS OPENED
                                        if(doc.language == "en") {
                                            message.reply("Your profile:");
                                            embed = new MessageEmbed()
                                                .setTitle(`Profile:`)
                                                .setColor(0xff0000)
                                                .setDescription(`Your balance: ${doc.balance} \n Profile: opened`)
                                        } else if(doc.language == "ru") {
                                            message.reply("Твой профиль:");
                                            embed = new MessageEmbed()
                                                .setTitle(`Профиль:`)
                                                .setColor(0xff0000)
                                                .setDescription(`Баланс: ${doc.balance} \n Профиль: открытый`) 
                                        } else {
                                            message.reply("Твій профіль:");
                                            embed = new MessageEmbed()
                                                .setTitle(`Профіль:`)
                                                .setColor(0xff0000)
                                                .setDescription(`Баланс: ${doc.balance} \n Профіль: відкритий`)
                                        }
                
                                        message.channel.send(embed);
                                    }
                                }
                            });
                        }
                    });
                } else if(msg == "openprofile") {
                    User.findOneAndUpdate({username: msgAI}, {isClosed: false}, {new: true}, (err, doc) => {
                        if(doc.language == "en") {
                            return message.reply("Succes");
                        } else if(doc.language == "ru") {
                            return message.reply("Успешно");
                        }

                        return message.reply("Успішно");
                    });
                } else if(msg == "closeprofile") {
                    User.findOneAndUpdate({username: msgAI}, {isClosed: true}, {new: true}, (err, doc) => {
                        if(doc.language == "en") {
                            return message.reply("Succes");
                        } else if(doc.language == "ru") {
                            return message.reply("Успешно");
                        }

                        return message.reply("Успішно");
                    });
                } else if(msg == "language") {
                    let newLanguage = message.content.slice(12).toLowerCase();

                    new Promise((res, rej) => {
                        const thisUser = User.findOneAndUpdate({username: msgAI}, {language: newLanguage}, {new: true}).exec();
                        res(thisUser);
                    })
                      .then((val) => {
                        if(!val) {
                            return message.reply("ERR! User not found!");
                        }
                      });

                    message.reply("Succes");
                } else if(msg == "getbonus") {
                    User.findOneAndUpdate({username: msgAI, bonus: true}, {bonus: false, $inc: {balance: 200}}, (err, doc) => {
                        if(doc.language == "en") {
                            return message.reply("Succes");
                        } else if(doc.language == "ru") {
                            return message.reply("Успешно");
                        }

                        message.reply("Успішно");
                    });
                } else if(msg == "roll") { 
                    User.findOne({username: msgAI}, (err, doc) => {
                        // IF ROLLS/4 CALL FUNCTION
                        if(doc.rolls % 4 == 0) {
                            freeRoll();
                        } else {
                            if(doc.balance < 10) {
                                if(doc.language == "en") {
                                    return message.reply("You don't have enough coins");
                                } else if(doc.language == "ru") {
                                    return message.reply("Не хватает монет");
                                }

                                return message.reply("Не достатньо коштів");
                            }

                            // ROLL \\
                            let ranN = Math.floor(Math.random() * 15);
                            let strNum = message.content.slice(7);
                            let Num = Number(strNum);

                            if(message.content.length <= 5) {
                                if(doc.language == "en") {
                                    return message.reply("Please write number! 0 to 15");
                                } else if(doc.language == "ru") {
                                    return message.reply("Введите число от 0 до 15");
                                }

                                return message.reply("Введіть число від 0 до 15");
                            } else {
                                if(Num > 15) {
                                    if(doc.language == "en") {
                                        return message.reply("Max number 15!");
                                    } else if(doc.language == "ru") {
                                        return message.reply("Максимальное число 15!");
                                    }
                                    
                                    return message.reply("Максимальне число 15");
                                } else {
                                    User.findOneAndUpdate({username: msgAI}, {$inc: {balance: -10, rolls: 1}}, {new: true});
                                    
                                    if(Num == ranN) {
                                        if(doc.language == "en") {
                                            embed = new MessageEmbed()
                                                .setTitle(`Number: ${ranN}`)
                                                .setColor(0xff0000)
                                                .setDescription(`Your number: ${Num} \n You win ;)`)
                                        } else if(doc.language == "ru") {
                                            embed = new MessageEmbed()
                                                .setTitle(`Число: ${ranN}`)
                                                .setColor(0xff0000)
                                                .setDescription(`Твое число: ${Num}\n Поздравляю с победой ;)`)
                                        } else {
                                            embed = new MessageEmbed()
                                                .setTitle(`Число: ${ranN}`)
                                                .setColor(0xff0000)
                                                .setDescription(`Твоє число: ${Num}\n Вітаю з перемогою ;)`)
                                        }

                                        message.channel.send(embed);
                                        User.findOneAndUpdate({username: msgAI}, {$inc: {balance: 30 }}, {new: true}, (err) => {if(err) console.log(err);});
                                    } else {
                                        if(doc.language == "en") {
                                            embed = new MessageEmbed()
                                                .setTitle(`Number: ${ranN}`)
                                                .setColor(0xff0000)
                                                .setDescription(`Your number: ${Num} \n You lose :(`)
                                        } else if(doc.language == "ru") {
                                            embed = new MessageEmbed()
                                                .setTitle(`Число: ${ranN}`)
                                                .setColor(0xff0000)
                                                .setDescription(`Твое число: ${Num}\n Ты проиграл(я не удивлен :)`)
                                        } else {
                                            embed = new MessageEmbed()
                                                .setTitle(`Число: ${ranN}`)
                                                .setColor(0xff0000)
                                                .setDescription(`Твоє число: ${Num}\n Ти програв :(`)
                                        }

                                        message.channel.send(embed);
                                    }
                                }
                            } 
                            // ROLL \\
                        }
                    });
                } else if(msg == "orel") {
                    coinOrel();
                } else if(msg == "reshka") {
                    coinReshka();
                } else if(msg == "profile") {
                    let memberProfile1 = message.content.slice(11);
                    let memberProfile2 = memberProfile1.slice(3);
                    let memberId = memberProfile2.slice(0, 18);

                    new Promise((res, rej) => {
                        const user = User.findOne({username: memberId}).exec();
                        res(user);
                    })
                      .then((val) => {
                        if(!val) {
                            message.reply("User not found!");
                        } else {
                            User.findOne({username: memberId}, (err, doc) => {
                                if(doc.isClosed) {
                                    if(doc.language == "en") {
                                        return message.reply("Can't check user profile, profile is closed");
                                    } else if(doc.language == "ru") {
                                        return message.reply("Не могу показать профиль пользователя, профиль скрыт");
                                    }

                                    return message.reply("Не можу показати профіль, профіль закритий");
                                }

                                if(doc.bonus) {
                                    if(doc.language == "en") {
                                        embed = new MessageEmbed()
                                            .setTitle("Profile:")
                                            .setColor(0xff0000)
                                            .setDescription(`Balance: ${doc.balance} \n This user has not yet received a bonus`)
                                    } else if(doc.language == "ru") {
                                        embed = new MessageEmbed()
                                            .setTitle("Профиль:")
                                            .setColor(0xff0000)
                                            .setDescription(`Баланс: ${doc.balance} \n Этот пользователь еще не брал бонус`)
                                    } else {
                                        embed = new MessageEmbed()
                                            .setTitle("Профіль:")
                                            .setColor(0xff0000)
                                            .setDescription(`Баланс: ${doc.balance} \n Цей користувач ще не брав бонус`)
                                    }
                                } else {
                                    if(doc.language == "en") {
                                        embed = new MessageEmbed()
                                            .setTitle("Profile:")
                                            .setColor(0xff0000)
                                            .setDescription(`Balance: ${doc.balance}`)
                                    } else if(doc.language == "ru") {
                                        embed = new MessageEmbed()
                                            .setTitle("Профиль:")
                                            .setColor(0xff0000)
                                            .setDescription(`Баланс: ${doc.balance}`)
                                    } else {
                                        embed = new MessageEmbed()
                                            .setTitle("Профіль:")
                                            .setColor(0xff0000)
                                            .setDescription(`Баланс: ${doc.balance}`)
                                    }
                                }

                                message.channel.send(embed);
                            }); 
                        }
                    })
                } else {
                    message.reply(`Command not found!`);
                }
            }
        });
    }
});

require('./server')();
bot.login(config.token);