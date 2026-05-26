<script lang="ts">
	import HomeFiveBrandStrip from './HomeFiveBrandStrip.svelte';
	import HomeFiveBudgetSection from './HomeFiveBudgetSection.svelte';
	import HomeFiveCompareSection from './HomeFiveCompareSection.svelte';
	import HomeFiveFeaturedVehicles from './HomeFiveFeaturedVehicles.svelte';
	import HomeFiveFooter from './HomeFiveFooter.svelte';
	import HomeFiveHeader from './HomeFiveHeader.svelte';
	import HomeFiveHero from './HomeFiveHero.svelte';
	import HomeFiveNewsSection from './HomeFiveNewsSection.svelte';
	import HomeFiveReviewsSection from './HomeFiveReviewsSection.svelte';
	import HomeFiveTypeGallery from './HomeFiveTypeGallery.svelte';
	import type {
		HomeFiveBrandCard,
		HomeFiveComparePair,
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveHeroData,
		HomeFiveNewsPost,
		HomeFiveReview,
		HomeFiveTypeCard,
		HomeFiveVehicleCardData
	} from '$lib/auxero/home-five';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';

	let {
		afterBrandStripHtml,
		afterBudgetSectionHtml,
		afterCompareSectionHtml,
		afterFeaturedVehiclesHtml,
		afterFooterHtml,
		afterHeaderHtml,
		afterHeroHtml,
		afterNewsSectionHtml,
		afterReviewsSectionHtml,
		afterTypeGalleryHtml,
		brandCards,
		budgetVehicles,
		comparePairs,
		featuredVehicles,
		footer,
		header,
		hero,
		newsPosts,
		pageDocument,
		reviews,
		typeCards
	}: {
		afterBrandStripHtml: string;
		afterBudgetSectionHtml: string;
		afterCompareSectionHtml: string;
		afterFeaturedVehiclesHtml: string;
		afterFooterHtml: string;
		afterHeaderHtml: string;
		afterHeroHtml: string;
		afterNewsSectionHtml: string;
		afterReviewsSectionHtml: string;
		afterTypeGalleryHtml: string;
		brandCards: HomeFiveBrandCard[];
		budgetVehicles: HomeFiveVehicleCardData[];
		comparePairs: HomeFiveComparePair[];
		featuredVehicles: HomeFiveVehicleCardData[];
		footer?: HomeFiveFooterData;
		header?: HomeFiveHeaderData;
		hero?: HomeFiveHeroData;
		newsPosts: HomeFiveNewsPost[];
		pageDocument: AuxeroPageDocument;
		reviews: HomeFiveReview[];
		typeCards: HomeFiveTypeCard[];
	} = $props();
	let bodyClassScript = $derived(
		`<script>document.body.className = ${JSON.stringify(pageDocument.bodyClass)};</` + 'script>'
	);
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<svelte:head>{@html pageDocument.headHtml}</svelte:head>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html bodyClassScript}
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html pageDocument.bodyHtml}
<HomeFiveHeader {header} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterHeaderHtml}
<HomeFiveHero {hero} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterHeroHtml}
<HomeFiveFeaturedVehicles vehicles={featuredVehicles} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterFeaturedVehiclesHtml}
<HomeFiveBrandStrip cards={brandCards} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterBrandStripHtml}
<HomeFiveTypeGallery cards={typeCards} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterTypeGalleryHtml}
<HomeFiveCompareSection pairs={comparePairs} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterCompareSectionHtml}
<HomeFiveBudgetSection vehicles={budgetVehicles} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterBudgetSectionHtml}
<HomeFiveReviewsSection {reviews} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterReviewsSectionHtml}
<HomeFiveNewsSection posts={newsPosts} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterNewsSectionHtml}
<HomeFiveFooter {footer} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterFooterHtml}
