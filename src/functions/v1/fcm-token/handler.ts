import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import FCMToken from './FCMToken';
import {createFCMToken} from './FCMTokenRepo';


export const saveFCMToken = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const {user, token} = JSON.parse(event.body);

	const fcmToken: FCMToken = {
		user: Number(user),
		token,
		active: true,
		date: new Date().getTime()
	};

	try {
		await createFCMToken(fcmToken);

		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: 'Token save',
			}),
		};
	} catch (error) {
		console.error('getUsersSavedUser, error: ', error);

		return {
			statusCode: 500,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: error.message,
			}),
		};
	}
};