import {
	getRelatedVehicles,
	vehicles,
	type Vehicle,
	type VehicleCondition
} from '$lib/data/vehicles';
import { listBohemcarsInventoryListings } from './db';

const fallbackImage = '/assets/images/card/card-1.jpg';

const conditionForListing = (status: string): VehicleCondition =>
	status === 'published' ? 'Used' : 'Certified';

const priceNumber = (value: unknown, fallback = 0) => {
	if (typeof value === 'number' && Number.isFinite(value)) return value;

	const parsed = Number(String(value ?? '').replace(/[^\d.-]/g, ''));

	return Number.isFinite(parsed) ? parsed : fallback;
};

const listingVehicleImageSet = (previewImage: string, galleryImages: string[]) =>
	Array.from(new Set([previewImage, ...galleryImages].filter(Boolean)));

export const vehicleFromCmsListing = (
	listing: ReturnType<typeof listBohemcarsInventoryListings>[number]
): Vehicle => {
	const price = priceNumber(listing.price);
	const image = listing.previewImage || listing.galleryImages[0] || fallbackImage;
	const images = listingVehicleImageSet(image, listing.galleryImages);

	return {
		agentSlug: 'bohemcars-sales',
		bodyType: listing.bodyType,
		brand: listing.brand,
		condition: conditionForListing(listing.status),
		dealerSlug: 'bohemcars-plovdiv',
		description: listing.description,
		engine: listing.engine,
		exterior: listing.color,
		features: listing.features,
		fuel: listing.fuel,
		gallery: images.length ? images : [fallbackImage],
		image,
		images,
		interior: 'On request',
		isClientVehicle: false,
		location: listing.location,
		mileage: listing.mileage,
		model: listing.model,
		monthly: price > 0 ? Math.round(price / 72) : 0,
		price,
		priceBgn: listing.status === 'published' ? 'Vehicle in the VAT system' : 'On request',
		priceLabel: listing.priceLabel,
		rating: 4.9,
		slug: listing.slug,
		sourceUrl: listing.sourceUrl,
		stockNumber: listing.stockNumber,
		tag: 'Available',
		tagTone: 'lime',
		title: listing.title,
		transmission: listing.transmission,
		vin: listing.vin,
		year: listing.year
	};
};

export const listPublishedCmsVehicles = () =>
	listBohemcarsInventoryListings()
		.filter((listing) => listing.status === 'published')
		.map(vehicleFromCmsListing);

export const listPublicVehicles = () => [...vehicles, ...listPublishedCmsVehicles()];

export const getPublicVehicleBySlug = (slug: string) =>
	vehicles.find((vehicle) => vehicle.slug === slug) ??
	listPublishedCmsVehicles().find((vehicle) => vehicle.slug === slug);

export const getRelatedPublicVehicles = (vehicle: Vehicle, limit = 4) => {
	const source = listPublicVehicles();
	const staticRelated = vehicles.some((candidate) => candidate.slug === vehicle.slug)
		? getRelatedVehicles(vehicle, limit)
		: [];
	const closeMatches = source.filter(
		(candidate) =>
			candidate.slug !== vehicle.slug &&
			(candidate.brand === vehicle.brand || candidate.bodyType === vehicle.bodyType)
	);
	const fallback = source.filter(
		(candidate) =>
			candidate.slug !== vehicle.slug &&
			!closeMatches.some((match) => match.slug === candidate.slug)
	);

	return [...staticRelated, ...closeMatches, ...fallback]
		.filter(
			(candidate, index, all) => all.findIndex((match) => match.slug === candidate.slug) === index
		)
		.slice(0, limit);
};
