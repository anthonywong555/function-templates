'use strict';

const jsforce = require('jsforce');

/**
 * This method is responsible for ouath to Salesforce.
 * @param {object} serverlessContext 
 * @param {object} SalesforceConnectionObject
 */
const ouathSFDC = async(serverlessContext) => {
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
      Method: authSalesforce\n
      Error: ${e}\n
    \n`;
  }
}

/**
 * Return the 
 * @param {*} serverlessContext 
 */
const getAuthToken = async(serverlessContext, twilioClient, serverlessHelper) => {
  try {
    
  } catch(e) {
    throw `\n
      Method: authSalesforce\n
      Error: ${e}\n
    \n`;
  }
}

/**
 * This method will return an instance of Salesforce Connection.
 * @param {object} serverlessContext 
 * @param {object} SalesforceConnectionObject
 */
const getSfdcConnection = async(serverlessContext, serverlessHelper, twilioClient) => {
  try {

  } catch (e) {
    throw `\n
    Method: getSfdcConnection\n
    Error: ${e}\n
    \n`
  }
}

module.exports = {};