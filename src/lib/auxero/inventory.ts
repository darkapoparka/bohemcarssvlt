import type { Vehicle } from '$lib/data/vehicles';

export type AuxeroInventoryView = '3' | '4' | 'map';

export type AuxeroInventoryVehicleCard = {
	brand: string;
	delay: string;
	description: string;
	fuel: string;
	highlightClass: string;
	image: string;
	imagesCount: number;
	mileageLabel: string;
	monthlyLabel: string;
	priceLabel: string;
	slug: string;
	tag: string;
	title: string;
	transmission: string;
	videoCount: number;
	year: number;
};

export const formatInventoryKm = (value: number) =>
	`${value.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} km`;

export const formatInventoryMonthly = (value: number) =>
	`${value.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} EUR/mo`;

export const inventoryCardHighlightClass = (vehicle: Vehicle, index: number) => {
	if (vehicle.isClientVehicle) return 'bg-primary-2';
	if (vehicle.tag === 'New listing') return 'bg-green';

	return index % 4 === 0 ? 'bg-primary-2' : 'bg-green';
};

export const inventoryGridClassForView = (view: AuxeroInventoryView) => {
	if (view === '4') {
		return 'grid grid-cols-4 xl-grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-41';
	}

	if (view === 'map') {
		return 'grid grid-cols-1 gap-20';
	}

	return 'grid grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-41';
};

export const inventoryCardsFromVehicles = (vehicles: Vehicle[]): AuxeroInventoryVehicleCard[] =>
	vehicles.map((vehicle, index) => ({
		brand: vehicle.brand,
		delay: `0.${(index % 4) + 1}s`,
		description: vehicle.description,
		fuel: vehicle.fuel,
		highlightClass: inventoryCardHighlightClass(vehicle, index),
		image: vehicle.image,
		imagesCount: vehicle.images.length || 1,
		mileageLabel: formatInventoryKm(vehicle.mileage),
		monthlyLabel: formatInventoryMonthly(vehicle.monthly),
		priceLabel: vehicle.priceLabel,
		slug: vehicle.slug,
		tag: vehicle.tag ?? 'Available',
		title: vehicle.title,
		transmission: vehicle.transmission,
		videoCount: 0,
		year: vehicle.year
	}));
