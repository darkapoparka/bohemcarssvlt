<script lang="ts">
	import type { AuxeroFaq, AuxeroFaqGroup } from '$lib/auxero/faqs';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import FaqsContent from './FaqsContent.svelte';

	let {
		afterFaqsHtml,
		beforeFaqsHtml,
		featured,
		groups,
		pageDocument
	}: {
		afterFaqsHtml: string;
		beforeFaqsHtml: string;
		featured: AuxeroFaq[];
		groups: AuxeroFaqGroup[];
		pageDocument: AuxeroPageDocument;
	} = $props();
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeFaqsHtml} afterHtml={afterFaqsHtml}>
	<FaqsContent {featured} {groups} />
</AuxeroPageShell>
