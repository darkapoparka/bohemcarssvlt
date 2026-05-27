import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { favoriteCardsFromVehicles } from '$lib/auxero/favorites';
import { canAccessBohemcarsRoute, resolveBohemcarsPageSession } from '$lib/server/auth';
import { getBohemcarsFavoriteVehicles } from '$lib/server/garage';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';

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
	const { pageDocument, slot: favoritesSlot } = renderAuxeroPageSlot(
		'my-favorites.html',
		renderOptions,
		{
			marker: 'data-bohemcars-favorites-grid',
			templateError: 'Favorites template could not be rendered',
			slotError: 'Favorites grid slot could not be located'
		}
	);

	return {
		afterFavoritesHtml: favoritesSlot.afterHtml,
		auxeroFullPage: true,
		beforeFavoritesHtml: favoritesSlot.beforeHtml,
		cards: favoriteCardsFromVehicles(getBohemcarsFavoriteVehicles(session)),
		pageDocument
	};
};
