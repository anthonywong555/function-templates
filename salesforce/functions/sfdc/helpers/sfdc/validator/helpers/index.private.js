'use strict';

const functions = Runtime.getFunctions();

/*
 * Load Schema Helper Methods
 */
const schemaPath = functions['sfdc/helpers/sfdc/validator/helpers/schema/index'].path;
const schema = require(schemaPath);

module.exports = {schema};