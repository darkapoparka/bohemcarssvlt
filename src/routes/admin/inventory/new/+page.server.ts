import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAdminCmsOverview } from '$lib/server/admin-cms';
import { requireBohemcarsPageSession } from '$lib/server/auth';
import { createInventoryListing, type InventoryListingInput } from '$lib/server/inventory';

const value = (formData: FormData, key: string) => String(formData.get(key) ?? '').trim();
const statusValue = (status: string): InventoryListingInput['status'] =>
	status === 'published' || status === 'archived' || status === 'draft' ? status : 'draft';
const readListingValues = (formData: FormData) => ({
	mileage: value(formData, 'mileage'),
	priceLabel: value(formData, 'priceLabel'),
	routePath: value(formData, 'routePath'),
	status: statusValue(value(formData, 'status')),
	title: value(formData, 'title'),
	vin: value(formData, 'vin')
});

export const load: PageServerLoad = ({ request, url }) => {
	const session = requireBohemcarsPageSession(request, 'admin/inventory/new', url.searchParams);

	return {
		auxeroFullPage: true,
		cms: getAdminCmsOverview(),
		session
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const values = readListingValues(formData);

		if (!values.title) {
			return fail(400, {
				error: 'Listing title is required.',
				values
			});
		}

		const listing = createInventoryListing(values);

		redirect(303, `/admin/listings/${listing.id}?created=1`);
	}
};
