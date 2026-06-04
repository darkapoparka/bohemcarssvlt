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

<style>
	@media (max-width: 767.98px) {
		:global(body.auxero-template-clients-reviews-html #wrapper),
		:global(body.auxero-template-clients-reviews-html section.pb-100) {
			background: var(--bc-bg) !important;
			background-color: var(--bc-bg) !important;
		}

		:global(body.auxero-template-clients-reviews-html section.pb-100) {
			padding-top: 32px !important;
			padding-bottom: 92px !important;
		}

		:global(body.auxero-template-clients-reviews-html section.pb-100 > .tf-spacing-style4) {
			display: none !important;
		}

		:global(body.auxero-template-clients-reviews-html section.pb-100 > .container) {
			width: 100% !important;
			max-width: none !important;
			padding-right: 14px !important;
			padding-left: 14px !important;
		}
	}
</style>
