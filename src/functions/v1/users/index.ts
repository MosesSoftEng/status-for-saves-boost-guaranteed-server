import {handlerPath} from '@libs/handler-resolver';


export const getUsers = {
	handler: `${handlerPath(__dirname)}/handler.getUsersHan`,
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
	handler: `${handlerPath(__dirname)}/handler.getUsersSavedUserHan`,
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
				'dynamodb:DescribeTable',
				'dynamodb:Query',
			],
			Resource: [
				'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TABLE_CONTACTS}',
				'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TABLE_CONTACTS}/index/PhoneUserIndex',
			],
		},
	],
};


export const getUsersNotContact = {
	handler: `${handlerPath(__dirname)}/handler.getUsersNotContactHan`,
	events: [
		{
			http: {
				method: 'get',
				path: 'v1/users/not-contact/{user}',
				cors: true,
			},
		},
	],
	iamRoleStatements: [
		{
			Effect: 'Allow',
			Action: [
				'dynamodb:Scan',
				'dynamodb:DescribeTable',
				'dynamodb:GetItem'
			],
			Resource: [
				'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TABLE_USERS}',
				'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TABLE_CONTACTS}',
			],
		},
	],
};


export const getUsersAreContact = {
	handler: `${handlerPath(__dirname)}/handler.getUsersAreContactHan`,
	events: [
		{
			http: {
				method: 'get',
				path: 'v1/users/are-contact/{user}',
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
			],
		},
	],
};


export const deleteUser = {
	handler: `${handlerPath(__dirname)}/handler.deleteUserHan`,
	events: [
		{
			http: {
				method: 'get',
				path: 'v1/users/delete/{user}',
				cors: true,
			},
		},
	],
	iamRoleStatements: [
		{
			Effect: 'Allow',
			Action: [
				'dynamodb:DeleteItem'
			],
			Resource: [
				'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TABLE_USERS}',
			],
		},
	],
};

export const deleteUserRequest = {
	handler: `${handlerPath(__dirname)}/handler.deleteUserRequestHan`,
	events: [
		{
			http: {
				method: 'get',
				path: 'v1/users/delete/request',
				cors: true,
			},
		},
	]
};

