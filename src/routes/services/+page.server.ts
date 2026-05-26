import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { serviceFormData } from '$lib/auxero/services';
import { splitAuxeroDivBlockByMarker, splitAuxeroDocument } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';

export const load: PageServerLoad = ({ request, url }) => {
	const html = renderAuxeroTemplate('services-center.html', {
		request,
		routePath: 'services',
		searchParams: url.searchParams
	});

	if (!html) {
		error(500, 'Services template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const serviceFormSlot = splitAuxeroDivBlockByMarker(
		pageDocument.bodyHtml,
		'services-center-form'
	);

	if (!serviceFormSlot) {
		error(500, 'Services form slot could not be located');
	}

	return {
		afterServiceFormHtml: serviceFormSlot.afterHtml,
		auxeroFullPage: true,
		beforeServiceFormHtml: serviceFormSlot.beforeHtml,
		form: serviceFormData,
		pageDocument
	};
};
