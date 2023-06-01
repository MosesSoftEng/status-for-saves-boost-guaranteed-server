import * as AWS from 'aws-sdk';
import Contact from './Contact';

const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_CONTACTS = process.env.TABLE_CONTACTS;

export const createContact = async (contact: Contact): Promise<Contact> => {
	await docClient.put({
		TableName: TABLE_CONTACTS,
		Item: contact,
	}).promise();

	return contact;
};

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
