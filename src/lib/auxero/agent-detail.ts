import type { Agent } from '$lib/data/agents';
import { bohemcarsContact } from '$lib/data/bohemcars';
import { vehicles } from '$lib/data/vehicles';
import { inventoryCardsFromVehicles, type AuxeroInventoryVehicleCard } from './inventory';

export type AuxeroAgentDetailContent = {
	bio: string;
	image: string;
	inventoryCards: AuxeroInventoryVehicleCard[];
	inventoryHeading: string;
	name: string;
	sidebar: AuxeroAgentDetailSidebar;
	summary: string;
	verifiedLabel: string;
};

export type AuxeroAgentDetailSidebar = {
	address: string;
	callHref: string;
	callLabel: string;
	consentLabel: string;
	formTitle: string;
	mapSrc: string;
	messagePlaceholder: string;
	phone: string;
	subjectOptions: string[];
	submitLabel: string;
	termsLabel: string;
	viberHref: string;
	viberLabel: string;
};

const agentDetailSummary =
	'Bohemcars keeps every conversation practical: source details, inspection context, import or registration steps, and viewing appointments are confirmed before the next commitment.';

export const agentDetailFromAgent = (agent: Agent): AuxeroAgentDetailContent => {
	const matchingVehicles = vehicles.filter((vehicle) => vehicle.agentSlug === agent.slug);
	const visibleVehicles = matchingVehicles.slice(0, 3);
	const inventoryVehicles = visibleVehicles.length ? visibleVehicles : vehicles.slice(0, 3);
	const inventoryCount = matchingVehicles.length || vehicles.length;

	return {
		bio: agent.bio,
		image: agent.image,
		inventoryCards: inventoryCardsFromVehicles(inventoryVehicles),
		inventoryHeading: `Bohemcars Inventory (${inventoryCount})`,
		name: agent.name,
		sidebar: {
			address: bohemcarsContact.addressLabel,
			callHref: bohemcarsContact.primaryPhoneHref,
			callLabel: 'Обади се на Bohemcars',
			consentLabel:
				'Yes, I would like to receive price alerts on this vehicle and helpful shopping information.',
			formTitle: `Изпрати запитване to ${agent.name}`,
			mapSrc: bohemcarsContact.mapEmbedUrl,
			messagePlaceholder: 'Comment',
			phone: bohemcarsContact.primaryPhoneLabel,
			subjectOptions: [
				'Наличност на автомобила',
				'Наличност на автомобила 2',
				'Наличност на автомобила 3'
			],
			submitLabel: 'Изпрати запитване',
			termsLabel: 'Visitor Agreement.',
			viberHref: bohemcarsContact.viberHref,
			viberLabel: 'Пиши във Viber'
		},
		summary: agentDetailSummary,
		verifiedLabel: 'Verified Bohemcars Consultant'
	};
};
