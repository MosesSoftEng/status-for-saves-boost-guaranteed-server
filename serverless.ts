import type {AWS} from '@serverless/typescript';

import hello from '@functions/hello';

const serverlessConfiguration: AWS = {
	service: 'status-for-saves-server',
	frameworkVersion: '3',
	plugins: ['serverless-esbuild'],
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
			TABLE_USERS: '${self:service}-users-${self:provider.stage}',
		},

		/*
		 * AWS configuration.
		 */
		profile: 'default',
		stage: 'dev',
		region: 'us-east-1',
	},
	// import the function via paths
	functions: {hello},

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
							AttributeName: 'mobile',
							AttributeType: 'S',
						}
					],
					KeySchema: [
						{
							AttributeName: 'mobile',
							KeyType: 'HASH',
						}
					],
					BillingMode: 'PAY_PER_REQUEST'
				},
			}
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
