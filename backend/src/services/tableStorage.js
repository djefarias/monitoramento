const { TableClient } = require('@azure/data-tables');

const connectionString = process.env.STORAGE_CONNECTION_STRING;

function getTableClient(tableName) {
  return TableClient.fromConnectionString(connectionString, tableName);
}

async function createEntity(tableName, entity) {
  const client = getTableClient(tableName);
  return await client.createEntity(entity);
}

async function getEntity(tableName, partitionKey, rowKey) {
  const client = getTableClient(tableName);
  try {
    return await client.getEntity(partitionKey, rowKey);
  } catch (error) {
    if (error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

async function listEntities(tableName, filter = null) {
  const client = getTableClient(tableName);
  const entities = [];
  
  const options = filter ? { queryOptions: { filter } } : {};
  
  for await (const entity of client.listEntities(options)) {
    entities.push(entity);
  }
  
  return entities;
}

async function updateEntity(tableName, entity) {
  const client = getTableClient(tableName);
  return await client.updateEntity(entity, 'Merge');
}

async function deleteEntity(tableName, partitionKey, rowKey) {
  const client = getTableClient(tableName);
  return await client.deleteEntity(partitionKey, rowKey);
}

module.exports = {
  createEntity,
  getEntity,
  listEntities,
  updateEntity,
  deleteEntity
};
