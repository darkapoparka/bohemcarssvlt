import type { Agent } from '$lib/data/agents';
import { bohemcarsContact } from '$lib/data/bohemcars';

export type AuxeroAgentSocialLink = {
	href: string;
	icon: string;
	label: string;
};

export type AuxeroAgentCard = {
	active: boolean;
	emailHref: string;
	image: string;
	name: string;
	phoneHref: string;
	slug: string;
	socials: AuxeroAgentSocialLink[];
	title: string;
};

const agentSocials = (): AuxeroAgentSocialLink[] => [
	{ href: bohemcarsContact.facebookHref, icon: 'input-facebook.svg', label: 'Facebook' },
	{ href: bohemcarsContact.viberHref, icon: 'ChatCircleDots.svg', label: 'Viber' },
	{ href: bohemcarsContact.youtubeHref, icon: 'input-youtube.svg', label: 'YouTube' },
	{ href: bohemcarsContact.emailHref, icon: 'input-telegram.svg', label: 'Email' }
];

export const agentCardsFromAgents = (agents: Agent[]): AuxeroAgentCard[] =>
	agents.map((agent, index) => ({
		active: index === 1,
		emailHref: bohemcarsContact.emailHref,
		image: agent.image,
		name: agent.name,
		phoneHref: bohemcarsContact.primaryPhoneHref,
		slug: agent.slug,
		socials: agentSocials(),
		title: agent.title
	}));
