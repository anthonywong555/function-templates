'use strict';

/**
 * SERVERLESS FILE BOLIER PLATE
 */
const SERVERLESS_FILE_PATH = '/sfdc/helpers/sfdc/action/index';

const ACTION_QUERY = 'ACTION_QUERY';

const ACTION_SOBJECT_CREATE = 'ACTION_SOBJECT_CREATE';

const ACTION_SOBJECT_READ = 'ACTION_SOBJECT_READ';

const ACTION_SOBJECT_UPDATE = 'ACTION_SOBJECT_UPDATE';

const ACTION_SOBJECT_DELETE = 'ACTION_SOBJECT_DELETE';

const getJSON = (targetString) => {
  let result;
  try {
    result = JSON.parse(targetString);
  } catch (e) {
    result = targetString;
  }
  return result;
}

const generatePayload = (serverlessContext, serverlessEvent, serverlessHelper, actionType) => {
  try {
    let payload = null;
    switch(actionType) {
      case ACTION_QUERY:
        payload = {
          query: serverlessEvent.query
        };
        break;
      case ACTION_SOBJECT_CREATE:
      case ACTION_SOBJECT_UPDATE:
        payload = {
          sobject: serverlessEvent.sobject,
          records: getJSON(serverlessEvent.records)
        }
        break;
      case ACTION_SOBJECT_READ:
        payload = {
          sobject: serverlessEvent.sobject,
          ids: getJSON(serverlessEvent.ids)
        };
        break;
      case ACTION_SOBJECT_DELETE:
        payload = {
          ids: getJSON(serverlessEvent.ids)
        }
        break;
      default:
        throw new Error(`Unknown Action Type: ${actionType}`);
    }
    const action = {
      payload,
      type: actionType
    };

    return action;
  } catch (e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, SERVERLESS_FILE_PATH, 'generatePayload', e);
  }
}

const generateAction = (serverlessContext, serverlessEvent, serverlessHelper, actionType) => {
  try {
    const payload = generatePayload(serverlessContext, serverlessEvent, serverlessHelper, actionType);
    return payload;
  } catch(e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, SERVERLESS_FILE_PATH, 'generateAction', e);
  }
}

module.exports = {
  generateAction, 
  ACTION_QUERY, 
  ACTION_SOBJECT_CREATE, 
  ACTION_SOBJECT_READ, 
  ACTION_SOBJECT_UPDATE, 
  ACTION_SOBJECT_DELETE
};