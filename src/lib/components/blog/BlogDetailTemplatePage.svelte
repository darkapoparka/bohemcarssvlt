<script lang="ts">
	import type { AuxeroBlogDetailContent } from '$lib/auxero/blog-detail';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
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
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeDetailHtml} afterHtml={afterDetailHtml}>
	<BlogDetailMainContent {content} />
</AuxeroPageShell>
