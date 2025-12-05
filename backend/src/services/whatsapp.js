const axios = require('axios');

const WHATSAPP_API_URL = 'https://graph.facebook.com/v17.0';

async function sendMessage(phone, message) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  
  if (token === 'PENDING_CONFIGURATION' || phoneId === 'PENDING_CONFIGURATION') {
    return {
      success: false,
      status: 'PENDING_CONFIG',
      message: 'WhatsApp credentials not configured yet'
    };
  }
  
  try {
    const cleanPhone = phone.replace(/\D/g, '');
    
    const response = await axios.post(
      `${WHATSAPP_API_URL}/${phoneId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        text: {
          body: message
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return {
      success: true,
      status: 'SUCCESS',
      messageId: response.data.messages[0].id
    };
  } catch (error) {
    return {
      success: false,
      status: 'FAILED',
      error: error.response?.data?.error?.message || error.message
    };
  }
}

module.exports = {
  sendMessage
};
