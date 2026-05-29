import { bohemcarsContact, bohemcarsConsultants, bohemcarsFetchedAt } from '$lib/data/bohemcars';
import type { Vehicle } from '$lib/data/vehicles';
import {
	getMessages,
	localizeVehicleTermsInText,
	translateVehicleTerm,
	type DetailCopy,
	type Locale
} from '$lib/i18n/messages';
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
	copy: DetailCopy;
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

const detailFeatureTabs = (
	vehicle: Vehicle,
	locale: Locale = 'en'
): AuxeroVehicleDetailFeatureTab[] => {
	const features = (
		vehicle.features.length
			? vehicle.features
			: ['Verified source listing', 'History review available', 'Viewing by appointment']
	)
		.map((feature) => localizeVehicleTermsInText(locale, feature))
		.slice(0, 24);

	return [
		{ label: locale === 'bg' ? 'Оборудване' : 'Equipment', items: features.slice(0, 12) },
		{ label: locale === 'bg' ? 'Комфорт' : 'Comfort', items: features.slice(12, 24) },
		{
			label: locale === 'bg' ? 'История' : 'History',
			items:
				locale === 'bg'
					? ['Проверка при внос от Канада', 'Преглед на документи', 'Разговор за регистрация']
					: ['Canada import review', 'Document trail review', 'Registration readiness discussion']
		},
		{
			label: locale === 'bg' ? 'Техника' : 'Mechanical',
			items:
				locale === 'bg'
					? [
							'Може да се организира технически преглед',
							vehicle.engine || 'Детайли за двигателя по запитване'
						]
					: ['Mechanical inspection can be arranged', vehicle.engine || 'Engine details on request']
		},
		{
			label: locale === 'bg' ? 'Спецификации' : 'Specs',
			items: [
				translateVehicleTerm(locale, 'fuels', vehicle.fuel),
				translateVehicleTerm(locale, 'transmissions', vehicle.transmission),
				translateVehicleTerm(locale, 'bodyTypes', vehicle.bodyType)
			].filter(Boolean)
		},
		{
			label: locale === 'bg' ? 'Бележки' : 'Notes',
			items: [
				locale === 'bg'
					? 'Огледите се потвърждават предварително.'
					: bohemcarsContact.appointmentNote,
				bohemcarsFetchedAt
					? locale === 'bg'
						? `Наличността е обновена ${bohemcarsFetchedAt}`
						: `Inventory refreshed ${bohemcarsFetchedAt}`
					: locale === 'bg'
						? 'Наличността е обновена от източника на Bohemcars'
						: 'Inventory refreshed from Bohemcars source data'
			]
		}
	];
};

const overviewItems = (
	vehicle: Vehicle,
	locale: Locale = 'en'
): AuxeroVehicleDetailOverviewItem[] => [
	{
		icon: 'icon-gauge.svg',
		label: locale === 'bg' ? 'Пробег' : 'Mileage',
		value: formatInventoryKm(vehicle.mileage)
	},
	{ icon: 'calendar.svg', label: locale === 'bg' ? 'Година' : 'Year', value: String(vehicle.year) },
	{
		icon: 'gaspump.svg',
		label: locale === 'bg' ? 'Гориво' : 'Fuel',
		value: translateVehicleTerm(locale, 'fuels', vehicle.fuel)
	},
	{ icon: 'palette.svg', label: locale === 'bg' ? 'Цвят' : 'Color', value: vehicle.exterior },
	{ icon: 'MapPin.svg', label: locale === 'bg' ? 'Локация' : 'Location', value: vehicle.location },
	{
		icon: 'Seatbelt.svg',
		label: locale === 'bg' ? 'Интериор' : 'Interior',
		value: vehicle.interior
	},
	{
		icon: 'Frame.svg',
		label: locale === 'bg' ? 'Двигател' : 'Engine',
		value: vehicle.engine || (locale === 'bg' ? 'По запитване' : 'On request')
	},
	{
		icon: 'transmission-2.svg',
		label: locale === 'bg' ? 'Скорости' : 'Transmission',
		value: translateVehicleTerm(locale, 'transmissions', vehicle.transmission)
	},
	{
		icon: 'Barcode.svg',
		label: locale === 'bg' ? 'ID от източника' : 'Source ID',
		value: vehicle.vin
	},
	{
		icon: 'QrCode.svg',
		label: locale === 'bg' ? 'Номер в наличност' : 'Stock Number',
		value: vehicle.stockNumber
	}
];

export const vehicleDetailFromVehicle = (
	vehicle: Vehicle,
	locale: Locale = 'en'
): AuxeroVehicleDetailData => {
	const consultant =
		bohemcarsConsultants.find((agent) => agent.slug === vehicle.agentSlug) ??
		bohemcarsConsultants[0];
	const copy = getMessages(locale).detail;

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
		copy,
		description:
			localizeVehicleTermsInText(locale, vehicle.description) ||
			`${vehicle.title} ${copy.detailDescriptionFallback}`,
		featureTabs: detailFeatureTabs(vehicle, locale),
		galleryImages: Array.from({ length: galleryImageCount }, () => vehicle.image),
		image: vehicle.image,
		monthlyLabel: formatInventoryMonthly(vehicle.monthly, locale),
		overviewItems: overviewItems(vehicle, locale),
		priceBgn: vehicle.priceBgn || vehicle.condition,
		priceLabel: vehicle.priceLabel,
		slug: vehicle.slug,
		title: vehicle.title
	};
};
