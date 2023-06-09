import * as AWS from 'aws-sdk';
import FCMToken from './FCMToken';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../../status-for-saves-firebase-adminsdk-x6dla-bad19d9573.json';
import {Notification} from 'firebase-admin/lib/messaging/messaging-api';

const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_FCM_TOKEN = process.env.TABLE_FCM_TOKEN;

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

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


/**
 * Sends a Firebase Cloud Messaging (FCM) notification to the specified token.
 * @param {string} token - The FCM token of the recipient device.
 * @param {Notification} notification - The notification object containing the title and body.
 * @returns {Promise<void>} - A promise that resolves when the notification is sent successfully.
 */
export const sendFCMNotification = async (token: string, notification: Notification ): Promise<void> => {
	const message = {
		token,
		notification,
	};

	await admin.messaging().send(message);
};


