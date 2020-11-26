'use strict';

/**
 * Load Modules
 */
const axios = require('axios');
const qs = require('querystring');
const crypto = require('crypto');

const formatErrorMsg = (serverlessContext, filePath, functionName, error) => {
  const isStackTrace = (serverlessContext.DEV_TOOLS_STACK_TRACE === 'true') ?
    true : false;
  
  let result = error;

  if(isStackTrace) {
    result = `\n
    File Path: ${filePath} \n 
    Function Name: ${functionName} \n 
    Error Message: ${error} \n
    \n`;
  }
  return result;
}

const delay = async (timeoutInMill) => {
  return new Promise(resolve => setTimeout(resolve, timeoutInMill));
}

const CORSResponse = () => {
  const response = new Twilio.Response(); //eslint-disable-line no-undef

  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.appendHeader('Content-Type', 'application/json');
  return response;
};

const generateXTwilioSignature = (authToken, url, payload) => {
  const data = Object.keys(payload)
    .sort()
    .reduce((acc, key) => acc + key + payload[key], url);

  // sign the string with sha1 using your AuthToken
  // base64 encode it
  const signature =  crypto.createHmac('sha1', authToken)
    .update(Buffer.from(data, 'utf-8'))
    .digest('base64');
  return signature;
}

/**
 * This function use axios to make a POST Request
 * to a Twilio Function that's protected.
 * @param {*} authToken 
 * @param {*} url 
 * @param {*} payload 
 * @returns {Object} axios.data
 */
const twilioFunctionAPICallout = async(authToken, url, payload) => {
  const twilioSig = generateXTwilioSignature(authToken, url, payload);
  const axiosResponse = await axios({
    method: 'POST',
    headers: {
      'X-Twilio-Signature': twilioSig 
    },
    url,
    data: qs.stringify(payload)
  });
  return axiosResponse.data;
}

module.exports = {
  formatErrorMsg, 
  delay, 
  CORSResponse, 
  generateXTwilioSignature, 
  twilioFunctionAPICallout
};