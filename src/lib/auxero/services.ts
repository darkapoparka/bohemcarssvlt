import { bohemcarsAssets, bohemcarsContact } from '$lib/data/bohemcars';
import type { AuxeroPageBanner } from './page-banner';

export type AuxeroSupportService = {
	description: string;
	href: string;
	image: string;
	title: string;
};

export type AuxeroServicesContent = {
	cards: AuxeroSupportService[];
	cardsDescription: string;
	cardsTitle: string;
	contact: {
		checklist: string[];
		description: string;
		emailLabel: string;
		phoneHref: string;
		phoneLabel: string;
		secondaryPhoneHref: string;
		secondaryPhoneLabel: string;
		title: string;
		workNote: string;
	};
	hero: AuxeroPageBanner;
};

export type AuxeroServiceInputField = {
	active: boolean;
	id?: string;
	label: string;
	name: string;
	placeholder?: string;
	required?: boolean;
	type: 'date' | 'email' | 'tel' | 'text';
	value?: string;
};

export type AuxeroServiceFormData = {
	fields: AuxeroServiceInputField[];
	serviceLabel: string;
	serviceName: string;
	serviceOptions: string[];
	submitLabel: string;
	title: string;
	vehicleField: AuxeroServiceInputField;
};

export const auxeroServiceCards: AuxeroSupportService[] = [
	{
		title: 'Внос от Канада',
		description:
			'Подбор на автомобили с проследима история, ясни снимки и реалистична крайна цена преди покупка.',
		href: '/contact',
		image: '/assets/bohemcars/services/import-canada-banner-generated.png'
	},
	{
		title: 'Проверка на обява',
		description:
			'Преглед на VIN, пробег, история, оборудване, снимки и контекст на продавача преди решение.',
		href: '/compare',
		image: '/assets/bohemcars/services/evaluate-link-service.png'
	},
	{
		title: 'Продажба на автомобил',
		description:
			'Изпрати данни, документи, снимки и очаквания, за да изберем правилния път за продажба.',
		href: '/sell-your-car',
		image: '/assets/bohemcars/services/sell-car-service.png'
	},
	{
		title: 'Документи и регистрация',
		description: 'Съдействие за документи по внос, техническа подготовка, регистрация и предаване.',
		href: '/services',
		image: bohemcarsAssets.footerImage
	},
	{
		title: 'Огледи с уговорка',
		description:
			'Подготвени огледи, при които автомобилът, документите и консултантът са готови предварително.',
		href: '/contact',
		image: bohemcarsAssets.hero
	},
	{
		title: 'Сравнение на модели',
		description:
			'Сравняваме цена, пробег, оборудване, история, разходи и срокове за няколко кандидата.',
		href: '/compare',
		image: '/assets/bohemcars/cta/import-canada-banner-v2.png'
	}
];

export const auxeroServicesContent: AuxeroServicesContent = {
	cards: auxeroServiceCards,
	cardsDescription:
		'Практична подкрепа за покупка, внос, проверка, документи и продажба, без излишен шум.',
	cardsTitle: 'Услуги за покупка и внос',
	contact: {
		checklist: [
			'Специалисти по внос и документи',
			'Огледи само с уговорен час',
			'Ясни ориентировъчни разходи преди ангажимент',
			'Съдействие от заявка до предаване'
		],
		description:
			'Изпрати линк, VIN, бюджет, срок или заявка за продажба и Bohemcars ще подготви правилната следваща стъпка.',
		emailLabel: bohemcarsContact.emailLabel,
		phoneHref: bohemcarsContact.primaryPhoneHref,
		phoneLabel: bohemcarsContact.primaryPhoneLabel,
		secondaryPhoneHref: bohemcarsContact.marketplacePhoneHref,
		secondaryPhoneLabel: bohemcarsContact.marketplacePhoneLabel,
		title: 'Контакт за услуга',
		workNote: bohemcarsContact.appointmentNote
	},
	hero: {
		description:
			'Подбор, проверка, документи и реалистична крайна цена за автомобили от Канада, преди да стигнем до оглед.',
		eyebrow: 'Bohemcars услуги',
		image: '/assets/bohemcars/services/import-canada-banner-generated.png',
		title: 'Внос от Канада'
	}
};

export const serviceFormData: AuxeroServiceFormData = {
	fields: [
		{
			active: true,
			label: 'Име',
			name: 'name',
			placeholder: 'Вашето име',
			required: true,
			type: 'text'
		},
		{
			active: false,
			label: 'Имейл',
			name: 'email',
			placeholder: bohemcarsContact.emailLabel,
			required: true,
			type: 'email'
		},
		{
			active: false,
			label: 'Телефон',
			name: 'phone',
			placeholder: bohemcarsContact.primaryPhoneLabel,
			type: 'tel'
		},
		{
			active: false,
			label: 'Предпочитана дата',
			name: 'date',
			type: 'date'
		}
	],
	serviceLabel: 'Услуга',
	serviceName: 'service',
	serviceOptions: auxeroServiceCards.map((service) => service.title),
	submitLabel: 'Изпрати заявка',
	title: 'Заяви услуга',
	vehicleField: {
		active: false,
		label: 'Автомобил или VIN',
		name: 'vehicle',
		placeholder: 'Линк към автомобил или VIN',
		type: 'text'
	}
};

export const importRequestSteps = [
	{
		title: 'Линк или VIN',
		text: 'Изпрати конкретната обява, VIN или кратко описание на автомобила, който искаш да внесеш.'
	},
	{
		title: 'Проверка',
		text: 'Bohemcars преглежда история, снимки, продавач, пробег, оборудване и реалистични разходи.'
	},
	{
		title: 'Следващ ход',
		text: 'Получаваш практичен отговор: струва ли си, какъв е рискът и как продължава вносът.'
	}
] as const;

export const importRequestFormData = (vehicle = ''): AuxeroServiceFormData => ({
	...serviceFormData,
	fields: serviceFormData.fields.map((field) =>
		field.name === 'phone' ? { ...field, active: true, required: true } : { ...field }
	),
	serviceOptions: ['Внос от Канада', 'Проверка на обява'],
	submitLabel: 'Изпрати за проверка',
	title: 'Провери автомобил за внос',
	vehicleField: {
		...serviceFormData.vehicleField,
		active: true,
		placeholder: 'Линк към обява от Канада или VIN',
		required: true,
		value: vehicle
	}
});
