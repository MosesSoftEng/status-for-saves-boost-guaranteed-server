import * as AWS from 'aws-sdk';
import FCMToken from './FCMToken';

const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_FCM_TOKEN = process.env.TABLE_FCM_TOKEN;


/**
 * Creates a new FCM token in the DynamoDB table.
 * @param {FCMToken} fcmToken - The FCM token to be created.
 * @returns {Promise<FCMToken>} - A promise that resolves to the created FCM token.
 */
export const createFCMToken = async (fcmToken: FCMToken): Promise<FCMToken> => {
	await docClient.put({
		TableName: TABLE_FCM_TOKEN,
		Item: fcmToken,
	}).promise();

	return fcmToken;
};
