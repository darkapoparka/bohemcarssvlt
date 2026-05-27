import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auxeroBlogDetailForSlug } from '$lib/auxero/blog-detail';
import { renderAuxeroPageSlot } from '$lib/server/auxero-page';

export const load: PageServerLoad = ({ params, request, url }) => {
	const content = auxeroBlogDetailForSlug(params.slug);

	if (!content) {
		error(404, 'Blog post not found');
	}

	const { pageDocument, slot: detailSlot } = renderAuxeroPageSlot(
		'blog-details-1.html',
		{
			request,
			routePath: `blog/${params.slug}`,
			searchParams: url.searchParams
		},
		{
			marker: 'class="innerpage__content md-mb-30"',
			templateError: 'Blog detail template could not be rendered',
			slotError: 'Blog detail content slot could not be located'
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
