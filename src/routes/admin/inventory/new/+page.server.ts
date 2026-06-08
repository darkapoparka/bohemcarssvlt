import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { mergeListingUploads, readInventoryListingFields } from '$lib/server/cms-listing-form';
import { getAdminCmsOverview } from '$lib/server/admin-cms';
import { requireBohemcarsPageSession } from '$lib/server/auth';
import { createInventoryListing, updateInventoryListing } from '$lib/server/inventory';

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
		const values = readInventoryListingFields(formData);

		if (!values.title) {
			return fail(400, {
				error: 'Listing title is required.',
				values
			});
		}

		const listing = createInventoryListing(values);
		try {
			const media = await mergeListingUploads({ formData, recordId: listing.id });
			updateInventoryListing(listing.id, media);
		} catch (error) {
			return fail(400, {
				error: error instanceof Error ? error.message : 'Uploaded files could not be saved.',
				values
			});
		}

		redirect(303, `/admin/inventory/edit/${listing.id}?created=1`);
	}
};
