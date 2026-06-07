import type { PageServerLoad } from './$types';
import { getAdminCmsOverview } from '$lib/server/admin-cms';
import { requireBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const session = requireBohemcarsPageSession(request, 'admin', url.searchParams);

	return {
		auxeroFullPage: true,
		cms: getAdminCmsOverview(),
		session
	};
};
