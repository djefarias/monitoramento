const { app } = require('@azure/functions');
const { listEntities } = require('../services/tableStorage');
const { comparePassword } = require('../utils/crypto');
const { generateToken } = require('../middleware/auth');
const { validateEmail, validateRequired } = require('../utils/validation');

app.http('authLogin', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'auth/login',
  handler: async (request, context) => {
    try {
      const body = await request.json();
      
      validateRequired(body.email, 'Email');
      validateRequired(body.password, 'Password');
      
      if (!validateEmail(body.email)) {
        return {
          status: 400,
          jsonBody: {
            success: false,
            error: 'Invalid email format'
          }
        };
      }
      
      const operators = await listEntities('operators', `PartitionKey eq 'OPERATOR' and email eq '${body.email.toLowerCase()}'`);
      
      if (operators.length === 0) {
        return {
          status: 401,
          jsonBody: {
            success: false,
            error: 'Invalid email or password'
          }
        };
      }
      
      const operator = operators[0];
      
      const isPasswordValid = await comparePassword(body.password, operator.passwordHash);
      
      if (!isPasswordValid) {
        return {
          status: 401,
          jsonBody: {
            success: false,
            error: 'Invalid email or password'
          }
        };
      }
      
      const token = generateToken({
        id: operator.rowKey,
        email: operator.email,
        name: operator.name
      });
      
      return {
        status: 200,
        jsonBody: {
          success: true,
          token,
          operator: {
            id: operator.rowKey,
            email: operator.email,
            name: operator.name
          }
        }
      };
      
    } catch (error) {
      context.error('Error during login:', error);
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
