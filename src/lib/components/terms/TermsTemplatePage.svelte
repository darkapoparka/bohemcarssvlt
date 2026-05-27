<script lang="ts">
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { AuxeroTermsSection } from '$lib/auxero/terms';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import TermsContent from './TermsContent.svelte';

	let {
		afterTermsHtml,
		beforeTermsHtml,
		pageDocument,
		sections
	}: {
		afterTermsHtml: string;
		beforeTermsHtml: string;
		pageDocument: AuxeroPageDocument;
		sections: AuxeroTermsSection[];
	} = $props();
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeTermsHtml} afterHtml={afterTermsHtml}>
	<TermsContent {sections} />
</AuxeroPageShell>
