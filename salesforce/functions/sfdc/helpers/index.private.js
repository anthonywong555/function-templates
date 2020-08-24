'use strict';

const functions = Runtime.getFunctions();

const sfdcPath = functions['sfdc/helpers/sfdc/index'].path;
const sfdc = require(sfdcPath);

const devtoolsPath = functions['sfdc/helpers/devtools/index'].path;
const devtools = require(devtoolsPath);

const twilioServerlessEnvPath = functions['sfdc/helpers/twilio/serverless/variable'].path;
const twilioServerlessEnv = require(twilioServerlessEnvPath);

module.exports = {sfdc, devtools, twilioServerlessEnv};