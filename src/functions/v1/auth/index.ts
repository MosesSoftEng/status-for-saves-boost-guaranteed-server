import { handlerPath } from '@libs/handler-resolver';

export const login = {
	handler: `${handlerPath(__dirname)}/handler.login`,
	events: [
		{
			http: {
				method: 'post',
				path: 'v1/login',
				cors: true,
			},
		},
	],
	iamRoleStatements: [
		{
			Effect: 'Allow',
			Action: [
				'dynamodb:GetItem',
				'dynamodb:PutItem',
			],
			Resource: [
				'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TABLE_USERS}',
				'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TABLE_CONTACTS}'
			],
		},
	],
};
