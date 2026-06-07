import type { PageServerLoad } from './$types';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import { getAccountListingsData } from '$lib/server/account-listings-state';
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
		dashboard: getAccountDashboardPageData('my-listings.html', renderOptions, {
			subtitle: 'Manage Bohemcars inventory, edit listings, and review availability.',
			title: 'Inventory'
		}),
		listings: getAccountListingsData('my-listings.html', renderOptions),
		listingsHtml: listingsSlot.sectionHtml,
		pageDocument
	};
};
