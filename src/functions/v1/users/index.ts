import {handlerPath} from '@libs/handler-resolver';


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


export const getUsersSavedUser = {
	handler: `${handlerPath(__dirname)}/handler.getUsersSavedUser`,
	events: [
		{
			http: {
				method: 'get',
				path: 'v1/users/saved/{user}',
				cors: true,
			},
		},
	],
	iamRoleStatements: [
		{
			Effect: 'Allow',
			Action: [
				'dynamodb:Scan',
				'dynamodb:DescribeTable'
			],
			Resource: [
				'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TABLE_CONTACTS}',
				'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TABLE_USERS_SAVED}',
			],
		},
	],
};
