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

/*
 * Load Action Helper Methods
 */
const actionPath = functions['sfdc/helpers/sfdc/action/index'].path;
const action = require(actionPath);

/*
 * Load Reducer Helper Methods
 */
const reducerPath = functions['sfdc/helpers/sfdc/reducer/index'].path;
const reducer = require(reducerPath);

module.exports = {cache, oauth, action, reducer};