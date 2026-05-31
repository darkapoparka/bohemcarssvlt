import {
	homeFiveBrandCardsForLocale,
	homeFiveComparePairsFromVehicles,
	homeFiveFooterDataForLocale,
	homeFiveHeaderDataForLocale,
	homeFiveHeroDataFromVehicles,
	homeFiveModalsDataFromVehicles,
	homeFiveNewsPostsFromPosts,
	homeFiveReviewItems,
	homeFiveTypeCardsForLocale,
	homeFiveVehicleCardsFromVehicles,
	homeFiveVehiclePillsForLocale
} from '$lib/auxero/home-five';
import { posts } from '$lib/data/blog';
import { vehicles } from '$lib/data/vehicles';
import { getMessages, resolveLocale } from '$lib/i18n/messages';
import { renderAuxeroPageDocument, splitAuxeroBodySection } from '$lib/server/auxero-page';

export const buildHomeFivePageData = ({ request, url }: { request: Request; url: URL }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const messages = getMessages(locale);
	const pageDocument = renderAuxeroPageDocument(
		'home-05.html',
		{
			request,
			routePath: '',
			searchParams: url.searchParams
		},
		'Home 05 template could not be rendered'
	);
	const headerSlot = splitAuxeroBodySection(
		pageDocument.bodyHtml,
		'<!-- Header -->',
		'<!-- Header -->'
	);
	const heroSlot = splitAuxeroBodySection(
		headerSlot?.afterHtml ?? pageDocument.bodyHtml,
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
	const modalSlot = splitAuxeroBodySection(
		footerSlot?.afterHtml ?? '',
		'<!-- Modal -->',
		'<!-- /CompareModal -->'
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
		afterFooterHtml: modalSlot ? modalSlot.beforeHtml : (footerSlot?.afterHtml ?? ''),
		afterHeaderHtml: headerSlot ? (heroSlot?.beforeHtml ?? '') : '',
		afterNewsSectionHtml: footerSlot ? footerSlot.beforeHtml : (newsSectionSlot?.afterHtml ?? ''),
		afterReviewsSectionHtml: newsSectionSlot
			? newsSectionSlot.beforeHtml
			: (reviewsSectionSlot?.afterHtml ?? ''),
		afterTypeGalleryHtml: compareSectionSlot
			? compareSectionSlot.beforeHtml
			: (typeGallerySlot?.afterHtml ?? ''),
		afterModalsHtml: modalSlot?.afterHtml ?? '',
		auxeroFullPage: true,
		brandCards: homeFiveBrandCardsForLocale(locale),
		budgetVehicles: homeFiveVehicleCardsFromVehicles(vehicles, 8, locale),
		comparePairs: homeFiveComparePairsFromVehicles(vehicles),
		copy: messages.home,
		featuredVehicles: featuredVehiclesSlot
			? homeFiveVehicleCardsFromVehicles(vehicles, 8, locale)
			: [],
		footer: footerSlot ? homeFiveFooterDataForLocale(locale) : undefined,
		header: headerSlot ? homeFiveHeaderDataForLocale(locale) : undefined,
		hero: heroSlot ? homeFiveHeroDataFromVehicles(vehicles, locale) : undefined,
		modals: modalSlot ? homeFiveModalsDataFromVehicles(vehicles, locale) : undefined,
		newsPosts: newsSectionSlot ? homeFiveNewsPostsFromPosts(posts) : [],
		pageDocument: {
			...pageDocument,
			headHtml: pageDocument.headHtml.replace(/<title>[\s\S]*?<\/title>/i, ''),
			bodyHtml:
				headerSlot?.beforeHtml ??
				heroSlot?.beforeHtml ??
				featuredVehiclesSlot?.beforeHtml ??
				pageDocument.bodyHtml
		},
		reviews: reviewsSectionSlot ? homeFiveReviewItems : [],
		typeCards: homeFiveTypeCardsForLocale(locale),
		vehiclePills: homeFiveVehiclePillsForLocale(locale)
	};
};
