import { describe, expect, it } from 'vitest';
import {
	auxeroSellMobileSteps,
	auxeroSellSteps,
	sellCarFormData,
	sellCarMobileCopy
} from './sell-your-car';

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

	it('keeps mobile-specific sell-car copy in the data layer', () => {
		expect(sellCarMobileCopy).toMatchObject({
			formTitle: 'Попълни за минута',
			logoAlt: 'Bohemcars',
			logoSrc: '/assets/bohemcars/brand/bohemcars-logo-concept-dark-green.webp',
			messageLabel: 'Пиши ни',
			submitLabel: 'Заяви оценка',
			stepsTitle: 'Как работи'
		});
		expect(auxeroSellMobileSteps.map((step) => step.title)).toEqual([
			'Данни',
			'Преглед',
			'Следващ ход'
		]);
		expect(sellCarFormData.fields.map((field) => field.mobileLabel)).toEqual([
			'VIN номер',
			'Пробег',
			'Очаквана цена',
			'Телефон'
		]);
	});
});
