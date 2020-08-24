'use strict';

const create = async() => {
  try {
    await twilioClient.serverless.services('ZSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    .environments('ZEXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    .variables
    .create({key: 'key', value: 'value'});
  } catch(e) {
    throw e;
  }
}

const fetch = async() => {
  try {

  } catch(e) {
    throw e;
  }
}

module.exports = {create, fetch};