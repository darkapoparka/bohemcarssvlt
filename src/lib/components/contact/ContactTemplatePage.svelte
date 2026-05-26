<script lang="ts">
	import type { AuxeroContactFormData } from '$lib/auxero/contact';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import ContactFormCard from './ContactFormCard.svelte';

	let {
		afterContactFormHtml,
		beforeContactFormHtml,
		form,
		pageDocument
	}: {
		afterContactFormHtml: string;
		beforeContactFormHtml: string;
		form: AuxeroContactFormData;
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
{@html beforeContactFormHtml}
<ContactFormCard {form} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterContactFormHtml}
