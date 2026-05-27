import { describe, expect, it } from 'vitest';
import { agents } from '$lib/data/agents';
import {
	agentDetailFallbackSlug,
	getAgentDetailBySlug,
	getAgentDetailOrFallback,
	getAgentInventoryState,
	listAgentDetails
} from './agent-detail-state';

describe('agent-detail-state', () => {
	it('lists the public Bohemcars consultants', () => {
		expect(listAgentDetails().map((agent) => agent.slug)).toEqual(
			agents.map((agent) => agent.slug)
		);
		expect(listAgentDetails()).toHaveLength(3);
	});

	it('resolves the requested agent detail slug', () => {
		const agent = getAgentDetailBySlug('bohemcars-import');

		expect(agent?.name).toBe('Bohemcars Import');
		expect(agent?.title).toBe('Canada Import Consultant');
	});

	it('keeps raw template fallback deterministic for compatibility routes', () => {
		expect(agentDetailFallbackSlug).toBe(agents[0]?.slug);
		expect(getAgentDetailOrFallback('missing')?.slug).toBe(agents[0]?.slug);
		expect(getAgentDetailOrFallback()?.slug).toBe(agents[0]?.slug);
	});

	it('returns an agent inventory list without exceeding the detail-card limit', () => {
		const agent = getAgentDetailOrFallback('bohemcars-import');
		const inventory = getAgentInventoryState(agent, 3);

		expect(inventory.vehicles).toHaveLength(3);
		expect(inventory.count).toBeGreaterThanOrEqual(inventory.vehicles.length);
		expect(inventory.vehicles.every((vehicle) => vehicle.agentSlug === agent.slug)).toBe(true);
	});
});
