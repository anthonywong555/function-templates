'use strict';

const formatErrorMsg = (serverlessContext, functionName, errorMsg) => {
  const cleanErrorMsg = 
    (typeof errorMsg === 'object') ? 
    JSON.stringify(errorMsg, null, '\t') : 
    errorMsg;
  return `
    \n
    Twilio Function Path: ${serverlessContext.PATH} \n 
    Function Name: ${functionName} \n 
    Error Message: ${cleanErrorMsg} \n
    \n
  `;
}

module.exports = {formatErrorMsg};