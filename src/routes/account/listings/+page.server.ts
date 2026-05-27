import type { PageServerLoad } from './$types';
import { getAccountListingsData } from '$lib/server/account-listings-state';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';
import { requireBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account/listings';
	const session = requireBohemcarsPageSession(request, routePath, url.searchParams);

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
		listings: getAccountListingsData('my-listings.html', renderOptions),
		pageDocument
	};
};
