import Contact from './Contact';
import {createContact, getContactByUserAndPhone} from './ContactsRepository';


/**
 * Creates a contact service.
 * @param {number} user - The user phone saving the contact.
 * @param {number} phone - The phone number of the contact.
 * @returns {Promise<Contact>} - A promise that resolves to the created contact.
 */
export const createContactServ = async (user: number, phone: number): Promise<Contact> => {
	const contact: Contact = {
		user,
		phone,
		isUserContactOfPhone: await getContactByUserAndPhone(phone, user) !== undefined,
		date: Date.now(),
	};

	return createContact(contact);
};
