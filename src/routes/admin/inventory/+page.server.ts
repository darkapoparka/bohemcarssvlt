import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { archiveInventoryListing } from '$lib/server/inventory';
import { getAdminCmsOverview, getAdminInventoryRows } from '$lib/server/admin-cms';
import { requireBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const session = requireBohemcarsPageSession(request, 'admin/inventory', url.searchParams);
	const query = (url.searchParams.get('q') ?? '').trim().toLowerCase();
	const status = (url.searchParams.get('status') ?? 'all').toLowerCase();
	const cms = getAdminCmsOverview();
	const rows = getAdminInventoryRows({ includeArchived: status === 'archived' });
	const inventory = rows.filter((vehicle) => {
		const matchesQuery =
			!query ||
			[
				vehicle.title,
				vehicle.brand,
				vehicle.model,
				vehicle.vin,
				vehicle.stockNumber,
				vehicle.fuel,
				vehicle.transmission,
				vehicle.priceLabel,
				vehicle.location
			]
				.join(' ')
				.toLowerCase()
				.includes(query);
		const matchesStatus =
			status === 'all' ? vehicle.status !== 'archived' : vehicle.status === status;

		return matchesQuery && matchesStatus;
	});

	return {
		auxeroFullPage: true,
		cms,
		inventory,
		query,
		session,
		status
	};
};

export const actions: Actions = {
	archive: async ({ request, url }) => {
		requireBohemcarsPageSession(request, 'admin/inventory', url.searchParams);
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '').trim();

		if (!id) {
			return fail(400, { error: 'Listing id is required.' });
		}

		const listing = archiveInventoryListing(id);

		if (!listing) {
			return fail(404, { error: 'Listing could not be archived.' });
		}

		redirect(303, '/admin/inventory?archived=1');
	}
};
