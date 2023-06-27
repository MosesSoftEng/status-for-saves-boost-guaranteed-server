export const environment = {
	AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
	NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',

	//* Dynamodb Tables
	TABLE_USERS: '${self:service}-users-01-${self:provider.stage}',
	TABLE_USERS_SAVED: '${self:service}-users-saved-*-${self:provider.stage}',
	TABLE_CONTACTS: '${self:service}-contacts-${self:provider.stage}',
	TABLE_FCM_TOKEN: '${self:service}-fcm-token-01-${self:provider.stage}',
};
