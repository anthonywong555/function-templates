'use strict'

/**
 * Load Modules
 */
const jsforce = require('jsforce');

const moment = require('moment');

/**
 * This will be the key for serverless environment variable that will hold
 * Salesforce oauth response.
 */
const SFDC_OAUTH_RESPONSE = 'SFDC_OAUTH_RESPONSE';

/**
 * SERVERLESS FILE BOLIER PLATE
 */
const SERVERLESS_FILE_PATH = '/sfdc/helpers/sfdc/connection/index';

const getSFDCOauthResponse = async(serverlessContext, serverlessHelper) => {
  try {
    const {SFDC_IS_OAUTH_USER_AGENT_FLOW} = serverlessContext;
    let sfdcOauthResponse;

    if(SFDC_IS_OAUTH_USER_AGENT_FLOW === 'true') {
      // OAuth 2.0 User-Agent Flow
      sfdcOauthResponse = await serverlessHelper.sfdc.oauth.ouathSFDCByUserAgent(serverlessContext, serverlessHelper);
    } else {
      // OAuth 2.0 JWT Bearer Flow for Server-to-Server
      sfdcOauthResponse = await serverlessHelper.sfdc.oauth.ouathSFDCByServerToServer(serverlessContext, serverlessHelper);
    }
    return sfdcOauthResponse;
  } catch (e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, SERVERLESS_FILE_PATH, 'getSFDCOauthResponse', e);
  }
}

/**
 * Check to see if Salesforce Oauth Information is in serverless variables.
 * @param {Object} serverlessContext 
 * @param {Object} serverlessHelper 
 * @param {Object} twilioClient 
 */
const saveSFDCOauthInSerEnv = async (serverlessContext, serverlessHelper, twilioClient) => {
  try {
    const {TWILIO_SERVERLESS_SERVICE_SID, TWILIO_SERVERLESS_ENVIRONMENT_SID} = serverlessContext;
    const sfdcOauthResponse = await getSFDCOauthResponse(serverlessContext, serverlessHelper);
    const sfdcOauthResponseStringify = JSON.stringify(sfdcOauthResponse);
    await twilioClient.serverless.services(TWILIO_SERVERLESS_SERVICE_SID)
      .environments(TWILIO_SERVERLESS_ENVIRONMENT_SID)
      .variables
      .create({key: SFDC_OAUTH_RESPONSE, value: sfdcOauthResponseStringify});

    return sfdcOauthResponse;
  } catch (e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, SERVERLESS_FILE_PATH, 'saveSFDCOauthInSerEnv', e);
  }
};

/**
 * Check to see if Twilio Serverless has to latest Access Token.
 * If not it will update the Access Token.
 * @param {Object} serverlessContext 
 * @param {Object} serverlessHelper 
 * @param {Object} twilioClient 
 */
const performExpirationCheck = async (serverlessContext, serverlessHelper, twilioClient, sfdcOauthFromEnv) => {
  try {
    const {dateUpdated} = sfdcOauthFromEnv; 
    const oldDateTime = moment(dateUpdated);
    const currDateTime = moment(new Date());

    const duration = moment.duration(currDateTime.diff(oldDateTime));
    const mins = duration.asMinutes();
    const {SFDC_ACCESS_TOKEN_EXPIRES_IN_MINS} = serverlessContext;
    
    let result = JSON.parse(sfdcOauthFromEnv.value);

    if(mins >= SFDC_ACCESS_TOKEN_EXPIRES_IN_MINS) {
      // Refresh a Token
      const {TWILIO_SERVERLESS_SERVICE_SID, TWILIO_SERVERLESS_ENVIRONMENT_SID} = serverlessContext;
      const sfdcOauthResponse = await getSFDCOauthResponse(serverlessContext, serverlessHelper);
      const sfdcOauthResponseStringify = JSON.stringify(sfdcOauthResponse);
      await twilioClient.serverless.services(TWILIO_SERVERLESS_SERVICE_SID)
        .environments(TWILIO_SERVERLESS_ENVIRONMENT_SID)
        .variables(sfdcOauthFromEnv.sid)
        .update({value: sfdcOauthResponseStringify});
      result = sfdcOauthResponse;
    }

    return result;
  } catch (e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, SERVERLESS_FILE_PATH, 'performExpirationCheck', e);
  }
}

/**
 * This method wil check to see Salesforce Access Token is up to date 
 * in Serverless Environment Variable.
 * @param {Object} serverlessContext 
 * @param {Object} serverlessHelper 
 */
const getSFDCOauthResponseFromCache = async (serverlessContext, serverlessHelper, twilioClient) => {
  try {
    const {TWILIO_SERVERLESS_SERVICE_SID, TWILIO_SERVERLESS_ENVIRONMENT_SID} = serverlessContext;
    const sfdcOauthFromEnv = await serverlessHelper
      .twilio
      .serverless
      .variable
      .fetchByKey(twilioClient, TWILIO_SERVERLESS_SERVICE_SID, TWILIO_SERVERLESS_ENVIRONMENT_SID, SFDC_OAUTH_RESPONSE);
    
    let sfdcOauthResponse = null;

    if(sfdcOauthFromEnv) {
      // Check to see if those information is update to date
      sfdcOauthResponse = await performExpirationCheck(serverlessContext, serverlessHelper, twilioClient, sfdcOauthFromEnv);
    } else {
      // Check to see if Salesforce Access Token, Instance URL and etc is in Serverless Env
      sfdcOauthResponse = await saveSFDCOauthInSerEnv(serverlessContext, serverlessHelper, twilioClient);
    }

    return sfdcOauthResponse;
  } catch (e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, SERVERLESS_FILE_PATH, 'getSFDCOauthResponseFromCache', e);
  }
}

/**
 * This method will return an instance of Salesforce Connection.
 * @param {Object} serverlessContext 
 * @param {Object} SalesforceConnectionObject
 */
const getSfdcConnection = async (serverlessContext, serverlessHelper, twilioClient) => {
  try {
    const sfdcOauthResponse = await getSFDCOauthResponseFromCache(serverlessContext, serverlessHelper, twilioClient);
    const {accessToken, instanceUrl} = sfdcOauthResponse;  
    const sfdcConn = new jsforce.Connection({
      accessToken,
      instanceUrl
    });
    return sfdcConn;
  } catch (e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, SERVERLESS_FILE_PATH, 'getSfdcConnection', e);
  }
}

module.exports = {getSfdcConnection};