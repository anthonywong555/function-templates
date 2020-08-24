'use strict';

let serverlessHelper = null;

exports.handler = async (context, event, callback) => {
  try {
    const twilioClient = context.getTwilioClient();
    loadServerlessModules();

    const result = await driver(context, event, twilioClient);
    return callback(null, result);
  } catch (e) {
    return callback(e);
  }
};

const loadServerlessModules = () => {
  try {
    const functions = Runtime.getFunctions();
    const serverlessHelperPath = functions['sfdc/helpers/index'].path;
    serverlessHelper = require(serverlessHelperPath);
  } catch (e) {
    throw e;
  }
}

const driver = async (serverlessContext, serverlessEvent, twilioClient) => {
  try {
    const {query} = serverlessEvent;
    const sfdcConn = await serverlessHelper.getSfdcConnection(serverlessContext);
    const result = await sfdcConn.query(query);
    return result;
  } catch (e) {
    throw serverlessHelper.formatErrorMsg(serverlessContext, 'driver', e);
  }
}