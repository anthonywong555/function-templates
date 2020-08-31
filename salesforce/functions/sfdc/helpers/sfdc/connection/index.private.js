'use strict'

/**
 * Load Modules
 */
const jsforce = require('jsforce');

/**
 * This will be the key for serverless environment variable that will hold
 * Salesforce oauth response.
 */
const SFDC_OAUTH_RESPONSE = 'SFDC_OAUTH_RESPONSE';

/**
 * SERVERLESS FILE BOLIER PLATE
 */
const SERVERLESS_FILE_PATH = '/sfdc/helpers/sfdc/connection/index';

const upsertSFDCOauthResponseInCache = async(serverlessContext, serverlessHelper, twilioClient) => {
  try {
    const {TWILIO_SERVERLESS_SERVICE_SID, TWILIO_SERVERLESS_ENVIRONMENT_SID} = serverlessContext;
    const sfdcOauthFromEnv = await serverlessHelper
      .twilio
      .serverless
      .variable
      .fetchByKey(twilioClient, TWILIO_SERVERLESS_SERVICE_SID, TWILIO_SERVERLESS_ENVIRONMENT_SID, SFDC_OAUTH_RESPONSE);
    
    let envSid = sfdcOauthFromEnv ? sfdcOauthFromEnv.sid : null;

    const sfdcOauthResponse = await serverlessHelper.sfdc.oauth.OAuthToSFDC(serverlessContext, serverlessHelper);
    const sfdcOauthResponseStringify = JSON.stringify(sfdcOauthResponse);
    await serverlessHelper
      .twilio
      .serverless
      .variable
      .upsert(twilioClient, TWILIO_SERVERLESS_SERVICE_SID, TWILIO_SERVERLESS_ENVIRONMENT_SID, envSid, SFDC_OAUTH_RESPONSE, sfdcOauthResponseStringify);
    return sfdcOauthResponse;
  } catch (e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, SERVERLESS_FILE_PATH, 'upsertSFDCOauthResponseInCache', e);
  }
}

const canJSONParse = (jsonString) => {
  let result = true;
  try {
    JSON.parse(jsonString);
  } catch (e) {
    result = false;
  }
  return result;
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

    if(sfdcOauthFromEnv && sfdcOauthFromEnv.value && canJSONParse(sfdcOauthFromEnv.value)) {
      sfdcOauthResponse = JSON.parse(sfdcOauthFromEnv.value);
    } else {
      sfdcOauthResponse = await upsertSFDCOauthResponseInCache(serverlessContext, serverlessHelper, twilioClient);
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
    let sfdcOauthResponse = await getSFDCOauthResponseFromCache(serverlessContext, serverlessHelper, twilioClient);

    if(!isValidSfdcOauthResponse(sfdcOauthResponse)) {
      sfdcOauthResponse = upsertSFDCOauthResponseInCache(serverlessContext, serverlessHelper, twilioClient);
    }

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

const isValidSfdcOauthResponse = async (sfdcOauthResponse) => {
  let result = true;
  try {
    const {accessToken, instanceUrl} = sfdcOauthResponse;
    const sfdcConn = new jsforce.Connection({
      accessToken,
      instanceUrl
    });
    const identity = await sfdcConn.identity();
  } catch (e) {
    result = false;
  }
  return result;
}

module.exports = {getSfdcConnection};