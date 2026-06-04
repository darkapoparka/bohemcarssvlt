import type { PageServerLoad } from './$types';
import { auxeroServicesContent, serviceFormData } from '$lib/auxero/services';
import { removeAuxeroBreadcrumb, renderAuxeroPageSlot } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ request, url }) => {
	const { pageDocument, slot: servicesSlot } = renderAuxeroPageSlot(
		'services-center.html',
		{
			request,
			routePath: 'services',
			searchParams: url.searchParams
		},
		{
			marker: 'data-bohemcars-services',
			templateError: 'Services template could not be rendered',
			slotError: 'Services content slot could not be located'
		}
	);

	return {
		afterServicesHtml: servicesSlot.afterHtml,
		auxeroFullPage: true,
		beforeServicesHtml: removeAuxeroBreadcrumb(servicesSlot.beforeHtml),
		form: serviceFormData,
		pageDocument,
		services: auxeroServicesContent
	};
};
