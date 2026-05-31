<script lang="ts">
	import HomeFiveActionBand from './HomeFiveActionBand.svelte';
	import HomeFiveBrowseSection from './HomeFiveBrowseSection.svelte';
	import HomeFiveBudgetSection from './HomeFiveBudgetSection.svelte';
	import HomeFiveFeaturedVehicles from './HomeFiveFeaturedVehicles.svelte';
	import HomeFiveFooter from './HomeFiveFooter.svelte';
	import HomeFiveHeader from './HomeFiveHeader.svelte';
	import HomeFiveHero from './HomeFiveHero.svelte';
	import HomeFiveModals from './HomeFiveModals.svelte';
	import HomeFiveNewsSection from './HomeFiveNewsSection.svelte';
	import HomeFiveReviewsSection from './HomeFiveReviewsSection.svelte';
	import type {
		HomeFiveBrandCard,
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveHeroData,
		HomeFiveModalsData,
		HomeFiveNewsPost,
		HomeFiveReview,
		HomeFiveTypeCard,
		HomeFiveVehicleCardData,
		HomeFiveVehiclePill
	} from '$lib/auxero/home-five';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { HomePageCopy } from '$lib/i18n/messages';

	let {
		afterBrandStripHtml,
		afterBudgetSectionHtml,
		afterCompareSectionHtml,
		afterFeaturedVehiclesHtml,
		afterFooterHtml,
		afterHeaderHtml,
		afterHeroHtml,
		afterModalsHtml,
		afterNewsSectionHtml,
		afterReviewsSectionHtml,
		afterTypeGalleryHtml,
		brandCards,
		budgetVehicles,
		copy,
		featuredVehicles,
		footer,
		header,
		hero,
		modals,
		newsPosts,
		pageDocument,
		reviews,
		typeCards,
		vehiclePills
	}: {
		afterBrandStripHtml: string;
		afterBudgetSectionHtml: string;
		afterCompareSectionHtml: string;
		afterFeaturedVehiclesHtml: string;
		afterFooterHtml: string;
		afterHeaderHtml: string;
		afterHeroHtml: string;
		afterModalsHtml: string;
		afterNewsSectionHtml: string;
		afterReviewsSectionHtml: string;
		afterTypeGalleryHtml: string;
		brandCards: HomeFiveBrandCard[];
		budgetVehicles: HomeFiveVehicleCardData[];
		copy: HomePageCopy;
		featuredVehicles: HomeFiveVehicleCardData[];
		footer?: HomeFiveFooterData;
		header?: HomeFiveHeaderData;
		hero?: HomeFiveHeroData;
		modals?: HomeFiveModalsData;
		newsPosts: HomeFiveNewsPost[];
		pageDocument: AuxeroPageDocument;
		reviews: HomeFiveReview[];
		typeCards: HomeFiveTypeCard[];
		vehiclePills: HomeFiveVehiclePill[];
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
<main id="main-content">
	<HomeFiveHero {hero} />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html afterHeroHtml}
	<HomeFiveFeaturedVehicles vehicles={featuredVehicles} pills={vehiclePills} {copy} />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html afterFeaturedVehiclesHtml}
	<HomeFiveBrowseSection {brandCards} {typeCards} {copy} {afterBrandStripHtml} />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html afterTypeGalleryHtml}
	<HomeFiveActionBand {copy} />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html afterCompareSectionHtml}
	<HomeFiveBudgetSection vehicles={budgetVehicles} {copy} />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html afterBudgetSectionHtml}
	<HomeFiveReviewsSection {reviews} {copy} />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html afterReviewsSectionHtml}
	<HomeFiveNewsSection posts={newsPosts} {copy} />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html afterNewsSectionHtml}
</main>
<HomeFiveFooter {footer} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterFooterHtml}
<HomeFiveModals {modals} {copy} {header} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterModalsHtml}
