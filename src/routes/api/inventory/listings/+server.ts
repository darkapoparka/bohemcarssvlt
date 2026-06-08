import { errorJson, okJson, payloadString, readApiPayload } from '$lib/server/api';
import { requireBohemcarsApiAccess } from '$lib/server/api-auth';
import {
	archiveInventoryListing,
	createInventoryListing,
	listInventoryForAdmin,
	updateInventoryListing
} from '$lib/server/inventory';
import type { BohemcarsInventoryListingStatus } from '$lib/server/db';

export function GET({ request, url }: { request: Request; url: URL }) {
	const access = requireBohemcarsApiAccess({
		allowedRoles: ['admin'],
		fallbackRole: url.searchParams.get('role') ?? undefined,
		request,
		routePath: 'admin/inventory'
	});

	if (access.response) return access.response;

	const listings = listInventoryForAdmin();

	return okJson({
		listings,
		vehicles: listings.filter((listing) => listing.source === 'static-vehicle')
	});
}

const inventoryStatus = (
	value: string | undefined
): BohemcarsInventoryListingStatus | undefined => {
	if (value === 'draft' || value === 'published' || value === 'archived') return value;

	return undefined;
};

export async function POST({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const access = requireBohemcarsApiAccess({
		allowedRoles: ['admin'],
		fallbackRole: payloadString(payload, 'actorRole', 'role'),
		request,
		routePath: 'admin/inventory'
	});

	if (access.response) return access.response;

	const title = payloadString(payload, 'title', 'vehicleTitle');

	if (!title) {
		return errorJson('Listing title is required', 400);
	}

	const listing = createInventoryListing({
		mileage: payloadString(payload, 'mileage'),
		priceLabel: payloadString(
			payload,
			'priceLabel',
			'price',
			'expectedPrice',
			'PriceListing',
			'Enternumber'
		),
		routePath: payloadString(payload, 'routePath'),
		status: inventoryStatus(payloadString(payload, 'status')) ?? 'draft',
		title,
		vin: payloadString(payload, 'vin', 'VIN', 'EnterVIN')
	});

	return okJson({ listing }, { status: 201 });
}

export async function PATCH({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const access = requireBohemcarsApiAccess({
		allowedRoles: ['admin'],
		fallbackRole: payloadString(payload, 'actorRole', 'role'),
		request,
		routePath: 'admin/inventory'
	});

	if (access.response) return access.response;

	const id = payloadString(payload, 'id', 'listingId', 'slug');

	if (!id) {
		return errorJson('Listing id is required', 400);
	}

	const listing = updateInventoryListing(id, {
		mileage: payloadString(payload, 'mileage'),
		priceLabel: payloadString(
			payload,
			'priceLabel',
			'price',
			'expectedPrice',
			'PriceListing',
			'Enternumber'
		),
		routePath: payloadString(payload, 'routePath'),
		status: inventoryStatus(payloadString(payload, 'status')),
		title: payloadString(payload, 'title', 'vehicleTitle'),
		vin: payloadString(payload, 'vin', 'VIN', 'EnterVIN')
	});

	if (!listing) {
		return errorJson('Bohemcars inventory listing not found', 404);
	}

	return okJson({ listing });
}

export async function DELETE({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const access = requireBohemcarsApiAccess({
		allowedRoles: ['admin'],
		fallbackRole: payloadString(payload, 'actorRole', 'role'),
		request,
		routePath: 'admin/inventory'
	});

	if (access.response) return access.response;

	const id = payloadString(payload, 'id', 'listingId', 'slug');

	if (!id) {
		return errorJson('Listing id is required', 400);
	}

	const listing = archiveInventoryListing(id);

	if (!listing) {
		return errorJson('Bohemcars inventory listing not found', 404);
	}

	return okJson({ listing });
}
