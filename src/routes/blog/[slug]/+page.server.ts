import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auxeroBlogDetailForSlug } from '$lib/auxero/blog-detail';
import { splitAuxeroDivBlockByMarker, splitAuxeroDocument } from '$lib/server/auxero-page';
import { renderAuxeroTemplate } from '$lib/server/auxero-template';

export const load: PageServerLoad = ({ params, request, url }) => {
	const content = auxeroBlogDetailForSlug(params.slug);

	if (!content) {
		error(404, 'Blog post not found');
	}

	const html = renderAuxeroTemplate('blog-details-1.html', {
		request,
		routePath: `blog/${params.slug}`,
		searchParams: url.searchParams
	});

	if (!html) {
		error(500, 'Blog detail template could not be rendered');
	}

	const pageDocument = splitAuxeroDocument(html);
	const detailSlot = splitAuxeroDivBlockByMarker(
		pageDocument.bodyHtml,
		'class="innerpage__content md-mb-30"'
	);

	if (!detailSlot) {
		error(500, 'Blog detail content slot could not be located');
	}

	return {
		afterDetailHtml: detailSlot.afterHtml,
		auxeroFullPage: true,
		beforeDetailHtml: detailSlot.beforeHtml,
		content,
		pageDocument
	};
};
