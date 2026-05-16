/*
 * © 2026 SeXyxeon (VOIDSEC)
 *
 * ⚠️ COPYRIGHT NOTICE
 * This source code is protected under copyright law.
 * Any form of re-uploading, recoding, modification,
 * selling, or redistribution WITHOUT explicit permission
 * from the original author is strictly prohibited.
 *
 * ❌ NO CREDIT = NO PERMISSION
 * ❌ DO NOT CLAIM THIS CODE AS YOUR OWN
 *
 * ✔️ Usage or modification is allowed ONLY
 * with prior permission and proper credit.
 *
 * OFFICIAL LINKS (ONLY):
 * YouTube   : https://youtube.com/@voidsec7718
 * Instagram : sabir._7718
 * Telegram  : https://t.me/SABIR7718
 * GitHub    : https://github.com/SABIR7718
 * WhatsApp  : +91 73650 85213
 *
 * Violations may result in DMCA takedown
 * or termination of the Telegram bot.
 */


require("dotenv").config();
process.env.NTBA_FIX_350 = 1;
const SY = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch').default;
const {
    log
} = require("@sabir7718/log");
const config = require("./config");
const http = require('http');

const PORT = process.env.PORT || 3000;
const API = process.env.API;

const LoveDir = './Love';
if (!fs.existsSync(LoveDir)) {
    fs.mkdirSync(LoveDir);
}

const activeBots = {};
const notauthorized = '⚠️ 𝖸𝗈𝗎 𝖺𝗋𝖾 𝗇𝗈𝗍 𝖺𝗎𝗍𝗁𝗈𝗋𝗂𝗓𝖾𝖽 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽.';
const protectionMessage = `❌ 𝖸𝗈𝗎 𝗆𝗎𝗌𝗍 𝗃𝗈𝗂𝗇 𝗈𝗎𝗋 𝖼𝗁𝖺𝗇𝗇𝖾𝗅 𝖺𝗇𝖽 𝗀𝗋𝗈𝗎𝗉 𝗍𝗈 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖻𝗈𝗍.\n𝖠𝖿𝗍𝖾𝗋 𝗃𝗈𝗂𝗇𝗂𝗇𝗀, 𝖼𝗅𝗂𝖼𝗄 𝗍𝗁𝖾 𝗏𝖾𝗋𝗂𝖿𝗒 𝖻𝗎𝗍𝗍𝗈𝗇 𝖻𝖾𝗅𝗈𝗐.`;

function getDB() {
    const dbPath = path.join(LoveDir, 'data.json');
    if (!fs.existsSync(dbPath)) {
        return {
            tokens: [],
            premium: [],
            resellers: []
        };
    }
    try {
        const content = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(content);
    } catch (err) {
        log('error', null, 'Database read error: ' + err.message);
        return {
            tokens: [],
            premium: [],
            resellers: []
        };
    }
}

function saveDB(data) {
    try {
        fs.writeFileSync(path.join(LoveDir, 'data.json'), JSON.stringify(data, null, 2));
    } catch (err) {
        log('error', null, 'Database save error: ' + err.message);
    }
}

function isPremium(userId) {
    const db = getDB();
    return db.premium.some(id => id.toString() === userId.toString());
}

async function CheckSYlovesToo(userId, adminId) {
    if (userId.toString() === adminId.toString()) return true;

    try {
        const response = await fetch(
            `https://checksylovetoo.onrender.com/checksylovestoo?id=${userId}`
        );

        const data = await response.json();

        return data.isjoined === true;

    } catch (err) {
        console.error("Protection API Error:", err.message);
        return false;
    }
}

function SABIR7718() {
    const diff = Date.now() - startTime;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${d}𝖽 ${h}𝗁 ${m}𝗆`;
}

const startTime = Date.now();

function mainCaption(name, runtime) {
    return `<b>─【 𝐍𝐔𝐌-𝐓𝐎-𝐃𝐄𝐓𝐀𝐈𝐋𝐒 】─

 𝖴𝗌𝖾𝗋 : ${name}
 𝖱𝗎𝗇𝗍𝗂𝗆𝖾 : ${runtime}
 𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋 : ${config.S7}

𝖴𝗌𝖾</b> <code>/number</code> <b>( number )</b>`;
}

const joinKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{
                text: '📢 𝖩𝗈𝗂𝗇 𝖢𝗁𝖺𝗇𝗇𝖾𝗅',
                url: config.channel
            }, {
                text: '👥 𝖩𝗈𝗂𝗇 𝖦𝗋𝗈𝗎𝗉',
                url: config.group
            }],
            [{
                text: '✅ 𝖵𝖾𝗋𝗂𝖿𝗒 𝖬𝖾𝗆𝖻𝖾𝗋𝗌𝗁𝗂𝗉',
                callback_data: 'check_membership'
            }]
        ]
    }
};

function startBot(token, isMain = false) {
    try {
        const S7 = new SY(token, {
            polling: true
        });
        let botConfig = {
            ...config
        };
        let tokenData = getDB().tokens.find(t => t.token === token);
        if (tokenData && tokenData.config) {
            botConfig = {
                ...botConfig,
                ...tokenData.config
            };
        }
        const botOwnerId = tokenData ? tokenData.owner : config.adminId;

        S7.getMe().then(me => {
            activeBots[token] = S7;
            log('success', 'BOT', `Started @${me.username}`);
        }).catch(err => {
            log('error', 'BOT', `Failed token ${token.slice(0,10)}`);
        });

        function SYLoVe(commands, callback) {
            if (!Array.isArray(commands)) commands = [commands];
            S7.on('message', async (msg) => {
                if (!msg.text) return;
                const cmd = msg.text.trim().split(' ')[0].slice(1).toLowerCase();
                if (commands.includes(cmd)) {
                    const chatId = msg.chat.id;
                    const userId = msg.from.id;
                    if (botConfig.channelId || botConfig.groupId) {
                        if (cmd !== 'checkmembership') {
                            const isMember = await CheckSYlovesToo(userId, botOwnerId);
                            if (!isMember) {
                                return S7.sendMessage(chatId, `🚫 <b>𝖠𝖼𝖼𝖾𝗌𝗌 𝖣𝖾𝗇𝗂𝖾𝖽!</b>\n\n𝖯𝗅𝖾𝖺𝗌𝖾 𝗃𝗈𝗂𝗇 𝗈𝗎𝗋 𝖼𝗈𝗆𝗆𝗎𝗇𝗂𝗍𝗒 𝗍𝗈 𝖼𝗈𝗇𝗍𝗂𝗇𝗎𝖾.`, {
                                    parse_mode: 'HTML',
                                    ...joinKeyboard
                                });
                            }
                        }
                    }
                    callback(msg, S7, chatId, userId);
                }
            });
        }

        SYLoVe(['start', 'menu'], (msg, S7, chatId) => {
            const name = msg.from.first_name || "𝖴𝗌𝖾𝗋";
            S7.sendPhoto(chatId, config.logo, {
                caption: mainCaption(name, SABIR7718()),
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: '📢 𝖮𝖿𝖿𝗂𝖼𝗂𝖺𝗅 𝖢𝗁𝖺𝗇𝗇𝖾𝗅',
                            url: config.channel
                        }],
                        [{
                            text: '👥 𝖲𝗎𝗉𝗉𝗈𝗋𝗍 𝖦𝗋𝗈𝗎𝗉',
                            url: config.group
                        }]
                    ]
                }
            });
        });

        SYLoVe('number', async (msg, S7, chatId, userId) => {

            const args = msg.text.split(/\s+/);
            const number = args[1];

            /*if (userId.toString() !== botOwnerId.toString() && !isPremium(userId)) {
                return S7.sendMessage(chatId,
                    `Bᴜʏ Pʀᴇᴍɪᴜᴍ Tᴏ ᴜsᴇ Tʜɪs Cᴏᴍᴍᴀɴᴅs\n\n` +
                    `Cᴏɴᴛᴀᴄᴛ Wɪᴛʜ Oᴡɴᴇʀ - @Zoroxbug\n` +
                    `Lɪғᴇᴛɪᴍᴇ Pʀᴇᴍɪᴜᴍ Pʀɪᴄᴇ - ₹200`, {
                        parse_mode: "HTML"
                    }
                );
            }*/

            if (!number) {
                return S7.sendMessage(
                    chatId,
                    "*Pʀᴏᴠɪᴅᴇ ᴀ ᴘʜᴏɴᴇ ɴᴜᴍʙᴇʀ.*\n*Exᴀᴍᴘʟᴇ: /number 9876543210*", {
                        parse_mode: "Markdown"
                    }
                );
            }

            const loading = await S7.sendMessage(
                chatId,
                "*Fᴇᴛᴄʜɪɴɢ Dᴇᴛᴀɪʟs...*", {
                    parse_mode: "Markdown"
                }
            );

            try {

                const clean = number.replace(/[^0-9]/g, '');

                const apiUrl = `${API}${clean}`;

                const response = await fetch(apiUrl);
                const json = await response.json();

                const list = json?.RESULTS;

                if (!json.SUCCESS || !Array.isArray(list) || list.length === 0) {
                    return S7.editMessageText(
                        "❌ Nᴏ Rᴇsᴜʟᴛ Fᴏᴜɴᴅ", {
                            chat_id: chatId,
                            message_id: loading.message_id
                        }
                    );
                }

                let SABIR7718 = `📋 *NUMBER SEARCH RESULTS*\n`;
                SABIR7718 += `📦 *Total Results:* ${json.COUNT || list.length}\n\n`;

                list.forEach((d, i) => {

                    SABIR7718 += `🔎 *Entry ${i + 1}*\n`;
                    SABIR7718 += "```\n";
                    SABIR7718 += `👤 Name    : ${d.NAME || 'N/A'}\n`;
                    SABIR7718 += `👨 Father  : ${d.FNAME || 'N/A'}\n`;
                    SABIR7718 += `📱 Mobile  : ${d.MOBILE || 'N/A'}\n`;
                    SABIR7718 += `☎️ Alt No  : ${d.ALT || 'N/A'}\n`;
                    SABIR7718 += `📡 Circle  : ${d.CIRCLE || 'N/A'}\n`;
                    SABIR7718 += `🆔 ID      : ${d.ID || 'N/A'}\n`;
                    SABIR7718 += `📧 Email   : ${d.EMAIL || 'N/A'}\n`;
                    SABIR7718 += `📍 Address : ${d.ADDRESS || 'N/A'}\n`;
                    SABIR7718 += "```\n\n";

                });

                if (SABIR7718.length > 3900) {
                    SABIR7718 = SABIR7718.slice(0, 3900) + "\n\n⚠️ Output trimmed...";
                }

                await S7.editMessageText(SABIR7718, {
                    chat_id: chatId,
                    message_id: loading.message_id,
                    parse_mode: "Markdown"
                });

            } catch (err) {

                console.error("API Request Error:", err);

                S7.editMessageText(
                    "⚠️ API CONNECTION ERROR.", {
                        chat_id: chatId,
                        message_id: loading.message_id
                    }
                );

            }

        });

        SYLoVe('addprem', (msg, S7, chatId, userId) => {
            if (userId.toString() !== config.adminId) return S7.sendMessage(chatId, notauthorized);

            const target = msg.text.split(' ')[1];
            if (!target) return S7.sendMessage(chatId, "Usage: /addprem <user_id>");

            let db = getDB();
            if (db.premium.includes(target)) {
                return S7.sendMessage(chatId, "✅ User is already premium.");
            }

            db.premium.push(target);
            saveDB(db);
            S7.sendMessage(chatId, `✅ *User ${target} added to Premium!*`, {
                parse_mode: "Markdown"
            });
        });

        SYLoVe('delprem', (msg, S7, chatId, userId) => {
            if (userId.toString() !== config.adminId) return S7.sendMessage(chatId, notauthorized);

            const target = msg.text.split(' ')[1];
            if (!target) return S7.sendMessage(chatId, "Usage: /delprem <user_id>");

            let db = getDB();
            const index = db.premium.indexOf(target);
            if (index === -1) return S7.sendMessage(chatId, "❌ User not found in premium list.");

            db.premium.splice(index, 1);
            saveDB(db);
            S7.sendMessage(chatId, `🗑️ *User ${target} removed from Premium.*`, {
                parse_mode: "Markdown"
            });
        });

        SYLoVe('listprem', (msg, S7, chatId, userId) => {
            if (userId.toString() !== config.adminId) return S7.sendMessage(chatId, notauthorized);

            const db = getDB();
            if (db.premium.length === 0) return S7.sendMessage(chatId, "No premium users yet.");

            let text = "🌟 *Premium Users List:*\n\n";
            db.premium.forEach((id, i) => {
                text += `${i + 1}. <code>${id}</code>\n`;
            });

            S7.sendMessage(chatId, text, {
                parse_mode: "HTML"
            });
        });

        SYLoVe('checkmembership', async (msg, S7, chatId, userId) => {
            const isMember = await CheckSYlovesToo(userId, botOwnerId);
            if (isMember) {
                S7.sendMessage(chatId, "✅ 𝖵𝖾𝗋𝗂𝖿𝗂𝖼𝖺𝗍𝗂𝗈𝗇 𝖲𝗎𝖼𝖼𝖾𝗌𝗌𝖿𝗎𝗅! 𝖸𝗈𝗎 𝖼𝖺𝗇 𝗇𝗈𝗐 𝗎𝗌𝖾 𝗍𝗁𝖾 𝖻𝗈𝗍.");
            } else {
                S7.sendMessage(chatId, protectionMessage, {
                    parse_mode: 'HTML',
                    ...joinKeyboard
                });
            }
        });

        SYLoVe('addtoken', (msg, S7, chatId, userId) => {
            if (userId.toString() !== config.adminId) return S7.sendMessage(chatId, notauthorized);
            const token = msg.text.split(' ')[1];
            if (!token) return S7.sendMessage(chatId, "𝖴𝗌𝖺𝗀𝖾: /𝖺𝖽𝖽𝗍𝗈𝗄𝖾𝗇 <𝗍𝗈𝗄𝖾𝗇>");
            let db = getDB();
            if (db.tokens.some(t => t.token === token)) return S7.sendMessage(chatId, "𝖳𝗈𝗄𝖾𝗇 𝖺𝗅𝗋𝖾𝖺𝖽𝗒 𝖾𝗑𝗂𝗌𝗍𝗌.");
            db.tokens.push({
                token,
                owner: userId.toString()
            });
            saveDB(db);
            startBot(token);
            S7.sendMessage(chatId, "✅ 𝖭𝖾𝗐 𝖻𝗈𝗍 𝗂𝗇𝗌𝗍𝖺𝗇𝖼𝖾 𝖺𝖼𝗍𝗂𝗏𝖺𝗍𝖾𝖽.");
        });

        SYLoVe('deltoken', (msg, S7, chatId, userId) => {
            if (userId.toString() !== config.adminId) return S7.sendMessage(chatId, notauthorized);
            const token = msg.text.split(' ')[1];
            if (!token) return S7.sendMessage(chatId, "𝖴𝗌𝖺𝗀𝖾: /𝖽𝖾𝗅𝗍𝗈𝗄𝖾𝗇 <𝗍𝗈𝗄𝖾𝗇>");
            let db = getDB();
            const idx = db.tokens.findIndex(t => t.token === token);
            if (idx === -1) return S7.sendMessage(chatId, "𝖳𝗈𝗄𝖾𝗇 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽.");
            db.tokens.splice(idx, 1);
            saveDB(db);
            if (activeBots[token]) {
                activeBots[token].stopPolling().catch(() => {});
                delete activeBots[token];
            }
            S7.sendMessage(chatId, "🗑️ 𝖳𝗈𝗄𝖾𝗇 𝗋𝖾𝗆𝗈𝗏𝖾𝖽.");
        });

        S7.on('callback_query', async (query) => {
            if (query.data === 'check_membership') {
                const isMember = await CheckSYlovesToo(query.from.id, botOwnerId);
                if (isMember) {
                    S7.deleteMessage(query.message.chat.id, query.message.message_id).catch(() => {});
                    S7.sendMessage(query.message.chat.id, "✅ 𝖠𝖼𝖼𝖾𝗌𝗌 𝖦𝗋𝖺𝗇𝗍𝖾𝖽!");
                } else {
                    S7.answerCallbackQuery(query.id, {
                        text: "❌ 𝖸𝗈𝗎 𝗁𝖺𝗏𝖾𝗇'𝗍 𝗃𝗈𝗂𝗇𝖾𝖽 𝗒𝖾𝗍!",
                        show_alert: true
                    });
                }
            }
        });

    } catch (err) {
        log('error', 'SYSTEM', err.message);
    }
}

startBot(config.mainToken, true);
const db = getDB();
db.tokens.forEach(item => startBot(item.token));
log('info', 'SYSTEM', `Premium System Online.`);

const RENDER_URL = "https://checksylovetoo.onrender.com/checksylovestoo?id=1823013721";

async function keepSYloveAlive() {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(RENDER_URL, {
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!res.ok) return;

        const data = await res.json().catch(() => null);

        if (data?.isjoined !== undefined) {
            console.log("🟢 Render Awake");
        }

    } catch (err) {}
}

keepSYloveAlive();

setInterval(keepSYloveAlive, 5 * 60 * 1000);

const server = http.createServer((req, res) => {
    const uptime = SABIR7718();
    
    const responseData = {
        status: "online",
        message: "Bot is Running Successfully",
        uptime: uptime,
        developer: "SABIR7718",
        bot_type: "Number Lookup Bot",
        timestamp: new Date().toISOString()
    };

    res.writeHead(200, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    
    res.end(JSON.stringify(responseData, null, 2));
});

server.listen(PORT, () => {
    log('success', 'HTTP', `Uptime server running on port ${PORT}`);
});

if (process.env.URL) {

    (async () => {
        try {
            const res = await fetch(process.env.URL);
            log('info', 'PING', `Pinged: ${process.env.URL} | Status: ${res.status}`);
        } catch (err) {
            log('error', 'PING', err.message);
        }
    })();

    setInterval(async () => {
        try {
            const res = await fetch(process.env.URL);
            log('info', 'PING', `Pinged: ${process.env.URL} | Status: ${res.status}`);
        } catch (err) {
            log('error', 'PING', err.message);
        }
    }, 5 * 60 * 1000);
}