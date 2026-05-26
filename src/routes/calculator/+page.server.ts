import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auxeroCalculatorData } from '$lib/auxero/calculator';
import { splitAuxeroDocument, splitAuxeroElementBlockByMarker } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';

export const load: PageServerLoad = ({ request, url }) => {
	const html = renderAuxeroTemplate('calculator.html', {
		request,
		routePath: 'calculator',
		searchParams: url.searchParams
	});

	if (!html) {
		error(500, 'Calculator template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const calculatorSlot = splitAuxeroElementBlockByMarker(
		pageDocument.bodyHtml,
		'data-bohemcars-calculator',
		'div'
	);

	if (!calculatorSlot) {
		error(500, 'Calculator slot could not be located');
	}

	return {
		afterCalculatorHtml: calculatorSlot.afterHtml,
		auxeroFullPage: true,
		beforeCalculatorHtml: calculatorSlot.beforeHtml,
		calculator: auxeroCalculatorData,
		pageDocument
	};
};
