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


/**
 * Retrieves a list of users from the DynamoDB table.
 * 
 * @param {string} [lastIndex=0] - The last index value to start the scan from.
 * @param {number} [limit=10] - The maximum number of items to retrieve.
 * @returns {Promise<User[]>} A promise that resolves to an array of User objects.
 */
export const getUsers = async (lastIndex = '0', limit = 10): Promise<User[]> => {
	const result = await docClient.scan({
		TableName: TABLE_USERS!,
		Limit: limit,
		ExclusiveStartKey: lastIndex ? {phone: lastIndex} : undefined,
	}).promise();

	return result.Items as User[] ?? [];
};
