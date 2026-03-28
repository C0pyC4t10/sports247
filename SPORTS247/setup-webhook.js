require('dotenv').config();
const axios = require('axios');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

async function setupWebhook() {
  console.log('='.repeat(50));
  console.log('TELEGRAM WEBHOOK SETUP');
  console.log('='.repeat(50));
  
  if (!BOT_TOKEN) {
    console.log('❌ TELEGRAM_BOT_TOKEN not found in .env');
    process.exit(1);
  }
  
  if (!WEBHOOK_URL) {
    console.log('❌ WEBHOOK_URL not found in .env');
    console.log('');
    console.log('Add this to your .env file:');
    console.log('WEBHOOK_URL=https://your-app.onrender.com/telegraf');
    console.log('(Replace with your actual Render URL)');
    process.exit(1);
  }
  
  console.log('📋 Token: Found');
  console.log('📋 Webhook URL:', WEBHOOK_URL);
  console.log('');
  
  try {
    // Delete existing webhook
    console.log('🔄 Deleting old webhook...');
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`);
    console.log('✅ Old webhook deleted');
    
    // Set new webhook
    console.log('🔄 Setting new webhook...');
    const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      url: WEBHOOK_URL
    });
    
    if (response.data.ok) {
      console.log('✅ Webhook set successfully!');
      console.log('');
      console.log('🎉 Bot is now ready!');
      console.log('Message @C0PYC4T10BOT to test!');
    } else {
      console.log('❌ Failed:', response.data);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

setupWebhook();
