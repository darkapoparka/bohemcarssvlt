import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { contactFormData } from '$lib/auxero/contact';
import { splitAuxeroDivBlockByMarker, splitAuxeroDocument } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';

export const load: PageServerLoad = ({ request, url }) => {
	const html = renderAuxeroTemplate('contact-us.html', {
		request,
		routePath: 'contact',
		searchParams: url.searchParams
	});

	if (!html) {
		error(500, 'Contact template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const contactFormSlot = splitAuxeroDivBlockByMarker(pageDocument.bodyHtml, 'contact-page-form');

	if (!contactFormSlot) {
		error(500, 'Contact form slot could not be located');
	}

	return {
		afterContactFormHtml: contactFormSlot.afterHtml,
		auxeroFullPage: true,
		beforeContactFormHtml: contactFormSlot.beforeHtml,
		form: contactFormData,
		pageDocument
	};
};
