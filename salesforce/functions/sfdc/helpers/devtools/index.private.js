'use strict';

const formatErrorMsg = (serverlessContext, functionName, errorMsg) => {
  return `
    \n
    Twilio Function Path: ${serverlessContext.PATH} \n 
    Function Name: ${functionName} \n 
    Error Message: ${errorMsg} \n
    \n
  `;
}

module.exports = {formatErrorMsg};