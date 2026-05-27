import { bohemcarsAssets, bohemcarsContact } from '$lib/data/bohemcars';

export type AuxeroSupportService = {
	description: string;
	href: string;
	image: string;
	title: string;
};

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

export const auxeroServiceCards: AuxeroSupportService[] = [
	{
		title: 'Import From Canada',
		description:
			'Shortlist vehicles with traceable history, clear photos, and realistic landed-cost expectations before purchase.',
		href: '/contact',
		image: '/assets/bohemcars/services/import-canada-service.png'
	},
	{
		title: 'Evaluate A Listing',
		description:
			'Review VIN, mileage, history reports, equipment, photos, and seller context before you commit.',
		href: '/compare',
		image: '/assets/bohemcars/services/evaluate-link-service.png'
	},
	{
		title: 'Sell Your Car',
		description:
			'Send vehicle details, documents, photos, and expectations so Bohemcars can advise on the right sale path.',
		href: '/sell-your-car',
		image: '/assets/bohemcars/services/sell-car-service.png'
	},
	{
		title: 'Documents And Registration',
		description:
			'Coordinate import documents, technical preparation, registration steps, and handoff details.',
		href: '/services',
		image: bohemcarsAssets.footerImage
	},
	{
		title: 'Appointment Viewings',
		description:
			'Book prepared viewings so the vehicle, documents, and consultant context are ready before arrival.',
		href: '/contact',
		image: bohemcarsAssets.hero
	},
	{
		title: 'Model Comparison',
		description:
			'Compare price, mileage, equipment, history, running costs, and import timing across several candidates.',
		href: '/compare',
		image: '/assets/bohemcars/cta/import-canada-banner-v2.png'
	}
];

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
	serviceOptions: auxeroServiceCards.map((service) => service.title),
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
