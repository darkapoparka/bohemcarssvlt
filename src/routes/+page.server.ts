import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { splitAuxeroDocument } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';

export const load: PageServerLoad = ({ request, url }) => {
	const html = renderAuxeroTemplate('home-05.html', {
		request,
		routePath: '',
		searchParams: url.searchParams
	});

	if (!html) {
		error(500, 'Home 05 template could not be rendered');
	}

	return {
		auxeroFullPage: true,
		pageDocument: splitAuxeroDocument(html)
	};
};
