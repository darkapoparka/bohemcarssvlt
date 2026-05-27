import type { PageServerLoad } from './$types';
import { getAccountListingFormData } from '$lib/server/account-listing-form-state';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';
import { requireBohemcarsPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ params, request, url }) => {
	const routePath = `admin/inventory/edit/${params.id}`;
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
			templateError: 'Admin listing edit template could not be rendered',
			slotError: 'Admin listing edit form slot could not be located'
		}
	);

	return {
		afterFormHtml: formSlot.afterHtml,
		auxeroFullPage: true,
		beforeFormHtml: formSlot.beforeHtml,
		form: getAccountListingFormData('add-listings-2.html', renderOptions),
		pageDocument
	};
};
