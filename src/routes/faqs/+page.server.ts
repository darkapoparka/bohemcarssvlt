import type { PageServerLoad } from './$types';
import { auxeroFaqGroups, featuredFaqs } from '$lib/auxero/faqs';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ request, url }) => {
	const { pageDocument, slot: faqsSlot } = renderAuxeroPageSlot(
		'faqs.html',
		{
			request,
			routePath: 'faqs',
			searchParams: url.searchParams
		},
		{
			marker: 'data-bohemcars-faqs',
			tagName: 'section',
			templateError: 'FAQ template could not be rendered',
			slotError: 'FAQ content slot could not be located'
		}
	);

	return {
		afterFaqsHtml: faqsSlot.afterHtml,
		auxeroFullPage: true,
		beforeFaqsHtml: faqsSlot.beforeHtml,
		featured: featuredFaqs,
		groups: auxeroFaqGroups,
		pageDocument
	};
};
