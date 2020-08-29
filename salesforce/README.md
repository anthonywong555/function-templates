# salesforce

This template allows you to make API callouts to Salesforce.

## Pre-requisites

1. Spin up a Salesforce [Trailhead Playground](https://trailhead.salesforce.com/content/learn/modules/trailhead_playground_management/create-a-trailhead-playground) or [Scratch Org](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_scratch_orgs.htm).

2. Determine which [OAuth Authorization Flows](https://help.salesforce.com/articleView?id=remoteaccess_oauth_flows.htm&type=5) you want to use. Either [User-Agent](https://help.salesforce.com/articleView?id=remoteaccess_oauth_user_agent_flow.htm&type=5) or [Server-to-Server](https://help.salesforce.com/articleView?id=remoteaccess_oauth_jwt_flow.htm&type=5). I recommend User-Agent to test and for production Server-to-Server.

## User-Agent

1. Setup > Quick Find > App Manager.

2. Click New Connected App.

3. Fill in the following information.

| KEY                   	| VALUE                                                                                                                   	|
|-----------------------	|-------------------------------------------------------------------------------------------------------------------------	|
| Connected App Name    	| Twilio Function                                                                                                         	|
| API Name              	| Twilio_Function                                                                                                         	|
| Contact Email         	| YOUR_EMAIL                                                                                                              	|
| Enable OAuth Settings 	| true                                                                                                                    	|
| Callback URL          	| https://www.twilio.com/                                                                                                 	|
| Selected OAuth Scopes 	| - Access and manage your data (api) <br > - Perform requests on your behalf at any time (refresh_token, offline_access) 	|

## Server-to-Server

1. Setup > Quick Find > App Manager.

2. Click New Connect App.

3. Fill in the following information.



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
