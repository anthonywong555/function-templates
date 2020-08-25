'use strict';

const functions = Runtime.getFunctions();

/*
 * Load Salesforce Helper Methods
 */
const sfdcPath = functions['sfdc/helpers/sfdc/index'].path;
const sfdc = require(sfdcPath);

/*
 * Load Serverless Dev Tools Helper Methods
 */
const devtoolsPath = functions['sfdc/helpers/devtools/index'].path;
const devtools = require(devtoolsPath);

/*
 * Load Custom Twilio Helper Methods
 */
const twilioServerlessEnvPath = functions['sfdc/helpers/twilio/serverless/variable/index'].path;
const twilioServerlessEnv = require(twilioServerlessEnvPath);

module.exports = {sfdc, devtools, twilioServerlessEnv};