'use strict';

const functions = Runtime.getFunctions();

/*
 * Load Connection Helper Methods
 */
const connectionPath = functions['sfdc/helpers/sfdc/connection/index'].path;
const connection = require(connectionPath);

/*
 * Load Ouath Helper Methods
 */
const oauthPath = functions['sfdc/helpers/oauth/index'].path;
const oauth = require(oauthPath);

module.exports = {connection, oauth};