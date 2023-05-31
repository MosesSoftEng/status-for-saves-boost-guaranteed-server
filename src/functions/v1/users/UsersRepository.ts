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
