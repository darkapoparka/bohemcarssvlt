import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auxeroReviewCards } from '$lib/auxero/reviews';
import { splitAuxeroDocument, splitAuxeroElementBlockByMarker } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';

export const load: PageServerLoad = ({ request, url }) => {
	const html = renderAuxeroTemplate('clients-reviews.html', {
		request,
		routePath: 'reviews',
		searchParams: url.searchParams
	});

	if (!html) {
		error(500, 'Reviews template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const reviewsSlot = splitAuxeroElementBlockByMarker(
		pageDocument.bodyHtml,
		'data-bohemcars-reviews-grid',
		'div'
	);

	if (!reviewsSlot) {
		error(500, 'Reviews grid slot could not be located');
	}

	return {
		afterReviewsHtml: reviewsSlot.afterHtml,
		auxeroFullPage: true,
		beforeReviewsHtml: reviewsSlot.beforeHtml,
		cards: auxeroReviewCards,
		pageDocument
	};
};
