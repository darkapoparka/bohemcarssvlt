import type { PageServerLoad } from './$types';
import { auxeroReviewCards, auxeroReviewsPage } from '$lib/auxero/reviews';
import { resolveLocale } from '$lib/i18n/messages';
import { renderAuxeroPageDocument } from '$lib/server/auxero-page';
import { auxeroPublicShellData } from '$lib/server/auxero-public-shell';

export const load: PageServerLoad = ({ request, url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const pageDocument = renderAuxeroPageDocument(
		'clients-reviews.html',
		{
			request,
			routePath: 'reviews',
			searchParams: url.searchParams
		},
		'Reviews template could not be rendered'
	);

	return {
		auxeroFullPage: true,
		cards: auxeroReviewCards,
		pageDocument,
		reviewsPage: auxeroReviewsPage,
		...auxeroPublicShellData(pageDocument, locale, '/reviews')
	};
};
