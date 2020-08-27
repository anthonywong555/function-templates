'use strict';

const functions = Runtime.getFunctions();

/*
 * Load Variables Helper Methods
 */
const variablePath = functions['sfdc/helpers/twilio/serverless/variable/index'].path;
const variable = require(variablePath);

module.exports = {variable};