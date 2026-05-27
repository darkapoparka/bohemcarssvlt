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
	const { pageDocument, slot: agentsSlot } = renderAuxeroPageSlot(
		'sale-agents.html',
		renderOptions,
		{
			marker: 'data-bohemcars-agent-management="true"',
			templateError: 'Admin agents template could not be rendered',
			slotError: 'Admin agents grid slot could not be located'
		}
	);

	return {
		afterAgentsHtml: agentsSlot.afterHtml,
		auxeroFullPage: true,
		beforeAgentsHtml: agentsSlot.beforeHtml,
		cards: managedAgentCardsFromAgents(listManagedAgents()),
		management: true,
		pageDocument
	};
};
