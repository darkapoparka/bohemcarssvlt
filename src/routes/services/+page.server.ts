import type { PageServerLoad } from './$types';
import { serviceFormData } from '$lib/auxero/services';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ request, url }) => {
	const { pageDocument, slot: serviceFormSlot } = renderAuxeroPageSlot(
		'services-center.html',
		{
			request,
			routePath: 'services',
			searchParams: url.searchParams
		},
		{
			marker: 'services-center-form',
			templateError: 'Services template could not be rendered',
			slotError: 'Services form slot could not be located'
		}
	);

	return {
		afterServiceFormHtml: serviceFormSlot.afterHtml,
		auxeroFullPage: true,
		beforeServiceFormHtml: serviceFormSlot.beforeHtml,
		form: serviceFormData,
		pageDocument
	};
};
