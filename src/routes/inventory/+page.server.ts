import type { PageServerLoad } from './$types';
import { inventoryCardsFromVehicles } from '$lib/auxero/inventory';
import {
	getInventoryState,
	inventoryTemplateForView,
	resolveInventoryView
} from '$lib/server/inventory-state';
import { renderAuxeroPageDocument, splitAuxeroDivBlockByMarker } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ request, url }) => {
	const view = resolveInventoryView(url.searchParams.get('view'));
	const templateFile = inventoryTemplateForView(view);
	const renderOptions = {
		request,
		routePath: 'inventory',
		searchParams: url.searchParams,
		view
	};
	const pageDocument = renderAuxeroPageDocument(
		templateFile,
		renderOptions,
		'Inventory template could not be rendered'
	);
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
