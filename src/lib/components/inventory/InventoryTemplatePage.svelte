<script lang="ts">
	import type { AuxeroInventoryVehicleCard, AuxeroInventoryView } from '$lib/auxero/inventory';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroInventoryContent from './AuxeroInventoryContent.svelte';

	let {
		afterInventoryHtml,
		beforeInventoryHtml,
		cards,
		pageDocument,
		view
	}: {
		afterInventoryHtml: string;
		beforeInventoryHtml: string;
		cards: AuxeroInventoryVehicleCard[];
		pageDocument: AuxeroPageDocument;
		view: AuxeroInventoryView;
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
{@html beforeInventoryHtml}
<AuxeroInventoryContent {cards} {view} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterInventoryHtml}
