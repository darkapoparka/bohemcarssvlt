<script lang="ts">
	import type { AuxeroAccountListingFormData } from '$lib/auxero/account-listing-form';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
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
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeFormHtml} afterHtml={afterFormHtml}>
	<AccountListingForm {form} />
</AuxeroPageShell>
