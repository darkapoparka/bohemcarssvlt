import type { PageServerLoad } from './$types';
import { inventoryCardsFromVehicles } from '$lib/auxero/inventory';
import { inventoryDesktopDataFromState } from '$lib/auxero/inventory-desktop';
import { inventoryMobileDataFromState } from '$lib/auxero/inventory-mobile';
import type { AuxeroPageDocument } from '$lib/auxero/page-document';
import { getMessages, resolveLocale } from '$lib/i18n/messages';
import {
	defaultInventoryViewForLayout,
	getInventoryState,
	inventoryTemplateForView,
	resolveInventoryLayout,
	resolveInventoryView
} from '$lib/server/inventory-state';
import { renderAuxeroPageDocument } from '$lib/server/auxero-page';
import { auxeroPublicShellData } from '$lib/server/auxero-public-shell';

const inventoryScopeBodyClass = 'bohemcars-inventory-template';
const mergeBodyClasses = (...classNames: string[]) =>
	Array.from(
		new Set(classNames.flatMap((className) => className.trim().split(/\s+/)).filter(Boolean))
	).join(' ');

const withInventoryBodyClass = (pageDocument: AuxeroPageDocument): AuxeroPageDocument => ({
	...pageDocument,
	bodyClass: mergeBodyClasses(pageDocument.bodyClass, inventoryScopeBodyClass)
});

export const load: PageServerLoad = ({ request, url }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const copy = getMessages(locale).inventory;
	const layout = resolveInventoryLayout(url.searchParams);
	const explicitView = url.searchParams.get('view');
	const view = explicitView
		? resolveInventoryView(explicitView)
		: defaultInventoryViewForLayout(layout);
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
	const shellPageDocument = withInventoryBodyClass(pageDocument);
	const inventoryState = getInventoryState(templateFile, renderOptions);

	return {
		auxeroFullPage: true,
		cards: inventoryCardsFromVehicles(inventoryState.selected, locale),
		copy,
		desktop: inventoryDesktopDataFromState(inventoryState, locale),
		mobile: inventoryMobileDataFromState(inventoryState, locale),
		pageDocument: shellPageDocument,
		seoTitle: locale === 'bg' ? 'Автомобили — Bohemcars' : 'Cars — Bohemcars',
		...auxeroPublicShellData(shellPageDocument, locale, '/inventory'),
		view: inventoryState.view
	};
};
