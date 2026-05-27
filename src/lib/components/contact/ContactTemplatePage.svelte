<script lang="ts">
	import type { AuxeroContactFormData } from '$lib/auxero/contact';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
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
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeContactFormHtml} afterHtml={afterContactFormHtml}>
	<ContactFormCard {form} />
</AuxeroPageShell>
