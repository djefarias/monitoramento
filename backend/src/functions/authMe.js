const { app } = require('@azure/functions');
const { getEntity } = require('../services/tableStorage');
const { verifyToken } = require('../middleware/auth');

app.http('authMe', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'auth/me',
  handler: async (request, context) => {
    try {
      const decoded = verifyToken(request);
      
      const operator = await getEntity('operators', 'OPERATOR', decoded.id);
      
      if (!operator) {
        return {
          status: 404,
          jsonBody: {
            success: false,
            error: 'Operator not found'
          }
        };
      }
      
      return {
        status: 200,
        jsonBody: {
          success: true,
          operator: {
            id: operator.rowKey,
            email: operator.email,
            name: operator.name,
            createdAt: operator.createdAt
          }
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
      
      context.error('Error getting operator info:', error);
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
