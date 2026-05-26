export type AuxeroFaq = {
	answer: string;
	question: string;
	topic: string;
};

export type AuxeroFaqGroup = {
	items: AuxeroFaq[];
	title: string;
};

export const supportFaqs: AuxeroFaq[] = [
	{
		topic: 'Import',
		question: 'Why import a vehicle from Canada?',
		answer:
			'Canada can offer well-equipped vehicles with traceable history and competitive pricing. Bohemcars still checks the specific car, records, mileage, photos, and estimated landed cost before recommending a decision.'
	},
	{
		topic: 'Timing',
		question: 'How long does import usually take?',
		answer:
			'Typical timing can be around 6 to 10 weeks, depending on vehicle selection, transport, customs steps, documents, and preparation for registration.'
	},
	{
		topic: 'Checks',
		question: 'What does Bohemcars check before purchase?',
		answer:
			'The team reviews history, mileage, origin, seller context, service information, available reports, photos, documents, and known model-specific requirements.'
	},
	{
		topic: 'Costs',
		question: 'How is the final cost formed?',
		answer:
			'The estimate normally combines vehicle price, transport, customs duty, VAT, documents, technical preparation, registration steps, and any service work needed before handoff.'
	},
	{
		topic: 'Documents',
		question: 'What documents will I receive?',
		answer:
			'Documents depend on the exact vehicle and transaction. Bohemcars confirms the purchase, transport, customs, and registration paperwork available before handoff.'
	},
	{
		topic: 'Warranty',
		question: 'Do imported vehicles include warranty?',
		answer:
			'Warranty is not assumed automatically. If a vehicle has remaining factory coverage or dealer support, that must be confirmed for the specific vehicle before purchase.'
	},
	{
		topic: 'Selling',
		question: 'Can Bohemcars help sell my vehicle?',
		answer:
			'Yes. Send VIN, mileage, photos, service history, condition, documents, and your expected price. Bohemcars can advise on a direct offer, client listing, or sale assistance.'
	},
	{
		topic: 'Viewing',
		question: 'Do I need an appointment?',
		answer:
			'Yes. Viewings are arranged by appointment so the vehicle, documents, and consultant context are prepared before you arrive.'
	},
	{
		topic: 'Compare',
		question: 'Can Bohemcars compare several models?',
		answer:
			'Yes. Send the vehicles, budget, timing, and priorities. The team can compare equipment, history, running costs, availability, and import complexity.'
	}
];

const faqsByTopic = (topics: string[]) => supportFaqs.filter((faq) => topics.includes(faq.topic));

export const featuredFaqs = supportFaqs.slice(0, 3);

export const auxeroFaqGroups: AuxeroFaqGroup[] = [
	{
		title: 'Import And Buying',
		items: faqsByTopic(['Import', 'Timing', 'Checks'])
	},
	{
		title: 'Costs And Documents',
		items: faqsByTopic(['Costs', 'Documents', 'Warranty'])
	},
	{
		title: 'Selling And Appointments',
		items: faqsByTopic(['Selling', 'Viewing', 'Compare'])
	}
];
