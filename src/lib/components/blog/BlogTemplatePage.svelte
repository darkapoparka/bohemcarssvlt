<script lang="ts">
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { BlogPost } from '$lib/data/blog';
	import BlogListGrid from './BlogListGrid.svelte';

	let {
		afterBlogHtml,
		beforeBlogHtml,
		pageDocument,
		posts
	}: {
		afterBlogHtml: string;
		beforeBlogHtml: string;
		pageDocument: AuxeroPageDocument;
		posts: BlogPost[];
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
{@html beforeBlogHtml}
<BlogListGrid {posts} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterBlogHtml}
