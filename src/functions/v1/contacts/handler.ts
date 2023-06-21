import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import Contact from './Contact';
import {createContact, deleteContactByUserAndPhone, getContactByUserAndPhone, getContacts} from './ContactsRepository';
import {getUserFCMToken, sendFCMNotification} from '../fcm-token/FCMTokenRepo';
import FCMToken from '../fcm-token/FCMToken';
import {addUserToUsersSaved, getUserFromUsersSaved as getUserSavedFromUsersSaved} from '../users/UsersRepository';
import UserSaved from '../users/UserSaved';

const TABLE_USERS_SAVED = process.env.TABLE_USERS_SAVED;


/**
 * Saves a contact.
 * @param {APIGatewayProxyEvent} event - The event object containing the request body.
 * @returns {Promise<APIGatewayProxyResult>} - A promise that resolves to the APIGatewayProxyResult.
 */
export const saveContact = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const {user, phone} = JSON.parse(event.body);

	const contact: Contact = {
		user: Number(user),
		phone: Number(phone),
		date: Date.now(),
	};

	try {
		await createContact(contact);

		const otherUserUsersSavedTableName = TABLE_USERS_SAVED.replace('*', contact.phone.toString());
		const thisUserUsersSavedTableName = TABLE_USERS_SAVED.replace('*', contact.user.toString());

		const isThisUserAContactInOtherUser = await getContactByUserAndPhone(Number(phone), Number(user)) !== undefined;

		const userSaved: UserSaved = {
			phone: Number(user),
			isContact: isThisUserAContactInOtherUser,
			date: Date.now(),
		};
		await addUserToUsersSaved(otherUserUsersSavedTableName, userSaved);

		const otherUserUserSaved: UserSaved = await getUserSavedFromUsersSaved(thisUserUsersSavedTableName, contact.phone);

		if (otherUserUserSaved) {
			otherUserUserSaved.isContact = true;
			await addUserToUsersSaved(thisUserUsersSavedTableName, otherUserUserSaved);
		}

		const fcmToken: FCMToken = await getUserFCMToken(Number(phone));

		if (fcmToken) {
			await sendFCMNotification(fcmToken.token, {title: 'New contact save!', body: 'A user has saved your contact, save back to retain save.'});
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
