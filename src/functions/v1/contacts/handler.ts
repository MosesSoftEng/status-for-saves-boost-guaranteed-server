import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import Contact from './Contact';
import {createContact} from './ContactsRepository';


export const saveContact = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const {user, phone} = JSON.parse(event.body);

	const contact: Contact = {
		user: Number(user),
		phone: Number(phone),
		date: new Date().getTime()
	};

	try {
		await createContact(contact);

		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: 'Contact save',
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
