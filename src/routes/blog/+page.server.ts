import type { PageServerLoad } from './$types';
import { auxeroBlogListPage } from '$lib/auxero/blog-list';
import { listBlogPosts } from '$lib/server/blog-state';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ request, url }) => {
	const posts = listBlogPosts();
	const { pageDocument, slot: blogSlot } = renderAuxeroPageSlot(
		'blog-grid-style-1.html',
		{
			request,
			routePath: 'blog',
			searchParams: url.searchParams
		},
		{
			marker: 'data-bohemcars-blog-page',
			tagName: 'section',
			templateError: 'Blog template could not be rendered',
			slotError: 'Blog page slot could not be located'
		}
	);

	return {
		afterBlogHtml: blogSlot.afterHtml,
		auxeroFullPage: true,
		beforeBlogHtml: blogSlot.beforeHtml,
		blogPage: auxeroBlogListPage,
		pageDocument,
		posts
	};
};
