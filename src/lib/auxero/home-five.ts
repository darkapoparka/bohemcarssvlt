import { bohemcarsAssets } from '$lib/data/bohemcars';
import type { Vehicle } from '$lib/data/vehicles';

export type HomeFiveBrandCard = {
	count: string;
	image: string;
	name: string;
	query: string;
};

export type HomeFiveTypeCard = {
	bodyType: string;
	image: string;
	label: string;
};

export type HomeFiveCompareVehicle = {
	brand: string;
	image: string;
	priceLabel: string;
	slug: string;
	title: string;
};

export type HomeFiveComparePair = {
	left: HomeFiveCompareVehicle;
	right: HomeFiveCompareVehicle;
};

export const homeFiveBrandCards: HomeFiveBrandCard[] = [
	{ name: 'BMW', image: '/assets/images/brand/brand-1.png', count: '18 Vehicles', query: 'BMW' },
	{
		name: 'Mercedes',
		image: '/assets/images/brand/brand-2.png',
		count: '22 Vehicles',
		query: 'Mercedes-Benz'
	},
	{ name: 'Audi', image: '/assets/images/brand/brand-3.png', count: '38 Vehicles', query: 'Audi' },
	{
		name: 'Honda',
		image: '/assets/images/brand/brand-4.png',
		count: '29 Vehicles',
		query: 'Honda'
	},
	{
		name: 'Toyota',
		image: '/assets/images/brand/brand-5.png',
		count: '23 Vehicles',
		query: 'Toyota'
	},
	{
		name: 'Volvo',
		image: '/assets/images/brand/brand-6.png',
		count: '32 Vehicles',
		query: 'Volvo'
	},
	{ name: 'Ford', image: '/assets/images/brand/brand-7.png', count: '24 Vehicles', query: 'Ford' },
	{
		name: 'Hyundai',
		image: '/assets/images/brand/brand-8.png',
		count: '22 Vehicles',
		query: 'Hyundai'
	},
	{ name: 'Kia', image: '/assets/images/brand/brand-9.png', count: '14 Vehicles', query: 'Kia' },
	{
		name: 'Mazda',
		image: '/assets/images/brand/brand-10.png',
		count: '32 Vehicles',
		query: 'Mazda'
	},
	{
		name: 'Ferrari',
		image: '/assets/images/brand/brand-11.png',
		count: '24 Vehicles',
		query: 'Ferrari'
	},
	{
		name: 'Tesla',
		image: '/assets/images/brand/brand-12.png',
		count: '27 Vehicles',
		query: 'Tesla'
	}
];

export const homeFiveTypeCards: HomeFiveTypeCard[] = [
	{ label: 'SUV', image: '/assets/images/card/card-37.jpg', bodyType: 'SUV' },
	{ label: 'SUV', image: '/assets/images/card/card-38.jpg', bodyType: 'SUV' },
	{ label: 'Pickup Truck', image: '/assets/images/card/card-39.jpg', bodyType: 'Pickup Truck' },
	{ label: 'Sedan', image: '/assets/images/card/card-40.jpg', bodyType: 'Sedan' },
	{ label: 'Hatchback', image: '/assets/images/card/card-41.jpg', bodyType: 'Hatchback' },
	{ label: 'Crossover', image: '/assets/images/card/card-42.jpg', bodyType: 'Crossover' }
];

const brokenHomeImageSlugs = new Set(['21779200396408437']);

export const imageForHomeFiveVehicle = (vehicle: Vehicle) =>
	brokenHomeImageSlugs.has(vehicle.slug) ? bohemcarsAssets.hero : vehicle.image;

const compareVehicleFrom = (vehicle: Vehicle): HomeFiveCompareVehicle => ({
	brand: vehicle.brand,
	image: imageForHomeFiveVehicle(vehicle),
	priceLabel: vehicle.priceLabel,
	slug: vehicle.slug,
	title: vehicle.title
});

export function homeFiveComparePairsFromVehicles(vehicles: Vehicle[]): HomeFiveComparePair[] {
	return [
		[vehicles[0], vehicles[1]],
		[vehicles[2], vehicles[3]]
	]
		.filter((pair): pair is [Vehicle, Vehicle] => Boolean(pair[0] && pair[1]))
		.map(([left, right]) => ({
			left: compareVehicleFrom(left),
			right: compareVehicleFrom(right)
		}));
}
