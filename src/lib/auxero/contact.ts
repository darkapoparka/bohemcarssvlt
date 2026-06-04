export type AuxeroContactInputField = {
	active: boolean;
	id: string;
	label: string;
	name: string;
	placeholder?: string;
	type: 'email' | 'tel' | 'text';
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
			label: 'Име',
			name: 'Firstname',
			placeholder: 'Вашето име',
			type: 'text'
		},
		{
			active: false,
			id: 'Lastname',
			label: 'Фамилия',
			name: 'Lastname',
			placeholder: 'Вашата фамилия',
			type: 'text'
		},
		{
			active: false,
			id: 'SendInquiryemail',
			label: 'Имейл',
			name: 'SendInquiryemail',
			placeholder: 'bohemcars@gmail.com',
			type: 'email'
		},
		{
			active: false,
			id: 'SendInquiryphone',
			label: 'Телефон',
			name: 'SendInquiryphone',
			placeholder: '+359 893 588 680',
			type: 'tel'
		}
	],
	messageLabel: 'Съобщение',
	messagePlaceholder: 'Автомобил, VIN, линк към обява, бюджет или въпрос',
	submitLabel: 'Изпрати съобщение',
	subtitle: 'Огледи, внос от Канада, документи и продажба на автомобил - с уговорка.',
	title: 'Пишете ни за автомобил'
};
