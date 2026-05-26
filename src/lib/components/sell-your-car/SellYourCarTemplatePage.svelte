<script lang="ts">
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { AuxeroSellCarFormData } from '$lib/auxero/sell-your-car';
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

	let bodyClassScript = $derived(
		`<script>document.body.className = ${JSON.stringify(pageDocument.bodyClass)};</` + 'script>'
	);
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<svelte:head>{@html pageDocument.headHtml}</svelte:head>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html bodyClassScript}
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html beforeSellFormHtml}
<SellCarForm {form} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterSellFormHtml}
