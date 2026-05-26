import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { agentDetailFromAgent } from '$lib/auxero/agent-detail';
import { agents, getAgentBySlug } from '$lib/data/agents';
import { splitAuxeroDivBlockByMarker, splitAuxeroDocument } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';

export const load: PageServerLoad = ({ params, request, url }) => {
	const agent = getAgentBySlug(params.slug) ?? agents[0];
	const renderOptions = {
		request,
		routePath: `agents/${agent.slug}`,
		searchParams: url.searchParams,
		slug: agent.slug
	};
	const html = renderAuxeroTemplate('sale-agents-details.html', renderOptions);

	if (!html) {
		error(500, 'Agent detail template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const detailSlot = splitAuxeroDivBlockByMarker(
		pageDocument.bodyHtml,
		'class="innerpage__content md-mb-30"'
	);

	if (!detailSlot) {
		error(500, 'Agent detail slot could not be located');
	}

	return {
		afterDetailHtml: detailSlot.afterHtml,
		auxeroFullPage: true,
		beforeDetailHtml: detailSlot.beforeHtml,
		detail: agentDetailFromAgent(agent),
		pageDocument
	};
};
