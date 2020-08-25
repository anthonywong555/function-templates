'use strict';

const jsforce = require('jsforce');

/**
 * This method is responsible for ouath to Salesforce
 * by User-Agent Flow.
 * @param {object} serverlessContext 
 * @param {object} SalesforceConnectionObject
 */
const ouathSFDCByUserAgent = async(serverlessContext) => {
  try {
    const conn = new jsforce.Connection({
      oauth2 : {
        loginUrl : serverlessContext.SFDC_LOGIN_URL,
        clientId : serverlessContext.SFDC_CONNECTED_APP_CONSUMER_KEY,
        clientSecret : serverlessContext.SFDC_CONNECTED_APP_CONSUMER_SECRET,
        redirectUri : serverlessContext.SFDC_CONNECTED_APP_CALLBACK_URL
      }
    });
  
    await conn.login(
      serverlessContext.SFDC_USERNAME, 
      serverlessContext.SFDC_PASSWORD + serverlessContext.SFDC_SECURITY_TOKEN
    );
    return conn;
  } catch(e) {
    throw `\n
      Method: ouathSFDCByUserAgent\n
      Error: ${e}\n
    \n`;
  }
}

/**
 * Return the 
 * @param {*} serverlessContext 
 */
const getAuthToken = async(serverlessContext, serverlessHelper, twilioClient) => {
  try {
    
  } catch(e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, 'getAuthToken', e);
  }
}

const getInstanceURL = async(serverlessContext, serverlessHelper, twilioClient) => {
  try {
    
  } catch (e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, 'getInstanceUrl', e);
  }
}

/**
 * This method will return an instance of Salesforce Connection.
 * @param {object} serverlessContext 
 * @param {object} SalesforceConnectionObject
 */
const getSfdcConnection = async(serverlessContext, serverlessHelper, twilioClient) => {
  try {
    const accessToken = await getAuthToken(serverlessContext, serverlessHelper, twilioClient);
    const instanceUrl = await getInstanceURL(serverlessContext, serverlessHelper, twilioClient);
    const sfdcConn = new jsforce.Connection({
      accessToken,
      instanceUrl
    });
    return sfdcConn;

  } catch (e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, 'getSfdcConnection', e);
  }
}

module.exports = {getSfdcConnection};