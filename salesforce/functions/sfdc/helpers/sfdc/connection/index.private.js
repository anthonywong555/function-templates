'use strict'

/**
 * This will be the key for serverless environment variable that will hold
 * Salesforce oauth response.
 */
const SFDC_OAUTH_RESPONSE = 'SFDC_OAUTH_RESPONSE';

/**
 * Check to see if Salesforce Oauth Information is in serverless variables.
 * @param {Object} serverlessContext 
 * @param {Object} serverlessHelper 
 * @param {Object} twilioClient 
 */
const performServerlessCheck = async (serverlessContext, serverlessHelper, twilioClient) => {
  try {
    const {TWILIO_SERVERLESS_SERVICE_SID, TWILIO_SERVERLESS_ENVIRONMENT_SID} = serverlessContext;
    const sfdcOauthFromEnv = await serverlessHelper
      .twilio
      .serverless
      .variable
      .fetchByKey(twilioClient, TWILIO_SERVERLESS_SERVICE_SID, TWILIO_SERVERLESS_ENVIRONMENT_SID, SFDC_OAUTH_RESPONSE);
    
    // Check to see if access token and instance url are in Serverless Env.
    if(!sfdcOauthFromEnv) {
      // Oauth
      const {SFDC_IS_OAUTH_USER_AGENT_FLOW} = serverlessContext;
      let sfdcOauthResponse;

      if(SFDC_IS_OAUTH_USER_AGENT_FLOW) {
        // OAuth 2.0 User-Agent Flow
        sfdcOauthResponse = await serverlessHelper.sfdc.oauth.ouathSFDCByUserAgent(serverlessContext);
      } else {
        // OAuth 2.0 JWT Bearer Flow for Server-to-Server
        sfdcOauthResponse = await serverlessHelper.sfdc.oauth.ouathSFDCByServerToServer(serverlessContext);
      }

      const sfdcOauthResponseStringify = JSON.stringify(sfdcOauthResponse);
      await twilioClient.serverless.services(TWILIO_SERVERLESS_SERVICE_SID)
      .environments(TWILIO_SERVERLESS_ENVIRONMENT_SID)
      .variables
      .create({key: SFDC_OAUTH_RESPONSE, value: sfdcOauthResponseStringify})
    }
  } catch (e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, '/sfdc/helpers/sfdc/connection/index/performOuathCheck', e);
  }
};

/**
 * This method wil check to see Salesforce Access Token is up to date 
 * in Serverless Environment Variable.
 * @param {Object} serverlessContext 
 * @param {Object} serverlessHelper 
 */
const performOuathCheck = async (serverlessContext, serverlessHelper, twilioClient) => {
  try {
    // Check to see if Salesforce Access Token, Instance URL and etc is in Serverless Env
    await performServerlessCheck();

    // Check to see if those information is update to date

  } catch (e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, '/sfdc/helpers/sfdc/connection/index/performOuathCheck', e);
  }
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
    await performOuathCheck(serverlessContext, serverlessHelper, twilioClient);
    
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
    const jsforce = require('jsforce');
    
    const sfdcConn = new jsforce.Connection({
      accessToken,
      instanceUrl
    });
    return sfdcConn;
  } catch (e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, '/sfdc/helpers/sfdc/connection/index/getSfdcConnection', e);
  }
}

module.exports = {getSfdcConnection};