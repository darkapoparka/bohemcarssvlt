<script lang="ts">
	import type { AuxeroInventoryVehicleCard, AuxeroInventoryView } from '$lib/auxero/inventory';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
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
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeInventoryHtml} afterHtml={afterInventoryHtml}>
	<AuxeroInventoryContent {cards} {view} />
</AuxeroPageShell>
