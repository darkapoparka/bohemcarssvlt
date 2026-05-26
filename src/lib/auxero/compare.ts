import type { Vehicle } from '$lib/data/vehicles';
import { formatInventoryKm } from './inventory';

export type AuxeroCompareVehicle = {
	engine: string;
	exterior: string;
	fuel: string;
	image: string;
	interior: string;
	location: string;
	mileageLabel: string;
	priceLabel: string;
	slug: string;
	stockNumber: string;
	title: string;
	transmission: string;
	vin: string;
	year: number;
};

export type AuxeroCompareRow = {
	alt: string;
	icon: string;
	label: string;
	values: string[];
};

export const compareVehiclesFromVehicles = (vehicles: Vehicle[]): AuxeroCompareVehicle[] =>
	vehicles.map((vehicle) => ({
		engine: vehicle.engine || 'On request',
		exterior: vehicle.exterior || 'On request',
		fuel: vehicle.fuel,
		image: vehicle.image,
		interior: vehicle.interior || 'On request',
		location: vehicle.location,
		mileageLabel: formatInventoryKm(vehicle.mileage),
		priceLabel: vehicle.priceLabel,
		slug: vehicle.slug,
		stockNumber: vehicle.stockNumber,
		title: vehicle.title,
		transmission: vehicle.transmission,
		vin: vehicle.vin,
		year: vehicle.year
	}));

export const compareRowsFromVehicles = (vehicles: AuxeroCompareVehicle[]): AuxeroCompareRow[] => [
	{
		alt: 'mileage',
		icon: 'mileage.svg',
		label: 'Mileage',
		values: vehicles.map((vehicle) => vehicle.mileageLabel)
	},
	{
		alt: 'year',
		icon: 'years.svg',
		label: 'Years',
		values: vehicles.map((vehicle) => String(vehicle.year))
	},
	{
		alt: 'fuel',
		icon: 'gaspump.svg',
		label: 'Fuel',
		values: vehicles.map((vehicle) => vehicle.fuel)
	},
	{
		alt: 'color',
		icon: 'color.svg',
		label: 'Color',
		values: vehicles.map((vehicle) => vehicle.exterior)
	},
	{
		alt: 'location',
		icon: 'location.svg',
		label: 'Location',
		values: vehicles.map((vehicle) => vehicle.location)
	},
	{
		alt: 'interior',
		icon: 'interior.svg',
		label: 'Interior',
		values: vehicles.map((vehicle) => vehicle.interior)
	},
	{
		alt: 'engine',
		icon: 'engine.svg',
		label: 'Engine',
		values: vehicles.map((vehicle) => vehicle.engine)
	},
	{
		alt: 'transmission',
		icon: 'transmission.svg',
		label: 'Transmission',
		values: vehicles.map((vehicle) => vehicle.transmission)
	},
	{
		alt: 'source id',
		icon: 'VIN.svg',
		label: 'Source ID',
		values: vehicles.map((vehicle) => vehicle.vin)
	},
	{
		alt: 'stock number',
		icon: 'QrCode.svg',
		label: 'Stock Number',
		values: vehicles.map((vehicle) => vehicle.stockNumber)
	},
	{
		alt: 'price',
		icon: 'Payment.png',
		label: 'Price',
		values: vehicles.map((vehicle) => vehicle.priceLabel)
	}
];
