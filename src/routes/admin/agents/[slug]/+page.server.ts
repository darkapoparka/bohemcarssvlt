import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import { listManagedAgents } from '$lib/server/agents';
import { requireBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ params, request, url }) => {
	const routePath = `admin/agents/${params.slug}`;
	const session = requireBohemcarsPageSession(request, routePath, url.searchParams);
	const agent = listManagedAgents().find((candidate) => candidate.slug === params.slug);

	if (!agent) {
		error(404, 'Dashboard agent not found');
	}

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};

	return {
		agent,
		dashboard: getAccountDashboardPageData('dashboard.html', renderOptions, {
			subtitle: 'Review agent workload, contact shortcuts, and lead ownership.',
			title: agent.name
		})
	};
};
