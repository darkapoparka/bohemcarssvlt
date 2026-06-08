import { vehicles } from '$lib/data/vehicles';
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
	email?: string;
	expectedPrice?: string;
	message?: string;
	mileage?: string;
	name?: string;
	phone?: string;
	routePath?: string;
	source?: 'sell-your-car' | 'admin-listing' | 'customer-listing';
	status?: BohemcarsVehicleSubmissionStatus;
	title?: string;
	vin?: string;
};

export type VehicleSubmissionUpdateInput = {
	expectedPrice?: string;
	id: string;
	message?: string;
	mileage?: string;
	status?: BohemcarsVehicleSubmissionStatus;
	title?: string;
	vin?: string;
};

export type InventoryListingInput = {
	id?: string;
	mileage?: string;
	priceLabel?: string;
	routePath?: string;
	status?: BohemcarsInventoryListingStatus;
	title?: string;
	vin?: string;
};

export const listInventoryForAdmin = () => [
	...vehicles.map((vehicle) => ({
		id: vehicle.slug,
		mileage: `${vehicle.mileage.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} km`,
		priceLabel: vehicle.priceLabel,
		routePath: `/inventory/${vehicle.slug}`,
		slug: vehicle.slug,
		source: 'static-vehicle' as const,
		status: 'published' as const,
		title: vehicle.title,
		vin: vehicle.vin
	})),
	...listBohemcarsInventoryListings()
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
		mileage: input.mileage,
		priceLabel: input.priceLabel,
		routePath: input.routePath,
		status: input.status,
		title: input.title,
		vin: input.vin
	});

export const updateInventoryListing = (id: string, input: InventoryListingInput) =>
	updateBohemcarsInventoryListingRecord(id, {
		mileage: input.mileage,
		priceLabel: input.priceLabel,
		routePath: input.routePath,
		status: input.status,
		title: input.title,
		vin: input.vin
	});

export const archiveInventoryListing = (id: string) => archiveBohemcarsInventoryListingRecord(id);

export const createVehicleSubmission = (input: VehicleSubmissionInput) => {
	const submission = createBohemcarsVehicleSubmissionRecord({
		contactEmail: input.email,
		contactName: input.name,
		contactPhone: input.phone,
		expectedPrice: input.expectedPrice,
		message: input.message,
		mileage: input.mileage,
		routePath: input.routePath,
		source: input.source,
		status: input.status,
		title: input.title,
		vin: input.vin
	});

	if (submission.source === 'admin-listing') {
		createBohemcarsInventoryListingRecord({
			mileage: submission.mileage,
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
		expectedPrice: input.expectedPrice,
		message: input.message,
		mileage: input.mileage,
		status: input.status,
		title: input.title,
		vin: input.vin
	});

	if (submission?.source === 'admin-listing') {
		updateBohemcarsInventoryListingRecord(submission.id, {
			mileage: submission.mileage,
			priceLabel: submission.expectedPrice,
			status: submission.status === 'published' ? 'published' : 'draft',
			title: submission.title,
			vin: submission.vin
		});
	}

	return submission;
};
