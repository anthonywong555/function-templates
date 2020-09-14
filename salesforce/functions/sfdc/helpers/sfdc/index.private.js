'use strict';

const functions = Runtime.getFunctions();

/*
 * Load Cache Helper Methods
 */
const cachePath = functions['sfdc/helpers/sfdc/cache/index'].path;
const cache = require(cachePath);

/**
 * Load Constants Helper Methods
 */
const constantsPath = functions['sfdc/helpers/sfdc/constants/index'].path;
const constants = require(constantsPath);

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

/**
 * Load Validator Helper Methods
 */
const validatorPath = functions['sfdc/helpers/sfdc/validator/index'].path;
const validator = require(validatorPath);

module.exports = {
  cache,
  constants,
  oauth,
  action, 
  reducer,
  validator
};