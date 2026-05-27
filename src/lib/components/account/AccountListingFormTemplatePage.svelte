<script lang="ts">
	import type { AuxeroAccountListingFormData } from '$lib/auxero/account-listing-form';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AccountListingForm from './AccountListingForm.svelte';

	let {
		afterFormHtml,
		beforeFormHtml,
		form,
		pageDocument
	}: {
		afterFormHtml: string;
		beforeFormHtml: string;
		form: AuxeroAccountListingFormData;
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
{@html beforeFormHtml}
<AccountListingForm {form} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterFormHtml}
