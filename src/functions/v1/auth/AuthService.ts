import User from '../users/User';
import {createUser, getUserByPhone} from '../users/UsersRepository';


/**
 * Get or create a user based on the WhatsApp phone number.
 * @param {User} user - The user object containing the WhatsApp phone number.
 * @returns {Promise<User>} A promise that resolves to the existing or newly created user.
 */
export const getCreateUser = async (user: User): Promise<User> => {
	const existingUser = await getUserByPhone(user.phone);

	if(existingUser)
		return existingUser;

	const newUser = await createUser(user);
	
	return newUser;
};
