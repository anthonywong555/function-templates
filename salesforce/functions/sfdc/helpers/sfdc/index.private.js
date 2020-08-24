'use strict';

const jsforce = require('jsforce');

/**
 * This method only ouath to Salesforce.
 * @param {object} serverlessContext 
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

const getAuthToken = async(serverlessContext) => {
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
 * This method will return an instance of jsforce connection.
 * @param {*} serverlessContext 
 */
const getSfdcConnection = async(serverlessContext) => {
  try {

  } catch (e) {
    throw `\n
    Method: getSfdcConnection\n
    Error: ${e}\n
    \n`
  }
}

module.exports = {};