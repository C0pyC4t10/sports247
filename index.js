require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');

const API_BASE = process.env.API_BASE || 'http://localhost:3000';
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const userChats = new Map();

function mainMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('📰 All News', 'news_all'), Markup.button.callback('🏏 Cricket', 'news_cricket')],
    [Markup.button.callback('⚽ Football', 'news_football'), Markup.button.callback('🏀 Basketball', 'news_basketball')],
    [Markup.button.callback('🎾 Tennis', 'news_tennis'), Markup.button.callback('📊 Analyze', 'analyze_btn')],
    [Markup.button.callback('🎨 Generate Post', 'generate_btn'), Markup.button.callback('💬 AI Chat', 'chat_btn')],
    [Markup.button.callback('❓ Help', 'help_btn'), Markup.button.callback('🗑️ Clear Chat', 'clear_btn')]
  ]);
}

function initBot() {
  const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
  
  bot.catch((err) => {
    console.log('Bot catch error:', err.message);
  });

  const botCommands = [
    { command: 'start', description: 'Start the bot' },
    { command: 'news', description: 'Get latest sports news' },
    { command: 'news_cricket', description: 'Cricket news only' },
    { command: 'news_football', description: 'Football news only' },
    { command: 'analyze', description: 'AI analyze article URL' },
    { command: 'generate', description: 'Generate social media post' },
    { command: 'help', description: 'Show all commands' },
    { command: 'clear', description: 'Clear chat history' }
  ];

  async function setCommands() {
    try {
      await bot.telegram.setMyCommands(botCommands);
      console.log('Bot commands set successfully');
    } catch (e) {
      console.log('Set commands error:', e.message);
    }
  }

  async function chatWithAI(userId, message) {
    try {
      const history = userChats.get(userId) || [];
      
      console.log('Calling AI for user:', userId);
      
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are SPORTS247 AI assistant - a helpful, friendly sports expert. You help users with sports news, match analysis, predictions, and any sports-related questions. Keep responses concise, engaging, and use emojis." },
          ...history.slice(-10),
          { role: "user", content: message }
        ]
      }, {
        headers: { 
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      const reply = response.data.choices[0].message.content;
      console.log('AI response:', reply.substring(0, 50));
      
      history.push({ role: "user", content: message });
      history.push({ role: "assistant", content: reply });
      userChats.set(userId, history.slice(-20));
      
      return reply;
    } catch (error) {
      console.log('Chat error:', error.message);
      return "Sorry, I couldn't process your message. Try again later.";
    }
  }

  async function sendMsg(chatId, text, extra = {}) {
    try {
      await bot.telegram.sendMessage(chatId, text, extra);
    } catch (e) {
      console.log('Send error:', e.message);
    }
  }

  bot.start(async (ctx) => {
    const chatId = ctx.from.id;
    const userId = ctx.from.id;
    userChats.set(userId, []);
    
    await sendMsg(chatId, `🏆 *Welcome to SPORTS247 Bot!*

Your personal AI Sports Assistant

Choose an option from the menu below:`, {
      parse_mode: 'Markdown',
      reply_markup: mainMenu().reply_markup
    });
  });

  bot.help(async (ctx) => {
    const chatId = ctx.from.id;
    await sendMsg(chatId, `📋 *Available Commands:*

/start - Start bot & menu
/news - Latest sports news
/news_cricket - Cricket news
/news_football - Football news
/analyze <url> - AI analyze article
/generate <text> - Generate posts
/help - Show commands
/clear - Clear chat

💬 Or just chat with AI!`, { 
      parse_mode: 'Markdown',
      reply_markup: mainMenu().reply_markup
    });
  });

  bot.command('clear', async (ctx) => {
    const chatId = ctx.from.id;
    const userId = ctx.from.id;
    userChats.set(userId, []);
    await sendMsg(chatId, '✅ Chat history cleared!');
  });

  bot.command('news', async (ctx) => {
    const chatId = ctx.from.id;
    const args = ctx.message.text.split(' ').slice(1);
    const category = args[0]?.toLowerCase() || 'all';
    
    const categoryNames = {
      cricket: '🏏 Cricket',
      football: '⚽ Football',
      basketball: '🏀 Basketball',
      tennis: '🎾 Tennis',
      general: '🏆 All Sports'
    };
    
    const icon = categoryNames[category] || '📰';
    await sendMsg(chatId, `${icon} Fetching latest ${category} news...`);
    
    try {
      const response = await axios.get(`${API_BASE}/trending`, { timeout: 15000 });
      const { trending, byCategory } = response.data;
      
      let news = trending;
      if (category !== 'all' && byCategory[category]) {
        news = byCategory[category];
      }
      
      if (!news || news.length === 0) {
        return sendMsg(chatId, 'No news found. Try again later.');
      }
      
      for (const item of news.slice(0, 5)) {
        const categoryIcon = item.category === 'cricket' ? '🏏' : item.category === 'football' ? '⚽' : item.category === 'basketball' ? '🏀' : item.category === 'tennis' ? '🎾' : '📰';
        const message = `${categoryIcon} *${item.title}*\n\n📍 ${item.source}\n🔗 [Read More](${item.link})`;
        await sendMsg(chatId, message, { parse_mode: 'Markdown' });
      }
    } catch (error) {
      await sendMsg(chatId, '❌ Failed to fetch news. Please try again later.');
    }
  });

  bot.command('news_cricket', async (ctx) => {
    const chatId = ctx.from.id;
    await sendMsg(chatId, '🏏 Fetching Cricket news...');
    try {
      const response = await axios.get(`${API_BASE}/trending`, { timeout: 15000 });
      const { byCategory } = response.data;
      const news = byCategory.cricket || [];
      
      if (!news || news.length === 0) {
        return sendMsg(chatId, 'No cricket news found.');
      }
      
      for (const item of news.slice(0, 5)) {
        await sendMsg(chatId, `🏏 *${item.title}*\n\n📍 ${item.source}\n🔗 [Read More](${item.link})`, { parse_mode: 'Markdown' });
      }
    } catch (error) {
      sendMsg(chatId, '❌ Failed to fetch cricket news.');
    }
  });

  bot.command('news_football', async (ctx) => {
    const chatId = ctx.from.id;
    await sendMsg(chatId, '⚽ Fetching Football news...');
    try {
      const response = await axios.get(`${API_BASE}/trending`, { timeout: 15000 });
      const { byCategory } = response.data;
      const news = byCategory.football || [];
      
      if (!news || news.length === 0) {
        return sendMsg(chatId, 'No football news found.');
      }
      
      for (const item of news.slice(0, 5)) {
        await sendMsg(chatId, `⚽ *${item.title}*\n\n📍 ${item.source}\n🔗 [Read More](${item.link})`, { parse_mode: 'Markdown' });
      }
    } catch (error) {
      sendMsg(chatId, '❌ Failed to fetch football news.');
    }
  });

  bot.command('news_basketball', async (ctx) => {
    const chatId = ctx.from.id;
    await sendMsg(chatId, '🏀 Fetching Basketball news...');
    try {
      const response = await axios.get(`${API_BASE}/trending`, { timeout: 15000 });
      const { byCategory } = response.data;
      const news = byCategory.basketball || [];
      
      if (!news || news.length === 0) {
        return sendMsg(chatId, 'No basketball news found.');
      }
      
      for (const item of news.slice(0, 5)) {
        await sendMsg(chatId, `🏀 *${item.title}*\n\n📍 ${item.source}\n🔗 [Read More](${item.link})`, { parse_mode: 'Markdown' });
      }
    } catch (error) {
      sendMsg(chatId, '❌ Failed to fetch basketball news.');
    }
  });

  bot.command('news_tennis', async (ctx) => {
    const chatId = ctx.from.id;
    await sendMsg(chatId, '🎾 Fetching Tennis news...');
    try {
      const response = await axios.get(`${API_BASE}/trending`, { timeout: 15000 });
      const { byCategory } = response.data;
      const news = byCategory.tennis || [];
      
      if (!news || news.length === 0) {
        return sendMsg(chatId, 'No tennis news found.');
      }
      
      for (const item of news.slice(0, 5)) {
        await sendMsg(chatId, `🎾 *${item.title}*\n\n📍 ${item.source}\n🔗 [Read More](${item.link})`, { parse_mode: 'Markdown' });
      }
    } catch (error) {
      sendMsg(chatId, '❌ Failed to fetch tennis news.');
    }
  });

  bot.command('analyze', async (ctx) => {
    const chatId = ctx.from.id;
    const args = ctx.message.text.split(' ').slice(1);
    const url = args.join(' ');
    
    if (!url) {
      return sendMsg(chatId, 'Usage: /analyze <article-url>\n\nExample: /analyze https://espncricinfo.com/...');
    }
    
    await sendMsg(chatId, '🔍 Analyzing article with AI...');
    
    try {
      const response = await axios.post(`${API_BASE}/analyze`, { url }, { timeout: 30000 });
      await sendMsg(chatId, `📊 *Analysis:*\n\n${response.data.result}`, { parse_mode: 'Markdown' });
    } catch (error) {
      sendMsg(chatId, '❌ Failed to analyze. Please check the URL.');
    }
  });

  bot.command('generate', async (ctx) => {
    const chatId = ctx.from.id;
    const args = ctx.message.text.split(' ').slice(1);
    const text = args.join(' ');
    
    if (!text) {
      return sendMsg(chatId, 'Usage: /generate <sports-text>\n\nExample: /generate India wins world cup');
    }
    
    await sendMsg(chatId, '🎨 Generating social media posts...');
    
    try {
      const response = await axios.post(`${API_BASE}/generate-fb-visual`, { articleText: text }, { timeout: 30000 });
      const posts = response.data.posts;
      
      if (!posts || posts.length === 0) {
        return sendMsg(chatId, '❌ No posts generated. Try different text.');
      }
      
      for (const post of posts.slice(0, 2)) {
        const hashtags = Array.isArray(post.hashtags) ? post.hashtags.map(t => '#' + t).join(' ') : '';
        const message = `${post.fbCaption}\n\n${hashtags}`;
        await sendMsg(chatId, message);
      }
    } catch (error) {
      sendMsg(chatId, '❌ Failed to generate posts. Please try again.');
    }
  });

  bot.on('text', async (ctx) => {
    const message = ctx.message.text;
    const chatId = ctx.from.id;
    const userId = ctx.from.id;
    
    console.log('Received message:', message);
    
    if (message.startsWith('/')) {
      return;
    }
    
    try {
      await bot.telegram.sendMessage(chatId, '🤔 Thinking...');
      
      const reply = await chatWithAI(userId, message);
      
      await bot.telegram.sendMessage(chatId, reply);
    } catch (error) {
      console.log('Chat error:', error.message);
      await bot.telegram.sendMessage(chatId, '❌ Sorry, something went wrong. Try again!');
    }
  });

  bot.on('callback_query', async (ctx) => {
    const query = ctx.callbackQuery.data;
    const chatId = ctx.callbackQuery.message.chat.id;
    
    await ctx.answerCallbackQuery();
    
    if (query === 'news_all') {
      await sendNews(chatId, 'all');
    } else if (query === 'news_cricket') {
      await sendNews(chatId, 'cricket');
    } else if (query === 'news_football') {
      await sendNews(chatId, 'football');
    } else if (query === 'news_basketball') {
      await sendNews(chatId, 'basketball');
    } else if (query === 'news_tennis') {
      await sendNews(chatId, 'tennis');
    } else if (query === 'analyze_btn') {
      await sendMsg(chatId, '📊 *AI Analyze Article*\n\nSend me a URL to analyze:\n\nExample: https://espncricinfo.com/...', { parse_mode: 'Markdown' });
    } else if (query === 'generate_btn') {
      await sendMsg(chatId, '🎨 *Generate Social Post*\n\nDescribe what you want to post about:\n\nExample: India wins world cup', { parse_mode: 'Markdown' });
    } else if (query === 'chat_btn') {
      await sendMsg(chatId, '💬 *AI Chat*\n\nJust type your message and I\'ll respond!\n\nTry: "Who will win IPL 2024?"', { parse_mode: 'Markdown' });
    } else if (query === 'help_btn') {
      await sendMsg(chatId, `📋 *Available Commands:*

/start - Start bot & menu
/news - Latest sports news
/news_cricket - Cricket news
/news_football - Football news
/analyze <url> - AI analyze article
/generate <text> - Generate posts
/help - Show commands
/clear - Clear chat

💬 Or just chat with AI!`, { parse_mode: 'Markdown', reply_markup: mainMenu().reply_markup });
    } else if (query === 'clear_btn') {
      const userId = ctx.from.id;
      userChats.set(userId, []);
      await sendMsg(chatId, '✅ Chat history cleared!');
    }
  });

  async function sendNews(chatId, category) {
    const categoryNames = {
      all: '📰 All News',
      cricket: '🏏 Cricket',
      football: '⚽ Football',
      basketball: '🏀 Basketball',
      tennis: '🎾 Tennis'
    };
    
    await sendMsg(chatId, `${categoryNames[category]} Fetching latest news...`);
    
    try {
      const response = await axios.get(`${API_BASE}/trending`, { timeout: 15000 });
      const { trending, byCategory } = response.data;
      
      let news = trending;
      if (category !== 'all' && byCategory[category]) {
        news = byCategory[category];
      }
      
      if (!news || news.length === 0) {
        return sendMsg(chatId, 'No news found. Try again later.');
      }
      
      for (const item of news.slice(0, 5)) {
        const categoryIcon = item.category === 'cricket' ? '🏏' : item.category === 'football' ? '⚽' : item.category === 'basketball' ? '🏀' : item.category === 'tennis' ? '🎾' : '📰';
        const message = `${categoryIcon} *${item.title}*\n\n📍 ${item.source}\n🔗 [Read More](${item.link})`;
        await sendMsg(chatId, message, { parse_mode: 'Markdown' });
      }
    } catch (error) {
      await sendMsg(chatId, '❌ Failed to fetch news. Please try again later.');
    }
  }

  async function startBot() {
    try {
      console.log('🤖 Starting Telegram bot...');
      
      const me = await bot.telegram.getMe();
      console.log('Bot connected:', me.username);
      
      await setCommands();
      console.log('Commands registered');
      
      if (WEBHOOK_URL) {
        console.log('Setting webhook to:', WEBHOOK_URL);
        await bot.telegram.setWebhook(WEBHOOK_URL);
        console.log('✅ Webhook set successfully!');
      } else {
        console.log('Starting polling mode...');
        await bot.launch({
          polling: {
            timeout: 60,
            interval: 1000
          }
        });
        console.log('🤖 Bot started with polling!');
      }
    } catch (error) {
      console.log('Bot error:', error.message);
    }
  }

  function handleUpdate(update) {
    return bot.handleUpdate(update);
  }

  return { bot, startBot, handleUpdate };
}

module.exports = { initBot };
