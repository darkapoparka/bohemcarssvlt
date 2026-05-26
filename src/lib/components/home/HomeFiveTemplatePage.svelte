<script lang="ts">
	import HomeFiveBrandStrip from './HomeFiveBrandStrip.svelte';
	import HomeFiveBudgetSection from './HomeFiveBudgetSection.svelte';
	import HomeFiveCompareSection from './HomeFiveCompareSection.svelte';
	import HomeFiveTypeGallery from './HomeFiveTypeGallery.svelte';
	import type {
		HomeFiveBrandCard,
		HomeFiveComparePair,
		HomeFiveTypeCard,
		HomeFiveVehicleCardData
	} from '$lib/auxero/home-five';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';

	let {
		afterBrandStripHtml,
		afterBudgetSectionHtml,
		afterCompareSectionHtml,
		afterTypeGalleryHtml,
		brandCards,
		budgetVehicles,
		comparePairs,
		pageDocument,
		typeCards
	}: {
		afterBrandStripHtml: string;
		afterBudgetSectionHtml: string;
		afterCompareSectionHtml: string;
		afterTypeGalleryHtml: string;
		brandCards: HomeFiveBrandCard[];
		budgetVehicles: HomeFiveVehicleCardData[];
		comparePairs: HomeFiveComparePair[];
		pageDocument: AuxeroPageDocument;
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
