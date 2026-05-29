import {
	bohemcarsAssets,
	bohemcarsBrand,
	bohemcarsContact,
	mainNavigation
} from '$lib/data/bohemcars';
import type { BlogPost } from '$lib/data/blog';
import { vehicles as inventoryVehicles } from '$lib/data/vehicles';
import type { Vehicle } from '$lib/data/vehicles';
import {
	getMessages,
	localizeCount,
	localizeVehicleTermsInText,
	translateVehicleTerm,
	type Locale,
	type PublicMessages
} from '$lib/i18n/messages';

export type HomeFiveBrandCard = {
	count: string;
	image: string;
	name: string;
	query: string;
};

export type HomeFiveReview = {
	avatar: string;
	name: string;
	role: string;
	text: string;
};

export type HomeFiveNewsPost = {
	category: string;
	date: string;
	image: string;
	slug: string;
	title: string;
};

export type HomeFiveFooterLink = {
	href: string;
	label: string;
};

export type HomeFiveFooterSocial = {
	href: string;
	icon: 'facebook' | 'x' | 'instagram' | 'youtube';
	label: string;
};

export type HomeFiveFooterData = {
	appLinks: Array<HomeFiveFooterLink & { image: string }>;
	buyingLinks: HomeFiveFooterLink[];
	contact: {
		address: string;
		phoneHref: string;
		phoneLabel: string;
	};
	copyright: string;
	hours: string[];
	labels: {
		buyingSelling: string;
		emailPlaceholder: string;
		online: string;
		openingHours: string;
		quickLinks: string;
		subscribe: string;
	};
	legalLinks: HomeFiveFooterLink[];
	logo: {
		alt: string;
		href: string;
		src: string;
	};
	quickLinks: HomeFiveFooterLink[];
	socialLinks: HomeFiveFooterSocial[];
};

export type HomeFiveHeaderSocial = {
	href: string;
	icon: 'chat' | 'facebook' | 'instagram' | 'telegram' | 'x' | 'youtube';
	label: string;
	target?: '_blank';
};

export type HomeFiveHeaderMegaMenuLink = {
	href: string;
	label: string;
};

export type HomeFiveHeaderMegaMenuSection = {
	links: HomeFiveHeaderMegaMenuLink[];
	title: string;
};

export type HomeFiveHeaderMegaMenuVehicle = {
	href: string;
	image: string;
	label: string;
	meta: string;
};

export type HomeFiveHeaderMegaMenuFooter = {
	copy: string;
	ctaHref: string;
	ctaLabel: string;
	title: string;
};

export type HomeFiveHeaderContainerMenu = {
	links: HomeFiveHeaderMegaMenuLink[];
	variant: 'container';
};

export type HomeFiveHeaderInventoryMegaMenu = {
	footer: HomeFiveHeaderMegaMenuFooter;
	sections: HomeFiveHeaderMegaMenuSection[];
	variant: 'inventory';
	vehicles: HomeFiveHeaderMegaMenuVehicle[];
};

export type HomeFiveHeaderMegaMenu = HomeFiveHeaderContainerMenu | HomeFiveHeaderInventoryMegaMenu;

export type HomeFiveHeaderNavigationItem = {
	active: boolean;
	href: string;
	label: string;
	megaMenu?: HomeFiveHeaderMegaMenu;
};

export type HomeFiveHeaderData = {
	actionBadges: {
		compare: number;
		wishlist: number;
	};
	contact: {
		addressHref: string;
		addressLabel: string;
		emailHref: string;
		emailLabel: string;
		phoneHref: string;
		phoneLabel: string;
	};
	language: {
		current: string;
		options: string[];
	};
	ui: {
		addListing: string;
		compare: string;
		megaDetails: string;
		megaView: string;
		searchPlaceholder: string;
		signIn: string;
		wishlist: string;
	};
	logo: {
		alt: string;
		href: string;
		mobileSrc: string;
		src: string;
	};
	navigation: HomeFiveHeaderNavigationItem[];
	socialLinks: HomeFiveHeaderSocial[];
};

export type HomeFiveModalVehicle = {
	engine: string;
	exterior: string;
	fuel: string;
	image: string;
	interior: string;
	location: string;
	mileageLabel: string;
	slug: string;
	stockNumber: string;
	title: string;
	transmission: string;
	vin: string;
	year: number;
};

export type HomeFiveModalsData = {
	cardCompare: {
		left: HomeFiveModalVehicle;
		right: HomeFiveModalVehicle;
		rows: Array<{
			icon: string;
			label: string;
			left: string | number;
			right: string | number;
		}>;
	};
	comparePreview: HomeFiveModalVehicle[];
};

export type HomeFiveTypeCard = {
	bodyType: string;
	href: `/inventory${string}`;
	image: string;
	label: string;
};

export type HomeFiveVehiclePillIcon = 'coupe' | 'crossover' | 'luxury' | 'pickup' | 'sedan' | 'suv';

export type HomeFiveVehiclePill = {
	active: boolean;
	href: `/inventory${string}`;
	icon?: HomeFiveVehiclePillIcon;
	image?: string;
	kind: 'body' | 'brand' | 'spec';
	label: string;
	labels?: Partial<Record<Locale, string>>;
	termGroup?: keyof PublicMessages['vehicleTerms'];
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

export type HomeFiveVehicleCardData = {
	brand: string;
	fuel: string;
	highlightClass: 'bg-green' | 'bg-primary-2';
	image: string;
	monthlyLabel: string;
	photoCount: number;
	priceLabel: string;
	slug: string;
	title: string;
	transmission: string;
	transmissionIcon: 'auto.svg' | 'manual.svg';
	year: number;
	mileageLabel: string;
};

export type HomeFiveHeroSelectOption = {
	label: string;
	value: string;
};

export type HomeFiveHeroSelect = {
	defaultLabel: string;
	id: string;
	name: string;
	options: HomeFiveHeroSelectOption[];
	title: string;
};

export type HomeFiveHeroTextSlide = {
	ctaHref: '/inventory';
	ctaLabel: string;
	id: string;
	subtitle: string;
};

export type HomeFiveHeroTab = {
	active: boolean;
	label: string;
};

export type HomeFiveHeroData = {
	advancedFilters: HomeFiveHeroSelect[];
	backgroundImages: string[];
	checksTitle: string;
	features: string[];
	heading: string;
	primaryFilters: HomeFiveHeroSelect[];
	searchSubmitPrefix: string;
	searchSubmitSuffix: string;
	tabs: HomeFiveHeroTab[];
	textSlides: HomeFiveHeroTextSlide[];
	totalMatches: number;
	yearLabel: string;
	yearRange: {
		max: number;
		min: number;
	};
};

const brokenHomeImageSlugs = new Set(['21779200396408437']);

export const imageForHomeFiveVehicle = (vehicle: Vehicle) =>
	brokenHomeImageSlugs.has(vehicle.slug) ? bohemcarsAssets.hero : vehicle.image;

const inventoryMegaMenuVehicles = [
	{
		image: '/assets/bohemcars/megamenu/inventory-bmw-x5-cutout.png',
		label: 'BMW X5 40i',
		slug: '21764342419542174'
	},
	{
		image: '/assets/bohemcars/megamenu/inventory-bmw-x4m-cutout-v2.png',
		label: 'BMW X4 M Competition',
		slug: '21778068579001193'
	},
	{
		image: '/assets/bohemcars/megamenu/inventory-audi-sq5-cutout.png',
		label: 'Audi SQ5 Black Optic',
		slug: '21778067767337633'
	},
	{
		image: '/assets/bohemcars/megamenu/inventory-audi-a7-cutout.png',
		label: 'Audi A7 Black Optic',
		slug: '11774283016080050'
	}
] as const satisfies Array<{
	image: string;
	label: string;
	slug: string;
}>;

const inventoryMegaMenuFeaturedVehicles: HomeFiveHeaderMegaMenuVehicle[] =
	inventoryMegaMenuVehicles.map((entry) => {
		const vehicle = inventoryVehicles.find((candidate) => candidate.slug === entry.slug);

		return {
			href: vehicle ? `/inventory/${encodeURIComponent(vehicle.slug)}` : '/inventory',
			image: entry.image,
			label: entry.label,
			meta: vehicle ? `${vehicle.priceLabel} · ${vehicle.fuel}` : 'Available now'
		};
	});

const inventoryMegaMenu: HomeFiveHeaderInventoryMegaMenu = {
	variant: 'inventory',
	vehicles: inventoryMegaMenuFeaturedVehicles,
	sections: [
		{
			title: 'Browse Inventory',
			links: [
				{ href: '/inventory', label: 'All Vehicles' },
				{ href: '/inventory?view=4', label: 'Grid View' },
				{ href: '/inventory?view=map', label: 'Map View' },
				{ href: '/compare', label: 'Compare Vehicles' }
			]
		},
		{
			title: 'Shop By Body Type',
			links: [
				{ href: '/inventory?bodyType=SUV', label: 'SUV' },
				{ href: '/inventory?bodyType=Sedan', label: 'Sedan' },
				{ href: '/inventory?bodyType=Coupe', label: 'Coupe' },
				{ href: '/inventory?bodyType=Wagon', label: 'Wagon' }
			]
		},
		{
			title: 'Shop By Fuel Type',
			links: [
				{ href: '/inventory?fuel=Petrol', label: 'Petrol' },
				{ href: '/inventory?fuel=Diesel', label: 'Diesel' },
				{ href: '/inventory?fuel=Hybrid', label: 'Hybrid' },
				{ href: '/inventory?fuel=EV', label: 'EV' }
			]
		},
		{
			title: 'Bohemcars Support',
			links: [
				{ href: '/services', label: 'Import & Buying Services' },
				{ href: '/calculator', label: 'Import Cost Calculator' },
				{ href: '/sell-your-car', label: 'Sell Your Car' },
				{ href: '/agents', label: 'Meet Our Consultants' }
			]
		}
	],
	footer: {
		copy: 'Filter by body, fuel, price, and mileage before you book a viewing.',
		ctaHref: '/inventory',
		ctaLabel: 'View All Inventory',
		title: `${inventoryVehicles.length} vehicles in the Bohemcars stock feed`
	}
};

const servicesMegaMenu: HomeFiveHeaderContainerMenu = {
	variant: 'container',
	links: [
		{ href: '/services', label: 'Services Overview' },
		{ href: '/financing', label: 'Financing' },
		{ href: '/calculator', label: 'Import Calculator' },
		{ href: '/sell-your-car', label: 'Sell Your Car' },
		{ href: '/compare', label: 'Compare Vehicles' },
		{ href: '/contact', label: 'Book A Consultation' }
	]
};

const aboutMegaMenu: HomeFiveHeaderContainerMenu = {
	variant: 'container',
	links: [
		{ href: '/about', label: 'About Us' },
		{ href: '/agents', label: 'Meet Our Consultants' },
		{ href: '/reviews', label: 'Client Reviews' },
		{ href: '/faqs', label: 'Frequently Asked Questions' },
		{ href: '/blog', label: 'Bohemcars Notes' },
		{ href: '/contact', label: 'Visit The Office' }
	]
};

const inventoryMegaMenuForLocale = (locale: Locale): HomeFiveHeaderInventoryMegaMenu => {
	if (locale === 'en') return inventoryMegaMenu;

	return {
		variant: 'inventory',
		vehicles: inventoryMegaMenuFeaturedVehicles.map((vehicle) => ({
			...vehicle,
			meta: localizeVehicleTermsInText(locale, vehicle.meta)
		})),
		sections: [
			{
				title: locale === 'bg' ? 'Разгледай автомобили' : 'Browse Inventory',
				links: [
					{ href: '/inventory', label: locale === 'bg' ? 'Всички автомобили' : 'All Vehicles' },
					{ href: '/inventory?view=4', label: locale === 'bg' ? 'Изглед с карти' : 'Grid View' },
					{ href: '/inventory?view=map', label: locale === 'bg' ? 'Карта' : 'Map View' },
					{ href: '/compare', label: locale === 'bg' ? 'Сравни автомобили' : 'Compare Vehicles' }
				]
			},
			{
				title: locale === 'bg' ? 'По тип купе' : 'Shop By Body Type',
				links: [
					{
						href: '/inventory?bodyType=SUV',
						label: translateVehicleTerm(locale, 'bodyTypes', 'SUV')
					},
					{
						href: '/inventory?bodyType=Sedan',
						label: translateVehicleTerm(locale, 'bodyTypes', 'Sedan')
					},
					{
						href: '/inventory?bodyType=Coupe',
						label: translateVehicleTerm(locale, 'bodyTypes', 'Coupe')
					},
					{
						href: '/inventory?bodyType=Wagon',
						label: translateVehicleTerm(locale, 'bodyTypes', 'Wagon')
					}
				]
			},
			{
				title: locale === 'bg' ? 'По гориво' : 'Shop By Fuel Type',
				links: [
					{
						href: '/inventory?fuel=Petrol',
						label: translateVehicleTerm(locale, 'fuels', 'Petrol')
					},
					{
						href: '/inventory?fuel=Diesel',
						label: translateVehicleTerm(locale, 'fuels', 'Diesel')
					},
					{
						href: '/inventory?fuel=Hybrid',
						label: translateVehicleTerm(locale, 'fuels', 'Hybrid')
					},
					{ href: '/inventory?fuel=EV', label: translateVehicleTerm(locale, 'fuels', 'EV') }
				]
			},
			{
				title: locale === 'bg' ? 'Съдействие от Bohemcars' : 'Bohemcars Support',
				links: [
					{
						href: '/services',
						label: locale === 'bg' ? 'Внос и покупка' : 'Import & Buying Services'
					},
					{
						href: '/calculator',
						label: locale === 'bg' ? 'Калкулатор за внос' : 'Import Cost Calculator'
					},
					{
						href: '/sell-your-car',
						label: locale === 'bg' ? 'Продай автомобила си' : 'Sell Your Car'
					},
					{
						href: '/agents',
						label: locale === 'bg' ? 'Нашите консултанти' : 'Meet Our Consultants'
					}
				]
			}
		],
		footer: {
			copy:
				locale === 'bg'
					? 'Филтрирай по тип, гориво, цена и пробег преди да запазиш оглед.'
					: 'Filter by body, fuel, price, and mileage before you book a viewing.',
			ctaHref: '/inventory',
			ctaLabel: locale === 'bg' ? 'Виж всички автомобили' : 'View All Inventory',
			title:
				locale === 'bg'
					? `${inventoryVehicles.length} автомобила в наличност`
					: `${inventoryVehicles.length} vehicles in the Bohemcars stock feed`
		}
	};
};

const servicesMegaMenuForLocale = (locale: Locale): HomeFiveHeaderContainerMenu => ({
	variant: 'container',
	links:
		locale === 'bg'
			? [
					{ href: '/services', label: 'Услуги' },
					{ href: '/financing', label: 'Финансиране' },
					{ href: '/calculator', label: 'Калкулатор за внос' },
					{ href: '/sell-your-car', label: 'Продай автомобила си' },
					{ href: '/compare', label: 'Сравни автомобили' },
					{ href: '/contact', label: 'Запази консултация' }
				]
			: servicesMegaMenu.links
});

const aboutMegaMenuForLocale = (locale: Locale): HomeFiveHeaderContainerMenu => ({
	variant: 'container',
	links:
		locale === 'bg'
			? [
					{ href: '/about', label: 'За нас' },
					{ href: '/agents', label: 'Нашите консултанти' },
					{ href: '/reviews', label: 'Отзиви от клиенти' },
					{ href: '/faqs', label: 'Често задавани въпроси' },
					{ href: '/blog', label: 'Съвети от Bohemcars' },
					{ href: '/contact', label: 'Посети офиса' }
				]
			: aboutMegaMenu.links
});

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

export const homeFiveBrandCardsForLocale = (locale: Locale): HomeFiveBrandCard[] =>
	homeFiveBrandCards.map((card) => ({
		...card,
		count: localizeCount(locale, card.count)
	}));

export const homeFiveHeaderDataForLocale = (locale: Locale): HomeFiveHeaderData => {
	const t = getMessages(locale);

	return {
		actionBadges: {
			compare: 2,
			wishlist: 2
		},
		contact: {
			addressHref: '/contact',
			addressLabel: bohemcarsContact.addressLabel,
			emailHref: '/contact',
			emailLabel: bohemcarsContact.emailLabel,
			phoneHref: '/contact',
			phoneLabel: bohemcarsContact.primaryPhoneLabel
		},
		language: {
			current: t.header.languageCurrent,
			options: t.header.languageOptions
		},
		ui: {
			addListing: t.header.addListing,
			compare: t.header.compare,
			megaDetails: t.header.megaDetails,
			megaView: t.header.megaView,
			searchPlaceholder: t.header.searchPlaceholder,
			signIn: t.header.signIn,
			wishlist: t.header.wishlist
		},
		logo: {
			alt: bohemcarsBrand.name,
			href: '/',
			mobileSrc: bohemcarsAssets.logoLight,
			src: bohemcarsAssets.logoLight
		},
		navigation: mainNavigation.map<HomeFiveHeaderNavigationItem>((item) => ({
			...item,
			label: t.nav[item.href as keyof typeof t.nav],
			active: item.href === '/',
			megaMenu:
				item.href === '/inventory'
					? inventoryMegaMenuForLocale(locale)
					: item.href === '/services'
						? servicesMegaMenuForLocale(locale)
						: item.href === '/about'
							? aboutMegaMenuForLocale(locale)
							: undefined
		})),
		socialLinks: [
			{ href: '/reviews', icon: 'facebook', label: t.home.reviewsTitle },
			{ href: '/blog', icon: 'youtube', label: t.home.newsTitle },
			{ href: '/services', icon: 'chat', label: t.nav['/services'] },
			{ href: '/contact', icon: 'telegram', label: t.nav['/contact'] },
			{ href: '/agents', icon: 'x', label: locale === 'bg' ? 'Консултанти' : 'Consultants' }
		]
	};
};

export const homeFiveHeaderData: HomeFiveHeaderData = homeFiveHeaderDataForLocale('en');

export const homeFiveReviewItems: HomeFiveReview[] = [
	{
		name: 'Aleksandar Vytev',
		role: 'Bohemcars client',
		avatar: '/assets/images/avatar/avatar-1.png',
		text: 'The team explained the vehicle history, transport, and registration steps before I committed. The handoff felt calm and transparent.'
	},
	{
		name: 'Krasimir Georgiev',
		role: 'Import client',
		avatar: '/assets/images/avatar/avatar-2.png',
		text: 'Bohemcars kept the conversation practical: photos, documents, mileage, and the costs that matter before delivery.'
	},
	{
		name: 'Iliyan Petrov',
		role: 'Client vehicle seller',
		avatar: '/assets/images/avatar/avatar-3.png',
		text: 'I sent the car details and received clear feedback on pricing, documents, and the best way to present the vehicle.'
	}
];

export const homeFiveNewsPostsFromPosts = (posts: BlogPost[]): HomeFiveNewsPost[] =>
	posts.slice(0, 3).map((post) => ({
		category: post.category,
		date: post.date,
		image: post.image,
		slug: post.slug,
		title: post.title
	}));

export const homeFiveFooterData: HomeFiveFooterData = {
	appLinks: [
		{
			href: '/contact',
			image: '/assets/images/brand/app-store-dark.png',
			label: 'Contact on mobile'
		},
		{
			href: '/contact',
			image: '/assets/images/brand/google-play-dark.png',
			label: 'Message Bohemcars'
		}
	],
	buyingLinks: [
		{ href: '/services', label: 'Services' },
		{ href: '/inventory', label: 'Find a Car' },
		{ href: '/agents', label: 'Find a Consultant' },
		{ href: '/inventory?view=map', label: 'Inventory Map' },
		{ href: '/inventory?status=available', label: 'Verified Listings' },
		{ href: '/calculator', label: 'Import Calculator' },
		{ href: '/reviews', label: 'Client Reviews' }
	],
	contact: {
		address: bohemcarsContact.addressLabel,
		phoneHref: '/contact',
		phoneLabel: bohemcarsContact.primaryPhoneLabel
	},
	copyright: `©2026 ${bohemcarsBrand.name}. All Rights Reserved.`,
	hours: ['Monday-Friday 9:00 - 18:00', 'Weekend viewings by appointment'],
	labels: {
		buyingSelling: 'BUYING & SELLING',
		emailPlaceholder: 'Enter your e-mail',
		online: 'Bohemcars Online',
		openingHours: 'Opening Hours:',
		quickLinks: 'QUICK LINKS',
		subscribe: 'Subscribe'
	},
	legalLinks: [
		{ href: '/terms', label: 'Terms Of Services' },
		{ href: '/terms', label: 'Privacy Policy' },
		{ href: '/terms', label: 'Cookie Policy' }
	],
	logo: {
		alt: bohemcarsBrand.name,
		href: '/',
		src: bohemcarsAssets.logoDark
	},
	quickLinks: [
		{ href: '/about', label: 'About Us' },
		{ href: '/inventory?view=4', label: 'Buying With Bohemcars' },
		{ href: '/sell-your-car', label: 'Sell Your Car' },
		{ href: '/services', label: 'Services' },
		{ href: '/faqs', label: 'FAQ' },
		{ href: '/blog', label: 'News' },
		{ href: '/contact', label: 'Contact Bohemcars' }
	],
	socialLinks: [
		{ href: '/contact', icon: 'facebook', label: 'Contact' },
		{ href: '/blog', icon: 'youtube', label: 'Blog' },
		{ href: '/reviews', icon: 'facebook', label: 'Reviews' },
		{ href: '/services', icon: 'youtube', label: 'Services' },
		{ href: '/agents', icon: 'x', label: 'Consultants' },
		{ href: '/inventory', icon: 'instagram', label: 'Inventory' }
	]
};

export const homeFiveFooterDataForLocale = (locale: Locale): HomeFiveFooterData => {
	if (locale === 'en') return homeFiveFooterData;

	return {
		...homeFiveFooterData,
		appLinks: [
			{
				href: '/contact',
				image: '/assets/images/brand/app-store-dark.png',
				label: 'Контакт през телефон'
			},
			{
				href: '/contact',
				image: '/assets/images/brand/google-play-dark.png',
				label: 'Пиши на Bohemcars'
			}
		],
		buyingLinks: [
			{ href: '/services', label: 'Услуги' },
			{ href: '/inventory', label: 'Намери автомобил' },
			{ href: '/agents', label: 'Намери консултант' },
			{ href: '/inventory?view=map', label: 'Карта на наличните' },
			{ href: '/inventory?status=available', label: 'Проверени обяви' },
			{ href: '/calculator', label: 'Калкулатор за внос' },
			{ href: '/reviews', label: 'Отзиви от клиенти' }
		],
		copyright: `©2026 ${bohemcarsBrand.name}. Всички права запазени.`,
		hours: ['Понеделник-петък 9:00 - 18:00', 'Огледи през уикенда с уговорка'],
		labels: {
			buyingSelling: 'ПОКУПКА И ПРОДАЖБА',
			emailPlaceholder: 'Въведете имейл',
			online: 'Bohemcars онлайн',
			openingHours: 'Работно време:',
			quickLinks: 'БЪРЗИ ВРЪЗКИ',
			subscribe: 'Абонирай се'
		},
		legalLinks: [
			{ href: '/terms', label: 'Общи условия' },
			{ href: '/terms', label: 'Поверителност' },
			{ href: '/terms', label: 'Бисквитки' }
		],
		quickLinks: [
			{ href: '/about', label: 'За нас' },
			{ href: '/inventory?view=4', label: 'Покупка с Bohemcars' },
			{ href: '/sell-your-car', label: 'Продай автомобила си' },
			{ href: '/services', label: 'Услуги' },
			{ href: '/faqs', label: 'FAQ' },
			{ href: '/blog', label: 'Новини' },
			{ href: '/contact', label: 'Контакт с Bohemcars' }
		],
		socialLinks: [
			{ href: '/contact', icon: 'facebook', label: 'Контакт' },
			{ href: '/blog', icon: 'youtube', label: 'Блог' },
			{ href: '/reviews', icon: 'facebook', label: 'Отзиви' },
			{ href: '/services', icon: 'youtube', label: 'Услуги' },
			{ href: '/agents', icon: 'x', label: 'Консултанти' },
			{ href: '/inventory', icon: 'instagram', label: 'Автомобили' }
		]
	};
};

export const homeFiveTypeCards: HomeFiveTypeCard[] = [
	{
		label: 'Electric',
		image: '/assets/images/card/card-27.png',
		bodyType: 'Electric',
		href: '/inventory?fuel=EV'
	},
	{
		label: 'Sedan',
		image: '/assets/images/card/card-28.png',
		bodyType: 'Sedan',
		href: '/inventory?bodyType=Sedan'
	},
	{
		label: 'SUV',
		image: '/assets/images/card/card-29.png',
		bodyType: 'SUV',
		href: '/inventory?bodyType=SUV'
	},
	{
		label: 'Pickup Truck',
		image: '/assets/images/card/card-30.png',
		bodyType: 'Pickup Truck',
		href: '/inventory?bodyType=Pickup%20Truck'
	},
	{
		label: 'Hatchback',
		image: '/assets/images/card/card-31.png',
		bodyType: 'Hatchback',
		href: '/inventory?bodyType=Hatchback'
	},
	{
		label: 'Crossover',
		image: '/assets/images/card/card-32.png',
		bodyType: 'Crossover',
		href: '/inventory?bodyType=Crossover'
	},
	{
		label: 'Coupe',
		image: '/assets/images/card/card-33.png',
		bodyType: 'Coupe',
		href: '/inventory?bodyType=Coupe'
	},
	{
		label: 'Cabriolet',
		image: '/assets/images/card/card-34.png',
		bodyType: 'Cabriolet',
		href: '/inventory?bodyType=Cabriolet'
	}
];

export const homeFiveTypeCardsForLocale = (locale: Locale): HomeFiveTypeCard[] =>
	homeFiveTypeCards.map((card) => ({
		...card,
		label: translateVehicleTerm(locale, 'bodyTypes', card.label)
	}));

export const homeFiveVehiclePills: HomeFiveVehiclePill[] = [
	{
		active: true,
		href: '/inventory?bodyType=SUV',
		icon: 'suv',
		kind: 'body',
		label: 'SUV',
		termGroup: 'bodyTypes'
	},
	{
		active: false,
		href: '/inventory?bodyType=Sedan',
		icon: 'sedan',
		kind: 'body',
		label: 'Sedan',
		termGroup: 'bodyTypes'
	},
	{
		active: false,
		href: '/inventory?bodyType=Coupe',
		icon: 'coupe',
		kind: 'body',
		label: 'Coupe',
		termGroup: 'bodyTypes'
	},
	{
		active: false,
		href: '/inventory?bodyType=Luxury',
		icon: 'luxury',
		kind: 'body',
		label: 'Luxury',
		termGroup: 'bodyTypes'
	},
	{
		active: false,
		href: '/inventory?transmission=Automatic',
		image: '/assets/icons/transmission.svg',
		kind: 'spec',
		label: 'Automatic',
		termGroup: 'transmissions'
	},
	{
		active: false,
		href: '/inventory?q=4x4',
		image: '/assets/icons/transmission.svg',
		kind: 'spec',
		label: '4x4'
	},
	{
		active: false,
		href: '/inventory?fuel=Petrol',
		image: '/assets/icons/gaspump.svg',
		kind: 'spec',
		label: 'Petrol',
		termGroup: 'fuels'
	},
	{
		active: false,
		href: '/inventory?minYear=2021',
		image: '/assets/icons/calendar.svg',
		kind: 'spec',
		label: '2021+'
	},
	{
		active: false,
		href: '/inventory?maxMileage=120000',
		image: '/assets/icons/mileage.svg',
		kind: 'spec',
		label: 'Under 120k',
		labels: { bg: 'до 120k' }
	},
	{
		active: false,
		href: '/inventory?brand=BMW',
		image: '/assets/images/brand/brand-1.png',
		kind: 'brand',
		label: 'BMW'
	},
	{
		active: false,
		href: '/inventory?brand=Audi',
		image: '/assets/images/brand/brand-3.png',
		kind: 'brand',
		label: 'Audi'
	},
	{
		active: false,
		href: '/inventory?brand=Mercedes-Benz',
		image: '/assets/images/brand/brand-2.png',
		kind: 'brand',
		label: 'Mercedes'
	}
];

export const homeFiveVehiclePillsForLocale = (locale: Locale): HomeFiveVehiclePill[] =>
	homeFiveVehiclePills.map((pill) => ({
		...pill,
		label:
			pill.labels?.[locale] ??
			(pill.termGroup ? translateVehicleTerm(locale, pill.termGroup, pill.label) : pill.label)
	}));

const uniqueSortedValues = (items: string[]) =>
	Array.from(new Set(items.filter(Boolean))).sort((left, right) => left.localeCompare(right));

const selectOptions = (
	locale: Locale,
	values: string[],
	group?: keyof PublicMessages['vehicleTerms']
): HomeFiveHeroSelectOption[] =>
	uniqueSortedValues(values).map((value) => ({
		label: group ? translateVehicleTerm(locale, group, value) : value,
		value
	}));

export function homeFiveHeroDataFromVehicles(
	vehicles: Vehicle[],
	locale: Locale = 'en'
): HomeFiveHeroData {
	const t = getMessages(locale).hero;
	const textSlides: HomeFiveHeroTextSlide[] = Array.from({ length: 4 }, (_, index) => ({
		ctaHref: '/inventory',
		ctaLabel: t.ctaLabel,
		id: `home-five-hero-slide-${index + 1}`,
		subtitle: t.slideSubtitle
	}));

	return {
		advancedFilters: [
			{
				defaultLabel: t.filters.allFuelTypes,
				id: 'Home05FuelSelectToggle',
				name: 'fuel',
				options: selectOptions(
					locale,
					vehicles.map((vehicle) => vehicle.fuel),
					'fuels'
				),
				title: t.filters.fuelType
			},
			{
				defaultLabel: t.filters.allTransmissions,
				id: 'Home05TransmissionSelectToggle',
				name: 'transmission',
				options: selectOptions(
					locale,
					vehicles.map((vehicle) => vehicle.transmission),
					'transmissions'
				),
				title: t.filters.transmission
			},
			{
				defaultLabel: t.filters.allStatuses,
				id: 'Home05StatusSelectToggle',
				name: 'status',
				options: ['New listing', 'Available', 'Client vehicle'].map((value) => ({
					label: translateVehicleTerm(locale, 'statuses', value),
					value
				})),
				title: t.filters.status
			}
		],
		backgroundImages: bohemcarsAssets.homeHeroSlides.filter(Boolean),
		checksTitle: t.checksTitle,
		features: t.features,
		heading: t.heading,
		primaryFilters: [
			{
				defaultLabel: t.filters.allBrand,
				id: 'Home05BrandSelectToggle',
				name: 'brand',
				options: selectOptions(
					locale,
					vehicles.map((vehicle) => vehicle.brand)
				),
				title: t.filters.selectBrand
			},
			{
				defaultLabel: t.filters.allModel,
				id: 'Home05ModelSelectToggle',
				name: 'q',
				options: selectOptions(locale, vehicles.map((vehicle) => vehicle.model).slice(0, 8)),
				title: t.filters.selectModel
			},
			{
				defaultLabel: t.filters.allBodyTypes,
				id: 'Home05BodySelectToggle',
				name: 'bodyType',
				options: selectOptions(
					locale,
					vehicles.map((vehicle) => vehicle.bodyType).filter(Boolean),
					'bodyTypes'
				),
				title: t.filters.bodyType
			},
			{
				defaultLabel: t.filters.allPrice,
				id: 'Home05MaxPriceSelectToggle',
				name: 'maxPrice',
				options: ['30 000 EUR', '50 000 EUR', '80 000 EUR', '120 000 EUR'].map((value) => ({
					label: value,
					value
				})),
				title: t.filters.maxPrice
			}
		],
		searchSubmitPrefix: t.searchSubmitPrefix,
		searchSubmitSuffix: t.searchSubmitSuffix,
		tabs: t.tabs,
		textSlides,
		totalMatches: vehicles.length,
		yearLabel: t.yearLabel,
		yearRange: { min: 2015, max: 2026 }
	};
}

const compareVehicleFrom = (vehicle: Vehicle): HomeFiveCompareVehicle => ({
	brand: vehicle.brand,
	image: imageForHomeFiveVehicle(vehicle),
	priceLabel: vehicle.priceLabel,
	slug: vehicle.slug,
	title: vehicle.title
});

const formatKm = (value: number) => `${value.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} km`;

const formatMonthly = (value: number, locale: Locale) =>
	`${value.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} ${locale === 'bg' ? 'EUR/мес.' : 'EUR/mo'}`;

export const homeFiveVehicleCardFromVehicle = (
	vehicle: Vehicle,
	index: number,
	locale: Locale = 'en'
): HomeFiveVehicleCardData => ({
	brand: vehicle.brand,
	fuel: translateVehicleTerm(locale, 'fuels', vehicle.fuel),
	highlightClass: index % 2 === 0 ? 'bg-primary-2' : 'bg-green',
	image: imageForHomeFiveVehicle(vehicle),
	mileageLabel: formatKm(vehicle.mileage),
	monthlyLabel: formatMonthly(vehicle.monthly, locale),
	photoCount: vehicle.images.length || 1,
	priceLabel: vehicle.priceLabel,
	slug: vehicle.slug,
	title: vehicle.title,
	transmission: translateVehicleTerm(locale, 'transmissions', vehicle.transmission),
	transmissionIcon: vehicle.transmission === 'Manual' ? 'manual.svg' : 'auto.svg',
	year: vehicle.year
});

export const homeFiveVehicleCardsFromVehicles = (
	vehicles: Vehicle[],
	limit: number,
	locale: Locale = 'en'
) =>
	vehicles
		.slice(0, limit)
		.map((vehicle, index) => homeFiveVehicleCardFromVehicle(vehicle, index, locale));

const modalVehicleFromVehicle = (
	vehicle: Vehicle,
	locale: Locale = 'en'
): HomeFiveModalVehicle => ({
	engine: vehicle.engine,
	exterior: vehicle.exterior,
	fuel: translateVehicleTerm(locale, 'fuels', vehicle.fuel),
	image: imageForHomeFiveVehicle(vehicle),
	interior: vehicle.interior,
	location: vehicle.location,
	mileageLabel: formatKm(vehicle.mileage),
	slug: vehicle.slug,
	stockNumber: vehicle.stockNumber,
	title: vehicle.title,
	transmission: translateVehicleTerm(locale, 'transmissions', vehicle.transmission),
	vin: vehicle.vin,
	year: vehicle.year
});

export function homeFiveModalsDataFromVehicles(
	vehicles: Vehicle[],
	locale: Locale = 'en'
): HomeFiveModalsData | undefined {
	const [left, right, ...rest] = vehicles;

	if (!left || !right) {
		return undefined;
	}

	const modalLeft = modalVehicleFromVehicle(left, locale);
	const modalRight = modalVehicleFromVehicle(right, locale);

	return {
		cardCompare: {
			left: modalLeft,
			right: modalRight,
			rows: [
				{
					icon: 'mileage.svg',
					label: locale === 'bg' ? 'Пробег' : 'Mileage',
					left: modalLeft.mileageLabel,
					right: modalRight.mileageLabel
				},
				{
					icon: 'years.svg',
					label: locale === 'bg' ? 'Година' : 'Years',
					left: modalLeft.year,
					right: modalRight.year
				},
				{
					icon: 'fuel.svg',
					label: locale === 'bg' ? 'Гориво' : 'Fuel',
					left: modalLeft.fuel,
					right: modalRight.fuel
				},
				{
					icon: 'color.svg',
					label: locale === 'bg' ? 'Цвят' : 'Color',
					left: modalLeft.exterior,
					right: modalRight.exterior
				},
				{
					icon: 'location.svg',
					label: locale === 'bg' ? 'Локация' : 'Location',
					left: modalLeft.location,
					right: modalRight.location
				},
				{
					icon: 'interior.svg',
					label: locale === 'bg' ? 'Интериор' : 'Interior',
					left: modalLeft.interior,
					right: modalRight.interior
				},
				{
					icon: 'engine.svg',
					label: locale === 'bg' ? 'Двигател' : 'Engine',
					left: modalLeft.engine,
					right: modalRight.engine
				},
				{
					icon: 'transmission.svg',
					label: locale === 'bg' ? 'Скорости' : 'Transmission',
					left: modalLeft.transmission,
					right: modalRight.transmission
				},
				{ icon: 'VIN.svg', label: 'VIN', left: modalLeft.vin, right: modalRight.vin },
				{
					icon: 'QrCode.svg',
					label: locale === 'bg' ? 'Номер в наличност' : 'Stock Number',
					left: modalLeft.stockNumber,
					right: modalRight.stockNumber
				}
			]
		},
		comparePreview: [left, right, ...rest]
			.slice(0, 3)
			.map((vehicle) => modalVehicleFromVehicle(vehicle, locale))
	};
}

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
