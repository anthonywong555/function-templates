'use strict';

/**
 * Fetch a serverless variable by key. If not found return a null.
 * @param {Twilio Client} twilioClient 
 * @param {String} serviceSid 
 * @param {String} environmentSid 
 * @param {String} key
 * @return {Object} Instance of variable in Serverless
 */
const fetchByKey = async (twilioClient, serviceSid, environmentSid, key) => {
  try {
    const variables = await twilioClient.serverless
      .services(serviceSid)
      .environments(environmentSid)
      .variables
      .list();

    let result = null;

    for(const aVariable of variables) {
      if(aVariable.key === key) {
        result = aVariable;
        break;
      }
    }

    return result;
  } catch (e) {
    throw e;
  }
}

/**
 * Upsert a variable.
 * @param {Object} twilioClient 
 * @param {String} serviceSid 
 * @param {String} environmentSid 
 * @param {String} variableSid 
 * @param {String} key 
 * @param {String} value 
 * @returns {Object} 
 */
const upsert = async (twilioClient, serviceSid, environmentSid, variableSid, key, value) => {
  try {
    let result = null;
    if(variableSid) {
      result = await twilioClient.serverless.services(serviceSid)
        .environments(environmentSid)
        .variables(variableSid)
        .update({key, value});
    } else {
      result = await twilioClient.serverless.services(serviceSid)
        .environments(environmentSid)
        .variables
        .create({key, value});
    }
    return result;
  } catch (e) {
    throw e;
  }
}

module.exports = {fetchByKey, upsert};