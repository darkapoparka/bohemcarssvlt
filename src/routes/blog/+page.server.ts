import type { PageServerLoad } from './$types';
import { posts } from '$lib/data/blog';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ request, url }) => {
	const { pageDocument, slot: blogSlot } = renderAuxeroPageSlot(
		'blog-grid-style-1.html',
		{
			request,
			routePath: 'blog',
			searchParams: url.searchParams
		},
		{
			marker: 'data-bohemcars-blog-grid',
			templateError: 'Blog template could not be rendered',
			slotError: 'Blog grid slot could not be located'
		}
	);

	return {
		afterBlogHtml: blogSlot.afterHtml,
		auxeroFullPage: true,
		beforeBlogHtml: blogSlot.beforeHtml,
		pageDocument,
		posts
	};
};
