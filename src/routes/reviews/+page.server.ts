import type { PageServerLoad } from './$types';
import { auxeroReviewCards } from '$lib/auxero/reviews';
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
			marker: 'data-bohemcars-reviews-grid',
			templateError: 'Reviews template could not be rendered',
			slotError: 'Reviews grid slot could not be located'
		}
	);

	return {
		afterReviewsHtml: reviewsSlot.afterHtml,
		auxeroFullPage: true,
		beforeReviewsHtml: reviewsSlot.beforeHtml,
		cards: auxeroReviewCards,
		pageDocument
	};
};
