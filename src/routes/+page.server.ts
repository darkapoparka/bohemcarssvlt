import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { homeFiveBrandCards, homeFiveTypeCards } from '$lib/auxero/home-five';
import { splitAuxeroBodySection, splitAuxeroDocument } from '$lib/server/auxero-page';
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

	const pageDocument = splitAuxeroDocument(html);
	const brandStripSlot = splitAuxeroBodySection(
		pageDocument.bodyHtml,
		'<!-- Explore Our Brands -->',
		'<!-- /Explore Our Brands -->'
	);
	const typeGallerySlot = splitAuxeroBodySection(
		brandStripSlot?.afterHtml ?? '',
		'<!-- Browse By Type -->',
		'<!-- /Browse By Type -->'
	);

	return {
		afterBrandStripHtml: typeGallerySlot
			? typeGallerySlot.beforeHtml
			: (brandStripSlot?.afterHtml ?? ''),
		afterTypeGalleryHtml: typeGallerySlot?.afterHtml ?? '',
		auxeroFullPage: true,
		brandCards: homeFiveBrandCards,
		pageDocument: {
			...pageDocument,
			bodyHtml: brandStripSlot?.beforeHtml ?? pageDocument.bodyHtml
		},
		typeCards: homeFiveTypeCards
	};
};
