export type AuxeroContactInputField = {
	active: boolean;
	id: string;
	label: string;
	name: string;
	placeholder?: string;
	type: 'number' | 'text';
};

export type AuxeroContactFormData = {
	fields: AuxeroContactInputField[];
	messageLabel: string;
	messagePlaceholder: string;
	submitLabel: string;
	subtitle: string;
	title: string;
};

export const contactFormData: AuxeroContactFormData = {
	fields: [
		{
			active: true,
			id: 'Firstname',
			label: 'First Name',
			name: 'Firstname',
			type: 'text'
		},
		{
			active: false,
			id: 'Lastname',
			label: 'Last Name',
			name: 'Lastname',
			placeholder: 'Enter your last name',
			type: 'text'
		},
		{
			active: false,
			id: 'SendInquiryemail',
			label: 'Email',
			name: 'SendInquiryemail',
			placeholder: 'Enter your email address',
			type: 'text'
		},
		{
			active: false,
			id: 'SendInquiryphone',
			label: 'Phone Number',
			name: 'SendInquiryphone',
			placeholder: 'Enter your phone number',
			type: 'number'
		}
	],
	messageLabel: 'Message',
	messagePlaceholder: 'Your Message*',
	submitLabel: 'Send Message',
	subtitle: 'Vehicle viewings by appointment',
	title: 'get in touch'
};
