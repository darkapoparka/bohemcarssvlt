import type { PageServerLoad } from './$types';
import { managedAgentCardsFromAgents } from '$lib/auxero/agents';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';
import { listManagedAgents } from '$lib/server/agents';
import { requireBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'admin/agents';
	const session = requireBohemcarsPageSession(request, routePath, url.searchParams);

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};
	const { pageDocument, slot: agentsSlot } = renderAuxeroPageSlot('dashboard.html', renderOptions, {
		marker: 'dashboard-content--inner',
		templateError: 'Admin agents dashboard template could not be rendered',
		slotError: 'Admin agents dashboard slot could not be located'
	});

	return {
		afterAgentsHtml: agentsSlot.afterHtml,
		auxeroFullPage: true,
		beforeAgentsHtml: agentsSlot.beforeHtml,
		cards: managedAgentCardsFromAgents(listManagedAgents()),
		dashboard: getAccountDashboardPageData('dashboard.html', renderOptions, {
			subtitle: 'Manage Bohemcars agents, lead ownership, and message shortcuts.',
			title: 'Agents'
		}),
		dashboardShell: true,
		management: true,
		pageDocument
	};
};
