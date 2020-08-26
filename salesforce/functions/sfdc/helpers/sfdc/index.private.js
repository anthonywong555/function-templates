'use strict';

const jsforce = require('jsforce');

/**
 * This will be the key for serverless environment variable that will hold
 * Salesforce oauth response.
 */
const SFDC_OAUTH_RESPONSE = 'SFDC_OAUTH_RESPONSE';

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
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, 'ouathSFDCByUserAgent', e);
  }
}

/**
 * This method wil check to see Salesforce Access Token is up to date 
 * in Serverless Environment Variable.
 * @param {Object} serverlessContext 
 * @param {Object} serverlessHelper 
 */
const performOuathCheck = async (serverlessContext, serverlessHelper) => {

}

/**
 * This method will return an instance of Salesforce Connection.
 * @param {Object} serverlessContext 
 * @param {Object} SalesforceConnectionObject
 */
const getSfdcConnection = async(serverlessContext, serverlessHelper, twilioClient) => {
  try {
    /**
     * Make sure Serverless Environment Variable has the lastest
     * Salesforce Access Token and Instance Url.
     */
    await performOuathCheck(serverlessContext, serverlessHelper);
    /**
     * Grab the latest access token and instance url from Serverless Environments.
     */
    const {TWILIO_SERVERLESS_SERVICE_SID, TWILIO_SERVERLESS_ENVIRONMENT_SID} = serverlessContext;
    const sfdcOauthResponse = await serverlessHelper
      .twilio
      .serverless
      .variable
      .fetchByKey(twilioClient, TWILIO_SERVERLESS_SERVICE_SID, TWILIO_SERVERLESS_ENVIRONMENT_SID, SFDC_OAUTH_RESPONSE);
    
    const {accessToken, instanceUrl} = sfdcOauthResponse;

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