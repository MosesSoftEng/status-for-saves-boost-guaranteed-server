import { handlerPath } from "@libs/handler-resolver";

export const createTicket = {
	handler: `${handlerPath(__dirname)}/handler.createTicket`,
	events: [
		{
			http: {
				method: "post",
				path: "v1/tickets",
				cors: true,
			},
		},
	],
	iamRoleStatements: [
		{
			Effect: "Allow",
			Action: ["dynamodb:PutItem"],
			Resource: ["arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TABLE_TICKETS}"],
		},
	],
};
