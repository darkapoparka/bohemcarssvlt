import { bohemcarsContact } from '$lib/data/bohemcars';

export type AuxeroServiceInputField = {
	active: boolean;
	id?: string;
	label: string;
	name: string;
	placeholder?: string;
	required?: boolean;
	type: 'date' | 'email' | 'tel' | 'text';
};

export type AuxeroServiceFormData = {
	fields: AuxeroServiceInputField[];
	serviceLabel: string;
	serviceName: string;
	serviceOptions: string[];
	submitLabel: string;
	title: string;
	vehicleField: AuxeroServiceInputField;
};

export const serviceFormData: AuxeroServiceFormData = {
	fields: [
		{
			active: true,
			label: 'Name',
			name: 'name',
			placeholder: 'Your name',
			required: true,
			type: 'text'
		},
		{
			active: false,
			label: 'Email',
			name: 'email',
			placeholder: bohemcarsContact.emailLabel,
			required: true,
			type: 'email'
		},
		{
			active: false,
			label: 'Phone',
			name: 'phone',
			placeholder: bohemcarsContact.primaryPhoneLabel,
			type: 'tel'
		},
		{
			active: false,
			label: 'Preferred Date',
			name: 'date',
			type: 'date'
		}
	],
	serviceLabel: 'Service',
	serviceName: 'service',
	serviceOptions: [
		'Import From Canada',
		'Evaluate A Listing',
		'Sell Your Car',
		'Documents And Registration',
		'Appointment Viewings',
		'Model Comparison'
	],
	submitLabel: 'Schedule Service',
	title: 'Schedule A Service',
	vehicleField: {
		active: false,
		label: 'Vehicle Or VIN',
		name: 'vehicle',
		placeholder: 'Vehicle link or VIN',
		type: 'text'
	}
};
