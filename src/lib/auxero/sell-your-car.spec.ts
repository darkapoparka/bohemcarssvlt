import { describe, expect, it } from 'vitest';
import { auxeroSellSteps, sellCarFormData } from './sell-your-car';

describe('auxeroSellSteps', () => {
	it('keeps the sell-your-car workflow content outside the raw adapter', () => {
		expect(auxeroSellSteps).toHaveLength(4);
		expect(auxeroSellSteps.map((step) => step.title)).toEqual([
			'Изпрати данни за автомобила',
			'Проверка на история и състояние',
			'Избор на път за продажба',
			'Финализиране и предаване'
		]);
		expect(sellCarFormData.submitLabel).toBe('Заяви преглед');
	});
});
