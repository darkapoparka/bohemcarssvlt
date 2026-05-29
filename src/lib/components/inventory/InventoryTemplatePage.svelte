<script lang="ts">
	import type { AuxeroInventoryVehicleCard, AuxeroInventoryView } from '$lib/auxero/inventory';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { InventoryCopy } from '$lib/i18n/messages';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import AuxeroInventoryContent from './AuxeroInventoryContent.svelte';

	let {
		afterInventoryHtml,
		beforeInventoryHtml,
		cards,
		copy,
		pageDocument,
		view
	}: {
		afterInventoryHtml: string;
		beforeInventoryHtml: string;
		cards: AuxeroInventoryVehicleCard[];
		copy: InventoryCopy;
		pageDocument: AuxeroPageDocument;
		view: AuxeroInventoryView;
	} = $props();
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeInventoryHtml} afterHtml={afterInventoryHtml}>
	<AuxeroInventoryContent {cards} {copy} {view} />
</AuxeroPageShell>
