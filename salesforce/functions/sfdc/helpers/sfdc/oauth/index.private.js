'use strict';

/**
 * Load Modules
 */

const jsforce = require('jsforce');

const {getJWTToken} = require('salesforce-jwt-promise');

const fs = require('fs');

/**
 * SERVERLESS FILE BOLIER PLATE
 */
const SERVERLESS_FILE_PATH = '/sfdc/helpers/sfdc/oauth/index';

/**
 * Oauth 2.0 User - Password
 * @param {Object} serverlessContext 
 * @param {Object} serverlessHelper
 * @returns {Object} 
 */
const ouathSFDCByUserPassword = async(serverlessContext, serverlessHelper) => {
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
    const result = {
      'accessToken': conn.accessToken,
      'instanceUrl': conn.instanceUrl
    };
    return result;
  } catch(e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, SERVERLESS_FILE_PATH, 'ouathSFDCByUserPassword', e);
  }
}

/**
 * Load SFDC Private Key from Twilio Assets.
 * @param {Object} serverlessContext 
 * @param {Object} serverlessHelper 
 * @returns {Object}
 */
const getSFDCPrivateKey = (serverlessContext, serverlessHelper) => {
  try {
    const {SFDC_PRIVATE_KEY_PATH} = serverlessContext;
    const SFDCPrivateKeySystemPath = Runtime.getAssets()[SFDC_PRIVATE_KEY_PATH].path;
    const SFDCPrivateKey = fs.readFileSync(SFDCPrivateKeySystemPath, 'utf-8');
    return SFDCPrivateKey;
  } catch (e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, SERVERLESS_FILE_PATH, 'getSFDCPrivateKey', e);
  }
}

/**
 * Generate a JWT Token
 * @param {Object} serverlessContext
 * @param {Object} serverlessHelper 
 * @param {String} privateKey 
 * @returns {Object}
 */
const generateJWTToken = async(serverlessContext, serverlessHelper, privateKey) => {
  try {
    const {SFDC_CONNECTED_APP_CONSUMER_KEY, SFDC_USERNAME, SFDC_LOGIN_URL} = serverlessContext;
    const jwtResponse = await getJWTToken({
      clientId: SFDC_CONNECTED_APP_CONSUMER_KEY,
      privateKey: privateKey,
      userName: SFDC_USERNAME,
      audience: SFDC_LOGIN_URL
    });
    return jwtResponse;
  } catch(e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, SERVERLESS_FILE_PATH, 'generateJWTToken', e);
  }
}

/**
 * Oauth 2.0 Server to Server
 * @param {Object} serverlessContext 
 * @param {Object} serverlessHelper
 * @returns {Object} 
 */
const ouathSFDCByServerToServer = async(serverlessContext, serverlessHelper) => {
  try {
    const privateKey = getSFDCPrivateKey(serverlessContext, serverlessHelper);
    const jwtResponse = await generateJWTToken(serverlessContext, serverlessHelper, privateKey);
    const result = {
      accessToken: jwtResponse.access_token,
      instanceUrl: jwtResponse.instance_url
    };
    return result;
  } catch(e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, SERVERLESS_FILE_PATH, 'ouathSFDCByServerToServer', e);
  }
}

const OAuthToSFDC = async(serverlessContext, serverlessHelper) => {
  try {
    const {SFDC_IS_OAUTH_USER_PASSWORD_FLOW} = serverlessContext;
    let sfdcOauthResponse;

    if(SFDC_IS_OAUTH_USER_PASSWORD_FLOW === 'true') {
      // OAuth 2.0 User-Password Flow
      sfdcOauthResponse = await ouathSFDCByUserPassword(serverlessContext, serverlessHelper);
    } else {
      // OAuth 2.0 JWT Bearer Flow for Server-to-Server
      sfdcOauthResponse = await ouathSFDCByServerToServer(serverlessContext, serverlessHelper);
    }
    return sfdcOauthResponse;
  } catch (e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, SERVERLESS_FILE_PATH, 'getSFDCOauthResponse', e);
  }
}

const getSFDCConnection = async(serverlessContext, serverlessHelper, twilioClient, forceRefresh = false) => {
  try {
    let sfdcOauthResponse;

    if(forceRefresh) {
      sfdcOauthResponse = await updateSFDCOAuthCache(serverlessContext, serverlessHelper, twilioClient);
    } else {
      sfdcOauthResponse = await getSFDCOAuthFromCache(serverlessContext, serverlessHelper, twilioClient);
    }
    
    const {accessToken, instanceUrl} = sfdcOauthResponse;
    const sfdcConnection = new jsforce.Connection();
    sfdcConnection.initialize({
      instanceUrl,
      accessToken
    });
    return sfdcConnection;
  } catch (e) {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, SERVERLESS_FILE_PATH, 'getSFDCConnection', e);
  }
}


module.exports = {getSFDCConnection};