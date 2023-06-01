import type {AWS} from '@serverless/typescript';

import hello from '@functions/hello';
import {login} from '@functions/v1/auth';

import { users } from '@functions/v1/users';

const serverlessConfiguration: AWS = {
	service: 'status-4-saves-server',
	frameworkVersion: '3',

	/*
	 * Plugins
	 */
	plugins: [
		'serverless-esbuild',
		'serverless-iam-roles-per-function',],
	provider: {
		name: 'aws',
		runtime: 'nodejs14.x',
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
			NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',

			//* Dynamodb Tables
			TABLE_USERS: '${self:service}-users-01-${self:provider.stage}',
			TABLE_CONTACTS: '${self:service}-contacts-01-${self:provider.stage}',
		},

		/*
		 * AWS configuration.
		 */
		profile: 'default',
		stage: 'dev',
		region: 'us-east-1',
	},

	/*
	 * Functions.
	 */
	functions: {
		hello,

		//* Auth
		login,

		//* Users
		users
	},

	/*
	 * Resources.
	 */
	resources: {
		Resources: {
			UsersTable: {
				Type: 'AWS::DynamoDB::Table',
				Properties: {
					TableName: '${self:provider.environment.TABLE_USERS}',
					AttributeDefinitions: [
						{
							AttributeName: 'phone',
							AttributeType: 'N',
						}
					],
					KeySchema: [
						{
							AttributeName: 'phone',
							KeyType: 'HASH',
						}
					],
					BillingMode: 'PAY_PER_REQUEST'
				},
			},
			ContactsTable: {
				Type: 'AWS::DynamoDB::Table',
				Properties: {
					TableName: '${self:provider.environment.TABLE_CONTACTS}',
					AttributeDefinitions: [
						{
							AttributeName: 'user',
							AttributeType: 'S',
						},
						{
							AttributeName: 'phone',
							AttributeType: 'S',
						},
					],
					KeySchema: [
						{
							AttributeName: 'user',
							KeyType: 'HASH',
						},
						{
							AttributeName: 'phone',
							KeyType: 'RANGE', // Use 'RANGE' for sort key
						},
					],
					BillingMode: 'PAY_PER_REQUEST'
				},
			},
		}
	},

	package: {individually: true},
	custom: {
		esbuild: {
			bundle: true,
			minify: false,
			sourcemap: true,
			exclude: ['aws-sdk'],
			target: 'node14',
			define: {'require.resolve': undefined},
			platform: 'node',
			concurrency: 10,
		},
	},
};

module.exports = serverlessConfiguration;
