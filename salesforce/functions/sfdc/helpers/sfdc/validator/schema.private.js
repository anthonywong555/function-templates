'use strict';

/**
 * SERVERLESS FILE BOLIER PLATE
 */
const SERVERLESS_FILE_PATH = '/salesforce/helpers/sfdc/validator/schema';

const SOQL_SCHEMA = {
  type: 'object',
  required: [ 'query' ],
  properties: {
    query: { type: 'string' }
  },
  errorMessage: 'Missing query field.'
};

const CREATE_UPDATE_SOBJECT_SCHEMA = {
  type: 'object',
  required: ['sobject', 'records'],
  properties: {
    sobject: { type: 'string' },
    records: { 
      type: ['string', 'object', 'array'],
      recordKeywordChecker: true
    }
  },
  errorMessage: {
    type: 'should be an object',
    required: {
      sobject: 'sobject field is required. It must be a string.',
      records: 'records field is required. It can be either JSON or a string that can be JSON.parse()'
    }
  }
};

const DELETE_SOBJECT_SCHEMA = {
  type: 'object',
  required: ['sobject', 'ids'],
  properties: {
    sobject: { type: 'string' },
    ids: { 
      type: ['string', 'array'],
      arrayOfStringsChecker: true
    }
  },
  errorMessage: {
    type: 'should be an object',
    required: {
      sobject: 'sobject field is required. It must be a string.',
      ids: 'ids field is required. It can be either string, array of strings, or a string that can be JSON.parse()'
    }
  }
};

const actionTypeToSchema = (serverlessContext, serverlessHelper, actionType) => {
  let result;
  
  switch(actionType) {
    case serverlessHelper.sfdc.constants.ACTION_QUERY:
      result = SOQL_SCHEMA;
      break;
    case serverlessHelper.sfdc.constants.ACTION_SOBJECT_CREATE:
    case serverlessHelper.sfdc.constants.ACTION_SOBJECT_UPDATE:
      result = CREATE_UPDATE_SOBJECT_SCHEMA;
      break;
    case serverlessHelper.sfdc.constants.ACTION_SOBJECT_READ:
      break;
    case serverlessHelper.sfdc.constants.ACTION_SOBJECT_DELETE:
      result = DELETE_SOBJECT_SCHEMA;
      break;
    default:
      const e = new Error(`Invalid actionType: ${actionType}`);
      throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, SERVERLESS_FILE_PATH, 'actionTypeToSchema', e);
  }

  return result;
}

module.exports = {actionTypeToSchema};