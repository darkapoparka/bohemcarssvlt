import { describe, expect, it } from 'vitest';
import { getAgentBySlug } from './agents';
import { getPostBySlug } from './blog';
import { getDealerBySlug } from './dealers';

describe('route lookup helpers', () => {
	it('finds dealer detail records', () => {
		expect(getDealerBySlug('bohemcars-plovdiv')?.name).toBe('Bohemcars');
	});

	it('finds sales agent detail records', () => {
		expect(getAgentBySlug('bohemcars-sales')?.title).toBe('Vehicle Consultant');
	});

	it('finds blog detail records', () => {
		expect(getPostBySlug('vnos-ot-kanada-proverka')?.category).toBe('Внос от Канада');
	});
});
