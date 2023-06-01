import * as AWS from 'aws-sdk';
import User from './User';

const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_USERS = process.env.TABLE_USERS;


/**
 * Get a user by WhatsApp phone number from the DynamoDB table.
 * @param {string} whatsAppPhoneNumber - The WhatsApp phone number of the user.
 * @returns {Promise<User>} A promise that resolves to the user object.
 */
export const getUserByPhone = async (phone: number): Promise<User> => {
	const {Item} = await docClient.get({
		TableName: TABLE_USERS,
		Key: {
			phone,
		},
	}).promise();

	return Item as User;
};


/**
 * Create a user in the DynamoDB table.
 * @param {User} user - The user object to be created.
 * @returns {Promise<User>} A promise that resolves to the created user object.
 */
export const createUser = async (user: User): Promise<User> => {
	await docClient.put({
		TableName: TABLE_USERS,
		Item: user,
	}).promise();

	return user;
};
