import { bohemcarsContact, bohemcarsConsultants, bohemcarsFetchedAt } from '$lib/data/bohemcars';
import type { Vehicle } from '$lib/data/vehicles';
import { formatInventoryKm, formatInventoryMonthly } from './inventory';

export type AuxeroVehicleDetailOverviewItem = {
	icon: string;
	label: string;
	value: string;
};

export type AuxeroVehicleDetailFeatureTab = {
	items: string[];
	label: string;
};

export type AuxeroVehicleDetailConsultant = {
	image: string;
	name: string;
	slug: string;
};

export type AuxeroVehicleDetailContact = {
	address: string;
	email: string;
	marketplacePhoneHref: string;
	marketplacePhoneLabel: string;
	primaryPhoneHref: string;
	primaryPhoneLabel: string;
};

export type AuxeroVehicleDetailData = {
	consultant: AuxeroVehicleDetailConsultant;
	contact: AuxeroVehicleDetailContact;
	description: string;
	featureTabs: AuxeroVehicleDetailFeatureTab[];
	galleryImages: string[];
	image: string;
	monthlyLabel: string;
	overviewItems: AuxeroVehicleDetailOverviewItem[];
	priceBgn: string;
	priceLabel: string;
	slug: string;
	title: string;
};

const galleryImageCount = 7;

const detailFeatureTabs = (vehicle: Vehicle): AuxeroVehicleDetailFeatureTab[] => {
	const features = (
		vehicle.features.length
			? vehicle.features
			: ['Verified source listing', 'History review available', 'Viewing by appointment']
	).slice(0, 24);

	return [
		{ label: 'Equipment', items: features.slice(0, 12) },
		{ label: 'Comfort', items: features.slice(12, 24) },
		{
			label: 'History',
			items: ['Canada import review', 'Document trail review', 'Registration readiness discussion']
		},
		{
			label: 'Mechanical',
			items: [
				'Mechanical inspection can be arranged',
				vehicle.engine || 'Engine details on request'
			]
		},
		{
			label: 'Specs',
			items: [vehicle.fuel, vehicle.transmission, vehicle.bodyType].filter(Boolean)
		},
		{
			label: 'Notes',
			items: [
				bohemcarsContact.appointmentNote,
				bohemcarsFetchedAt
					? `Inventory refreshed ${bohemcarsFetchedAt}`
					: 'Inventory refreshed from Bohemcars source data'
			]
		}
	];
};

const overviewItems = (vehicle: Vehicle): AuxeroVehicleDetailOverviewItem[] => [
	{ icon: 'icon-gauge.svg', label: 'Mileage', value: formatInventoryKm(vehicle.mileage) },
	{ icon: 'calendar.svg', label: 'Year', value: String(vehicle.year) },
	{ icon: 'gaspump.svg', label: 'Fuel', value: vehicle.fuel },
	{ icon: 'palette.svg', label: 'Color', value: vehicle.exterior },
	{ icon: 'MapPin.svg', label: 'Location', value: vehicle.location },
	{ icon: 'Seatbelt.svg', label: 'Interior', value: vehicle.interior },
	{ icon: 'Frame.svg', label: 'Engine', value: vehicle.engine || 'On request' },
	{ icon: 'transmission-2.svg', label: 'Transmission', value: vehicle.transmission },
	{ icon: 'Barcode.svg', label: 'Source ID', value: vehicle.vin },
	{ icon: 'QrCode.svg', label: 'Stock Number', value: vehicle.stockNumber }
];

export const vehicleDetailFromVehicle = (vehicle: Vehicle): AuxeroVehicleDetailData => {
	const consultant =
		bohemcarsConsultants.find((agent) => agent.slug === vehicle.agentSlug) ??
		bohemcarsConsultants[0];

	return {
		consultant: {
			image: consultant.image,
			name: consultant.name,
			slug: consultant.slug
		},
		contact: {
			address: bohemcarsContact.addressLabel,
			email: bohemcarsContact.emailLabel,
			marketplacePhoneHref: bohemcarsContact.marketplacePhoneHref,
			marketplacePhoneLabel: bohemcarsContact.marketplacePhoneLabel,
			primaryPhoneHref: bohemcarsContact.primaryPhoneHref,
			primaryPhoneLabel: bohemcarsContact.primaryPhoneLabel
		},
		description:
			vehicle.description ||
			`${vehicle.title} is available through Bohemcars with source review and viewing by appointment.`,
		featureTabs: detailFeatureTabs(vehicle),
		galleryImages: Array.from({ length: galleryImageCount }, () => vehicle.image),
		image: vehicle.image,
		monthlyLabel: formatInventoryMonthly(vehicle.monthly),
		overviewItems: overviewItems(vehicle),
		priceBgn: vehicle.priceBgn || vehicle.condition,
		priceLabel: vehicle.priceLabel,
		slug: vehicle.slug,
		title: vehicle.title
	};
};
