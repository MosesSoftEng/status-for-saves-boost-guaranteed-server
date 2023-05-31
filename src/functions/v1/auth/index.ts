import { handlerPath } from '@libs/handler-resolver';

export const auth = {
	handler: `${handlerPath(__dirname)}/handler.auth`,
	events: [
		{
			http: {
				method: 'post',
				path: 'v1/auth',
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
			Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TABLE_USERS}',
		},
	],
};
