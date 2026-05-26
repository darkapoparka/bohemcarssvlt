import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	homeFiveBrandCards,
	homeFiveComparePairsFromVehicles,
	homeFiveTypeCards
} from '$lib/auxero/home-five';
import { vehicles } from '$lib/data/vehicles';
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
	const compareSectionSlot = splitAuxeroBodySection(
		typeGallerySlot?.afterHtml ?? '',
		'<!-- Compare Top Rated Vehicles -->',
		'<!-- /Compare Top Rated Vehicles -->'
	);

	return {
		afterBrandStripHtml: typeGallerySlot
			? typeGallerySlot.beforeHtml
			: (brandStripSlot?.afterHtml ?? ''),
		afterCompareSectionHtml: compareSectionSlot?.afterHtml ?? '',
		afterTypeGalleryHtml: compareSectionSlot
			? compareSectionSlot.beforeHtml
			: (typeGallerySlot?.afterHtml ?? ''),
		auxeroFullPage: true,
		brandCards: homeFiveBrandCards,
		comparePairs: homeFiveComparePairsFromVehicles(vehicles),
		pageDocument: {
			...pageDocument,
			bodyHtml: brandStripSlot?.beforeHtml ?? pageDocument.bodyHtml
		},
		typeCards: homeFiveTypeCards
	};
};
