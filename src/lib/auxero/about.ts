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
		description: 'Автомобили от Канада с проверена история, документи и подготвен оглед.',
		eyebrow: 'За Bohemcars',
		image: '/assets/bohemcars/hero/home-05-showroom-exterior.webp',
		title: 'Проверка преди избор'
	},
	intro: {
		title: 'Как работим',
		heading: 'Ясна проверка преди избор на автомобил',
		description:
			'Bohemcars помага с историята на автомобила, контекста на вноса, документите, огледите и реалистичните очаквания за крайна цена.',
		checklist: [
			'Опит с внос и документи от Канада',
			'Прозрачни оценки и проверка по конкретен автомобил',
			'Подготвено предаване и съдействие с уговорен час'
		],
		mainImageAlt: 'Bohemcars showroom',
		subImage: '/assets/bohemcars/proof-studio-import-handoff.png',
		subImageAlt: 'Bohemcars handoff'
	},
	profile: {
		eyebrow: 'Профил на Bohemcars',
		heading: 'Подбор, проверка и предаване с ясен контекст',
		description:
			'Bohemcars работи като консултантска точка за автомобили от Канада: гледаме произход, история, документи, реална крайна цена и готовност за оглед преди клиентът да вземе решение.',
		statement:
			'Целта не е просто да покажем автомобил. Целта е клиентът да знае какво гледа, колко ще струва и какво следва след избора.',
		highlights: [
			'Проверка по VIN и история',
			'Контекст за внос, документи и регистрация',
			'Огледи и предаване с уговорка'
		],
		steps: [
			{
				title: 'Подбор',
				description:
					'Филтрираме налични и потенциални автомобили според бюджет, модел и очакван срок.'
			},
			{
				title: 'Проверка',
				description:
					'Преглеждаме история, снимки, документи, пробег и важните детайли преди ангажимент.'
			},
			{
				title: 'Оценка',
				description: 'Подготвяме реалистична крайна цена с транспорт, мита, ДДС и подготовка.'
			},
			{
				title: 'Предаване',
				description: 'Организираме оглед, документи, подготовка и спокойно предаване на автомобила.'
			}
		]
	},
	reviews: auxeroReviewCards.slice(0, 4),
	stats: [
		{ value: String(vehicles.length), suffix: '', label: 'Обяви в Bohemcars' },
		{ value: String(brands.length), suffix: '', label: 'Марки в наличност' },
		{ value: '98', suffix: '%', label: 'Facebook препоръки' },
		{ value: '157', suffix: '', label: 'Публични отзива' }
	],
	why: {
		heading: 'Защо Bohemcars?',
		description:
			'Подходът е практичен: проверка на автомобила, разбираема цена, подготвени документи и спокойно решение за клиента.',
		checklist: [
			'Проверен произход и преглед на документите',
			'Ясни ориентировъчни крайни разходи',
			'Контекст за обслужване и регистрация според автомобила',
			'Консултанти за внос, проверка и продажба'
		],
		image: '/assets/bohemcars/cta/import-canada-banner.png',
		imageAlt: 'Why choose Bohemcars'
	}
};
