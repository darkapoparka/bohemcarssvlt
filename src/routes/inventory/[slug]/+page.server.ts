import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { vehicleDetailFromVehicle } from '$lib/auxero/detail';
import { resolveLocale } from '$lib/i18n/messages';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';
import { getVehicleDetailBySlug } from '$lib/server/vehicle-detail-state';

export const load: PageServerLoad = ({ params, request, url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const vehicle = getVehicleDetailBySlug(params.slug);

	if (!vehicle) {
		error(404, 'Vehicle not found');
	}

	const { pageDocument, slot: detailSlot } = renderAuxeroPageSlot(
		'listing-details-3.html',
		{
			request,
			routePath: `inventory/${params.slug}`,
			searchParams: url.searchParams,
			slug: vehicle.slug
		},
		{
			marker: 'data-bohemcars-detail="true"',
			templateError: 'Vehicle detail template could not be rendered',
			slotError: 'Vehicle detail slot could not be located'
		}
	);

	return {
		afterDetailHtml: detailSlot.afterHtml,
		auxeroFullPage: true,
		beforeDetailHtml: detailSlot.beforeHtml,
		detail: vehicleDetailFromVehicle(vehicle, locale),
		pageDocument
	};
};
