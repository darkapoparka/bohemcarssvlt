import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { inventoryCardsFromVehicles } from '$lib/auxero/inventory';
import {
	getInventoryState,
	inventoryTemplateForView,
	resolveInventoryView
} from '$lib/server/auxero-listing-data';
import { splitAuxeroDivBlockByMarker, splitAuxeroDocument } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';

export const load: PageServerLoad = ({ request, url }) => {
	const view = resolveInventoryView(url.searchParams.get('view'));
	const templateFile = inventoryTemplateForView(view);
	const renderOptions = {
		request,
		routePath: 'inventory',
		searchParams: url.searchParams,
		view
	};
	const html = renderAuxeroTemplate(templateFile, renderOptions);

	if (!html) {
		error(500, 'Inventory template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const inventorySlot = splitAuxeroDivBlockByMarker(
		pageDocument.bodyHtml,
		'bohemcars-inventory-content'
	);
	const inventoryState = getInventoryState(templateFile, renderOptions);

	return {
		afterInventoryHtml: inventorySlot?.afterHtml ?? '',
		auxeroFullPage: true,
		beforeInventoryHtml: inventorySlot?.beforeHtml ?? pageDocument.bodyHtml,
		cards: inventorySlot ? inventoryCardsFromVehicles(inventoryState.selected) : [],
		pageDocument,
		view: inventoryState.view
	};
};
