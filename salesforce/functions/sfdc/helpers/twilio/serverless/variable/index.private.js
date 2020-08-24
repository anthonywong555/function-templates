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

module.exports = {fetchByKey};