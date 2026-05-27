import type { PageServerLoad } from './$types';
import { auxeroTermsSections } from '$lib/auxero/terms';
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
			marker: 'data-bohemcars-terms',
			templateError: 'Terms template could not be rendered',
			slotError: 'Terms content slot could not be located'
		}
	);

	return {
		afterTermsHtml: termsSlot.afterHtml,
		auxeroFullPage: true,
		beforeTermsHtml: termsSlot.beforeHtml,
		pageDocument,
		sections: auxeroTermsSections
	};
};
