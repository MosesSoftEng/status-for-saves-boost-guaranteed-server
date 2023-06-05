import * as AWS from 'aws-sdk';
import Contact from './Contact';

const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_CONTACTS = process.env.TABLE_CONTACTS;


// TODO: Add jsdocs
export const createContact = async (contact: Contact): Promise<Contact> => {
	await docClient.put({
		TableName: TABLE_CONTACTS,
		Item: contact,
	}).promise();

	return contact;
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
