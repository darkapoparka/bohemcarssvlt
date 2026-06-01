<script lang="ts">
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { AuxeroSellCarFormData } from '$lib/auxero/sell-your-car';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import SellCarForm from './SellCarForm.svelte';
	import SellYourCarMobilePage from './SellYourCarMobilePage.svelte';

	let {
		afterSellFormHtml,
		beforeSellFormHtml,
		form,
		pageDocument
	}: {
		afterSellFormHtml: string;
		beforeSellFormHtml: string;
		form: AuxeroSellCarFormData;
		pageDocument: AuxeroPageDocument;
	} = $props();
</script>

<div class="bohemcars-sell-desktop-route">
	<AuxeroPageShell {pageDocument} beforeHtml={beforeSellFormHtml} afterHtml={afterSellFormHtml}>
		<SellCarForm {form} />
	</AuxeroPageShell>
</div>

<div class="bohemcars-sell-mobile-route">
	<SellYourCarMobilePage {form} />
</div>

<style>
	.bohemcars-sell-mobile-route {
		display: none;
	}

	@media (max-width: 767.98px) {
		.bohemcars-sell-desktop-route {
			display: none;
		}

		.bohemcars-sell-mobile-route {
			display: block;
		}
	}
</style>
