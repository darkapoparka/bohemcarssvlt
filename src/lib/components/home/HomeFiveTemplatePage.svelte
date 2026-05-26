<script lang="ts">
	import HomeFiveBrandStrip from './HomeFiveBrandStrip.svelte';
	import HomeFiveCompareSection from './HomeFiveCompareSection.svelte';
	import HomeFiveTypeGallery from './HomeFiveTypeGallery.svelte';
	import type {
		HomeFiveBrandCard,
		HomeFiveComparePair,
		HomeFiveTypeCard
	} from '$lib/auxero/home-five';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';

	let {
		afterBrandStripHtml,
		afterCompareSectionHtml,
		afterTypeGalleryHtml,
		brandCards,
		comparePairs,
		pageDocument,
		typeCards
	}: {
		afterBrandStripHtml: string;
		afterCompareSectionHtml: string;
		afterTypeGalleryHtml: string;
		brandCards: HomeFiveBrandCard[];
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
