import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import { createTicketRepo } from './TicketsRepository';

export const createTicket = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	let message = "";
	const ticket = JSON.parse(event.body);

	try {
		await createTicketRepo(ticket);

		message = "Ticket saved";
	} catch(error) {
		message = error.message;	
	}	

	return {
		statusCode: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
		},
		body: JSON.stringify({
			message,
		}),
	};
};
