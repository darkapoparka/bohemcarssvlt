import type { PageServerLoad } from './$types';
import { getAdminCmsOverview } from '$lib/server/admin-cms';
import { requireBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const session = requireBohemcarsPageSession(request, 'admin/inventory', url.searchParams);
	const query = (url.searchParams.get('q') ?? '').trim().toLowerCase();
	const status = (url.searchParams.get('status') ?? 'all').toLowerCase();
	const cms = getAdminCmsOverview();
	const inventory = cms.inventory.filter((vehicle) => {
		const matchesQuery =
			!query ||
			[vehicle.title, vehicle.brand, vehicle.vin, vehicle.fuel, vehicle.priceLabel]
				.join(' ')
				.toLowerCase()
				.includes(query);
		const matchesStatus = status === 'all' || vehicle.status === status;

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
