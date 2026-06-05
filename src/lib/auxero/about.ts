import { auxeroReviewCards, type AuxeroReviewCard } from '$lib/auxero/reviews';
import { agentCardsFromAgents, type AuxeroAgentCard } from '$lib/auxero/agents';
import { agents } from '$lib/data/agents';
import { bohemcarsAssets, bohemcarsContact } from '$lib/data/bohemcars';
import { brands, vehicles } from '$lib/data/vehicles';
import type { AuxeroPageBanner } from './page-banner';

export type AuxeroAboutBrandCard = {
	count: string;
	href: string;
	image: string;
	name: string;
};

export type AuxeroAboutOffice = {
	address: string;
	appointment: string;
	description: string;
	email: string;
	emailHref: string;
	heading: string;
	hours: string;
	mapEmbedUrl: string;
	mapHref: string;
	phone: string;
	phoneHref: string;
	secondaryPhone: string;
	secondaryPhoneHref: string;
};

export type AuxeroAboutContent = {
	assets: {
		hero: string;
	};
	brands: AuxeroAboutBrandCard[];
	consultants: AuxeroAgentCard[];
	contact: {
		primaryPhoneHref: string;
		primaryPhoneLabel: string;
	};
	hero: AuxeroPageBanner;
	intro: {
		checklist: string[];
		description: string;
		heading: string;
		mainImageAlt: string;
		subImage: string;
		subImageAlt: string;
		title: string;
	};
	office: AuxeroAboutOffice;
	profile: {
		description: string;
		eyebrow: string;
		highlights: string[];
		heading: string;
		statement: string;
		steps: {
			description: string;
			image: string;
			title: string;
		}[];
	};
	process: {
		description: string;
		title: string;
	}[];
	reviews: AuxeroReviewCard[];
	stats: AuxeroAboutStat[];
	why: {
		checklist: string[];
		description: string;
		heading: string;
		image: string;
		imageAlt: string;
	};
};

export type AuxeroAboutStat = {
	label: string;
	suffix: string;
	value: string;
};

const brandLogos: Record<string, string> = {
	Audi: '/assets/bohemcars/brands/audi.png',
	BMW: '/assets/bohemcars/brands/bmw.png',
	Ford: '/assets/bohemcars/brands/ford.png',
	Mazda: '/assets/bohemcars/brands/mazda.png',
	'Mercedes-Benz': '/assets/bohemcars/brands/mercedes-benz.png',
	Porsche: '/assets/bohemcars/brands/porsche.png',
	Toyota: '/assets/bohemcars/brands/toyota.png',
	Volkswagen: '/assets/bohemcars/brands/volkswagen.png'
};

const vehicleCountLabel = (count: number) => {
	if (count === 0) return 'внос по заявка';

	return `${count} ${count === 1 ? 'автомобил' : 'автомобила'}`;
};

const aboutBrandCards: AuxeroAboutBrandCard[] = Object.entries(brandLogos).map(
	([brand, image]) => ({
		count: vehicleCountLabel(vehicles.filter((vehicle) => vehicle.brand === brand).length),
		href: `/inventory?brand=${encodeURIComponent(brand)}`,
		image,
		name: brand
	})
);

export const auxeroAboutContent: AuxeroAboutContent = {
	assets: {
		hero: bohemcarsAssets.hero
	},
	brands: aboutBrandCards,
	consultants: agentCardsFromAgents(agents),
	contact: {
		primaryPhoneHref: bohemcarsContact.primaryPhoneHref,
		primaryPhoneLabel: bohemcarsContact.primaryPhoneLabel
	},
	hero: {
		actions: [
			{ href: '/inventory', label: 'Виж автомобили' },
			{ href: '/contact', label: 'Свържете се', variant: 'secondary' }
		],
		description:
			'Автомобили от Канада, проверка по конкретен VIN, документи и оглед с ясен следващ ход.',
		eyebrow: 'За Bohemcars',
		image: '/assets/bohemcars/hero/about-import-banner-generated.png',
		title: 'Bohemcars: автомобили от Канада'
	},
	intro: {
		title: 'Какво проверяваме',
		heading: 'Услуги около внос, оглед и продажба',
		description:
			'Работата е практична и последователна: намираме правилния автомобил, проверяваме историята и документите, уточняваме разходите и подготвяме оглед или предаване без излишен шум.',
		checklist: [
			'VIN, снимки, история, пробег и сервизни следи',
			'Транспорт, мита, ДДС, подготовка и регистрация',
			'Огледи, документи и предаване с предварителна уговорка'
		],
		mainImageAlt: 'Bohemcars showroom',
		subImage: '/assets/bohemcars/proof-studio-import-handoff.png',
		subImageAlt: 'Bohemcars handoff'
	},
	office: {
		address: bohemcarsContact.addressLabel,
		appointment: bohemcarsContact.appointmentNote,
		description:
			'Огледите са с уговорка, за да има време за конкретния автомобил, документи, история и следваща стъпка.',
		email: bohemcarsContact.emailLabel,
		emailHref: bohemcarsContact.emailHref,
		heading: 'Огледи и предаване в Пловдив',
		hours: 'Понеделник-петък: 9:00 - 18:00',
		mapEmbedUrl: bohemcarsContact.mapEmbedUrl,
		mapHref:
			'https://www.google.com/maps/search/?api=1&query=BohemCars%20Plovdiv%20South%20Industrial%20Zone',
		phone: bohemcarsContact.primaryPhoneLabel,
		phoneHref: bohemcarsContact.primaryPhoneHref,
		secondaryPhone: bohemcarsContact.marketplacePhoneLabel,
		secondaryPhoneHref: bohemcarsContact.marketplacePhoneHref
	},
	profile: {
		eyebrow: 'Екип и история',
		heading: 'Пловдивски екип за автомобили от Канада',
		description:
			'Bohemcars работи около конкретния автомобил: налична кола, линк от Канада, VIN, документи, ориентир за крайни разходи, оглед и предаване.',
		statement:
			'Целта е клиентът да знае какво гледа, колко реално струва и каква е следващата стъпка преди ангажимент.',
		highlights: [
			'Внос от Канада',
			'Проверка по VIN и история',
			'Документи, разходи и оглед с уговорка'
		],
		steps: [
			{
				title: 'Внос от Канада',
				image: '/assets/bohemcars/services/import-canada-service.png',
				description:
					'Работа по конкретен модел, бюджет, срок и реалистична крайна цена до България.'
			},
			{
				title: 'Налични автомобили',
				image: '/assets/bohemcars/home2/home2-action-buy.png',
				description: 'Огледи с уговорка, контекст за произход, състояние, пробег и следващи стъпки.'
			},
			{
				title: 'Проверка и документи',
				image: '/assets/bohemcars/services/evaluate-link-service.png',
				description:
					'Преглед на VIN, история, снимки, сервизни следи, документи и готовност за регистрация.'
			},
			{
				title: 'Продажба и предаване',
				image: '/assets/bohemcars/services/sell-car-service.png',
				description:
					'Съдействие при клиентски автомобили, подготвяне на оглед, документи и спокойно предаване.'
			}
		]
	},
	process: [
		{
			title: '1. Заявка',
			description: 'Изпращате линк, VIN, бюджет или модел, който търсите.'
		},
		{
			title: '2. Проверка',
			description: 'Екипът гледа история, снимки, пробег, документи и реални разходи.'
		},
		{
			title: '3. Решение',
			description: 'Получавате ясен контекст дали автомобилът си струва следваща стъпка.'
		},
		{
			title: '4. Оглед и предаване',
			description: 'Организираме оглед, документи, регистрация или продажба с уговорка.'
		}
	],
	reviews: auxeroReviewCards.slice(0, 4),
	stats: [
		{ value: String(vehicles.length), suffix: '', label: 'Автомобила в наличност' },
		{ value: String(brands.length), suffix: '', label: 'Марки в инвентара' },
		{ value: '98', suffix: '%', label: 'Препоръки във Facebook' },
		{ value: '157', suffix: '', label: 'Публични отзива' }
	],
	why: {
		heading: 'Как работи процесът преди оглед или внос?',
		description:
			'Покупката или вносът не се решават само по снимка. Екипът събира контекст за произход, документи, разходи и готовност за регистрация, след което клиентът получава ясен следващ ход.',
		checklist: [
			'Подбор според бюджет, модел и очакван срок',
			'Проверка по VIN, история, снимки и документи',
			'Контекст за транспорт, мита, ДДС, подготовка и регистрация',
			'Оглед, продажба на клиентски автомобил и предаване с уговорка'
		],
		image: '/assets/bohemcars/cta/import-canada-banner.png',
		imageAlt: 'Why choose Bohemcars'
	}
};
