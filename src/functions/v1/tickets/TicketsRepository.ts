import * as AWS from 'aws-sdk';
import { Ticket } from './Ticket';

const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_TICKETS = process.env.TABLE_TICKETS;

export const createTicketRepo = async (ticket: Ticket): Promise<Ticket> => {
	await docClient
		.put({
			TableName: TABLE_TICKETS,
			Item: ticket,
		})
		.promise();

	return ticket;
};
