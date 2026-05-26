import { auxeroReviewCards, type AuxeroReviewCard } from '$lib/auxero/reviews';
import { agents } from '$lib/data/agents';
import { bohemcarsAssets, bohemcarsContact } from '$lib/data/bohemcars';
import { brands, vehicles } from '$lib/data/vehicles';

export type AuxeroAboutConsultant = {
	image: string;
	name: string;
	slug: string;
	title: string;
};

export type AuxeroAboutContent = {
	assets: {
		hero: string;
	};
	consultants: AuxeroAboutConsultant[];
	contact: {
		primaryPhoneHref: string;
		primaryPhoneLabel: string;
	};
	intro: {
		checklist: string[];
		description: string;
		heading: string;
		mainImageAlt: string;
		subImage: string;
		subImageAlt: string;
		title: string;
	};
	reviews: AuxeroReviewCard[];
	stats: AuxeroAboutStat[];
	why: {
		checklist: string[];
		description: string;
		heading: string;
		image: string;
		imageAlt: string;
	};
};

export type AuxeroAboutStat = {
	label: string;
	suffix: string;
	value: string;
};

export const auxeroAboutContent: AuxeroAboutContent = {
	assets: {
		hero: bohemcarsAssets.hero
	},
	consultants: agents.map((agent) => ({
		image: agent.image,
		name: agent.name,
		slug: agent.slug,
		title: agent.title
	})),
	contact: {
		primaryPhoneHref: bohemcarsContact.primaryPhoneHref,
		primaryPhoneLabel: bohemcarsContact.primaryPhoneLabel
	},
	intro: {
		title: 'About Bohemcars',
		heading: 'Canada-sourced vehicles, checked before the decision',
		description:
			'Bohemcars helps buyers and sellers work through vehicle history, import context, documents, appointments, and realistic landed-cost expectations.',
		checklist: [
			'Canada import and document experience',
			'Transparent estimates and vehicle-specific review',
			'Prepared handoff with appointment-based support'
		],
		mainImageAlt: 'Bohemcars showroom',
		subImage: '/assets/bohemcars/proof-studio-import-handoff.png',
		subImageAlt: 'Bohemcars handoff'
	},
	reviews: auxeroReviewCards.slice(0, 4),
	stats: [
		{ value: String(vehicles.length), suffix: '', label: 'Bohemcars Listings' },
		{ value: String(brands.length), suffix: '', label: 'Brands In Stock' },
		{ value: '98', suffix: '%', label: 'Facebook Recommendations' },
		{ value: '157', suffix: '', label: 'Public Reviews' }
	],
	why: {
		heading: 'Why Choose Bohemcars?',
		description:
			'The work is practical: verify the vehicle, understand the cost, prepare the documents, and keep the client decision calm.',
		checklist: [
			'Verified origin and document review',
			'Clear landed-cost estimates',
			'Vehicle-specific service and registration context',
			'Consultants who handle import, inspection, and sales questions'
		],
		image: '/assets/bohemcars/cta/import-canada-banner.png',
		imageAlt: 'Why choose Bohemcars'
	}
};
