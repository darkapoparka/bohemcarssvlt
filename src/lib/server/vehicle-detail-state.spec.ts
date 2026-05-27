import { describe, expect, it } from 'vitest';
import { vehicles } from '$lib/data/vehicles';
import {
	getVehicleDetailBySlug,
	getVehicleDetailOrFallback,
	getVehicleDetailRelated,
	vehicleDetailFallbackSlug
} from './vehicle-detail-state';

describe('vehicle-detail-state', () => {
	it('resolves the requested vehicle detail slug', () => {
		const vehicle = getVehicleDetailBySlug('21764342419542174');

		expect(vehicle?.title).toBe('BMW X5 40i M Sport Shadow Line');
	});

	it('keeps raw template fallback deterministic for compatibility routes', () => {
		expect(vehicleDetailFallbackSlug).toBe(vehicles[0]?.slug);
		expect(getVehicleDetailOrFallback('missing')?.slug).toBe(vehicles[0]?.slug);
		expect(getVehicleDetailOrFallback()?.slug).toBe(vehicles[0]?.slug);
	});

	it('returns related vehicles without repeating the current detail vehicle', () => {
		const vehicle = getVehicleDetailOrFallback('21764342419542174');
		const related = getVehicleDetailRelated(vehicle, 4);

		expect(related).toHaveLength(4);
		expect(related.every((item) => item.slug !== vehicle.slug)).toBe(true);
		expect(
			related.some((item) => item.brand === vehicle.brand || item.bodyType === vehicle.bodyType)
		).toBe(true);
	});
});
