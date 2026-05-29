import type { AuxeroPageDocument } from '$lib/auxero/page-document';

export const locales = ['bg', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'bg';

export type HomePageCopy = {
	brandCta: string;
	brandTitle: string;
	budgetTabs: Array<{ active: boolean; label: string }>;
	budgetTitle: string;
	byline: string;
	commonCta: string;
	compareEmpty: string;
	compareTitle: string;
	featuredTitle: string;
	newsTitle: string;
	reviewsTitle: string;
	typeCta: string;
	typeTitle: string;
	vehicleCard: VehicleCardCopy;
};

export type VehicleCardCopy = {
	compare: string;
	finance: string;
	fuelAlt: string;
	mileageAlt: string;
	photosAlt: string;
	savePrefix: string;
	transmissionAlt: string;
	videoAlt: string;
	viewDetails: string;
	yearAlt: string;
};

export type InventoryCopy = {
	emptyBody: string;
	emptyTitle: string;
	reset: string;
	vehicleCard: VehicleCardCopy;
};

export type DetailCopy = {
	callBohemcars: string;
	carOverview: string;
	cash: string;
	chatOnViber: string;
	compare: string;
	description: string;
	detailDescriptionFallback: string;
	directions: string;
	email: string;
	finance: string;
	financeIntro: string;
	financeTerms: string;
	formConsent: string;
	formTerms: string;
	formTermsLink: string;
	getToKnow: string;
	inquiryTitle: string;
	name: string;
	phone: string;
	playVideo: string;
	price: string;
	priceIntro: string;
	savePrefix: string;
	sendInquiry: string;
	subject: string;
	subjectAvailability: string;
	subjectDocuments: string;
	subjectViewing: string;
	viewAllPhoto: string;
	consultantLabel: string;
	message: string;
	messagePlaceholder: string;
};

export type PublicMessages = {
	detail: DetailCopy;
	header: {
		addListing: string;
		compare: string;
		languageCurrent: string;
		languageOptions: string[];
		megaDetails: string;
		megaView: string;
		searchPlaceholder: string;
		signIn: string;
		wishlist: string;
	};
	home: HomePageCopy;
	hero: {
		checksTitle: string;
		ctaLabel: string;
		features: string[];
		heading: string;
		searchSubmitPrefix: string;
		searchSubmitSuffix: string;
		slideSubtitle: string;
		statuses: string[];
		tabs: Array<{ active: boolean; label: string }>;
		yearLabel: string;
		filters: {
			allBodyTypes: string;
			allBrand: string;
			allFuelTypes: string;
			allModel: string;
			allPrice: string;
			allStatuses: string;
			allTransmissions: string;
			bodyType: string;
			fuelType: string;
			maxPrice: string;
			selectBrand: string;
			selectModel: string;
			status: string;
			transmission: string;
		};
	};
	inventory: InventoryCopy;
	nav: Record<'/' | '/about' | '/contact' | '/inventory' | '/services', string>;
	vehicleTerms: {
		bodyTypes: Record<string, string>;
		fuels: Record<string, string>;
		statuses: Record<string, string>;
		transmissions: Record<string, string>;
	};
};

const vehicleCardEn: VehicleCardCopy = {
	compare: 'Compare',
	finance: 'See Finance',
	fuelAlt: 'fuel',
	mileageAlt: 'mileage',
	photosAlt: 'photos',
	savePrefix: 'Save',
	transmissionAlt: 'transmission',
	videoAlt: 'video',
	viewDetails: 'View details',
	yearAlt: 'year'
};

const vehicleCardBg: VehicleCardCopy = {
	compare: 'Сравни',
	finance: 'Виж финансиране',
	fuelAlt: 'гориво',
	mileageAlt: 'пробег',
	photosAlt: 'снимки',
	savePrefix: 'Запази',
	transmissionAlt: 'скоростна кутия',
	videoAlt: 'видео',
	viewDetails: 'Виж детайли',
	yearAlt: 'година'
};

export const messages: Record<Locale, PublicMessages> = {
	en: {
		header: {
			addListing: 'Add Listing',
			compare: 'Compare',
			languageCurrent: 'English',
			languageOptions: ['English', 'Bulgarian'],
			megaDetails: 'Details',
			megaView: 'View',
			searchPlaceholder: 'Search Bohemcars inventory',
			signIn: 'Sign In',
			wishlist: 'Wishlist'
		},
		home: {
			brandCta: 'View All Brand',
			brandTitle: 'Explore Our Brands',
			budgetTabs: [
				{ label: 'All Cars', active: false },
				{ label: '20 000 - 50 000 EUR', active: true },
				{ label: '50 000 - 70 000 EUR', active: false },
				{ label: '70 000 - 100 000 EUR', active: false },
				{ label: '100 000+ EUR', active: false }
			],
			budgetTitle: 'Bohemcars by Budget',
			byline: 'by Bohemcars',
			commonCta: 'View All',
			compareEmpty: 'Your compare is currently empty',
			compareTitle: 'Compare Top Rated Vehicles',
			featuredTitle: 'Available Vehicles',
			newsTitle: 'Bohemcars notes',
			reviewsTitle: 'Client Reviews',
			typeCta: 'View All Types',
			typeTitle: 'Browse By Type',
			vehicleCard: vehicleCardEn
		},
		hero: {
			checksTitle: 'Bohemcars Checks',
			ctaLabel: 'View Inventory',
			features: [
				'Verified source listing',
				'History review',
				'Mileage review',
				'Document trail',
				'Canada import support',
				'Registration readiness',
				'Viewing by appointment',
				'Client vehicle intake'
			],
			heading: 'Browse, Compare, Drive With Bohemcars!',
			searchSubmitPrefix: 'Show',
			searchSubmitSuffix: 'Matches',
			slideSubtitle: 'Canada-sourced vehicles with verified history and clear appointment support.',
			statuses: ['New listing', 'Available', 'Client vehicle'],
			tabs: [
				{ active: true, label: 'All Vehicles' },
				{ active: false, label: 'New Listings' },
				{ active: false, label: 'Client Vehicles' }
			],
			yearLabel: 'Year',
			filters: {
				allBodyTypes: 'All Body Types',
				allBrand: 'All Brand',
				allFuelTypes: 'All Fuel Types',
				allModel: 'All Model',
				allPrice: 'All Price',
				allStatuses: 'All Statuses',
				allTransmissions: 'All Transmissions',
				bodyType: 'Body Type',
				fuelType: 'Fuel Type',
				maxPrice: 'Max Price',
				selectBrand: 'Select Brand',
				selectModel: 'Select Model',
				status: 'Status',
				transmission: 'Transmission'
			}
		},
		inventory: {
			emptyBody: 'Clear filters or contact Bohemcars for a Canada import request.',
			emptyTitle: 'No Bohemcars vehicles match these filters',
			reset: 'Reset inventory',
			vehicleCard: vehicleCardEn
		},
		detail: {
			callBohemcars: 'Call Bohemcars',
			carOverview: 'Car Overview',
			cash: 'Cash',
			chatOnViber: 'Chat on Viber',
			compare: 'Compare',
			consultantLabel: 'Bohemcars Consultant',
			description: 'Description',
			detailDescriptionFallback:
				'is available through Bohemcars with source review and viewing by appointment.',
			directions: 'Get Directions',
			email: 'Email',
			finance: 'Finance',
			financeIntro: 'Estimated payment before final taxes, registration, and transport costs.',
			financeTerms: 'Estimated over 72 months. Final terms confirmed by Bohemcars.',
			formConsent:
				'Yes, I would like to receive price alerts on this vehicle and helpful shopping information.',
			formTerms: 'By using this service, you accept our',
			formTermsLink: 'Visitor Agreement.',
			getToKnow: 'Get To Know this car',
			inquiryTitle: 'Send Inquiry about Vehicle',
			message: 'Message',
			messagePlaceholder: 'Comment',
			name: 'Name',
			phone: 'Phone',
			playVideo: 'Play Video',
			price: 'Price:',
			priceIntro:
				'Listed vehicle price. Final taxes and registration costs confirmed before purchase.',
			savePrefix: 'Save',
			sendInquiry: 'Send Inquiry',
			subject: 'Subject',
			subjectAvailability: "This Vehicle's Availability",
			subjectDocuments: 'Registration and documents',
			subjectViewing: 'Viewing appointment',
			viewAllPhoto: 'View All Photo'
		},
		nav: {
			'/': 'Home',
			'/about': 'About',
			'/contact': 'Contact',
			'/inventory': 'Inventory',
			'/services': 'Services'
		},
		vehicleTerms: {
			bodyTypes: {},
			fuels: {},
			statuses: {},
			transmissions: {}
		}
	},
	bg: {
		header: {
			addListing: 'Добави обява',
			compare: 'Сравни',
			languageCurrent: 'Български',
			languageOptions: ['Български', 'English'],
			megaDetails: 'Детайли',
			megaView: 'Виж',
			searchPlaceholder: 'Търси в наличните автомобили',
			signIn: 'Вход',
			wishlist: 'Любими'
		},
		home: {
			brandCta: 'Виж всички марки',
			brandTitle: 'Разгледай по марка',
			budgetTabs: [
				{ label: 'Всички автомобили', active: false },
				{ label: '20 000 - 50 000 EUR', active: true },
				{ label: '50 000 - 70 000 EUR', active: false },
				{ label: '70 000 - 100 000 EUR', active: false },
				{ label: '100 000+ EUR', active: false }
			],
			budgetTitle: 'Автомобили по бюджет',
			byline: 'от Bohemcars',
			commonCta: 'Виж всички',
			compareEmpty: 'Списъкът за сравнение е празен',
			compareTitle: 'Сравни избрани автомобили',
			featuredTitle: 'Налични автомобили',
			newsTitle: 'Съвети от Bohemcars',
			reviewsTitle: 'Отзиви от клиенти',
			typeCta: 'Виж всички типове',
			typeTitle: 'Разгледай по тип',
			vehicleCard: vehicleCardBg
		},
		hero: {
			checksTitle: 'Проверки от Bohemcars',
			ctaLabel: 'Виж наличните',
			features: [
				'Проверен източник',
				'Проверка на история',
				'Проверка на пробег',
				'Документална следа',
				'Съдействие за внос от Канада',
				'Готовност за регистрация',
				'Оглед с предварителна уговорка',
				'Прием на клиентски автомобили'
			],
			heading: 'Разгледай, сравни и избери с Bohemcars!',
			searchSubmitPrefix: 'Покажи',
			searchSubmitSuffix: 'автомобила',
			slideSubtitle: 'Автомобили от Канада с проверена история и ясни следващи стъпки преди оглед.',
			statuses: ['Нова обява', 'Наличен', 'Клиентски автомобил'],
			tabs: [
				{ active: true, label: 'Всички автомобили' },
				{ active: false, label: 'Нови обяви' },
				{ active: false, label: 'Клиентски автомобили' }
			],
			yearLabel: 'Година',
			filters: {
				allBodyTypes: 'Всички типове',
				allBrand: 'Всички марки',
				allFuelTypes: 'Всички горива',
				allModel: 'Всички модели',
				allPrice: 'Всички цени',
				allStatuses: 'Всички статуси',
				allTransmissions: 'Всички скорости',
				bodyType: 'Тип купе',
				fuelType: 'Гориво',
				maxPrice: 'Макс. цена',
				selectBrand: 'Избери марка',
				selectModel: 'Избери модел',
				status: 'Статус',
				transmission: 'Скорости'
			}
		},
		inventory: {
			emptyBody: 'Изчисти филтрите или се свържи с Bohemcars за внос от Канада.',
			emptyTitle: 'Няма автомобили, които отговарят на тези филтри',
			reset: 'Изчисти филтрите',
			vehicleCard: vehicleCardBg
		},
		detail: {
			callBohemcars: 'Обади се на Bohemcars',
			carOverview: 'Основни данни',
			cash: 'В брой',
			chatOnViber: 'Чат във Viber',
			compare: 'Сравни',
			consultantLabel: 'Консултант Bohemcars',
			description: 'Описание',
			detailDescriptionFallback:
				'е наличен чрез Bohemcars с проверка на източника и оглед с предварителна уговорка.',
			directions: 'Виж упътване',
			email: 'Имейл',
			finance: 'Финансиране',
			financeIntro:
				'Ориентировъчна вноска преди окончателни данъци, регистрация и транспортни разходи.',
			financeTerms: 'Ориентировъчно за 72 месеца. Финалните условия се потвърждават от Bohemcars.',
			formConsent:
				'Да, искам да получавам информация за цената на този автомобил и полезна информация за покупката.',
			formTerms: 'С използването на тази услуга приемате нашето',
			formTermsLink: 'потребителско споразумение.',
			getToKnow: 'Опознай автомобила',
			inquiryTitle: 'Изпрати запитване за автомобила',
			message: 'Съобщение',
			messagePlaceholder: 'Коментар',
			name: 'Име',
			phone: 'Телефон',
			playVideo: 'Пусни видео',
			price: 'Цена:',
			priceIntro:
				'Обявена цена на автомобила. Финалните данъци и регистрационни разходи се потвърждават преди покупка.',
			savePrefix: 'Запази',
			sendInquiry: 'Изпрати запитване',
			subject: 'Тема',
			subjectAvailability: 'Наличност на автомобила',
			subjectDocuments: 'Регистрация и документи',
			subjectViewing: 'Уговорка за оглед',
			viewAllPhoto: 'Виж всички снимки'
		},
		nav: {
			'/': 'Начало',
			'/about': 'За нас',
			'/contact': 'Контакти',
			'/inventory': 'Автомобили',
			'/services': 'Услуги'
		},
		vehicleTerms: {
			bodyTypes: {
				Cabriolet: 'Кабрио',
				Car: 'Автомобил',
				Coupe: 'Купе',
				Crossover: 'Кросоувър',
				Electric: 'Електрически',
				Hatchback: 'Хечбек',
				Luxury: 'Луксозни',
				'Pickup Truck': 'Пикап',
				Sedan: 'Седан',
				SUV: 'SUV',
				Wagon: 'Комби'
			},
			fuels: {
				Diesel: 'Дизел',
				EV: 'Електрически',
				Hybrid: 'Хибрид',
				Petrol: 'Бензин',
				PHEV: 'PHEV',
				'On request': 'По запитване'
			},
			statuses: {
				Available: 'Наличен',
				'Client vehicle': 'Клиентски автомобил',
				'New listing': 'Нова обява'
			},
			transmissions: {
				Automatic: 'Автоматик',
				Auto: 'Автоматик',
				Manual: 'Ръчна',
				'On request': 'По запитване'
			}
		}
	}
};

export const resolveLocale = (value: string | null | undefined): Locale =>
	value === 'en' ? 'en' : defaultLocale;

export const getMessages = (locale: Locale) => messages[locale];

export const translateVehicleTerm = (
	locale: Locale,
	group: keyof PublicMessages['vehicleTerms'],
	value: string
) => messages[locale].vehicleTerms[group][value] ?? value;

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const localizeVehicleTermsInText = (locale: Locale, value: string) => {
	if (locale === 'en') return value;

	const termGroups: Array<keyof PublicMessages['vehicleTerms']> = [
		'bodyTypes',
		'fuels',
		'statuses',
		'transmissions'
	];

	return termGroups.reduce(
		(localized, group) =>
			Object.entries(messages[locale].vehicleTerms[group]).reduce(
				(text, [source, replacement]) =>
					text.replace(new RegExp(`\\b${escapeRegExp(source)}\\b`, 'g'), replacement),
				localized
			),
		value
	);
};

export const localizeCount = (locale: Locale, count: string) =>
	locale === 'bg' ? count.replace(/\bVehicles\b/g, 'автомобила') : count;

const auxeroBgReplacements: Array<[RegExp, string]> = [
	[/\bHome\b/g, 'Начало'],
	[/\bInventory\b/g, 'Автомобили'],
	[/\bServices\b/g, 'Услуги'],
	[/\bAbout\b/g, 'За нас'],
	[/\bContact\b/g, 'Контакти'],
	[/Browse inventory/gi, 'Разгледай наличните автомобили'],
	[/Browse Inventory/g, 'Разгледай автомобили'],
	[/All Vehicles/g, 'Всички автомобили'],
	[/Grid View/g, 'Изглед с карти'],
	[/Map View/g, 'Карта'],
	[/Compare Vehicles/g, 'Сравни автомобили'],
	[/Shop By Body Type/g, 'По тип купе'],
	[/Shop By Fuel Type/g, 'По гориво'],
	[/Bohemcars Support/g, 'Съдействие от Bohemcars'],
	[/Import & Buying Services/g, 'Внос и покупка'],
	[/Import Cost Calculator/g, 'Калкулатор за внос'],
	[/Sell Your Car/g, 'Продай автомобила си'],
	[/Meet Our Consultants/g, 'Нашите консултанти'],
	[/Book A Consultation/g, 'Запази консултация'],
	[/Find a Car/g, 'Намери автомобил'],
	[/Find a Consultant/g, 'Намери консултант'],
	[/Verified Listings/g, 'Проверени обяви'],
	[/Client Reviews/g, 'Отзиви от клиенти'],
	[/Contact Bohemcars/g, 'Контакт с Bohemcars'],
	[/Frequently Asked Questions/g, 'Често задавани въпроси'],
	[/Bohemcars Notes/g, 'Съвети от Bohemcars'],
	[/Compare Bohemcars Vehicles Side-by-Side/g, 'Сравни автомобили от Bohemcars'],
	[
		/Compare price, mileage, source details, and specifications before you book a viewing\./g,
		'Сравни цена, пробег, източник и спецификации преди да запазиш оглед.'
	],
	[/Mileage/g, 'Пробег'],
	[/Years/g, 'Година'],
	[/Fuel/g, 'Гориво'],
	[/Color/g, 'Цвят'],
	[/Location/g, 'Локация'],
	[/Interior/g, 'Интериор'],
	[/Engine/g, 'Двигател'],
	[/Transmission/g, 'Скорости'],
	[/Source ID/g, 'ID от източника'],
	[/Stock Number/g, 'Номер в наличност'],
	[/Price/g, 'Цена'],
	[/On request/g, 'По запитване'],
	[/Remove/g, 'Премахни'],
	[/View All Inventory/g, 'Виж всички автомобили'],
	[/View All/g, 'Виж всички'],
	[/View details/g, 'Виж детайли'],
	[/View Details/g, 'Виж детайли'],
	[/See Finance/g, 'Виж финансиране'],
	[/Compare/g, 'Сравни'],
	[/New listing/g, 'Нова обява'],
	[/Available/g, 'Наличен'],
	[/Client vehicle/g, 'Клиентски автомобил'],
	[/Petrol/g, 'Бензин'],
	[/Diesel/g, 'Дизел'],
	[/Hybrid/g, 'Хибрид'],
	[/Automatic/g, 'Автоматик'],
	[/Manual/g, 'Ръчна']
];

const localizeAuxeroHtmlSegment = (html: string) =>
	auxeroBgReplacements.reduce(
		(localized, [pattern, replacement]) => localized.replace(pattern, replacement),
		html
	);

export const localizeAuxeroHtml = (html: string, locale: Locale) =>
	locale === 'bg'
		? html
				.split(/(<!--[\s\S]*?-->)/g)
				.map((segment) =>
					segment.startsWith('<!--') ? segment : localizeAuxeroHtmlSegment(segment)
				)
				.join('')
		: html;

export const localizeAuxeroPageDocument = (
	pageDocument: AuxeroPageDocument,
	locale: Locale
): AuxeroPageDocument => ({
	...pageDocument,
	bodyHtml: localizeAuxeroHtml(pageDocument.bodyHtml, locale),
	headHtml: localizeAuxeroHtml(pageDocument.headHtml, locale)
});
