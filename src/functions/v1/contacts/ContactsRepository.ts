import * as AWS from 'aws-sdk';
import Contact from './Contact';
import User from '../users/User';

const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_CONTACTS = process.env.TABLE_CONTACTS;
const TABLE_USERS_SAVED = process.env.TABLE_USERS_SAVED;


// TODO: Add jsdocs
export const createContact = async (contact: Contact): Promise<Contact> => {
	await docClient.put({
		TableName: TABLE_CONTACTS,
		Item: contact,
	}).promise();

	return contact;
};


/**
 * Retrieves a contact by user and phone number.
 * @param {number} user - The user identifier.
 * @param {number} phone - The phone number.
 * @returns {Promise<Contact>} - A promise that resolves to the contact object or undefined if not found.
 */
export const getContactByUserAndPhone = async (user: number, phone: number): Promise<Contact> => {
	const params = {
		TableName: TABLE_CONTACTS,
		Key: {
			user,
			phone
		}
	};

	const {Item} = await docClient.get(params).promise();

	return Item as Contact || undefined;
};


// TODO: Add jsdocs
export const getUnsavedContacts = async (user: string): Promise<Contact[]> => {
	const result = await docClient.scan({
		TableName: TABLE_CONTACTS,
		FilterExpression: '#user <> :userValue',
		ExpressionAttributeNames: {
			'#user': 'user',
		},
		ExpressionAttributeValues: {
			':userValue': user,
		},
	}).promise();

	if (result.Items) {
		return result.Items as Contact[];
	} else {
		return [];
	}
};


// TODO: Add jsdocs
export const getContacts = async (lastIndex = undefined, limit = 10): Promise<Contact[]> => {
	const result = await docClient.scan({
		TableName: TABLE_CONTACTS,
		Limit: limit,
		ExclusiveStartKey: {
			lastIndex
		}
	}).promise();

	if (result.Items) {
		return result.Items as Contact[];
	} else {
		return [];
	}
};


/**
 * Deletes a contact from the DynamoDB table based on the user and phone number.
 * @param {number} user - The user identifier.
 * @param {number} phone - The phone number.
 * @returns {Promise<void>} A promise that resolves when the contact is successfully deleted.
 */
export const deleteContactByUserAndPhone = async (user: number, phone: number): Promise<void> => {
	const params = {
		TableName: TABLE_CONTACTS,
		Key: {
			user,
			phone,
		},
	};

	await docClient.delete(params).promise();
};

/**
 * Retrieves a list of users who have saved a particular phone number.
 *
 * @param {number} phone The phone number of the users to retrieve.
 * @param {number} lastIndex The index of the last user that was retrieved in the previous call to the function.
 * @param {number} limit The limit on the number of users to retrieve.
 * @returns {Promise<User[]>} A promise that resolves to a list of User objects.
 */
export const getUsersThatSavePhoneNumber = async (phone: number, lastIndex = 0, limit = 10): Promise<User[]> => {
	const tableName = TABLE_USERS_SAVED.replace('*', phone.toString());

	const params = {
		TableName: tableName,
		Limit: limit,
		ExclusiveStartKey: lastIndex
			? {
				phone: lastIndex,
			}
			: undefined,
	};

	const result = await docClient.scan(params).promise();

	return result.Items as User[];
};
