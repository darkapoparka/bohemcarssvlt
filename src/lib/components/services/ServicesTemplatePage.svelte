<script lang="ts">
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { AuxeroServiceFormData, AuxeroServicesContent } from '$lib/auxero/services';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import ServicesContent from './ServicesContent.svelte';

	let {
		afterServicesHtml,
		beforeServicesHtml,
		form,
		pageDocument,
		services
	}: {
		afterServicesHtml: string;
		beforeServicesHtml: string;
		form: AuxeroServiceFormData;
		pageDocument: AuxeroPageDocument;
		services: AuxeroServicesContent;
	} = $props();
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeServicesHtml} afterHtml={afterServicesHtml}>
	<ServicesContent {form} {services} />
</AuxeroPageShell>
