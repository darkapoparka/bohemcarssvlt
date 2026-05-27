import type { PageServerLoad } from './$types';
import { agentDetailFromAgent } from '$lib/auxero/agent-detail';
import { agents, getAgentBySlug } from '$lib/data/agents';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ params, request, url }) => {
	const agent = getAgentBySlug(params.slug) ?? agents[0];
	const renderOptions = {
		request,
		routePath: `agents/${agent.slug}`,
		searchParams: url.searchParams,
		slug: agent.slug
	};
	const { pageDocument, slot: detailSlot } = renderAuxeroPageSlot(
		'sale-agents-details.html',
		renderOptions,
		{
			marker: 'class="innerpage__content md-mb-30"',
			templateError: 'Agent detail template could not be rendered',
			slotError: 'Agent detail slot could not be located'
		}
	);

	return {
		afterDetailHtml: detailSlot.afterHtml,
		auxeroFullPage: true,
		beforeDetailHtml: detailSlot.beforeHtml,
		detail: agentDetailFromAgent(agent),
		pageDocument
	};
};
