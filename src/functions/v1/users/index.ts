import { handlerPath } from '@libs/handler-resolver';


export const users = {
	handler: `${handlerPath(__dirname)}/handler.users`,
	events: [
		{
			http: {
				method: 'get',
				path: 'v1/users',
				cors: true,
			},
		},
	],
	iamRoleStatements: [
		{
			Effect: 'Allow',
			Action: [
				'dynamodb:Scan',
			],
			Resource: [
				'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TABLE_USERS}'
			],
		},
	],
};
