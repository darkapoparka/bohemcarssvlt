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
