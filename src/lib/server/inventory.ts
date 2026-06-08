import { vehicles } from '$lib/data/vehicles';
import type { BohemcarsCmsDocument, BohemcarsInventoryListingRecord } from '$lib/types/account';
import {
	archiveBohemcarsInventoryListingRecord,
	createBohemcarsInventoryListingRecord,
	createBohemcarsVehicleSubmissionRecord,
	listBohemcarsInventoryListings,
	listBohemcarsVehicleSubmissions,
	updateBohemcarsInventoryListingRecord,
	updateBohemcarsVehicleSubmissionRecord,
	type BohemcarsInventoryListingStatus,
	type BohemcarsVehicleSubmissionStatus
} from './db';

export type VehicleSubmissionInput = {
	documents?: BohemcarsCmsDocument[];
	email?: string;
	expectedPrice?: string;
	galleryImages?: string[];
	message?: string;
	mileage?: string;
	name?: string;
	phone?: string;
	previewImage?: string;
	routePath?: string;
	source?: 'sell-your-car' | 'admin-listing' | 'customer-listing';
	status?: BohemcarsVehicleSubmissionStatus;
	title?: string;
	vin?: string;
};

export type VehicleSubmissionUpdateInput = {
	documents?: BohemcarsCmsDocument[];
	expectedPrice?: string;
	galleryImages?: string[];
	id: string;
	message?: string;
	mileage?: string;
	previewImage?: string;
	status?: BohemcarsVehicleSubmissionStatus;
	title?: string;
	vin?: string;
};

export type InventoryListingInput = {
	bodyType?: string;
	brand?: string;
	color?: string;
	description?: string;
	documents?: BohemcarsCmsDocument[];
	doors?: number | string;
	engine?: string;
	features?: string[] | string;
	fuel?: string;
	galleryImages?: string[];
	id?: string;
	location?: string;
	mileage?: number | string;
	model?: string;
	previewImage?: string;
	price?: number | string;
	priceLabel?: string;
	routePath?: string;
	seats?: number | string;
	slug?: string;
	sourceUrl?: string;
	status?: BohemcarsInventoryListingStatus;
	stockNumber?: string;
	submissionId?: string;
	title?: string;
	transmission?: string;
	vin?: string;
	year?: number | string;
};

const numberFromInput = (value: number | string | undefined) => {
	if (value === undefined) return undefined;
	if (typeof value === 'string' && value.trim() === '') return undefined;

	const parsed = typeof value === 'number' ? value : Number(value.replace(/[^\d.-]/g, ''));

	return Number.isFinite(parsed) ? parsed : undefined;
};

const staticVehicleInventoryRecord = (
	vehicle: (typeof vehicles)[number]
): BohemcarsInventoryListingRecord => ({
	bodyType: vehicle.bodyType,
	brand: vehicle.brand,
	color: vehicle.exterior,
	createdAt: '2026-05-01T00:00:00.000Z',
	description: vehicle.description,
	documents: [],
	doors: 0,
	engine: vehicle.engine,
	features: vehicle.features,
	fuel: vehicle.fuel,
	galleryImages: vehicle.gallery,
	id: vehicle.slug,
	location: vehicle.location,
	mileage: vehicle.mileage,
	model: vehicle.model,
	previewImage: vehicle.image,
	price: vehicle.price,
	priceLabel: vehicle.priceLabel,
	routePath: `/inventory/${vehicle.slug}`,
	seats: 0,
	slug: vehicle.slug,
	source: 'static-vehicle',
	sourceUrl: vehicle.sourceUrl,
	status: 'published',
	stockNumber: vehicle.stockNumber,
	title: vehicle.title,
	transmission: vehicle.transmission,
	updatedAt: '2026-05-01T00:00:00.000Z',
	vin: vehicle.vin,
	year: vehicle.year
});

export const listInventoryForAdmin = ({
	includeArchived = false
}: { includeArchived?: boolean } = {}) => [
	...vehicles.map(staticVehicleInventoryRecord),
	...listBohemcarsInventoryListings({ includeArchived })
];

export const listVehicleSubmissions = () => listBohemcarsVehicleSubmissions();

export const normalizeVehicleSubmissionStatus = (value: string | undefined) => {
	if (
		value === 'draft' ||
		value === 'submitted' ||
		value === 'reviewing' ||
		value === 'published'
	) {
		return value;
	}

	return undefined;
};

export const createInventoryListing = (input: InventoryListingInput) =>
	createBohemcarsInventoryListingRecord({
		bodyType: input.bodyType,
		brand: input.brand,
		color: input.color,
		description: input.description,
		documents: input.documents,
		doors: numberFromInput(input.doors),
		engine: input.engine,
		features: Array.isArray(input.features) ? input.features : input.features?.split(/\r?\n|,/),
		fuel: input.fuel,
		galleryImages: input.galleryImages,
		mileage: numberFromInput(input.mileage),
		location: input.location,
		model: input.model,
		previewImage: input.previewImage,
		price: numberFromInput(input.price),
		priceLabel: input.priceLabel,
		routePath: input.routePath,
		seats: numberFromInput(input.seats),
		slug: input.slug,
		sourceUrl: input.sourceUrl,
		status: input.status,
		stockNumber: input.stockNumber,
		submissionId: input.submissionId,
		title: input.title,
		transmission: input.transmission,
		vin: input.vin,
		year: numberFromInput(input.year)
	});

export const updateInventoryListing = (id: string, input: InventoryListingInput) =>
	updateBohemcarsInventoryListingRecord(id, {
		bodyType: input.bodyType,
		brand: input.brand,
		color: input.color,
		description: input.description,
		documents: input.documents,
		doors: numberFromInput(input.doors),
		engine: input.engine,
		features: Array.isArray(input.features) ? input.features : input.features?.split(/\r?\n|,/),
		fuel: input.fuel,
		galleryImages: input.galleryImages,
		mileage: numberFromInput(input.mileage),
		location: input.location,
		model: input.model,
		previewImage: input.previewImage,
		price: numberFromInput(input.price),
		priceLabel: input.priceLabel,
		routePath: input.routePath,
		seats: numberFromInput(input.seats),
		slug: input.slug,
		sourceUrl: input.sourceUrl,
		status: input.status,
		stockNumber: input.stockNumber,
		title: input.title,
		transmission: input.transmission,
		vin: input.vin,
		year: numberFromInput(input.year)
	});

export const archiveInventoryListing = (id: string) => archiveBohemcarsInventoryListingRecord(id);

export const createVehicleSubmission = (input: VehicleSubmissionInput) => {
	const submission = createBohemcarsVehicleSubmissionRecord({
		contactEmail: input.email,
		contactName: input.name,
		contactPhone: input.phone,
		documents: input.documents,
		expectedPrice: input.expectedPrice,
		galleryImages: input.galleryImages,
		message: input.message,
		mileage: input.mileage,
		previewImage: input.previewImage,
		routePath: input.routePath,
		source: input.source,
		status: input.status,
		title: input.title,
		vin: input.vin
	});

	if (submission.source === 'admin-listing') {
		createBohemcarsInventoryListingRecord({
			description: submission.message,
			mileage: numberFromInput(submission.mileage),
			priceLabel: submission.expectedPrice,
			routePath: submission.routePath,
			status: submission.status === 'published' ? 'published' : 'draft',
			submissionId: submission.id,
			title: submission.title,
			vin: submission.vin
		});
	}

	return submission;
};

export const updateVehicleSubmission = (input: VehicleSubmissionUpdateInput) => {
	const submission = updateBohemcarsVehicleSubmissionRecord(input.id, {
		documents: input.documents,
		expectedPrice: input.expectedPrice,
		galleryImages: input.galleryImages,
		message: input.message,
		mileage: input.mileage,
		previewImage: input.previewImage,
		status: input.status,
		title: input.title,
		vin: input.vin
	});

	if (submission?.source === 'admin-listing') {
		updateBohemcarsInventoryListingRecord(submission.id, {
			mileage: numberFromInput(submission.mileage),
			priceLabel: submission.expectedPrice,
			status: submission.status === 'published' ? 'published' : 'draft',
			title: submission.title,
			vin: submission.vin
		});
	}

	return submission;
};
