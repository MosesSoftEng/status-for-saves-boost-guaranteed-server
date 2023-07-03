import * as AWS from 'aws-sdk';
import User from './User';
import UserSaved from './UserSaved';

import {isContactExistServ} from '../contacts/ContactsService';

const docClient = new AWS.DynamoDB.DocumentClient();
const dynamodb = new AWS.DynamoDB();
AWS.config.update({region: 'us-east-1'});

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
export const getUsers = async (lastIndex = 0, limit = 10): Promise<User[]> => {
	const result = await docClient.scan({
		TableName: TABLE_USERS,
		Limit: limit,
		ExclusiveStartKey: lastIndex ? {phone: lastIndex} : undefined,
	}).promise();

	return result.Items as User[] ?? [];
};


/**
 * Retrieves a list of users who are not a contact with the specified phone number.
 * @param {number} phone - The phone number to check for contacts.
 * @param {number} [lastIndex=0] - The last index from the previous query (for pagination).
 * @param {number} [limit=10] - The maximum number of users to retrieve.
 * @returns {Promise<User[]>} - A promise that resolves to an array of User objects.
 */
export const getUsersNotContact = async (phone: number, lastIndex = 0, limit = 10): Promise<User[]> => {
	const filteredUsers: User[] = [];

	while (filteredUsers.length < limit) {
		const users: User[] = await getUsers(lastIndex, limit - filteredUsers.length);

		if (users.length === 0) {
			break; // No more users to fetch, exit the loop
		}

		for (const user of users) {
			if (user.phone === phone) {
				continue; // Skip the user with the provided phone number
			}

			const isContact: boolean = await isContactExistServ(phone, user.phone);

			if (!isContact) {
				filteredUsers.push(user);
			}

			if (filteredUsers.length === limit) {
				break; // Reached the limit, exit the loop
			}
		}

		lastIndex = users[users.length - 1].phone;
	}

	return filteredUsers;
};


/**
 * Creates a DynamoDB table with the specified table name.
*
* @param {string} tableName - The name of the table to create.
* @returns {Promise<void>} - A promise that resolves when the table is created successfully.
*/
// TODO: Rename table to createUsersSavedTable
export const createUserSavedTable = async (tableName: string): Promise<void> => {
	const params = {
		TableName: tableName,
		KeySchema: [
			{
				AttributeName: 'phone',
				KeyType: 'HASH',
			},
		],
		AttributeDefinitions: [
			{
				AttributeName: 'phone',
				AttributeType: 'N',
			},
		],
		BillingMode: 'PAY_PER_REQUEST'
	};

	await dynamodb.createTable(params).promise();
};


/**
 * Adds a user to the "usersSaved" table.
 * @param {string} tableName - The name of the table to add the user to.
 * @param {number} phone - The phone number of the user.
 * @returns {Promise<void>} - A promise that resolves when the user is added successfully.
 */
export const addUserToUsersSaved = async (tableName: string, userSaved: UserSaved): Promise<void> => {
	const params = {
		TableName: tableName,
		Item: userSaved,
	};

	await docClient.put(params).promise();
};


/**
 * Retrieves a user from the users saved table by phone number.
 * @param {string} tableName - The name of the table.
 * @param {number} phone - The phone number of the user.
 * @returns {Promise<UserSaved>} - A promise that resolves to the user object or undefined if not found.
 */
export const getUserFromUsersSaved = async (tableName: string, phone: number): Promise<UserSaved> => {
	const params = {
		TableName: tableName,
		Key: {
			phone,
		}
	};

	const {Item} = await docClient.get(params).promise();

	return Item as UserSaved || undefined;
};
