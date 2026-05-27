import { describe, expect, it } from 'vitest';
import { auxeroSellSteps, sellCarFormData } from './sell-your-car';

describe('auxeroSellSteps', () => {
	it('keeps the sell-your-car workflow content outside the raw adapter', () => {
		expect(auxeroSellSteps).toHaveLength(4);
		expect(auxeroSellSteps.map((step) => step.title)).toEqual([
			'Send Vehicle Details',
			'Review History And Condition',
			'Choose The Sale Path',
			'Complete The Handoff'
		]);
		expect(sellCarFormData.submitLabel).toBe('Request Review');
	});
});
