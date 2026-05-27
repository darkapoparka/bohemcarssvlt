import type { PageServerLoad } from './$types';
import { contactFormData } from '$lib/auxero/contact';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ request, url }) => {
	const { pageDocument, slot: contactFormSlot } = renderAuxeroPageSlot(
		'contact-us.html',
		{
			request,
			routePath: 'contact',
			searchParams: url.searchParams
		},
		{
			marker: 'contact-page-form',
			templateError: 'Contact template could not be rendered',
			slotError: 'Contact form slot could not be located'
		}
	);

	return {
		afterContactFormHtml: contactFormSlot.afterHtml,
		auxeroFullPage: true,
		beforeContactFormHtml: contactFormSlot.beforeHtml,
		form: contactFormData,
		pageDocument
	};
};
