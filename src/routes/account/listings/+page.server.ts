import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAuxeroAccountListingsData } from '$lib/server/auxero-account-data';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';
import { canAccessBohemcarsRoute, resolveBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account/listings';
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
	const { pageDocument, slot: listingsSlot } = renderAuxeroPageSlot(
		'my-listings.html',
		renderOptions,
		{
			marker: 'data-bohemcars-account-listings',
			templateError: 'Account listings template could not be rendered',
			slotError: 'Account listings slot could not be located'
		}
	);

	return {
		afterListingsHtml: listingsSlot.afterHtml,
		auxeroFullPage: true,
		beforeListingsHtml: listingsSlot.beforeHtml,
		listings: getAuxeroAccountListingsData('my-listings.html', renderOptions),
		pageDocument
	};
};
