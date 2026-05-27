import { describe, expect, it } from 'vitest';
import { vehicles } from '$lib/data/vehicles';
import {
	getInventoryState,
	inventoryTemplateForView,
	resolveInventoryView,
	viewForInventoryTemplate
} from './inventory-state';

describe('inventory-state', () => {
	it('resolves Auxero inventory views and source templates', () => {
		expect(resolveInventoryView(null)).toBe('3');
		expect(resolveInventoryView('dense')).toBe('4');
		expect(resolveInventoryView('grid4')).toBe('4');
		expect(resolveInventoryView('half-map')).toBe('map');
		expect(inventoryTemplateForView('3')).toBe('listing-grid3-columns.html');
		expect(inventoryTemplateForView('4')).toBe('listing-grid4-columns.html');
		expect(inventoryTemplateForView('map')).toBe('listing-gridstyle-halfmap.html');
	});

	it('lets query params override the template-derived view', () => {
		const searchParams = new URLSearchParams('view=map');

		expect(viewForInventoryTemplate('listing-grid4-columns.html', { searchParams })).toBe('map');
		expect(viewForInventoryTemplate('listing-topmap.html')).toBe('map');
	});

	it('normalizes inventory aliases and filters Bohemcars vehicles', () => {
		const state = getInventoryState('listing-grid3-columns.html', {
			searchParams: new URLSearchParams('brand=BMW&FuelType=Petrol&bodyType=All')
		});

		expect(state.filters).toMatchObject({ brand: 'BMW', fuel: 'Petrol' });
		expect(state.filters.bodyType).toBeUndefined();
		expect(state.selected.length).toBeGreaterThan(0);
		expect(state.selected.every((vehicle) => vehicle.brand === 'BMW')).toBe(true);
		expect(state.selected.every((vehicle) => vehicle.fuel === 'Petrol')).toBe(true);
	});

	it('sorts selected vehicles from typed state rather than adapter markup', () => {
		const state = getInventoryState('listing-grid3-columns.html', {
			searchParams: new URLSearchParams('sort=lowest-price')
		});

		const expectedLowest = [...vehicles].sort((left, right) => left.price - right.price)[0];

		expect(state.sort).toBe('lowest');
		expect(state.sortParam).toBe('lowest-price');
		expect(state.selected[0]?.slug).toBe(expectedLowest?.slug);
	});
});
