import { getRelatedVehicles, getVehicleBySlug, vehicles, type Vehicle } from '$lib/data/vehicles';

export const vehicleDetailFallbackSlug = vehicles[0]?.slug ?? '21764342419542174';

export const getVehicleDetailBySlug = (slug: string) => getVehicleBySlug(slug);

export const getVehicleDetailOrFallback = (slug?: string) =>
	getVehicleBySlug(slug ?? vehicleDetailFallbackSlug) ?? vehicles[0];

export const getVehicleDetailRelated = (vehicle: Vehicle, limit = 4) =>
	getRelatedVehicles(vehicle, limit);
