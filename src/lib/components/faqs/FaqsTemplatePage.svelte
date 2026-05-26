<script lang="ts">
	import type { AuxeroFaq, AuxeroFaqGroup } from '$lib/auxero/faqs';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
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

	let bodyClassScript = $derived(
		`<script>document.body.className = ${JSON.stringify(pageDocument.bodyClass)};</` + 'script>'
	);
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<svelte:head>{@html pageDocument.headHtml}</svelte:head>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html bodyClassScript}
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html beforeFaqsHtml}
<FaqsContent {featured} {groups} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterFaqsHtml}
