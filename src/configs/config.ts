export const environment = {
	AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
	NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',

	// Dynamodb Tables.
	TABLE_TICKETS: '${self:service}-tickets-${self:provider.stage}',
};
