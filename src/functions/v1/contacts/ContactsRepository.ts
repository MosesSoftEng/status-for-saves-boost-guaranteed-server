import * as AWS from 'aws-sdk';
import Contact from './Contact';

const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_CONTACTS = process.env.TABLE_CONTACTS;


/**
 * Creates a contact by saving it to the contacts table.
 *
 * @param {Contact} contact - The contact to create.
 * @returns {Promise<Contact>} - A promise that resolves to the created contact.
 */
export const createContact = async (contact: Contact): Promise<Contact> => {
	await docClient.put({
		TableName: TABLE_CONTACTS,
		Item: contact,
	}).promise();

	return contact;
};


/**
 * Updates a contact by replacing its data in the contacts table.
 *
 * @param {Contact} contact - The updated contact data.
 * @returns {Promise<Contact>} - A promise that resolves to the updated contact.
 */
export const updateContact = async (contact: Contact): Promise<Contact> => {
	return createContact(contact);
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


/**
 * Deletes all user contacts from the CONTACTS table with the specified user as the partition key.
 *
 * @param {number} user - The user value for the partition key.
 * @returns {Promise<void>} A Promise that resolves when the deletion is complete.
 */
export const deleteUserContacts = async (user: number): Promise<void> => {
	const params = {
		TableName: TABLE_CONTACTS,
		KeyConditionExpression: '#user = :userValue',
		ExpressionAttributeNames: {
			'#user': 'user',
		},
		ExpressionAttributeValues: {
			':userValue': user,
		},
	};

	const result = await docClient.query(params).promise();
	const deletePromises = result.Items.map((item) => {
		const deleteParams = {
			TableName: TABLE_CONTACTS,
			Key: {
				user: item.user,
				phone: item.phone,
			},
		};
		return docClient.delete(deleteParams).promise();
	});
	await Promise.all(deletePromises);
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
