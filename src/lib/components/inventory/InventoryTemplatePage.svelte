<script lang="ts">
	import type { AuxeroInventoryVehicleCard, AuxeroInventoryView } from '$lib/auxero/inventory';
	import type { InventoryMobileData } from '$lib/auxero/inventory-mobile';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { InventoryCopy } from '$lib/i18n/messages';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import AuxeroInventoryContent from './AuxeroInventoryContent.svelte';
	import InventoryMobilePage from './InventoryMobilePage.svelte';

	let {
		afterInventoryHtml,
		beforeInventoryHtml,
		cards,
		copy,
		mobile,
		pageDocument,
		view
	}: {
		afterInventoryHtml: string;
		beforeInventoryHtml: string;
		cards: AuxeroInventoryVehicleCard[];
		copy: InventoryCopy;
		mobile: InventoryMobileData;
		pageDocument: AuxeroPageDocument;
		view: AuxeroInventoryView;
	} = $props();
</script>

<div class="bohemcars-inventory-desktop-route">
	<AuxeroPageShell {pageDocument} beforeHtml={beforeInventoryHtml} afterHtml={afterInventoryHtml}>
		<AuxeroInventoryContent {cards} {copy} {view} />
	</AuxeroPageShell>
</div>

<div class="bohemcars-inventory-mobile-route">
	<InventoryMobilePage {cards} {copy} {mobile} />
</div>

<style>
	.bohemcars-inventory-mobile-route {
		display: none;
	}

	@media (max-width: 767.98px) {
		.bohemcars-inventory-desktop-route {
			display: none;
		}

		.bohemcars-inventory-mobile-route {
			display: block;
		}
	}
</style>
