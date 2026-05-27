import { describe, expect, it } from 'vitest';
import { homeFiveVehiclePills } from './home-five';

describe('homeFiveVehiclePills', () => {
	it('keeps the Home 05 body-style pills as shared typed route data', () => {
		expect(homeFiveVehiclePills).toEqual([
			{ active: true, href: '/inventory?bodyType=SUV', label: 'SUV' },
			{ active: false, href: '/inventory?bodyType=Sedan', label: 'Sedan' },
			{ active: false, href: '/inventory?bodyType=Coupe', label: 'Coupe' },
			{ active: false, href: '/inventory?bodyType=Luxury', label: 'Luxury' }
		]);
	});
});
