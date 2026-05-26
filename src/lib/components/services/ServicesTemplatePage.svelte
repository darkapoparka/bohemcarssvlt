<script lang="ts">
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { AuxeroServiceFormData } from '$lib/auxero/services';
	import ServiceFormCard from './ServiceFormCard.svelte';

	let {
		afterServiceFormHtml,
		beforeServiceFormHtml,
		form,
		pageDocument
	}: {
		afterServiceFormHtml: string;
		beforeServiceFormHtml: string;
		form: AuxeroServiceFormData;
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
{@html beforeServiceFormHtml}
<ServiceFormCard {form} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterServiceFormHtml}
