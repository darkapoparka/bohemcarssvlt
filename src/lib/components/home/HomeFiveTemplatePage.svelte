<script lang="ts">
	import type {
		HomeFiveBrandCard,
		HomeFiveComparePair,
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
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import HomeFiveActionBand from './HomeFiveActionBand.svelte';
	import HomeFiveBrowseSection from './HomeFiveBrowseSection.svelte';
	import HomeFiveCompareSection from './HomeFiveCompareSection.svelte';
	import HomeFiveFeaturedVehicles from './HomeFiveFeaturedVehicles.svelte';
	import HomeFiveHero from './HomeFiveHero.svelte';
	import HomeFiveNewsSection from './HomeFiveNewsSection.svelte';
	import HomeFiveReviewsSection from './HomeFiveReviewsSection.svelte';

	let {
		brandCards,
		comparePairs,
		copy,
		featuredVehicles,
		footer,
		header,
		hero,
		modals,
		newsPosts,
		pageDocument,
		reviews,
		runtimeHtml,
		seoTitle,
		typeCards,
		vehiclePills
	}: {
		brandCards: HomeFiveBrandCard[];
		comparePairs: HomeFiveComparePair[];
		copy: HomePageCopy;
		featuredVehicles: HomeFiveVehicleCardData[];
		footer?: HomeFiveFooterData;
		header?: HomeFiveHeaderData;
		hero?: HomeFiveHeroData;
		modals?: HomeFiveModalsData;
		newsPosts: HomeFiveNewsPost[];
		pageDocument: AuxeroPageDocument;
		reviews: HomeFiveReview[];
		runtimeHtml?: string;
		seoTitle?: string;
		typeCards: HomeFiveTypeCard[];
		vehiclePills: HomeFiveVehiclePill[];
	} = $props();
</script>

<AuxeroPublicShell
	{copy}
	{footer}
	{header}
	hideMobileLogo
	mainId="main-content"
	{modals}
	{pageDocument}
	{runtimeHtml}
	title={seoTitle}
>
	<HomeFiveHero {hero} />
	<HomeFiveActionBand {copy} />
	<HomeFiveFeaturedVehicles vehicles={featuredVehicles} pills={vehiclePills} {copy} />
	<HomeFiveBrowseSection {brandCards} {typeCards} {copy} />
	<HomeFiveCompareSection pairs={comparePairs} {copy} />
	<HomeFiveReviewsSection {reviews} {copy} />
	<HomeFiveNewsSection posts={newsPosts} {copy} />
</AuxeroPublicShell>

<style>
	:global(#main-content) {
		background: var(--bc-bg);
	}

	@media (max-width: 767px) {
		:global(#main-content) {
			background: var(--bc-bg);
			display: flex;
			flex-direction: column;
		}

		:global(#main-content > *) {
			order: 90;
		}

		:global(#main-content > .bohemcars-mobile-home) {
			order: 10;
		}

		:global(#main-content > .bohemcars-mobile-home-quick) {
			order: 20;
		}

		:global(#main-content > .bohemcars-featured-vehicles) {
			order: 30;
		}

		:global(#main-content > .bohemcars-browse-section) {
			order: 40;
		}

		:global(#main-content > .bohemcars-action-band) {
			order: 50;
		}
	}
</style>
