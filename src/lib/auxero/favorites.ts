import type { Vehicle } from '$lib/data/vehicles';
import { formatInventoryKm } from './inventory';

export type AuxeroFavoriteVehicleCard = {
	brand: string;
	fuel: string;
	highlightClass: string;
	image: string;
	imagesCount: number;
	mileageLabel: string;
	priceLabel: string;
	slug: string;
	tag: string;
	title: string;
	transmission: string;
	videoCount: number;
	year: number;
};

const favoriteHighlightClass = (index: number) => (index % 2 === 0 ? 'bg-primary-2' : 'bg-green');

export const favoriteCardsFromVehicles = (vehicles: Vehicle[]): AuxeroFavoriteVehicleCard[] =>
	vehicles.map((vehicle, index) => ({
		brand: vehicle.brand,
		fuel: vehicle.fuel,
		highlightClass: favoriteHighlightClass(index),
		image: vehicle.image,
		imagesCount: vehicle.images.length || 1,
		mileageLabel: formatInventoryKm(vehicle.mileage),
		priceLabel: vehicle.priceLabel,
		slug: vehicle.slug,
		tag: vehicle.tag ?? 'Available',
		title: vehicle.title,
		transmission: vehicle.transmission,
		videoCount: 0,
		year: vehicle.year
	}));
