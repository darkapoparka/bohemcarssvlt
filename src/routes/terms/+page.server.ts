import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auxeroTermsSections } from '$lib/auxero/terms';
import { splitAuxeroDocument, splitAuxeroElementBlockByMarker } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';

export const load: PageServerLoad = ({ request, url }) => {
	const html = renderAuxeroTemplate('terms.html', {
		request,
		routePath: 'terms',
		searchParams: url.searchParams
	});

	if (!html) {
		error(500, 'Terms template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const termsSlot = splitAuxeroElementBlockByMarker(
		pageDocument.bodyHtml,
		'data-bohemcars-terms',
		'div'
	);

	if (!termsSlot) {
		error(500, 'Terms content slot could not be located');
	}

	return {
		afterTermsHtml: termsSlot.afterHtml,
		auxeroFullPage: true,
		beforeTermsHtml: termsSlot.beforeHtml,
		pageDocument,
		sections: auxeroTermsSections
	};
};
