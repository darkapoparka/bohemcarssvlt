import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	homeFiveBrandCards,
	homeFiveComparePairsFromVehicles,
	homeFiveFooterData,
	homeFiveHeroDataFromVehicles,
	homeFiveNewsPostsFromPosts,
	homeFiveReviewItems,
	homeFiveTypeCards,
	homeFiveVehicleCardsFromVehicles
} from '$lib/auxero/home-five';
import { posts } from '$lib/data/blog';
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
	const heroSlot = splitAuxeroBodySection(
		pageDocument.bodyHtml,
		'<!-- page-title -->',
		'<!-- page-title -->'
	);
	const featuredVehiclesSlot = splitAuxeroBodySection(
		heroSlot?.afterHtml ?? pageDocument.bodyHtml,
		'<!-- New Vehicles -->',
		'<!-- /New Vehicles -->'
	);
	const brandStripSlot = splitAuxeroBodySection(
		featuredVehiclesSlot?.afterHtml ?? pageDocument.bodyHtml,
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
	const budgetSectionSlot = splitAuxeroBodySection(
		compareSectionSlot?.afterHtml ?? '',
		'<!-- Used Cars by Budget -->',
		'<!-- /Used Cars by Budget -->'
	);
	const reviewsSectionSlot = splitAuxeroBodySection(
		budgetSectionSlot?.afterHtml ?? '',
		'<!-- /Client Reviews -->',
		'<!-- /Client Reviews -->'
	);
	const newsSectionSlot = splitAuxeroBodySection(
		reviewsSectionSlot?.afterHtml ?? '',
		'<!-- News & Reviews -->',
		'<!-- /News & Reviews -->'
	);
	const footerSlot = splitAuxeroBodySection(
		newsSectionSlot?.afterHtml ?? '',
		'<!-- Footer -->',
		'<!-- Footer -->'
	);

	return {
		afterBrandStripHtml: typeGallerySlot
			? typeGallerySlot.beforeHtml
			: (brandStripSlot?.afterHtml ?? ''),
		afterBudgetSectionHtml: reviewsSectionSlot
			? reviewsSectionSlot.beforeHtml
			: (budgetSectionSlot?.afterHtml ?? ''),
		afterCompareSectionHtml: budgetSectionSlot
			? budgetSectionSlot.beforeHtml
			: (compareSectionSlot?.afterHtml ?? ''),
		afterFeaturedVehiclesHtml: brandStripSlot
			? brandStripSlot.beforeHtml
			: (featuredVehiclesSlot?.afterHtml ?? ''),
		afterHeroHtml: heroSlot
			? featuredVehiclesSlot
				? featuredVehiclesSlot.beforeHtml
				: heroSlot.afterHtml
			: '',
		afterFooterHtml: footerSlot?.afterHtml ?? '',
		afterNewsSectionHtml: footerSlot ? footerSlot.beforeHtml : (newsSectionSlot?.afterHtml ?? ''),
		afterReviewsSectionHtml: newsSectionSlot
			? newsSectionSlot.beforeHtml
			: (reviewsSectionSlot?.afterHtml ?? ''),
		afterTypeGalleryHtml: compareSectionSlot
			? compareSectionSlot.beforeHtml
			: (typeGallerySlot?.afterHtml ?? ''),
		auxeroFullPage: true,
		brandCards: homeFiveBrandCards,
		budgetVehicles: homeFiveVehicleCardsFromVehicles(vehicles, 9),
		comparePairs: homeFiveComparePairsFromVehicles(vehicles),
		featuredVehicles: featuredVehiclesSlot ? homeFiveVehicleCardsFromVehicles(vehicles, 6) : [],
		footer: footerSlot ? homeFiveFooterData : undefined,
		hero: heroSlot ? homeFiveHeroDataFromVehicles(vehicles) : undefined,
		newsPosts: newsSectionSlot ? homeFiveNewsPostsFromPosts(posts) : [],
		pageDocument: {
			...pageDocument,
			bodyHtml: heroSlot?.beforeHtml ?? featuredVehiclesSlot?.beforeHtml ?? pageDocument.bodyHtml
		},
		reviews: reviewsSectionSlot ? homeFiveReviewItems : [],
		typeCards: homeFiveTypeCards
	};
};
