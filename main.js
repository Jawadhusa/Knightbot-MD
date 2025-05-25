const settings = require('./settings');
require('./config.js');
const { isBanned } = require('./lib/isBanned');
const yts = require('yt-search');
const { fetchBuffer } = require('./lib/myfunc');
const fs = require('fs');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const path = require('path');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { addWelcome, delWelcome, isWelcomeOn, addGoodbye, delGoodBye, isGoodByeOn } = require('./lib/index');

// استيراد الأوامر
const booksCommand = require('./commands/books');
const tagAllCommand = require('./commands/tagall');
const helpCommand = require('./commands/help');
const banCommand = require('./commands/ban');
const { promoteCommand } = require('./commands/promote');
const { demoteCommand } = require('./commands/demote');
const muteCommand = require('./commands/mute');
const unmuteCommand = require('./commands/unmute');
const stickerCommand = require('./commands/sticker');
const isAdmin = require('./lib/isAdmin');
const warnCommand = require('./commands/warn');
const warningsCommand = require('./commands/warnings');
const ttsCommand = require('./commands/tts');
const { tictactoeCommand, handleTicTacToeMove } = require('./commands/tictactoe');
const { incrementMessageCount, topMembers } = require('./commands/topmembers');
const ownerCommand = require('./commands/owner');
const deleteCommand = require('./commands/delete');
const { handleAntilinkCommand, handleLinkDetection } = require('./commands/antilink');
const { Antilink } = require('./lib/antilink');
const memeCommand = require('./commands/meme');
const tagCommand = require('./commands/tag');
const jokeCommand = require('./commands/joke');
const quoteCommand = require('./commands/quote');
const factCommand = require('./commands/fact');
const weatherCommand = require('./commands/weather');
const newsCommand = require('./commands/news');
const kickCommand = require('./commands/kick');
const simageCommand = require('./commands/simage');
const attpCommand = require('./commands/attp');
const { startHangman, guessLetter } = require('./commands/hangman');
const { startTrivia, answerTrivia } = require('./commands/trivia');
const { complimentCommand } = require('./commands/compliment');
const { insultCommand } = require('./commands/insult');
const { eightBallCommand } = require('./commands/eightball');
const { lyricsCommand } = require('./commands/lyrics');
const { dareCommand } = require('./commands/dare');
const { truthCommand } = require('./commands/truth');
const { clearCommand } = require('./commands/clear');
const pingCommand = require('./commands/ping');
const aliveCommand = require('./commands/alive');
const blurCommand = require('./commands/img-blur');
const welcomeCommand = require('./commands/welcome');
const goodbyeCommand = require('./commands/goodbye');
const githubCommand = require('./commands/github');
const { handleAntiBadwordCommand, handleBadwordDetection } = require('./lib/antibadword');
const antibadwordCommand = require('./commands/antibadword');
const { handleChatbotCommand, handleChatbotResponse } = require('./commands/chatbot');
const takeCommand = require('./commands/take');
const { flirtCommand } = require('./commands/flirt');
const characterCommand = require('./commands/character');
const wastedCommand = require('./commands/wasted');
const shipCommand = require('./commands/ship');
const groupInfoCommand = require('./commands/groupinfo');
const resetlinkCommand = require('./commands/resetlink');
const staffCommand = require('./commands/staff');
const unbanCommand = require('./commands/unban');
const emojimixCommand = require('./commands/emojimix');
const { handlePromotionEvent } = require('./commands/promote');
const { handleDemotionEvent } = require('./commands/demote');
const viewOnceCommand = require('./commands/viewonce');
const clearSessionCommand = require('./commands/clearsession');
const { autoStatusCommand, handleStatusUpdate } = require('./commands/autostatus');
const { simpCommand } = require('./commands/simp');
const { stupidCommand } = require('./commands/stupid');
const pairCommand = require('./commands/pair');
const stickerTelegramCommand = require('./commands/stickertelegram');
const textmakerCommand = require('./commands/textmaker');
const { handleAntideleteCommand, handleMessageRevocation, storeMessage } = require('./commands/antidelete');
const clearTmpCommand = require('./commands/cleartmp');
const setProfilePicture = require('./commands/setpp');
const instagramCommand = require('./commands/instagram');
const facebookCommand = require('./commands/facebook');
const playCommand = require('./commands/play');
const tiktokCommand = require('./commands/tiktok');
const songCommand = require('./commands/song');
const aiCommand = require('./commands/ai');
const { handleTranslateCommand } = require('./commands/translate');
const { handleSsCommand } = require('./commands/ss');
const { addCommandReaction, handleAreactCommand } = require('./lib/reactions');
const { goodnightCommand } = require('./commands/goodnight');
const { shayariCommand } = require('./commands/shayari');
const { rosedayCommand } = require('./commands/roseday');
const imagineCommand = require('./commands/imagine');

// الإعدادات العامة
global.packname = settings.packname;
global.author = settings.author;
global.channelLink = "https://chat.whatsapp.com/HrMdlVfuQeP7ir8HnRnwUK";
global.ytch = "Jawad 🍻✨";

// معلومات القناة
const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid:  120363161513685998@newsletter ,
            newsletterName:  IsHaQ-md ,
            serverMessageId: -1
        }
    }
};

async function handleMessages(sock, messageUpdate, printLog) {
    try {
        const { messages, type } = messageUpdate;
        if (type !==  notify ) return;

        const message = messages[0];
        if (!message?.message) return;

        // تخزين الرسالة لميزة منع الحذف
        if (message.message) {
            storeMessage(message);
        }

        // التعامل مع حذف الرسائل
        if (message.message?.protocolMessage?.type === 0) {
            await handleMessageRevocation(sock, message);
            return;
        }

        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const isGroup = chatId.endsWith( @g.us );

        let userMessage = message.message?.conversation?.trim().toLowerCase() ||
            message.message?.extendedTextMessage?.text?.trim().toLowerCase() ||   ;
        userMessage = userMessage.replace(/\.\s+/g,  . ).trim();

        // الحفاظ على النص الأصلي للأوامر التي تحتاج إلى الحالة الأصلية
        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||   ;

        // تسجيل استخدام الأوامر فقط
        if (userMessage.startsWith( . )) {
            console.log(`📝 أمر مستخدم في ${isGroup ?  مجموعة  :  خاص }: ${userMessage}`);
        }

        // التحقق من إذا كان المستخدم محظورًا (تخطي التحقق لأمر .unban)
        if (isBanned(senderId) && !userMessage.startsWith( .unban )) {
            // الرد أحيانًا لتجنب السبام
            if (Math.random() < 0.1) {
                await sock.sendMessage(chatId, {
                    text:  ❌ أنت محظور من استخدام البوت. تواصل مع المشرف لإلغاء الحظر. ,
                    ...channelInfo
                });
            }
            return;
        }

        // التحقق أولاً إذا كانت حركة في اللعبة
        if (/^[1-9]$/.test(userMessage) || userMessage.toLowerCase() ===  surrender ) {
            await handleTicTacToeMove(sock, chatId, senderId, userMessage);
            return;
        }

        if (!message.key.fromMe) incrementMessageCount(chatId, senderId);

        // التحقق من الكلمات السيئة أولاً، قبل أي معالجة أخرى
        if (isGroup && userMessage) {
            await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
        }

        // ثم التحقق من بادئة الأمر
        if (!userMessage.startsWith( . )) {
            if (isGroup) {
                // معالجة الرسائل غير الأوامر أولاً
                await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                await Antilink(message, sock);
                await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
            }
            return;
        }

        // قائمة أوامر المشرفين
        const adminCommands = [ .mute ,  .unmute ,  .ban ,  .unban ,  .promote ,  .demote ,  .kick ,  .tagall ,  .antilink ];
        const isAdminCommand = adminCommands.some(cmd => userMessage.startsWith(cmd));

        // قائمة أوامر المالك
        const ownerCommands = [ .mode ,  .autostatus ,  .antidelete ,  .cleartmp ,  .setpp ,  .clearsession ,  .areact ,  .autoreact ];
        const isOwnerCommand = ownerCommands.some(cmd => userMessage.startsWith(cmd));

        let isSenderAdmin = false;
        let isBotAdmin = false;

        // التحقق من حالة المشرف فقط لأوامر المشرفين في المجموعات
        if (isGroup && isAdminCommand) {
            const adminStatus = await isAdmin(sock, chatId, senderId);
            isSenderAdmin = adminStatus.isSenderAdmin;
            isBotAdmin = adminStatus.isBotAdmin;

            if (!isBotAdmin) {
                await sock.sendMessage(chatId, { text:  يرجى جعل البوت مشرفًا لاستخدام أوامر المشرفين. , ...channelInfo });
                return;
            }

            if (
                userMessage.startsWith( .mute ) ||
                userMessage ===  .unmute  ||
                userMessage.startsWith( .ban ) ||
                userMessage.startsWith( .unban ) ||
                userMessage.startsWith( .promote ) ||
                userMessage.startsWith( .demote )
            ) {
                if (!isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, {
                        text:  عذرًا، فقط مشرفو المجموعة يمكنهم استخدام هذا الأمر. ,
                        ...channelInfo
                    });
                    return;
                }
            }
        }

        // التحقق من حالة المالك لأوامر المالك
        if (isOwnerCommand) {
            // التحقق إذا كانت الرسالة من المالك (fromMe) أو من البوت نفسه
            if (!message.key.fromMe) {
                await sock.sendMessage(chatId, {
                    text:  ❌ هذا الأمر متاح فقط للمالك! ,
                    ...channelInfo
                });
                return;
            }
        }

        // التحقق من وضع الخصوصية
        try {
            const data = JSON.parse(fs.readFileSync( ./data/messageCount.json ));
            // السماح للمالك باستخدام البوت حتى في الوضع الخاص
            if (!data.isPublic && !message.key.fromMe) {
                return; // تجاهل الرسائل من غير المالك في الوضع الخاص
            }
        } catch (error) {
            console.error( خطأ في التحقق من وضع الوصول: , error);
            // الوضع الافتراضي هو العام إذا حدث خطأ في قراءة الملف
        }

        // معالجات الأوامر
        switch (true) {
            case userMessage ===  .simage : {
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                if (quotedMessage?.stickerMessage) {
                    await simageCommand(sock, quotedMessage, chatId);
                } else {
                    await sock.sendMessage(chatId, { text:  الرد على الملصق بأمر .simage لتحويله. , ...channelInfo });
                }
                break;
            }
            // ... (استمرار معالجات الأوامر بنفس الهيكل مع ترجمة الرسائل)
            default:
                if (isGroup) {
                    // التعامل مع الرسائل غير الأوامر في المجموعات
                    if (userMessage) {
                        await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                    }
                    await Antilink(message, sock);
                    await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
                }
                break;
        }

        if (userMessage.startsWith( . )) {
            // بعد معالجة الأمر بنجاح
            await addCommandReaction(sock, message);
        }
    } catch (error) {
        console.error( ❌ خطأ في معالج الرسائل: , error.message);
        if (chatId) {
            await sock.sendMessage(chatId, {
                text:  ❌ فشل في معالجة الأمر! ,
                ...channelInfo
            });
        }
    }
}

async function handleGroupParticipantUpdate(sock, update) {
    try {
        const { id, participants, action, author } = update;

        // التحقق إذا كانت مجموعة
        if (!id.endsWith( @g.us )) return;

        // التعامل مع الترقيات
        if (action ===  promote ) {
            await handlePromotionEvent(sock, id, participants, author);
            return;
        }

        // التعامل مع التنزيلات
        if (action ===  demote ) {
            await handleDemotionEvent(sock, id, participants, author);
            return;
        }

        // التعامل مع أحداث الانضمام
        if (action ===  add ) {
            const isWelcomeEnabled = await isWelcomeOn(id);
            if (!isWelcomeEnabled) return;

            const data = JSON.parse(fs.readFileSync( ./data/userGroupData.json ));
            const welcomeData = data.welcome[id];
            const welcomeMessage = welcomeData?.message ||  مرحبًا {user} في المجموعة! 🎉 ;

            for (const participant of participants) {
                const user = participant.split( @ )[0];
                const formattedMessage = welcomeMessage.replace( {user} , `@${user}`);

                await sock.sendMessage(id, {
                    text: formattedMessage,
                    mentions: [participant]
                });
            }
        }

        // التعامل مع أحداث المغادرة
        if (action ===  remove ) {
            const isGoodbyeEnabled = await isGoodByeOn(id);
            if (!isGoodbyeEnabled) return;

            const data = JSON.parse(fs.readFileSync( ./data/userGroupData.json ));
            const goodbyeData = data.goodbye[id];
            const goodbyeMessage = goodbyeData?.message ||  وداعًا {user} 👋 ;

            for (const participant of participants) {
                const user = participant.split( @ )[0];
                const formattedMessage = goodbyeMessage.replace( {user} , `@${user}`);

                await sock.sendMessage(id, {
                    text: formattedMessage,
                    mentions: [participant]
                });
            }
        }
    } catch (error) {
        console.error( خطأ في handleGroupParticipantUpdate: , error);
    }
}

module.exports = {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus: async (sock, status) => {
        await handleStatusUpdate(sock, status);
    }
};
