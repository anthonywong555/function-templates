'use strict';

const create = async(twilioClient, {serviceSid, environmentSid, payload}) => {
  try {
    const result = await twilioClient.serverless
      .services(serviceSid)
      .environments(environmentSid)
      .variables
      .create(payload);
    return result;
  } catch(e) {
    throw e;
  }
}

const fetch = async(twilioClient, {serviceSid, environmentSid, variableSid}) => {
  try {
    const result = await twilioClient.serverless
      .services(serviceSid)
      .environments(environmentSid)
      .variables(variableSid)
      .fetch();
    return result;
  } catch(e) {
    throw e;
  }
}

const read = async(twilioClient, {serviceSid, environmentSid}) => {
  try {
    const result = await twilioClient.serverless
      .services(serviceSid)
      .environments(environmentSid)
      .variables
      .list();
    return result;
  } catch(e) {
    throw e;
  }
}

const fetchByKey = async (twilioClient, {serviceSid, environmentSid, key}) => {
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

module.exports = {create, fetch, read, fetchByKey};