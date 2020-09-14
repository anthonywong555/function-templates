'use strict';

/**
 * SERVERLESS FILE BOLIER PLATE
 */
const SERVERLESS_FILE_PATH = '/sfdc/helpers/sfdc/validator/index';

/**
 * Load Modules
 */
const Ajv = require('ajv');

const functions = Runtime.getFunctions();

/*
 * Load Schema Helper Methods
 */
const schemaPath = functions['sfdc/helpers/sfdc/validator/schema'].path;
const schema = require(schemaPath);


/**
 * 
 * @param {String} actionType 
 */
const loadValidator = (actionType) => {
  const ajv = new Ajv({allErrors: true, jsonPointers: true});
  require('ajv-errors')(ajv);
  const targetSchema = schema.actionTypeToSchema[actionType];
  const validator = ajv.compile(targetSchema);
  return validator;
}

/**
 * Checks to see if target payload is valid for JS Force.
 * @param {Object} serverlessContext 
 * @param {Object} serverlessHelper 
 * @param {Object} targetPayload 
 * @param {String} actionType See salesforce/helpers/sfdc/constants
 * @returns {Object} 
 */
const isValidPayload = (serverlessContext, serverlessHelper, targetPayload, actionType) => {
  try {
    const validator = loadValidator(actionType);
    const isValid = validator(targetPayload);
    const errors = validator.errors;
    const errorMsg = errors ? 
    errors.reduce((acum, anError) => {
      return acum + anError.message + '\n'
    }, '') : 
    '';

    const result = {
      isValid,
      errorMsg
    };
    return result;
  } catch {
    throw serverlessHelper.devtools.formatErrorMsg(serverlessContext, SERVERLESS_FILE_PATH, 'isValidPayload', e);
  }
}

module.exports = {isValidPayload};