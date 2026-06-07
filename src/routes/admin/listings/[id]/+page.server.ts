import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAdminCmsOverview, getAdminInventoryRow } from '$lib/server/admin-cms';
import { requireBohemcarsPageSession } from '$lib/server/auth';
import {
	createInventoryListing,
	updateInventoryListing,
	type InventoryListingInput
} from '$lib/server/inventory';

const value = (formData: FormData, key: string) => String(formData.get(key) ?? '').trim();
const statusValue = (status: string): InventoryListingInput['status'] =>
	status === 'published' || status === 'archived' || status === 'draft' ? status : 'draft';
const readNotice = (url: URL) => {
	if (url.searchParams.get('created') === '1') return 'Listing created.';
	if (url.searchParams.get('updated') === '1') return 'Listing updated.';

	return '';
};
const readListingValues = (formData: FormData) => ({
	mileage: value(formData, 'mileage'),
	priceLabel: value(formData, 'priceLabel'),
	routePath: value(formData, 'routePath'),
	status: statusValue(value(formData, 'status')),
	title: value(formData, 'title'),
	vin: value(formData, 'vin')
});

export const load: PageServerLoad = ({ params, request, url }) => {
	const routePath = `admin/listings/${params.id}`;
	const session = requireBohemcarsPageSession(request, routePath, url.searchParams);
	const listing = getAdminInventoryRow(params.id);

	if (!listing) {
		error(404, 'Bohemcars inventory listing not found');
	}

	return {
		auxeroFullPage: true,
		cms: getAdminCmsOverview(),
		listing,
		notice: readNotice(url),
		session
	};
};

export const actions: Actions = {
	default: async ({ params, request }) => {
		const formData = await request.formData();
		const source = value(formData, 'source');
		const values = readListingValues(formData);

		if (!values.title) {
			return fail(400, {
				error: 'Listing title is required.',
				values
			});
		}

		const listing =
			source === 'admin-listing'
				? updateInventoryListing(params.id, values)
				: createInventoryListing(values);

		if (!listing) {
			return fail(404, {
				error: 'Listing could not be saved.',
				values
			});
		}

		redirect(303, `/admin/listings/${listing.id}?updated=1`);
	}
};
