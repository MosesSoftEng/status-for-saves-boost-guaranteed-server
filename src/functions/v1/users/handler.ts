import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import User from './User';
import {getUsers} from './UsersRepository';

/**
 * Lambda function to handle API Gateway event and retrieve users.
 *
 * @param {APIGatewayProxyEvent} event - The event object representing the API Gateway event.
 * @returns {Promise<APIGatewayProxyResult>} The Promise resolving to the API Gateway proxy result.
 */
export const users = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const {lastIndex, limit} = event.queryStringParameters ?? {};

	try {
		const users: User[] = await getUsers(Number(lastIndex), Number(limit));

		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: 'Users retrieved successfully',
				data: users,
			}),
		};
	} catch (error) {
		console.error('Error retrieving users:', error);

		return {
			statusCode: 500,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: 'Failed to retrieve users',
				error: error.message,
			}),
		};
	}
};
