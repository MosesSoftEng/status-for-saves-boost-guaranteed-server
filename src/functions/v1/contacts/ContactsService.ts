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


/**
 * Checks if a contact exists between the given user and phone number.
 *
 * @param {number} user - The user identifier.
 * @param {number} phone - The phone number.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the contact exists.
 */
export const isContactExistServ = async (user: number, phone: number): Promise<boolean> => {
	const isPhoneUserContact: boolean = await getContactByUserAndPhone(user, phone) !== undefined;

	return isPhoneUserContact;
};
