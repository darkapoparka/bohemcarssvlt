import type { PageServerLoad } from './$types';
import { getAuxeroAccountListingsData } from '$lib/server/auxero-account-data';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';
import { requireBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'admin/inventory';
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
			templateError: 'Admin inventory template could not be rendered',
			slotError: 'Admin inventory slot could not be located'
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
