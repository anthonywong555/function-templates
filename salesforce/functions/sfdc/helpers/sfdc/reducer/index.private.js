'use strict';

/**
 * SERVERLESS FILE BOLIER PLATE
 */
const SERVERLESS_FILE_PATH = '/sfdc/helpers/sfdc/reducer/index';

const SFDC_ERROR_INVALID_SESSION_ID = 'INVALID_SESSION_ID';

const execute = async(serverlessHelper, sfdcConnection, action) => {
  try {
    const {type, payload} = action;
    const {query, sobject, ids, records} = payload;

    switch(type) {
      case serverlessHelper.sfdc.action.ACTION_QUERY:
        return await sfdcConnection.query(query);
      case serverlessHelper.sfdc.action.ACTION_SOBJECT_CREATE:
        return await sfdcConnection.sobject(sobject).create(records);
      case serverlessHelper.sfdc.action.ACTION_SOBJECT_READ:
        return await sfdcConnection.sobject(sobject).create(ids);
      case serverlessHelper.sfdc.action.ACTION_SOBJECT_UPDATE:
        return await sfdcConnection.sobject(sobject).update(records);
      case serverlessHelper.sfdc.action.ACTION_SOBJECT_UPDATE:
        return await sfdcConnection.sobject(sobject).destroy(ids);
      default:
        return null;
    }
  } catch(e) {
    throw e;
  }
}

const driver = async(serverlessContext, serverlessHelper, sfdcConnection, action) => {
  const SFDC_NUM_API_RETRY = parseInt(serverlessContext.SFDC_NUM_API_RETRY) ? 
    parseInt(serverlessContext.SFDC_NUM_API_RETRY) : 
    2;
  
  let isErrorThrown;
  let result;

  for(let i = 0; i < SFDC_NUM_API_RETRY; i++) {
    try {
      isErrorThrown = false;
      result = await execute(serverlessHelper, sfdcConnection, action);
      break;
    } catch (e) {
      isErrorThrown = true;
      result = e;
      const {name} = e;
      if(name === SFDC_ERROR_INVALID_SESSION_ID) {
        sfdcConnection = await serverlessHelper.sfdc.cache.getSFDCConnection(serverlessContext, serverlessHelper, twilioClient, true);
      }
    }
  }

  if(isErrorThrown) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, SERVERLESS_FILE_PATH, 'driver', e); 
  }

  return result;
}

module.exports = {driver};