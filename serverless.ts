import type {AWS} from '@serverless/typescript';
import {environment} from 'src/configs/config';
import { createTicket } from '@functions/v1/tickets';


const serverlessConfiguration: AWS = {
	service: "vip-tickets-server",
	frameworkVersion: "3",

	/*
	 * Plugins
	 */
	plugins: ["serverless-esbuild", "serverless-iam-roles-per-function"],
	provider: {
		name: "aws",
		runtime: "nodejs14.x",
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment,

		/*
		 * AWS configuration.
		 */
		profile: "default",
		stage: "dev",
		region: "us-east-1",
	},

	/*
	 * Functions.
	 */
	functions: {
		createTicket,
	},

	/*
	 * Resources.
	 */
	resources: {
		Resources: {
			TicketsTable: {
				Type: "AWS::DynamoDB::Table",
				Properties: {
					TableName: "${self:provider.environment.TABLE_TICKETS}",
					AttributeDefinitions: [
						{
							AttributeName: "id",
							AttributeType: "S",
						},
					],
					KeySchema: [
						{
							AttributeName: "id",
							KeyType: "HASH",
						},
					],
					BillingMode: "PAY_PER_REQUEST",
				},
			},
		},
	},

	package: { individually: true },
	custom: {
		esbuild: {
			bundle: true,
			minify: false,
			sourcemap: true,
			exclude: ["aws-sdk"],
			target: "node14",
			define: { "require.resolve": undefined },
			platform: "node",
			concurrency: 10,
		},
	},
};

module.exports = serverlessConfiguration;
