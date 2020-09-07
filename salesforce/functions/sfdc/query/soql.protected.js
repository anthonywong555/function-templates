'use strict';

/**
 * This function allow user to make SOQL against Salesforce
 */

const SERVERLESS_FILE_PATH = '/sfdc/query/soql';

/**
 * Twilio calls this method
 * @param {Object} context 
 * @param {Object} event 
 * @param {Function} callback
 * @returns {Object} 
 */
exports.handler = async (context, event, callback) => {
  try {
    const twilioClient = context.getTwilioClient();
    const serverlessHelper = loadServerlessModules();
    const result = await driver(context, event, serverlessHelper, twilioClient);
    return callback(null, result);
  } catch (e) {
    return callback(e);
  }
};

/**
 * Loads up related helper methods.
 */
const loadServerlessModules = () => {
  try {
    const functions = Runtime.getFunctions();
    const serverlessHelperPath = functions['sfdc/helpers/index'].path;
    const serverlessHelper = require(serverlessHelperPath);
    return serverlessHelper;
  } catch (e) {
    throw e;
  }
}

/**
 * Main Driver of the Twilio Serverless Function
 * @param {Object} serverlessContext 
 * @param {Object} serverlessEvent 
 * @param {Object} serverlessHelper 
 * @param {Object} twilioClient 
 * @returns {Object}
 */
const driver = async (serverlessContext, serverlessEvent, serverlessHelper, twilioClient) => {
  try {
    const action = serverlessHelper.sfdc.action.generateAction(
      serverlessContext, 
      serverlessEvent, 
      serverlessHelper,
      serverlessHelper.sfdc.action.ACTION_QUERY
    );
    const sfdcConnection = await serverlessHelper.sfdc.cache.getSFDCConnection(
      serverlessContext, 
      serverlessHelper, 
      twilioClient
    );
    const result = await serverlessHelper.sfdc.reducer.driver(
      serverlessContext,
      serverlessHelper,
      sfdcConnection,
      action
    );
    return result;
  } catch (e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, SERVERLESS_FILE_PATH, 'driver', e);
  }
}