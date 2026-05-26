<script lang="ts">
	import type { AuxeroFavoriteVehicleCard } from '$lib/auxero/favorites';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
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

	let bodyClassScript = $derived(
		`<script>document.body.className = ${JSON.stringify(pageDocument.bodyClass)};</` + 'script>'
	);
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<svelte:head>{@html pageDocument.headHtml}</svelte:head>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html bodyClassScript}
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html beforeFavoritesHtml}
<AccountFavoritesGrid {cards} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterFavoritesHtml}
