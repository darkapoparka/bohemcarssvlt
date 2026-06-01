<script lang="ts">
	import type { AuxeroFavoriteVehicleCard } from '$lib/auxero/favorites';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import AccountFavoritesGrid from './AccountFavoritesGrid.svelte';
	import AccountFavoritesMobilePage from './AccountFavoritesMobilePage.svelte';

	let {
		afterFavoritesHtml,
		beforeFavoritesHtml,
		cards,
		pageDocument
	}: {
		afterFavoritesHtml: string;
		beforeFavoritesHtml: string;
		cards: AuxeroFavoriteVehicleCard[];
		pageDocument: AuxeroPageDocument;
	} = $props();
</script>

<div class="bohemcars-favorites-desktop-route">
	<AuxeroPageShell {pageDocument} beforeHtml={beforeFavoritesHtml} afterHtml={afterFavoritesHtml}>
		<AccountFavoritesGrid {cards} />
	</AuxeroPageShell>
</div>

<div class="bohemcars-favorites-mobile-route">
	<AccountFavoritesMobilePage {cards} />
</div>

<style>
	.bohemcars-favorites-mobile-route {
		display: none;
	}

	@media (max-width: 767.98px) {
		:global(body.auxero-template-my-favorites-html) {
			overflow: auto !important;
			background: #ffffff !important;
		}

		:global(body.auxero-template-my-favorites-html #wrapper) {
			background: #ffffff !important;
		}

		.bohemcars-favorites-desktop-route {
			display: none;
		}

		.bohemcars-favorites-mobile-route {
			display: block;
		}
	}
</style>
