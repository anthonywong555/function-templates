'use strict';

/**
 * SERVERLESS FILE BOLIER PLATE
 */
const SERVERLESS_FILE_PATH = '/sfdc/helpers/sfdc/reducer/index';

const execute = async(sfdcConnection, action) => {
  try {
    const {type, payload} = action;
    switch(type) {
      case 'soql':
        return await sfdcConnection.query(payload); 
      default:
        return null;
    }
  } catch(e) {
    return e;
  }
}

const driver = async(serverlessContext, serverlessHelper, sfdcConnection, action) => {
  const NUM_RETRY = 1;
  for(let i = 0; i < NUM_RETRY; i++) {
    try {
      const result = await execute(sfdcConnection, action);
      return result;
    } catch (e) {
      // Check if it's unauthorize connection
      throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, SERVERLESS_FILE_PATH, 'driver', e);
    }
  }
}

module.exports = {driver};