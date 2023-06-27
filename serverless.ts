import type {AWS} from '@serverless/typescript';
import hello from '@functions/hello';
import {login} from '@functions/v1/auth';
import {getUsersSavedUser, users} from '@functions/v1/users';
import {saveContact, deleteContact} from '@functions/v1/contacts';
import {saveFCMToken} from '@functions/v1/fcm-token';
import {environment} from 'src/configs/config';

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
		environment,

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
		users,
		getUsersSavedUser,

		//* contacts
		saveContact,
		deleteContact,

		//* FCM token
		saveFCMToken,
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
							AttributeType: 'N',
						},
						{
							AttributeName: 'phone',
							AttributeType: 'N',
						},
					],
					KeySchema: [
						{
							AttributeName: 'user',
							KeyType: 'HASH',
						},
						{
							AttributeName: 'phone',
							KeyType: 'RANGE',
						},
					],
					BillingMode: 'PAY_PER_REQUEST',
					GlobalSecondaryIndexes: [
						// TODO: Delete
						{
							IndexName: 'PhoneIndex',
							KeySchema: [
								{
									AttributeName: 'phone',
									KeyType: 'HASH',
								},
							],
							Projection: {
								ProjectionType: 'ALL',
							},
						},
						{
							IndexName: 'PhoneUserIndex',
							KeySchema: [
								{
									AttributeName: 'phone',
									KeyType: 'HASH',
								},
								{
									AttributeName: 'user',
									KeyType: 'RANGE',
								},
							],
							Projection: {
								ProjectionType: 'ALL',
							},
						},
					],
				},
			},
			FCMTokenTable: {
				Type: 'AWS::DynamoDB::Table',
				Properties: {
					TableName: '${self:provider.environment.TABLE_FCM_TOKEN}',
					AttributeDefinitions: [
						{
							AttributeName: 'user',
							AttributeType: 'N',
						}
					],
					KeySchema: [
						{
							AttributeName: 'user',
							KeyType: 'HASH',
						}
					],
					BillingMode: 'PAY_PER_REQUEST'
				},
			},
		},
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
