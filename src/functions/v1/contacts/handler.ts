import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import Contact from './Contact';
// TODO: rename functions to repo.
import {createContact as createContactRepo, updateContact, deleteContactByUserAndPhone, getContactByUserAndPhone} from './ContactsRepository';
import {getUserFCMToken, sendFCMNotification} from '../fcm-token/FCMTokenRepo';
import FCMToken from '../fcm-token/FCMToken';


/**
 * Saves a contact.
 *
 * @param {APIGatewayProxyEvent} event - The event object containing the request body.
 * @returns {Promise<APIGatewayProxyResult>} - A promise that resolves to the APIGatewayProxyResult.
 */
export const createContact = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		const {user, phone} = JSON.parse(event.body);

		const isUserContactOfPhone = await getContactByUserAndPhone(Number(phone), Number(user)) !== undefined;

		const contact: Contact = {
			user: Number(user),
			phone: Number(phone),
			isUserContactOfPhone,
			date: Date.now(),
		};

		await createContactRepo(contact);

		if (isUserContactOfPhone) {
			const reverseContact: Contact = {
				user: Number(phone),
				phone: Number(user),
				isUserContactOfPhone,
				date: Date.now(),
			};

			await updateContact(reverseContact);
		}

		const fcmToken: FCMToken = await getUserFCMToken(Number(phone));

		if (fcmToken) {
			await sendFCMNotification(fcmToken.token, {
				title: 'New contact saved!',
				body: 'A user has saved your contact. Save back to retain the contact.',
			});
		}

		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: 'Contact saved',
			}),
		};
	} catch (error) {
		return {
			statusCode: 500,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: error.message,
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
