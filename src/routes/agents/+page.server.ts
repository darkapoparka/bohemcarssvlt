import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { agentCardsFromAgents } from '$lib/auxero/agents';
import { agents } from '$lib/data/agents';
import { splitAuxeroDivBlockByMarker, splitAuxeroDocument } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';

export const load: PageServerLoad = ({ request, url }) => {
	const renderOptions = {
		request,
		routePath: 'agents',
		searchParams: url.searchParams
	};
	const html = renderAuxeroTemplate('sale-agents.html', renderOptions);

	if (!html) {
		error(500, 'Agents template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const agentsSlot = splitAuxeroDivBlockByMarker(
		pageDocument.bodyHtml,
		'data-bohemcars-agent-management="false"'
	);

	if (!agentsSlot) {
		error(500, 'Agents grid slot could not be located');
	}

	return {
		afterAgentsHtml: agentsSlot.afterHtml,
		auxeroFullPage: true,
		beforeAgentsHtml: agentsSlot.beforeHtml,
		cards: agentCardsFromAgents(agents),
		pageDocument
	};
};
