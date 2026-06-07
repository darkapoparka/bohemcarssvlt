import type { PageServerLoad } from './$types';
import {
	auxeroCalculatorBudgetLinks,
	auxeroCalculatorData,
	auxeroCalculatorFaqs
} from '$lib/auxero/calculator';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ request, url }) => {
	const { pageDocument, slot: calculatorSlot } = renderAuxeroPageSlot(
		'calculator.html',
		{
			request,
			routePath: 'calculator',
			searchParams: url.searchParams
		},
		{
			marker: 'data-bohemcars-calculator-page',
			templateError: 'Calculator template could not be rendered',
			slotError: 'Calculator page slot could not be located'
		}
	);

	return {
		afterCalculatorHtml: calculatorSlot.afterHtml,
		auxeroFullPage: true,
		beforeCalculatorHtml: calculatorSlot.beforeHtml,
		budgetLinks: auxeroCalculatorBudgetLinks,
		calculator: auxeroCalculatorData,
		faqs: auxeroCalculatorFaqs,
		pageDocument
	};
};
