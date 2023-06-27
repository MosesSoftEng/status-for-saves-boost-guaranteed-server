/**
 * The `Contact` interface represents a contact in a contact list.
 *
 * @interface
 * @extends {Object}
 *
 * @property {number} user The user phone saving the contact.
 * @property {number} phone The phone number of the contact.
 * @property {number} date The date the contact was created.
 */
export default interface Contact {
	user: number;
	phone: number;
	isUserContactOfPhone: boolean;
	date: number;
}
