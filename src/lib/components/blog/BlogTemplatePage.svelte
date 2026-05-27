<script lang="ts">
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { BlogPost } from '$lib/data/blog';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
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
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeBlogHtml} afterHtml={afterBlogHtml}>
	<BlogListGrid {posts} />
</AuxeroPageShell>
