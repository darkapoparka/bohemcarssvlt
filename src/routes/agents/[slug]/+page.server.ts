import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { agentDetailFromAgent } from '$lib/auxero/agent-detail';
import { getAgentDetailBySlug } from '$lib/server/agent-detail-state';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ params, request, url }) => {
	const agent = getAgentDetailBySlug(params.slug);

	if (!agent) {
		error(404, 'Agent not found');
	}

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
			marker: 'class="container innerpage-container"',
			templateError: 'Agent detail template could not be rendered',
			slotError: 'Agent detail container slot could not be located'
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
