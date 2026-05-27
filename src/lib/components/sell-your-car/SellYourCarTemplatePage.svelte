<script lang="ts">
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { AuxeroSellCarFormData } from '$lib/auxero/sell-your-car';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import SellCarForm from './SellCarForm.svelte';

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

<AuxeroPageShell {pageDocument} beforeHtml={beforeSellFormHtml} afterHtml={afterSellFormHtml}>
	<SellCarForm {form} />
</AuxeroPageShell>
