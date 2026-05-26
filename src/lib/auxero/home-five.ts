import { bohemcarsAssets, bohemcarsBrand } from '$lib/data/bohemcars';
import type { BlogPost } from '$lib/data/blog';
import type { Vehicle } from '$lib/data/vehicles';

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

export type HomeFiveTypeCard = {
	bodyType: string;
	image: string;
	label: string;
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
	highlightText: string;
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

export type HomeFiveHeroSelect = {
	defaultLabel: string;
	id: string;
	name: string;
	options: string[];
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
	features: string[];
	primaryFilters: HomeFiveHeroSelect[];
	tabs: HomeFiveHeroTab[];
	textSlides: HomeFiveHeroTextSlide[];
	totalMatches: number;
	yearRange: {
		max: number;
		min: number;
	};
};

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

export const homeFiveTypeCards: HomeFiveTypeCard[] = [
	{ label: 'SUV', image: '/assets/images/card/card-37.jpg', bodyType: 'SUV' },
	{ label: 'SUV', image: '/assets/images/card/card-38.jpg', bodyType: 'SUV' },
	{ label: 'Pickup Truck', image: '/assets/images/card/card-39.jpg', bodyType: 'Pickup Truck' },
	{ label: 'Sedan', image: '/assets/images/card/card-40.jpg', bodyType: 'Sedan' },
	{ label: 'Hatchback', image: '/assets/images/card/card-41.jpg', bodyType: 'Hatchback' },
	{ label: 'Crossover', image: '/assets/images/card/card-42.jpg', bodyType: 'Crossover' }
];

const uniqueSortedValues = (items: string[]) =>
	Array.from(new Set(items.filter(Boolean))).sort((left, right) => left.localeCompare(right));

export function homeFiveHeroDataFromVehicles(vehicles: Vehicle[]): HomeFiveHeroData {
	const textSlides: HomeFiveHeroTextSlide[] = Array.from({ length: 4 }, (_, index) => ({
		ctaHref: '/inventory',
		ctaLabel: 'View Inventory',
		id: `home-five-hero-slide-${index + 1}`,
		subtitle: `${bohemcarsBrand.tagline} and clear appointment support.`
	}));

	return {
		advancedFilters: [
			{
				defaultLabel: 'All Fuel Types',
				id: 'Home05FuelSelectToggle',
				name: 'fuel',
				options: uniqueSortedValues(vehicles.map((vehicle) => vehicle.fuel)),
				title: 'Fuel Type'
			},
			{
				defaultLabel: 'All Transmissions',
				id: 'Home05TransmissionSelectToggle',
				name: 'transmission',
				options: uniqueSortedValues(vehicles.map((vehicle) => vehicle.transmission)),
				title: 'Transmission'
			},
			{
				defaultLabel: 'All Statuses',
				id: 'Home05StatusSelectToggle',
				name: 'status',
				options: ['New listing', 'Available', 'Client vehicle'],
				title: 'Status'
			}
		],
		backgroundImages: bohemcarsAssets.homeHeroSlides.filter(Boolean),
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
		primaryFilters: [
			{
				defaultLabel: 'All Brand',
				id: 'Home05BrandSelectToggle',
				name: 'brand',
				options: uniqueSortedValues(vehicles.map((vehicle) => vehicle.brand)),
				title: 'Select Brand'
			},
			{
				defaultLabel: 'All Model',
				id: 'Home05ModelSelectToggle',
				name: 'q',
				options: vehicles.map((vehicle) => vehicle.model).slice(0, 8),
				title: 'Select Model'
			},
			{
				defaultLabel: 'All Body Types',
				id: 'Home05BodySelectToggle',
				name: 'bodyType',
				options: Array.from(new Set(vehicles.map((vehicle) => vehicle.bodyType).filter(Boolean))),
				title: 'Body Type'
			},
			{
				defaultLabel: 'All Price',
				id: 'Home05MaxPriceSelectToggle',
				name: 'maxPrice',
				options: ['30 000 EUR', '50 000 EUR', '80 000 EUR', '120 000 EUR'],
				title: 'Max Price'
			}
		],
		tabs: [
			{ active: true, label: 'All Vehicles' },
			{ active: false, label: 'New Listings' },
			{ active: false, label: 'Client Vehicles' }
		],
		textSlides,
		totalMatches: vehicles.length,
		yearRange: { min: 2015, max: 2026 }
	};
}

const brokenHomeImageSlugs = new Set(['21779200396408437']);

export const imageForHomeFiveVehicle = (vehicle: Vehicle) =>
	brokenHomeImageSlugs.has(vehicle.slug) ? bohemcarsAssets.hero : vehicle.image;

const compareVehicleFrom = (vehicle: Vehicle): HomeFiveCompareVehicle => ({
	brand: vehicle.brand,
	image: imageForHomeFiveVehicle(vehicle),
	priceLabel: vehicle.priceLabel,
	slug: vehicle.slug,
	title: vehicle.title
});

const formatKm = (value: number) => `${value.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} km`;

export const homeFiveVehicleCardFromVehicle = (
	vehicle: Vehicle,
	index: number
): HomeFiveVehicleCardData => ({
	brand: vehicle.brand,
	fuel: vehicle.fuel,
	highlightClass: index % 2 === 0 ? 'bg-primary-2' : 'bg-green',
	highlightText: vehicle.tag ?? (vehicle.isClientVehicle ? 'Client vehicle' : 'Available'),
	image: imageForHomeFiveVehicle(vehicle),
	mileageLabel: formatKm(vehicle.mileage),
	monthlyLabel: `${vehicle.monthly.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} EUR/mo`,
	photoCount: vehicle.images.length || 1,
	priceLabel: vehicle.priceLabel,
	slug: vehicle.slug,
	title: vehicle.title,
	transmission: vehicle.transmission,
	transmissionIcon: vehicle.transmission === 'Manual' ? 'manual.svg' : 'auto.svg',
	year: vehicle.year
});

export const homeFiveVehicleCardsFromVehicles = (vehicles: Vehicle[], limit: number) =>
	vehicles.slice(0, limit).map(homeFiveVehicleCardFromVehicle);

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
