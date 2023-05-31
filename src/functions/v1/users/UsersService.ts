import User from "./User";
import { getUserByWhatsAppPhoneNumber, createUser } from "./UsersRepository";


/**
 * Get or create a user based on the WhatsApp phone number.
 * @param {User} user - The user object containing the WhatsApp phone number.
 * @returns {Promise<User>} A promise that resolves to the existing or newly created user.
 */
export const getCreateUser = async (user: User): Promise<User> => {
	const existingUser = await getUserByWhatsAppPhoneNumber(user.whatsAppPhoneNumber);

	if(existingUser)
		return existingUser;

	const newUser = await createUser(user);
	
	return newUser;
};