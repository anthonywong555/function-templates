'use strict';

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

const driver = async (serverlessContext, serverlessEvent, serverlessHelper, twilioClient) => {
  try {
    const {query} = serverlessEvent;
    const sfdcConn = await serverlessHelper.getSfdcConnection(serverlessContext, serverlessHelper, twilioClient);
    const result = await sfdcConn.query(query);
    return result;
  } catch (e) {
    throw serverlessHelper.formatErrorMsg(serverlessContext, 'driver', e);
  }
}