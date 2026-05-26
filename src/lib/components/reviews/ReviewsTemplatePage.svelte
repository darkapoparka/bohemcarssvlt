<script lang="ts">
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { AuxeroReviewCard } from '$lib/auxero/reviews';
	import AuxeroReviewsGrid from './AuxeroReviewsGrid.svelte';

	let {
		afterReviewsHtml,
		beforeReviewsHtml,
		cards,
		pageDocument
	}: {
		afterReviewsHtml: string;
		beforeReviewsHtml: string;
		cards: AuxeroReviewCard[];
		pageDocument: AuxeroPageDocument;
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
{@html beforeReviewsHtml}
<AuxeroReviewsGrid {cards} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterReviewsHtml}
