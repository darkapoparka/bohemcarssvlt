import type { PageServerLoad } from './$types';
import { inventoryCardsFromVehicles } from '$lib/auxero/inventory';
import { homeFiveHeaderDataForLocale } from '$lib/auxero/home-five';
import { inventoryMobileDataFromState } from '$lib/auxero/inventory-mobile';
import { getMessages, resolveLocale } from '$lib/i18n/messages';
import {
	getInventoryState,
	inventoryTemplateForView,
	resolveInventoryView
} from '$lib/server/inventory-state';
import { renderAuxeroPageDocument, splitAuxeroBodySection } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ request, url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
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
	const headerSlot = splitAuxeroBodySection(
		pageDocument.bodyHtml,
		'<!-- Header -->',
		'<!-- Header -->'
	);
	const inventoryState = getInventoryState(templateFile, renderOptions);

	return {
		auxeroFullPage: true,
		cards: inventoryCardsFromVehicles(inventoryState.selected, locale),
		copy: getMessages(locale).inventory,
		desktopHtml: headerSlot ? headerSlot.afterHtml : '',
		header: headerSlot ? homeFiveHeaderDataForLocale(locale, '/inventory') : undefined,
		mobile: inventoryMobileDataFromState(inventoryState, locale),
		pageDocument: headerSlot ? { ...pageDocument, bodyHtml: headerSlot.beforeHtml } : pageDocument,
		seoTitle: locale === 'bg' ? 'Автомобили — Bohemcars' : 'Cars — Bohemcars',
		view: inventoryState.view
	};
};
