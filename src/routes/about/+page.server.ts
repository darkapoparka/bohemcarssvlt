import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auxeroAboutContent } from '$lib/auxero/about';
import { splitAuxeroDocument, splitAuxeroElementBlockByMarker } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';

export const load: PageServerLoad = ({ request, url }) => {
	const html = renderAuxeroTemplate('about-us.html', {
		request,
		routePath: 'about',
		searchParams: url.searchParams
	});

	if (!html) {
		error(500, 'About template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const aboutSlot = splitAuxeroElementBlockByMarker(
		pageDocument.bodyHtml,
		'data-bohemcars-about',
		'div'
	);

	if (!aboutSlot) {
		error(500, 'About content slot could not be located');
	}

	return {
		about: auxeroAboutContent,
		afterAboutHtml: aboutSlot.afterHtml,
		auxeroFullPage: true,
		beforeAboutHtml: aboutSlot.beforeHtml,
		pageDocument
	};
};
