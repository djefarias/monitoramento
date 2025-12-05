const { app } = require('@azure/functions');
const { v4: uuidv4 } = require('uuid');
const { getEntity, createEntity } = require('../services/tableStorage');
const { sendMessage } = require('../services/whatsapp');
const { verifyToken } = require('../middleware/auth');

app.http('sendAlert', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'send-alert',
  handler: async (request, context) => {
    try {
      verifyToken(request);
      
      const body = await request.json();
      
      if (!body.contactIds || !Array.isArray(body.contactIds) || body.contactIds.length === 0) {
        return {
          status: 400,
          jsonBody: {
            success: false,
            error: 'contactIds array is required and must not be empty'
          }
        };
      }
      
      if (!body.message || body.message.trim() === '') {
        return {
          status: 400,
          jsonBody: {
            success: false,
            error: 'message is required'
          }
        };
      }
      
      const results = [];
      
      for (const contactId of body.contactIds) {
        try {
          const contact = await getEntity('contacts', 'CONTACT', contactId);
          
          if (!contact) {
            results.push({
              contactId,
              success: false,
              status: 'NOT_FOUND',
              error: 'Contact not found'
            });
            continue;
          }
          
          const sendResult = await sendMessage(contact.phone, body.message);
          
          const logId = uuidv4();
          const logEntity = {
            partitionKey: 'ALERT',
            rowKey: logId,
            contactId: contactId,
            contactName: contact.name,
            phone: contact.phone,
            message: body.message,
            status: sendResult.status,
            errorMessage: sendResult.error || '',
            messageId: sendResult.messageId || '',
            timestamp: new Date().toISOString()
          };
          
          await createEntity('alertslog', logEntity);
          
          results.push({
            contactId,
            contactName: contact.name,
            phone: contact.phone,
            success: sendResult.success,
            status: sendResult.status,
            error: sendResult.error,
            messageId: sendResult.messageId
          });
          
        } catch (error) {
          context.error(`Error processing contact ${contactId}:`, error);
          results.push({
            contactId,
            success: false,
            status: 'ERROR',
            error: error.message
          });
        }
      }
      
      const allSuccess = results.every(r => r.success);
      const hasPendingConfig = results.some(r => r.status === 'PENDING_CONFIG');
      
      return {
        status: 200,
        jsonBody: {
          success: allSuccess,
          pendingConfiguration: hasPendingConfig,
          message: hasPendingConfig 
            ? 'WhatsApp credentials not configured. Alerts logged but not sent.' 
            : allSuccess 
              ? 'All alerts sent successfully' 
              : 'Some alerts failed to send',
          results
        }
      };
      
    } catch (error) {
      if (error.message.includes('token')) {
        return {
          status: 401,
          jsonBody: {
            success: false,
            error: 'Unauthorized: ' + error.message
          }
        };
      }
      
      context.error('Error sending alerts:', error);
      return {
        status: 500,
        jsonBody: {
          success: false,
          error: error.message
        }
      };
    }
  }
});
