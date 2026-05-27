import type { PageServerLoad } from './$types';
import { sellCarFormData } from '$lib/auxero/sell-your-car';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ request, url }) => {
	const { pageDocument, slot: sellFormSlot } = renderAuxeroPageSlot(
		'sell-your-car.html',
		{
			request,
			routePath: 'sell-your-car',
			searchParams: url.searchParams
		},
		{
			marker: 'bohemcars-sell-form',
			tagName: 'form',
			templateError: 'Sell your car template could not be rendered',
			slotError: 'Sell your car form slot could not be located'
		}
	);

	return {
		afterSellFormHtml: sellFormSlot.afterHtml,
		auxeroFullPage: true,
		beforeSellFormHtml: sellFormSlot.beforeHtml,
		form: sellCarFormData,
		pageDocument
	};
};
