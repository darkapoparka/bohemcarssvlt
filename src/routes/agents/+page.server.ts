import type { PageServerLoad } from './$types';
import { agentCardsFromAgents } from '$lib/auxero/agents';
import { listAgentDetails } from '$lib/server/agent-detail-state';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ request, url }) => {
	const agentList = listAgentDetails();
	const renderOptions = {
		request,
		routePath: 'agents',
		searchParams: url.searchParams
	};
	const { pageDocument, slot: agentsSlot } = renderAuxeroPageSlot(
		'sale-agents.html',
		renderOptions,
		{
			marker: 'data-bohemcars-agent-management="false"',
			templateError: 'Agents template could not be rendered',
			slotError: 'Agents grid slot could not be located'
		}
	);

	return {
		afterAgentsHtml: agentsSlot.afterHtml,
		auxeroFullPage: true,
		beforeAgentsHtml: agentsSlot.beforeHtml,
		cards: agentCardsFromAgents(agentList),
		pageDocument
	};
};
