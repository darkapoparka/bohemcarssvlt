import type { Vehicle } from '$lib/data/vehicles';
import { translateVehicleTerm, type Locale } from '$lib/i18n/messages';
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

const compareFallback = (locale: Locale) => (locale === 'bg' ? 'По запитване' : 'On request');

const compareImageOverrides: Record<string, string> = {
	'21764342419542174': '/assets/bohemcars/megamenu/inventory-bmw-x5-cutout.webp',
	'21778068579001193': '/assets/bohemcars/megamenu/inventory-bmw-x4m-cutout-v2.webp'
};

export const compareVehiclesFromVehicles = (
	vehicles: Vehicle[],
	locale: Locale = 'en'
): AuxeroCompareVehicle[] =>
	vehicles.map((vehicle) => ({
		engine: vehicle.engine || compareFallback(locale),
		exterior: vehicle.exterior || compareFallback(locale),
		fuel: translateVehicleTerm(locale, 'fuels', vehicle.fuel),
		image: compareImageOverrides[vehicle.slug] ?? vehicle.image,
		interior: vehicle.interior || compareFallback(locale),
		location: vehicle.location,
		mileageLabel: formatInventoryKm(vehicle.mileage),
		priceLabel: vehicle.priceLabel,
		slug: vehicle.slug,
		stockNumber: vehicle.stockNumber,
		title: vehicle.title,
		transmission: translateVehicleTerm(locale, 'transmissions', vehicle.transmission),
		vin: vehicle.vin,
		year: vehicle.year
	}));

export const compareRowsFromVehicles = (
	vehicles: AuxeroCompareVehicle[],
	locale: Locale = 'en'
): AuxeroCompareRow[] => [
	{
		alt: locale === 'bg' ? 'пробег' : 'mileage',
		icon: 'mileage.svg',
		label: locale === 'bg' ? 'Пробег' : 'Mileage',
		values: vehicles.map((vehicle) => vehicle.mileageLabel)
	},
	{
		alt: locale === 'bg' ? 'година' : 'year',
		icon: 'years.svg',
		label: locale === 'bg' ? 'Година' : 'Years',
		values: vehicles.map((vehicle) => String(vehicle.year))
	},
	{
		alt: locale === 'bg' ? 'гориво' : 'fuel',
		icon: 'gaspump.svg',
		label: locale === 'bg' ? 'Гориво' : 'Fuel',
		values: vehicles.map((vehicle) => vehicle.fuel)
	},
	{
		alt: locale === 'bg' ? 'цвят' : 'color',
		icon: 'color.svg',
		label: locale === 'bg' ? 'Цвят' : 'Color',
		values: vehicles.map((vehicle) => vehicle.exterior)
	},
	{
		alt: locale === 'bg' ? 'локация' : 'location',
		icon: 'location.svg',
		label: locale === 'bg' ? 'Локация' : 'Location',
		values: vehicles.map((vehicle) => vehicle.location)
	},
	{
		alt: locale === 'bg' ? 'интериор' : 'interior',
		icon: 'interior.svg',
		label: locale === 'bg' ? 'Интериор' : 'Interior',
		values: vehicles.map((vehicle) => vehicle.interior)
	},
	{
		alt: locale === 'bg' ? 'двигател' : 'engine',
		icon: 'engine.svg',
		label: locale === 'bg' ? 'Двигател' : 'Engine',
		values: vehicles.map((vehicle) => vehicle.engine)
	},
	{
		alt: locale === 'bg' ? 'скорости' : 'transmission',
		icon: 'transmission.svg',
		label: locale === 'bg' ? 'Скорости' : 'Transmission',
		values: vehicles.map((vehicle) => vehicle.transmission)
	},
	{
		alt: locale === 'bg' ? 'id от източника' : 'source id',
		icon: 'VIN.svg',
		label: locale === 'bg' ? 'ID от източника' : 'Source ID',
		values: vehicles.map((vehicle) => vehicle.vin)
	},
	{
		alt: locale === 'bg' ? 'номер в наличност' : 'stock number',
		icon: 'QrCode.svg',
		label: locale === 'bg' ? 'Номер в наличност' : 'Stock Number',
		values: vehicles.map((vehicle) => vehicle.stockNumber)
	},
	{
		alt: locale === 'bg' ? 'цена' : 'price',
		icon: 'Payment.png',
		label: locale === 'bg' ? 'Цена' : 'Price',
		values: vehicles.map((vehicle) => vehicle.priceLabel)
	}
];
