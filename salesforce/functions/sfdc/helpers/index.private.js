'use strict';

const functions = Runtime.getFunctions();
const sfdcPath = functions['sfdc/helpers/sfdc/index'].path;
const devtoolsPath = functions['sfdc/helpers/devtools/index'].path;
const sfdc = require(sfdcPath);
const devtools = require(devtoolsPath);

module.exports = {sfdc, devtools};