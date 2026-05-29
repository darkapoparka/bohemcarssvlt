import mobileBgFeed from './bohemcars-listings.json';

export type MobileBgListing = {
	id: string;
	title: string;
	price: string;
	priceBgn: string;
	vat: string;
	badge: string;
	location: string;
	production: string;
	mileage: string;
	color: string;
	fuel: string;
	power: string;
	euroStandard: string;
	displacement: string;
	gearbox: string;
	category: string;
	photoCount: string;
	image: string;
	href: string;
	shortDescription: string;
	features: string[];
};

type MobileBgFeed = {
	fetchedAt: string;
	sources: Record<string, string>;
	count: number;
	listings: MobileBgListing[];
};

export type BohemcarsVehicle = {
	id: string;
	make: string;
	model: string;
	year: number;
	price: string;
	priceBgn: string;
	priceEur: number;
	vatNote: string;
	description: string;
	mileage: string;
	mileageKm: number;
	fuel: string;
	transmission: string;
	body: string;
	status: string;
	label: string;
	image: string;
	sourceUrl: string;
	sourceId: string;
	location: string;
	color: string;
	power: string;
	euroStandard: string;
	displacement: string;
	photoCount: number;
	features: string[];
	isClientVehicle: boolean;
	needsClientReview: boolean;
};

const feed = mobileBgFeed as MobileBgFeed;

const makeNames = [
	'Mercedes-Benz',
	'Volkswagen',
	'Porsche',
	'Toyota',
	'Audi',
	'BMW',
	'Ford',
	'Mazda'
] as const;

const parseNumber = (value: string) => Number(value.replace(/[^\d.]/g, '')) || 0;

const normalizePrice = (value: string) => {
	const price = Math.round(parseNumber(value));

	return {
		priceEur: price,
		price: `${price.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} EUR`
	};
};

const parseYear = (production: string) => {
	const match = production.match(/\b(19|20)\d{2}\b/);

	return match ? Number(match[0]) : new Date().getFullYear();
};

const parseMileage = (mileage: string) => Number(mileage.replace(/\D/g, '')) || 0;

const detectMake = (title: string) => makeNames.find((make) => title.startsWith(make)) ?? 'Други';

const normalizeBody = (category: string) => {
	if (category === 'Джип') return 'SUV';
	if (category === 'Кабрио') return 'Cabriolet';
	if (category === 'Седан') return 'Sedan';
	if (category === 'Комби') return 'Wagon';
	if (category === 'Купе') return 'Coupe';

	return category || 'Car';
};

const normalizeFuel = (fuel: string) => {
	if (fuel === 'Бензинов') return 'Petrol';
	if (fuel === 'Дизелов') return 'Diesel';
	if (fuel === 'Хибриден') return 'Hybrid';
	if (fuel === 'Електрически') return 'EV';

	return fuel || 'On request';
};

const normalizeTransmission = (gearbox: string) => {
	if (gearbox === 'Автоматична') return 'Automatic';
	if (gearbox === 'Ръчна') return 'Manual';

	return gearbox || 'On request';
};

export const cleanBohemcarsDescription = (text: string) =>
	text
		.replaceAll('Бъглария', 'България')
		.replaceAll('Клиентси', 'Клиентски')
		.replaceAll('Кометар', 'Коментар')
		.replaceAll('желатено', 'желателно')
		.replaceAll('исинтиски', 'истински')
		.replaceAll('шифоране', 'шофиране')
		.replaceAll('обудхване', 'обдухване')
		.replaceAll('вакум', 'вакуум')
		.trim();

const toVehicle = (listing: MobileBgListing): BohemcarsVehicle => {
	const make = detectMake(listing.title);
	const { price, priceEur } = normalizePrice(listing.price);
	const mileageKm = parseMileage(listing.mileage);
	const description = cleanBohemcarsDescription(listing.shortDescription);

	return {
		id: listing.id,
		make,
		model: listing.title,
		year: parseYear(listing.production),
		price,
		priceBgn: listing.priceBgn,
		priceEur,
		vatNote: listing.vat,
		description,
		mileage: `${mileageKm.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} km`,
		mileageKm,
		fuel: normalizeFuel(listing.fuel),
		transmission: normalizeTransmission(listing.gearbox),
		body: normalizeBody(listing.category),
		status: listing.badge === 'НОВА ОБЯВА' ? 'New listing' : 'Available',
		label: String(parseYear(listing.production)),
		image: listing.image,
		sourceUrl: listing.href,
		sourceId: listing.id,
		location: listing.location.replace('обл. ', ''),
		color: listing.color,
		power: listing.power,
		euroStandard: listing.euroStandard,
		displacement: listing.displacement,
		photoCount: Number(listing.photoCount) || 0,
		features: listing.features,
		isClientVehicle: description.toLowerCase().includes('клиентски автомобил'),
		needsClientReview: true
	};
};

export const bohemcarsSources = feed.sources;
export const bohemcarsFetchedAt = feed.fetchedAt;
export const bohemcarsVehicles = feed.listings.map(toVehicle);

export const bohemcarsContact = {
	primaryPhoneLabel: '+359 893 588 680',
	primaryPhoneHref: 'tel:+359893588680',
	marketplacePhoneLabel: '0888899911',
	marketplacePhoneHref: 'tel:+359888899911',
	emailLabel: 'bohemcars@gmail.com',
	emailHref: 'mailto:bohemcars@gmail.com',
	viberHref:
		'https://invite.viber.com/?g2=AQAMxyLjvWlk%2FlHGq8xd7qpMRMyZvgIA20ahTwc2xZeW1nMGmSkYemUD9cv1trGj',
	facebookHref: 'https://www.facebook.com/people/BohemCars/100090502502398/',
	reviewsHref: 'https://www.facebook.com/people/BohemCars/100090502502398/?sk=reviews',
	youtubeHref: 'https://www.youtube.com/@BobbyDiv',
	addressLabel: 'Plovdiv, South Industrial Zone',
	appointmentNote: 'Vehicle viewings by appointment'
} as const;

export const bohemcarsBrand = {
	name: 'Bohemcars',
	displayName: 'BOHEM CARS',
	bulgarianName: 'Бохем Карс',
	domain: 'bohemcars.net',
	tagline: 'Canada-sourced vehicles with verified history',
	legalNote:
		'Proposal build reflects current public Bohemcars contact channels and appointment viewing.'
} as const;

export const bohemcarsAssets = {
	logoDark: '/assets/bohemcars/brand/bohemcars-logo-concept-dark-template-clean.png',
	logoLight: '/assets/bohemcars/brand/bohemcars-logo-concept-light-template-clean.png',
	hero: '/assets/bohemcars/hero/home-05-showroom-exterior.webp',
	homeHeroSlides: [
		'/assets/bohemcars/hero/home-05-showroom-exterior.webp',
		'/assets/bohemcars/hero/home-05-inspection-studio.webp',
		'/assets/bohemcars/hero/home-05-import-handoff.webp'
	],
	footerImage: '/assets/bohemcars/footer-canada-request-v2.png'
} as const;

export const bohemcarsConsultants = [
	{
		slug: 'bohemcars-sales',
		name: 'Bohemcars Sales',
		title: 'Vehicle Consultant',
		image: '/assets/bohemcars/team/avatar-sales.jpg'
	},
	{
		slug: 'bohemcars-import',
		name: 'Bohemcars Import',
		title: 'Canada Import Consultant',
		image: '/assets/bohemcars/team/avatar-logistics.jpg'
	},
	{
		slug: 'bohemcars-inspection',
		name: 'Bohemcars Inspection',
		title: 'Inspection & Documents Consultant',
		image: '/assets/bohemcars/team/avatar-inspection.jpg'
	}
] as const;

export const mainNavigation = [
	{ label: 'Home', href: '/', matchPrefixes: ['/'] },
	{ label: 'Inventory', href: '/inventory', matchPrefixes: ['/inventory'] },
	{
		label: 'Services',
		href: '/services',
		matchPrefixes: ['/services', '/financing', '/calculator', '/sell-your-car', '/compare']
	},
	{
		label: 'About',
		href: '/about',
		matchPrefixes: ['/about', '/agents', '/reviews', '/faqs', '/blog']
	},
	{ label: 'Contact', href: '/contact', matchPrefixes: ['/contact'] }
] as const;

export const isPrimaryNavActive = (pathname: string, item: (typeof mainNavigation)[number]) =>
	item.matchPrefixes.some(
		(prefix) => pathname === prefix || (prefix !== '/' && pathname.startsWith(prefix))
	);

export const getUniqueValues = <Key extends keyof BohemcarsVehicle>(key: Key) =>
	Array.from(new Set(bohemcarsVehicles.map((vehicle) => vehicle[key]).filter(Boolean))).sort(
		(a, b) => String(a).localeCompare(String(b), 'bg')
	);
