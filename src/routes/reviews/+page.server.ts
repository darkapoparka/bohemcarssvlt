import type { PageServerLoad } from './$types';
import { auxeroReviewCards, auxeroReviewsPage } from '$lib/auxero/reviews';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ request, url }) => {
	const { pageDocument, slot: reviewsSlot } = renderAuxeroPageSlot(
		'clients-reviews.html',
		{
			request,
			routePath: 'reviews',
			searchParams: url.searchParams
		},
		{
			marker: 'data-bohemcars-reviews-page',
			tagName: 'section',
			templateError: 'Reviews template could not be rendered',
			slotError: 'Reviews page slot could not be located'
		}
	);

	return {
		afterReviewsHtml: reviewsSlot.afterHtml,
		auxeroFullPage: true,
		beforeReviewsHtml: reviewsSlot.beforeHtml,
		cards: auxeroReviewCards,
		reviewsPage: auxeroReviewsPage,
		pageDocument
	};
};
