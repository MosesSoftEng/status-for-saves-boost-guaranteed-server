import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import User from './User';
import {deleteUser, getUsers, getUsersAreContact, getUsersNotContact, getUsersThatSavePhoneNumber} from './UsersRepository';

/**
 * Lambda function to handle API Gateway event and retrieve users.
 *
 * @param {APIGatewayProxyEvent} event - The event object representing the API Gateway event.
 * @returns {Promise<APIGatewayProxyResult>} The Promise resolving to the API Gateway proxy result.
 */
export const getUsersHan = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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


export const getUsersAreContactHan = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const {user} = event.pathParameters;
	const {lastIndex, limit} = event.queryStringParameters ?? {};

	try {
		const users = await getUsersAreContact(Number(user), Number(lastIndex), Number(limit));

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
		console.error('getUsersAreContact, error: ', error);

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


export const getUsersNotContactHan = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const {user} = event.pathParameters;
	const {lastIndex, limit} = event.queryStringParameters ?? {};

	try {
		const users = await getUsersNotContact(Number(user), Number(lastIndex), Number(limit));

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
		console.error('getUsersSavedUser, error: ', error);

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


/**
 * Retrieves users that have saved a specific phone number.
 * @param {APIGatewayProxyEvent} event - The event object representing the HTTP request.
 * @returns {Promise<APIGatewayProxyResult>} - A promise that resolves to the APIGatewayProxyResult object.
 */
export const getUsersSavedUserHan = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const {user} = event.pathParameters;
	const {lastIndex, limit} = event.queryStringParameters ?? {};

	try {
		const users = await getUsersThatSavePhoneNumber(Number(user), Number(lastIndex), Number(limit));

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
		console.error('getUsersSavedUser, error: ', error);

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


export const deleteUserHan = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const {user} = event.pathParameters;

	try {
		const users = await deleteUser(Number(user));

		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				message: 'Users deleted successfully',
				data: users,
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
				message: 'Failed to delete user',
				error: error.message,
			}),
		};
	}
};


export const deleteUserRequestHan = async (): Promise<APIGatewayProxyResult> => {
	const htmlForm = `
    <form method="get" action="https://ywu7goj8i4.execute-api.us-east-1.amazonaws.com/dev/v1/users/delete">
      <label for="phone">Phone Number:</label>
      <input type="text" id="phone" name="phone" required>
      <br>
      <input type="submit" value="Delete User" onclick="appendPhone()">
    </form>

    <script>
      function appendPhone() {
        const phoneInput = document.getElementById('phone');
        const phoneValue = phoneInput.value;
        const form = document.querySelector('form');
        form.action = form.action + '/' + phoneValue;
      }
    </script>
  `;

	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'text/html',
		},
		body: htmlForm,
	};
};
