import type { PageServerLoad } from './$types';
import { importRequestFormData } from '$lib/auxero/services';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ request, url }) => {
	const { pageDocument, slot: importSlot } = renderAuxeroPageSlot(
		'services-center.html',
		{
			request,
			routePath: 'import',
			searchParams: url.searchParams
		},
		{
			marker: 'data-bohemcars-services',
			templateError: 'Import template could not be rendered',
			slotError: 'Import content slot could not be located'
		}
	);

	return {
		afterImportHtml: importSlot.afterHtml,
		auxeroFullPage: true,
		beforeImportHtml: importSlot.beforeHtml,
		form: importRequestFormData(url.searchParams.get('vehicle') ?? ''),
		pageDocument
	};
};
