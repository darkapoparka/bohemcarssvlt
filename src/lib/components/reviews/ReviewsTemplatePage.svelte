<script lang="ts">
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { AuxeroReviewCard } from '$lib/auxero/reviews';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
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
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeReviewsHtml} afterHtml={afterReviewsHtml}>
	<AuxeroReviewsGrid {cards} />
</AuxeroPageShell>
