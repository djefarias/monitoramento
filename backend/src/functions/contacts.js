const { app } = require('@azure/functions');
const { v4: uuidv4 } = require('uuid');
const { createEntity, listEntities } = require('../services/tableStorage');
const { validateRequired, validatePhone } = require('../utils/validation');
const { verifyToken } = require('../middleware/auth');

app.http('createContact', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'contacts',
  handler: async (request, context) => {
    try {
      const body = await request.json();
      
      validateRequired(body.name, 'Name');
      validateRequired(body.phone, 'Phone');
      
      if (!validatePhone(body.phone)) {
        return {
          status: 400,
          jsonBody: {
            success: false,
            error: 'Invalid phone number format'
          }
        };
      }
      
      const contactId = uuidv4();
      const entity = {
        partitionKey: 'CONTACT',
        rowKey: contactId,
        name: body.name,
        alias: body.alias || '',
        phone: body.phone.replace(/\D/g, ''),
        notes: body.notes || '',
        createdAt: new Date().toISOString()
      };
      
      await createEntity('contacts', entity);
      
      return {
        status: 201,
        jsonBody: {
          success: true,
          contact: {
            id: contactId,
            name: entity.name,
            alias: entity.alias,
            phone: entity.phone,
            notes: entity.notes,
            createdAt: entity.createdAt
          }
        }
      };
    } catch (error) {
      context.error('Error creating contact:', error);
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

app.http('listContacts', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'contacts',
  handler: async (request, context) => {
    try {
      verifyToken(request);
      
      const entities = await listEntities('contacts', "PartitionKey eq 'CONTACT'");
      
      const contacts = entities.map(e => ({
        id: e.rowKey,
        name: e.name,
        alias: e.alias,
        phone: e.phone,
        notes: e.notes,
        createdAt: e.createdAt
      }));
      
      return {
        status: 200,
        jsonBody: {
          success: true,
          contacts
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
      
      context.error('Error listing contacts:', error);
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
