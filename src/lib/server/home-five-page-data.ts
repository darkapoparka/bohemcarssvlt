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
	homeFiveVehiclePillsForLocale,
	resolveHomeFiveHeroActionMode
} from '$lib/auxero/home-five';
import { homeTwoBudgetTilesFromVehicles } from '$lib/auxero/home-two';
import { parseAuxeroHeadAssets } from '$lib/auxero/page-document';
import { posts } from '$lib/data/blog';
import { vehicles } from '$lib/data/vehicles';
import { getMessages, resolveLocale } from '$lib/i18n/messages';
import {
	extractAuxeroBodyScriptsHtml,
	extractAuxeroRuntimeHtml,
	renderAuxeroPageDocument
} from '$lib/server/auxero-page';

const escapeHeadAttribute = (value: string) =>
	value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const buildHomeFivePageData = ({ request, url }: { request: Request; url: URL }) => {
	const locale = resolveLocale(url.searchParams.get('lang'));
	const activeHeroMode = resolveHomeFiveHeroActionMode(url.searchParams.get('intent'));
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
	const runtimeHtml = [
		extractAuxeroBodyScriptsHtml(pageDocument.bodyHtml),
		extractAuxeroRuntimeHtml(pageDocument.bodyHtml)
	]
		.filter(Boolean)
		.join('\n');

	// Feature only cars that carry a genuine remote listing photo so the homepage
	// card grid reads as one consistent set of real photos. Cars whose source photo
	// was missing/mismatched fall back to a local studio cutout or a generic stock
	// shot (e.g. the X5's remote photo is a 7-series sedan); those are kept out of the
	// grid here rather than mixing cutouts and stock images among the real listings.
	const vehiclesWithListingPhoto = vehicles.filter((vehicle) => /^https?:\/\//.test(vehicle.image));
	const homeHeadHtml = `${pageDocument.headHtml.replace(/<title>[\s\S]*?<\/title>/i, '')}
<meta name="description" content="${escapeHeadAttribute(messages.home.seo.description)}">
<link rel="preload" as="image" fetchpriority="high" href="/assets/bohemcars/megamenu/inventory-bmw-x5-cutout.webp" type="image/webp">
<link rel="preload" as="image" fetchpriority="high" href="/assets/bohemcars/megamenu/inventory-audi-sq5-cutout.webp" type="image/webp">`;

	return {
		auxeroFullPage: true,
		brandCards: homeFiveBrandCardsForLocale(locale),
		comparePairs: homeFiveComparePairsFromVehicles(vehicles),
		copy: messages.home,
		featuredVehicles: homeFiveVehicleCardsFromVehicles(vehiclesWithListingPhoto, 8, locale),
		footer: homeFiveFooterDataForLocale(locale),
		header: homeFiveHeaderDataForLocale(locale),
		hero: homeFiveHeroDataFromVehicles(vehicles, locale, activeHeroMode),
		homeTwoBudgetTiles: homeTwoBudgetTilesFromVehicles(vehicles, locale),
		modals: homeFiveModalsDataFromVehicles(vehicles, locale),
		newsPosts: homeFiveNewsPostsFromPosts(posts),
		pageDocument: {
			...pageDocument,
			headAssets: parseAuxeroHeadAssets(homeHeadHtml),
			headHtml: homeHeadHtml,
			bodyHtml: ''
		},
		reviews: homeFiveReviewItems,
		runtimeHtml,
		typeCards: homeFiveTypeCardsForLocale(locale),
		vehiclePills: homeFiveVehiclePillsForLocale(locale)
	};
};
