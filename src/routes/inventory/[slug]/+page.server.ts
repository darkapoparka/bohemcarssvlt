import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { vehicleDetailFromVehicle } from '$lib/auxero/detail';
import { getVehicleBySlug } from '$lib/data/vehicles';
import { splitAuxeroDivBlockByMarker, splitAuxeroDocument } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';

export const load: PageServerLoad = ({ params, request, url }) => {
	const vehicle = getVehicleBySlug(params.slug);

	if (!vehicle) {
		error(404, 'Vehicle not found');
	}

	const html = renderAuxeroTemplate('listing-details-3.html', {
		request,
		routePath: `inventory/${params.slug}`,
		searchParams: url.searchParams,
		slug: vehicle.slug
	});

	if (!html) {
		error(500, 'Vehicle detail template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const detailSlot = splitAuxeroDivBlockByMarker(
		pageDocument.bodyHtml,
		'data-bohemcars-detail="true"'
	);

	if (!detailSlot) {
		error(500, 'Vehicle detail slot could not be located');
	}

	return {
		afterDetailHtml: detailSlot.afterHtml,
		auxeroFullPage: true,
		beforeDetailHtml: detailSlot.beforeHtml,
		detail: vehicleDetailFromVehicle(vehicle),
		pageDocument
	};
};
