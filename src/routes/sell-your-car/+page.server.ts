import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { sellCarFormData } from '$lib/auxero/sell-your-car';
import { splitAuxeroDocument, splitAuxeroElementBlockByMarker } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';

export const load: PageServerLoad = ({ request, url }) => {
	const html = renderAuxeroTemplate('sell-your-car.html', {
		request,
		routePath: 'sell-your-car',
		searchParams: url.searchParams
	});

	if (!html) {
		error(500, 'Sell your car template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const sellFormSlot = splitAuxeroElementBlockByMarker(
		pageDocument.bodyHtml,
		'bohemcars-sell-form',
		'form'
	);

	if (!sellFormSlot) {
		error(500, 'Sell your car form slot could not be located');
	}

	return {
		afterSellFormHtml: sellFormSlot.afterHtml,
		auxeroFullPage: true,
		beforeSellFormHtml: sellFormSlot.beforeHtml,
		form: sellCarFormData,
		pageDocument
	};
};
