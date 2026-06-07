import type { PageServerLoad } from './$types';
import { favoriteCardsFromVehicles } from '$lib/auxero/favorites';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import { requireBohemcarsPageSession } from '$lib/server/auth';
import { getBohemcarsFavoriteVehicles } from '$lib/server/garage';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account/favorites';
	const session = requireBohemcarsPageSession(request, routePath, url.searchParams);

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
		dashboard: getAccountDashboardPageData('my-favorites.html', renderOptions, {
			subtitle: 'Saved Bohemcars vehicles stay in one quick review list.',
			title: 'My Favorites'
		}),
		pageDocument
	};
};
