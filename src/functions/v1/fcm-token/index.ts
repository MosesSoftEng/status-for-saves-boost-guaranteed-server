import {handlerPath} from '@libs/handler-resolver';


export const saveFCMToken = {
	handler: `${handlerPath(__dirname)}/handler.saveFCMToken`,
	events: [
		{
			http: {
				method: 'post',
				path: 'v1/fcm-token',
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
				'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TABLE_FCM_TOKEN}'
			],
		},
	],
};
