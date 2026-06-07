import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auxeroBlogDetailFromState } from '$lib/auxero/blog-detail';
import { getBlogDetailBySlug } from '$lib/server/blog-state';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ params, request, url }) => {
	const detailState = getBlogDetailBySlug(params.slug);

	if (!detailState) {
		error(404, 'Blog post not found');
	}

	const content = auxeroBlogDetailFromState(detailState);

	const { pageDocument, slot: detailSlot } = renderAuxeroPageSlot(
		'blog-details-1.html',
		{
			request,
			routePath: `blog/${params.slug}`,
			searchParams: url.searchParams
		},
		{
			marker: 'data-bohemcars-blog-detail-page',
			templateError: 'Blog detail template could not be rendered',
			slotError: 'Blog detail page slot could not be located'
		}
	);

	return {
		afterDetailHtml: detailSlot.afterHtml,
		auxeroFullPage: true,
		beforeDetailHtml: detailSlot.beforeHtml,
		content,
		pageDocument
	};
};
