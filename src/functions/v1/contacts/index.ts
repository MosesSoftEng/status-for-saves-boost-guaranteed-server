import { handlerPath } from '@libs/handler-resolver';


export const saveContact = {
	handler: `${handlerPath(__dirname)}/handler.saveContact`,
	events: [
		{
			http: {
				method: 'post',
				path: 'v1/contacts',
				cors: true,
			},
		},
	],
	iamRoleStatements: [
		{
			Effect: 'Allow',
			Action: [
				'dynamodb:PutItem',
			],
			Resource: [
				'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TABLE_CONTACTS}'
			],
		},
	],
};
