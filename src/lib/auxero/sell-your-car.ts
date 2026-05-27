import { bohemcarsContact } from '$lib/data/bohemcars';

export type AuxeroSellCarInputField = {
	active: boolean;
	id: string;
	label: string;
	name: string;
	placeholder?: string;
	required?: boolean;
	type: 'tel' | 'text';
};

export type AuxeroSellCarFormData = {
	fields: AuxeroSellCarInputField[];
	submitLabel: string;
};

export type AuxeroSellCarStep = {
	text: string;
	title: string;
};

export const auxeroSellSteps: AuxeroSellCarStep[] = [
	{
		title: 'Send Vehicle Details',
		text: 'Share VIN, mileage, photos, equipment, documents, and your expected price.'
	},
	{
		title: 'Review History And Condition',
		text: 'Bohemcars reviews the information and asks for anything needed before advising.'
	},
	{
		title: 'Choose The Sale Path',
		text: 'Discuss a direct offer, assisted sale, or publishing the car as a client vehicle.'
	},
	{
		title: 'Complete The Handoff',
		text: 'Finalize documents, appointment timing, payment path, and vehicle handover.'
	}
];

export const sellCarFormData: AuxeroSellCarFormData = {
	fields: [
		{
			active: true,
			id: 'sellVIN',
			label: 'VIN Number',
			name: 'vin',
			placeholder: 'Enter the VIN',
			required: true,
			type: 'text'
		},
		{
			active: false,
			id: 'sellMileage',
			label: 'Mileage',
			name: 'mileage',
			placeholder: 'Mileage in km',
			required: true,
			type: 'text'
		},
		{
			active: false,
			id: 'sellPrice',
			label: 'Expected Price',
			name: 'price',
			placeholder: 'Expected price in EUR',
			type: 'text'
		},
		{
			active: false,
			id: 'sellPhone',
			label: 'Contact Phone',
			name: 'phone',
			placeholder: bohemcarsContact.primaryPhoneLabel,
			required: true,
			type: 'tel'
		}
	],
	submitLabel: 'Request Review'
};
