import { bohemcarsConsultants, bohemcarsContact } from './bohemcars';

export interface Agent {
	slug: string;
	name: string;
	title: string;
	phone: string;
	email: string;
	image: string;
	rating: number;
	sales: number;
	bio: string;
}

const bios: Record<string, string> = {
	'bohemcars-sales':
		'Helps buyers choose between available cars, client vehicles, viewings, and next-step offers.',
	'bohemcars-import':
		'Coordinates Canada import requests, source checks, transport context, and realistic delivery steps.',
	'bohemcars-inspection':
		'Reviews history, documents, registration readiness, technical checks, and service context.'
};

export const agents: Agent[] = bohemcarsConsultants.map((consultant, index) => ({
	slug: consultant.slug,
	name: consultant.name,
	title: consultant.title,
	phone: bohemcarsContact.primaryPhoneLabel,
	email: bohemcarsContact.emailLabel,
	image: consultant.image,
	rating: 4.9,
	sales: [157, 126, 98][index] ?? 75,
	bio: bios[consultant.slug]
}));

export function getAgentBySlug(slug: string) {
	return agents.find((agent) => agent.slug === slug);
}
