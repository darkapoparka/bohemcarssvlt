import type { PageServerLoad } from './$types';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import { getAccountListingFormData } from '$lib/server/account-listing-form-state';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';
import { requireBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ params, request, url }) => {
	const routePath = `account/listings/edit/${params.id}`;
	const session = requireBohemcarsPageSession(request, routePath, url.searchParams);

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};
	const { pageDocument, slot: formSlot } = renderAuxeroPageSlot(
		'add-listings-2.html',
		renderOptions,
		{
			marker: 'data-bohemcars-add-listing-form',
			tagName: 'form',
			templateError: 'Account vehicle edit template could not be rendered',
			slotError: 'Account vehicle edit form slot could not be located'
		}
	);

	return {
		afterFormHtml: formSlot.afterHtml,
		auxeroFullPage: true,
		beforeFormHtml: formSlot.beforeHtml,
		dashboard: getAccountDashboardPageData('add-listings-2.html', renderOptions, {
			subtitle: 'Update a submitted vehicle from inside your account workspace.',
			title: 'Edit Submission'
		}),
		form: getAccountListingFormData('add-listings-2.html', renderOptions),
		formHtml: formSlot.sectionHtml,
		pageDocument
	};
};
