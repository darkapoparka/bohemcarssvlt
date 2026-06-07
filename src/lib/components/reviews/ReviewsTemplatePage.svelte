<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { AuxeroReviewCard, AuxeroReviewsPageData } from '$lib/auxero/reviews';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import AuxeroReviewsGrid from './AuxeroReviewsGrid.svelte';

	let {
		afterReviewsHtml,
		beforeReviewsHtml,
		cards,
		pageDocument,
		reviewsPage
	}: {
		afterReviewsHtml: string;
		beforeReviewsHtml: string;
		cards: AuxeroReviewCard[];
		pageDocument: AuxeroPageDocument;
		reviewsPage: AuxeroReviewsPageData;
	} = $props();

	const externalHref = (href: string) => ({ href });
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeReviewsHtml} afterHtml={afterReviewsHtml}>
	<section class="pb-100" data-bohemcars-reviews-page>
		<div class="container">
			<h1 class="h2">{reviewsPage.title}</h1>
			<div class="tf-spacing-style3"></div>
			<AuxeroReviewsGrid {cards} />
			<ul class="pagination justify-center">
				<li>
					<a href={resolve('/reviews')} class="pagination__link active">{reviewsPage.pageLabel}</a>
				</li>
				<li>
					<a
						{...externalHref(reviewsPage.facebookHref)}
						class="pagination__link"
						target="_blank"
						rel="noreferrer"
					>
						{reviewsPage.facebookLabel}
					</a>
				</li>
			</ul>
		</div>
	</section>
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
