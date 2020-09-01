'use strict';

const functions = Runtime.getFunctions();

/*
 * Load Cache Helper Methods
 */
const cachePath = functions['sfdc/helpers/sfdc/cache/index'].path;
const cache = require(cachePath);

/*
 * Load Ouath Helper Methods
 */
const oauthPath = functions['sfdc/helpers/sfdc/oauth/index'].path;
const oauth = require(oauthPath);

module.exports = {cache, oauth};