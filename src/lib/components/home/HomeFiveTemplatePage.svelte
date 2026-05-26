<script lang="ts">
	import HomeFiveBrandStrip from './HomeFiveBrandStrip.svelte';
	import HomeFiveTypeGallery from './HomeFiveTypeGallery.svelte';
	import type { HomeFiveBrandCard, HomeFiveTypeCard } from '$lib/auxero/home-five';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';

	let {
		afterBrandStripHtml,
		afterTypeGalleryHtml,
		brandCards,
		pageDocument,
		typeCards
	}: {
		afterBrandStripHtml: string;
		afterTypeGalleryHtml: string;
		brandCards: HomeFiveBrandCard[];
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
