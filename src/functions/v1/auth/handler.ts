import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import User from '../users/User';
import {getCreateUser} from './AuthService';
import {createContactServ} from '../contacts/ContactsService';


/**
 * Login the user.
 * @param {APIGatewayProxyEvent} event - The event object containing the request details.
 * @returns {Promise<APIGatewayProxyResult>} A promise that resolves to the APIGatewayProxyResult object.
 */
export const login = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const {whatsAppPhoneNumber} = JSON.parse(event.body);

	const user: User = {
		phone: Number(whatsAppPhoneNumber),
		date: new Date().getTime()
	};

	try {
		await getCreateUser(user);
		await createContactServ(Number(whatsAppPhoneNumber), Number(whatsAppPhoneNumber));

		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: 'user authenticated',
			}),
		};
	} catch ({message}) {
		return {
			statusCode: 500,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message,
			}),
		};
	}
};
