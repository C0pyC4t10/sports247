require('dotenv').config();
const axios = require('axios');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

async function setupWebhook() {
  if (!WEBHOOK_URL) {
    console.log('❌ WEBHOOK_URL not set in .env');
    console.log('Add to .env: WEBHOOK_URL=https://your-domain.com/telegraf');
    return;
  }

  try {
    // Delete existing webhook first
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`);
    console.log('✅ Deleted old webhook');
    
    // Set new webhook
    const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      url: WEBHOOK_URL,
      allowed_updates: ['message', 'callback_query']
    });
    
    if (response.data.ok) {
      console.log('✅ Webhook set successfully!');
      console.log('🔗 Webhook URL:', WEBHOOK_URL);
    } else {
      console.log('❌ Failed to set webhook:', response.data);
    }
    
    // Verify webhook
    const verify = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
    console.log('📋 Webhook info:', JSON.stringify(verify.data.result, null, 2));
    
  } catch (error) {
    console.log('❌ Error setting webhook:', error.message);
  }
}

setupWebhook();
