import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { favoriteCardsFromVehicles } from '$lib/auxero/favorites';
import { canAccessBohemcarsRoute, resolveBohemcarsPageSession } from '$lib/server/auth';
import { getBohemcarsFavoriteVehicles } from '$lib/server/garage';
import { splitAuxeroDivBlockByMarker, splitAuxeroDocument } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account/favorites';
	const session = resolveBohemcarsPageSession(request, routePath, url.searchParams);

	if (!session) {
		error(401, 'Bohemcars account session is required');
	}

	if (!canAccessBohemcarsRoute(session, routePath)) {
		error(403, 'Bohemcars account role cannot access this route');
	}

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};
	const html = renderAuxeroTemplate('my-favorites.html', renderOptions);

	if (!html) {
		error(500, 'Favorites template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const favoritesSlot = splitAuxeroDivBlockByMarker(
		pageDocument.bodyHtml,
		'data-bohemcars-favorites-grid'
	);

	if (!favoritesSlot) {
		error(500, 'Favorites grid slot could not be located');
	}

	return {
		afterFavoritesHtml: favoritesSlot.afterHtml,
		auxeroFullPage: true,
		beforeFavoritesHtml: favoritesSlot.beforeHtml,
		cards: favoriteCardsFromVehicles(getBohemcarsFavoriteVehicles(session)),
		pageDocument
	};
};
