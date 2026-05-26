import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { posts } from '$lib/data/blog';
import { splitAuxeroDocument, splitAuxeroElementBlockByMarker } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';

export const load: PageServerLoad = ({ request, url }) => {
	const html = renderAuxeroTemplate('blog-grid-style-1.html', {
		request,
		routePath: 'blog',
		searchParams: url.searchParams
	});

	if (!html) {
		error(500, 'Blog template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const blogSlot = splitAuxeroElementBlockByMarker(
		pageDocument.bodyHtml,
		'data-bohemcars-blog-grid',
		'div'
	);

	if (!blogSlot) {
		error(500, 'Blog grid slot could not be located');
	}

	return {
		afterBlogHtml: blogSlot.afterHtml,
		auxeroFullPage: true,
		beforeBlogHtml: blogSlot.beforeHtml,
		pageDocument,
		posts
	};
};
