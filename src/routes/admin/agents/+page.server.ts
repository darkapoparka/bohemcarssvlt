import type { PageServerLoad } from './$types';
import { managedAgentCardsFromAgents } from '$lib/auxero/agents';
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
		dashboardShell: true,
		management: true,
		pageDocument
	};
};
