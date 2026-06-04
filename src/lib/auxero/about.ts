import { auxeroReviewCards, type AuxeroReviewCard } from '$lib/auxero/reviews';
import { agentCardsFromAgents, type AuxeroAgentCard } from '$lib/auxero/agents';
import { agents } from '$lib/data/agents';
import { bohemcarsAssets, bohemcarsContact } from '$lib/data/bohemcars';
import { brands, vehicles } from '$lib/data/vehicles';
import type { AuxeroPageBanner } from './page-banner';

export type AuxeroAboutContent = {
	assets: {
		hero: string;
	};
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
	profile: {
		description: string;
		eyebrow: string;
		highlights: string[];
		heading: string;
		statement: string;
		steps: {
			description: string;
			title: string;
		}[];
	};
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

export const auxeroAboutContent: AuxeroAboutContent = {
	assets: {
		hero: bohemcarsAssets.hero
	},
	consultants: agentCardsFromAgents(agents),
	contact: {
		primaryPhoneHref: bohemcarsContact.primaryPhoneHref,
		primaryPhoneLabel: bohemcarsContact.primaryPhoneLabel
	},
	hero: {
		description:
			'Автомобили от Канада, проверка по конкретен VIN, документи и оглед с ясен следващ ход.',
		eyebrow: 'За Bohemcars',
		image: '/assets/bohemcars/hero/home-05-showroom-exterior.webp',
		title: 'Внос, проверка и предаване'
	},
	intro: {
		title: 'История и фокус',
		heading: 'Екип за автомобили от Канада, проверка и спокойно предаване',
		description:
			'Bohemcars е пловдивски екип, фокусиран върху практичната част от покупката: избор на правилен автомобил, внос от Канада, проверка на историята, документи, крайни разходи и оглед с уговорка.',
		checklist: [
			'Внос от Канада и налични автомобили в България',
			'VIN, история, снимки, пробег и документи преди решение',
			'Ориентир за транспорт, мита, ДДС, подготовка и регистрация'
		],
		mainImageAlt: 'Bohemcars showroom',
		subImage: '/assets/bohemcars/proof-studio-import-handoff.png',
		subImageAlt: 'Bohemcars handoff'
	},
	profile: {
		eyebrow: 'Какво прави екипът',
		heading: 'Подреждаме реалния случай, преди клиентът да каже да',
		description:
			'Bohemcars работи като точка за подбор, проверка и съдействие. Клиентът може да пита за автомобил от наличност, конкретна обява от Канада, VIN проверка, документи, разходи до България или продажба на собствен автомобил.',
		statement:
			'Фокусът е прост: да знаеш какво гледаш, колко реално ще струва и какво следва след избора.',
		highlights: [
			'Внос от Канада',
			'Проверка по VIN и история',
			'Документи, разходи и оглед с уговорка'
		],
		steps: [
			{
				title: 'Внос от Канада',
				description:
					'Работа по конкретен модел, бюджет, срок и реалистична крайна цена до България.'
			},
			{
				title: 'Налични автомобили',
				description: 'Огледи с уговорка, контекст за произход, състояние, пробег и следващи стъпки.'
			},
			{
				title: 'Проверка и документи',
				description:
					'Преглед на VIN, история, снимки, сервизни следи, документи и готовност за регистрация.'
			},
			{
				title: 'Продажба и предаване',
				description:
					'Съдействие при клиентски автомобили, подготвяне на оглед, документи и спокойно предаване.'
			}
		]
	},
	reviews: auxeroReviewCards.slice(0, 4),
	stats: [
		{ value: String(vehicles.length), suffix: '', label: 'Автомобила в наличност' },
		{ value: String(brands.length), suffix: '', label: 'Марки в инвентара' },
		{ value: '98', suffix: '%', label: 'Препоръки във Facebook' },
		{ value: '157', suffix: '', label: 'Публични отзива' }
	],
	why: {
		heading: 'Защо клиентите търсят Bohemcars?',
		description:
			'Защото покупката или вносът не се решават само по снимка. Екипът гледа произход, документи, разходи и готовност за оглед, преди да има ангажимент.',
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
