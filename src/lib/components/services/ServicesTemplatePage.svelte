<script lang="ts">
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { AuxeroServiceFormData } from '$lib/auxero/services';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
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
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeServiceFormHtml} afterHtml={afterServiceFormHtml}>
	<ServiceFormCard {form} />
</AuxeroPageShell>
