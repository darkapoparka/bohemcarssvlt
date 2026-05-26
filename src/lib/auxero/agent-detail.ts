import type { Agent } from '$lib/data/agents';
import { vehicles } from '$lib/data/vehicles';
import { inventoryCardsFromVehicles, type AuxeroInventoryVehicleCard } from './inventory';

export type AuxeroAgentDetailContent = {
	bio: string;
	image: string;
	inventoryCards: AuxeroInventoryVehicleCard[];
	inventoryHeading: string;
	name: string;
	summary: string;
	verifiedLabel: string;
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
		summary: agentDetailSummary,
		verifiedLabel: 'Verified Bohemcars Consultant'
	};
};
