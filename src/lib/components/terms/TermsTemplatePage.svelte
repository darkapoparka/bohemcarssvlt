<script lang="ts">
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { AuxeroTermsSection } from '$lib/auxero/terms';
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

	let bodyClassScript = $derived(
		`<script>document.body.className = ${JSON.stringify(pageDocument.bodyClass)};</` + 'script>'
	);
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<svelte:head>{@html pageDocument.headHtml}</svelte:head>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html bodyClassScript}
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html beforeTermsHtml}
<TermsContent {sections} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterTermsHtml}
