export type AuxeroTermsSection = {
	body: string[];
	id: string;
	title: string;
};

export const auxeroTermsPageTitle = 'Условия за използване на Bohemcars';

export const auxeroTermsSections: AuxeroTermsSection[] = [
	{
		id: 'section1',
		title: '1. Vehicle Information',
		body: [
			'Bohemcars presents vehicle information from available listings, client submissions, supplier details, photos, reports, and internal review notes.',
			'Availability, mileage, equipment, condition, pricing, and documents must be confirmed for the exact vehicle before purchase or reservation.'
		]
	},
	{
		id: 'section2',
		title: '2. Import Process',
		body: [
			'Import timing depends on vehicle selection, transport, customs steps, document readiness, technical preparation, and external partners.',
			'Estimated timelines are guidance only until a specific vehicle and transport path are confirmed.'
		]
	},
	{
		id: 'section3',
		title: '3. Costs And Calculator',
		body: [
			'Calculator results are estimates for orientation. Final landed cost can change with exchange rates, duty, VAT, transport, port handling, registration steps, and vehicle-specific preparation.',
			'A written breakdown for the exact vehicle should be reviewed before any payment decision.'
		]
	},
	{
		id: 'section4',
		title: '4. Appointments And Test Drives',
		body: [
			'Vehicle viewings are arranged by appointment so Bohemcars can prepare the car, documents, and relevant context.',
			'Any test drive or inspection must respect local rules, vehicle status, insurance conditions, and team availability.'
		]
	},
	{
		id: 'section5',
		title: '5. Client Vehicles',
		body: [
			'Client vehicles are reviewed from information supplied by the owner, including VIN, photos, mileage, service history, condition, and documents.',
			'Bohemcars may request additional information before advising on price, publication, direct offer, or sale assistance.'
		]
	},
	{
		id: 'section6',
		title: '6. Contact And Data',
		body: [
			'Messages submitted through the website are used to respond to vehicle, import, appointment, and sale requests.',
			'Do not submit sensitive payment details through public website forms. Confirm official payment instructions directly with Bohemcars before sending funds.'
		]
	}
];
