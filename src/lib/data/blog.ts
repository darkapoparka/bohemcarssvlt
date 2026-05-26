export interface BlogPost {
	slug: string;
	title: string;
	category: string;
	date: string;
	image: string;
	excerpt: string;
	content: string[];
}

export const posts: BlogPost[] = [
	{
		slug: 'vnos-ot-kanada-proverka',
		title: 'What Bohemcars Checks Before Importing A Vehicle From Canada',
		category: 'Canada import',
		date: 'May 2026',
		image: '/assets/bohemcars/blog/import-check-cover.png',
		excerpt:
			'History, mileage, service records, purchase photos, and documents shape a calmer import decision.',
		content: [
			'Before recommending a vehicle, Bohemcars reviews origin, mileage, service history, condition, and document trail so the buyer knows what they are approving before the car leaves Canada.',
			'The strongest candidates come from traceable sources with clear photos, history, and service context.',
			'After approval, Bohemcars coordinates transport, customs steps, and preparation for registration.'
		]
	},
	{
		slug: 'gotov-za-registracia',
		title: 'What Ready For Registration Means',
		category: 'Documents',
		date: 'May 2026',
		image: '/assets/bohemcars/blog/registration-cover.png',
		excerpt:
			'Technical checks, coding, documents, and model-specific preparation are part of the real handoff.',
		content: [
			'For an imported vehicle, preparation does not stop at transport. Documents, technical requirements, and model-specific details need to be reviewed before registration.',
			'Some cars need lighting, navigation, coding, or other adjustments before European use.',
			'A clear offer should separate the next steps and expected costs before the buyer commits.'
		]
	},
	{
		slug: 'prodai-avtomobila-si',
		title: 'How Bohemcars Reviews A Client Vehicle',
		category: 'Sell your car',
		date: 'May 2026',
		image: '/assets/bohemcars/blog/sell-car-cover.png',
		excerpt:
			'Photos, VIN, service history, mileage, and expected price help the team give realistic feedback.',
		content: [
			'When a client wants to sell a vehicle, the first step is clear information: VIN, mileage, history, photos, and documents.',
			'After review, Bohemcars can discuss a direct offer, sale assistance, or publishing the car as a client vehicle.',
			'Good information at the beginning saves time and helps the price stay realistic.'
		]
	}
];

export function getPostBySlug(slug: string) {
	return posts.find((post) => post.slug === slug);
}
