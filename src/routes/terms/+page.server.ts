import type { PageServerLoad } from './$types';
import { auxeroTermsPageTitle, auxeroTermsSections } from '$lib/auxero/terms';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ request, url }) => {
	const { pageDocument, slot: termsSlot } = renderAuxeroPageSlot(
		'terms.html',
		{
			request,
			routePath: 'terms',
			searchParams: url.searchParams
		},
		{
			marker: 'data-bohemcars-terms-page',
			tagName: 'section',
			templateError: 'Terms template could not be rendered',
			slotError: 'Terms page slot could not be located'
		}
	);

	return {
		afterTermsHtml: termsSlot.afterHtml,
		auxeroFullPage: true,
		beforeTermsHtml: termsSlot.beforeHtml,
		pageDocument,
		sections: auxeroTermsSections,
		title: auxeroTermsPageTitle
	};
};
