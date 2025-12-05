const { app } = require('@azure/functions');
const { v4: uuidv4 } = require('uuid');
const { createEntity, listEntities } = require('../services/tableStorage');
const { hashPassword } = require('../utils/crypto');
const { validateEmail, validateRequired } = require('../utils/validation');

app.http('authRegister', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'auth/register',
  handler: async (request, context) => {
    try {
      const adminSecret = request.headers.get('x-admin-secret');
      
      if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
        return {
          status: 403,
          jsonBody: {
            success: false,
            error: 'Invalid admin secret'
          }
        };
      }
      
      const body = await request.json();
      
      validateRequired(body.email, 'Email');
      validateRequired(body.password, 'Password');
      validateRequired(body.name, 'Name');
      
      if (!validateEmail(body.email)) {
        return {
          status: 400,
          jsonBody: {
            success: false,
            error: 'Invalid email format'
          }
        };
      }
      
      if (body.password.length < 6) {
        return {
          status: 400,
          jsonBody: {
            success: false,
            error: 'Password must be at least 6 characters'
          }
        };
      }
      
      const existingOperators = await listEntities('operators', `PartitionKey eq 'OPERATOR' and email eq '${body.email}'`);
      
      if (existingOperators.length > 0) {
        return {
          status: 409,
          jsonBody: {
            success: false,
            error: 'Email already registered'
          }
        };
      }
      
      const operatorId = uuidv4();
      const passwordHash = await hashPassword(body.password);
      
      const entity = {
        partitionKey: 'OPERATOR',
        rowKey: operatorId,
        email: body.email.toLowerCase(),
        passwordHash: passwordHash,
        name: body.name,
        createdAt: new Date().toISOString()
      };
      
      await createEntity('operators', entity);
      
      return {
        status: 201,
        jsonBody: {
          success: true,
          operator: {
            id: operatorId,
            email: entity.email,
            name: entity.name,
            createdAt: entity.createdAt
          }
        }
      };
      
    } catch (error) {
      context.error('Error registering operator:', error);
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
