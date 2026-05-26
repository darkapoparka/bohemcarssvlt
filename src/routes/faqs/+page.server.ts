import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auxeroFaqGroups, featuredFaqs } from '$lib/auxero/faqs';
import { splitAuxeroDocument, splitAuxeroElementBlockByMarker } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';

export const load: PageServerLoad = ({ request, url }) => {
	const html = renderAuxeroTemplate('faqs.html', {
		request,
		routePath: 'faqs',
		searchParams: url.searchParams
	});

	if (!html) {
		error(500, 'FAQ template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const faqsSlot = splitAuxeroElementBlockByMarker(
		pageDocument.bodyHtml,
		'data-bohemcars-faqs',
		'section'
	);

	if (!faqsSlot) {
		error(500, 'FAQ content slot could not be located');
	}

	return {
		afterFaqsHtml: faqsSlot.afterHtml,
		auxeroFullPage: true,
		beforeFaqsHtml: faqsSlot.beforeHtml,
		featured: featuredFaqs,
		groups: auxeroFaqGroups,
		pageDocument
	};
};
