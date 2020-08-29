# salesforce

This template allows you to make API callouts to Salesforce.

## Pre-requisites

1. Spin up a Salesforce [Trailhead Playground](https://trailhead.salesforce.com/content/learn/modules/trailhead_playground_management/create-a-trailhead-playground) or [Scratch Org](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_scratch_orgs.htm).

2. Determine which [OAuth Authorization Flows](https://help.salesforce.com/articleView?id=remoteaccess_oauth_flows.htm&type=5) you want to use. Either [User-Agent](https://help.salesforce.com/articleView?id=remoteaccess_oauth_user_agent_flow.htm&type=5) or [Server-to-Server](https://help.salesforce.com/articleView?id=remoteaccess_oauth_jwt_flow.htm&type=5). I recommend using User-Agent for POC and using Server-to-Server for production use.

## User-Agent

0. [Create a secure Salesforce API user.](https://help.salesforce.com/articleView?id=000331470&type=1&mode=1)

1. [Obtain a Security Token.](https://help.salesforce.com/articleView?id=user_security_token.htm&type=5)

2. Take note of the Salesforce API user's Username, Password and Security Token. We will need to use this later.

3. In Salesforce Lighting: Setup > Quick Find > App Manager.

4. Click New Connected App.

5. Fill in the following information.

| KEY                   	| VALUE                                                                                                                   	|
|-----------------------	|-------------------------------------------------------------------------------------------------------------------------	|
| Connected App Name    	| Twilio Function                                                                                                         	|
| API Name              	| Twilio_Function                                                                                                         	|
| Contact Email         	| YOUR_EMAIL                                                                                                              	|
| Enable OAuth Settings 	| true                                                                                                                    	|
| Callback URL          	| https://www.twilio.com/                                                                                                 	|
| Selected OAuth Scopes 	| - Access and manage your data (api) <br > - Perform requests on your behalf at any time (refresh_token, offline_access) 	|

6. Click Save.

7. Take a note of `Consumer Key` and `Consumer Secret`. We will need this later.

## Server-to-Server

0. [Create a Self-Signed SSL Certificate and Private Key](https://trailhead.salesforce.com/content/learn/modules/sfdx_travis_ci/sfdx_travis_ci_connected_app).

1. In Salesforce Lighting: Setup > Quick Find > App Manager.

2. Click New Connect App.

3. Fill in the following information.

| KEY                    	| VALUE                                                                                                                   	|
|------------------------	|-------------------------------------------------------------------------------------------------------------------------	|
| Connected App Name     	| Twilio Function                                                                                                         	|
| API Name               	| Twilio_Function                                                                                                         	|
| Contact Email          	| YOUR_EMAIL                                                                                                              	|
| Enable OAuth Settings  	| true                                                                                                                    	|
| Callback URL           	| https://www.twilio.com/                                                                                                 	|
| Use digital signatures 	| true                                                                                                                    	|
| Selected OAuth Scopes  	| - Access and manage your data (api) <br > - Perform requests on your behalf at any time (refresh_token, offline_access) 	|

4. Upload the `server.crt` file.

5. Click Save.

6. Take a note of `Consumer Key` and `Consumer Secret`. We will need this later.

7. Click Manage.

8. Edit Policis.

9. In the OAuth policies section, for Permitted Users select Admin approved users are pre-authorized, then click OK.

10. Click Save.

11. Create a Permission Set and assign pre-authorized users for this connected app.

### Environment variables

This project requires some environment variables to be set. To keep your tokens and secrets secure, make sure to not commit the `.env` file in git. When setting up the project with `twilio serverless:init ...` the Twilio CLI will create a `.gitignore` file that excludes `.env` from the version history.

In your `.env` file, set the following values:

| Variable | Description | Required |
| :------- | :---------- | :------- |


### Function Parameters

`/blank` expects the following parameters:

| Parameter | Description | Required |
| :-------- | :---------- | :------- |


`/hello-messaging` is protected and requires a valid Twilio signature as well as the following parameters:

| Parameter | Description | Required |
| :-------- | :---------- | :------- |


## Create a new project with the template

1. Install the [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart#install-twilio-cli)
2. Install the [serverless toolkit](https://www.twilio.com/docs/labs/serverless-toolkit/getting-started)

```shell
twilio plugins:install @twilio-labs/plugin-serverless
```

3. Initiate a new project

```
twilio serverless:init example --template=salesforce && cd example
```

4. Start the server with the [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart):

```
twilio serverless:start
```

5. Open the web page at https://localhost:3000/index.html and enter your phone number to test

ℹ️ Check the developer console and terminal for any errors, make sure you've set your environment variables.

## Deploying

Deploy your functions and assets with either of the following commands. Note: you must run these commands from inside your project folder. [More details in the docs.](https://www.twilio.com/docs/labs/serverless-toolkit)

With the [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart):

```
twilio serverless:deploy
```

## Helpful Tips

Here are some helpful tips when using the this template.

1. Monitor your session.

Everytime Twilio Functions makes an API callout to Salesforce it will resue the same access token. To verify this, in Salesforce go to the Session Management. (Setup > Quick Find > Session Management)

If you found yourself with a lot of session getting created then you want to disabled [Lock sessions to the IP address from which they originated](https://help.salesforce.com/articleView?id=admin_sessions.htm&type=5).

## References

Here are some helpful references that talks about Salesforce OAuth 2.0

Node Modules:
- [jsforce](https://jsforce.github.io/)
- [salesforce-jwt-promise](https://github.com/ChuckJonas/salesforce-jwt-promise)
- [salesforce-jwt-bearer-token-flow](https://www.npmjs.com/package/salesforce-jwt-bearer-token-flow)
- [jsforce with jwt](https://gist.github.com/jeffdonthemic/de5432f3e308882484f2acea68ebfabd)

Guides:
- [Create Your Connected App](https://trailhead.salesforce.com/content/learn/modules/sfdx_travis_ci/sfdx_travis_ci_connected_app)
- [Create a OAuth JWT Bearer Token flow connected app (4.x)](https://www.drupal.org/docs/8/modules/salesforce-suite/create-a-oauth-jwt-bearer-token-flow-connected-app-4x)
- [Salesforce OAuth 2.0 JWT Bearer Token Flow Walk-Through](https://gist.github.com/booleangate/30d345ecf0617db0ea19c54c7a44d06f)
- [How to connect to Salesforce using OAuth JWT Flow](https://help.talend.com/reader/4cgA8~D~pdi5biHRfSvg_Q/ZoXS~zBdrcuQAx427Yv6Gw)
- [Salesforce OAuth 2.0 JWT Bearer flow](https://mannharleen.github.io/2020-03-03-salesforce-jwt/)
- [Authorize an Org Using the JWT-Based Flow](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_jwt_flow.htm#sfdx_dev_auth_jwt_flow)