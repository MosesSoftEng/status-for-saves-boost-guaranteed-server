import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import Contact from './Contact';
import {createContact, deleteContactByUserAndPhone} from './ContactsRepository';
import {getUserFCMToken, sendFCMNotification} from '../fcm-token/FCMTokenRepo';
import FCMToken from '../fcm-token/FCMToken';

// TODO: Add jsdocs and lof error message to console.
export const saveContact = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const {user, phone} = JSON.parse(event.body);

	const contact: Contact = {
		user: Number(user),
		phone: Number(phone),
		date: new Date().getTime()
	};

	try {
		await createContact(contact);

		const fcmToken: FCMToken = await getUserFCMToken(Number(phone));

		if(fcmToken)
			// Send notification to contact.
			await sendFCMNotification(fcmToken.token, {title: 'New contact save!', body: 'A user has saved your contact, save back to retain save.'});

		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: 'Contact save',
				data: fcmToken
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

/**
 * Deletes a contact based on the user and phone number.
 * @param {APIGatewayProxyEvent} event - The API Gateway event object.
 * @returns {Promise<APIGatewayProxyResult>} A promise that resolves to the API Gateway proxy result.
 */
export const deleteContact = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const {user, phone} = JSON.parse(event.body);

	try {
		await deleteContactByUserAndPhone(Number(user), Number(phone));

		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: 'Contact deleted',
			}),
		};
	} catch (error) {
		console.error('Error deleting contact:', error);

		return {
			statusCode: 500,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: 'Failed to delete contact',
			}),
		};
	}
};
