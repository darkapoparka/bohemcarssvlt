<script lang="ts">
	import type { AuxeroBlogDetailContent } from '$lib/auxero/blog-detail';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import BlogDetailMainContent from './BlogDetailMainContent.svelte';

	let {
		afterDetailHtml,
		beforeDetailHtml,
		content,
		pageDocument
	}: {
		afterDetailHtml: string;
		beforeDetailHtml: string;
		content: AuxeroBlogDetailContent;
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
{@html beforeDetailHtml}
<BlogDetailMainContent {content} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterDetailHtml}
