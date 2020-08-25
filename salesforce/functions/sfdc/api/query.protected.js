'use strict';

/**
 * This function allow user to make SOQL against Salesforce
 */

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
    const {query} = serverlessEvent;
    const sfdcConn = await serverlessHelper.sfdc.getSfdcConnection(serverlessContext, serverlessHelper, twilioClient);
    const result = await sfdcConn.query(query);
    return result;
  } catch (e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, 'driver', e);
  }
}