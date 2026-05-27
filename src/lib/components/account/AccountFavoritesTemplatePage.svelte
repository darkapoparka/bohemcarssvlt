<script lang="ts">
	import type { AuxeroFavoriteVehicleCard } from '$lib/auxero/favorites';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import AccountFavoritesGrid from './AccountFavoritesGrid.svelte';

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

<AuxeroPageShell {pageDocument} beforeHtml={beforeFavoritesHtml} afterHtml={afterFavoritesHtml}>
	<AccountFavoritesGrid {cards} />
</AuxeroPageShell>
