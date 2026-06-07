<script lang="ts">
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { AuxeroInventoryVehicleCard } from '$lib/auxero/inventory';
	import type { AuxeroInventoryDesktopData } from '$lib/auxero/inventory-desktop';
	import type { InventoryMobileData } from '$lib/auxero/inventory-mobile';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { HomePageCopy, InventoryCopy } from '$lib/i18n/messages';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import { onMount } from 'svelte';
	import AuxeroInventoryDesktopSurface from './AuxeroInventoryDesktopSurface.svelte';
	import InventoryMobilePage from './InventoryMobilePage.svelte';

	let {
		cards,
		copy,
		desktop,
		mobile,
		pageDocument,
		seoTitle,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml
	}: {
		cards: AuxeroInventoryVehicleCard[];
		copy: InventoryCopy;
		desktop: AuxeroInventoryDesktopData;
		mobile: InventoryMobileData;
		pageDocument: AuxeroPageDocument;
		seoTitle?: string;
		shellCopy: HomePageCopy;
		shellFooter?: HomeFiveFooterData;
		shellHeader?: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
		shellRuntimeHtml?: string;
	} = $props();

	let mobileRouteVisible = $state(true);

	onMount(() => {
		const media = window.matchMedia('(max-width: 767.98px)');
		const syncMobileRoute = () => {
			mobileRouteVisible = media.matches;
		};

		syncMobileRoute();
		media.addEventListener('change', syncMobileRoute);

		return () => {
			media.removeEventListener('change', syncMobileRoute);
		};
	});
</script>

<div class="bohemcars-inventory-desktop-route">
	<AuxeroPublicShell
		{pageDocument}
		copy={shellCopy}
		footer={shellFooter}
		header={shellHeader}
		modals={shellModals}
		runtimeHtml={shellRuntimeHtml}
		title={seoTitle}
	>
		<AuxeroInventoryDesktopSurface {cards} {copy} {desktop} />
	</AuxeroPublicShell>
</div>

<div
	class="bohemcars-inventory-mobile-route"
	hidden={!mobileRouteVisible}
	aria-hidden={!mobileRouteVisible}
>
	<InventoryMobilePage {cards} {copy} {mobile} />
</div>

<style>
	.bohemcars-inventory-mobile-route {
		display: none;
	}

	@media (min-width: 768px) {
		.bohemcars-inventory-mobile-route :global(*) {
			display: none !important;
		}
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
