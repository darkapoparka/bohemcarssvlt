<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroBlogListPageData } from '$lib/auxero/blog-list';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { BlogPost } from '$lib/data/blog';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import BlogListGrid from './BlogListGrid.svelte';

	let {
		afterBlogHtml,
		beforeBlogHtml,
		blogPage,
		pageDocument,
		posts
	}: {
		afterBlogHtml: string;
		beforeBlogHtml: string;
		blogPage: AuxeroBlogListPageData;
		pageDocument: AuxeroPageDocument;
		posts: BlogPost[];
	} = $props();
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeBlogHtml} afterHtml={afterBlogHtml}>
	<section class="pb-100" data-bohemcars-blog-page>
		<div class="container"><h1 class="h2">{blogPage.title}</h1></div>
		<div class="tf-spacing-style3"></div>
		<div class="container">
			<BlogListGrid {posts} />
			<ul class="pagination bohemcars-blog-pagination justify-center">
				<li>
					<a href={resolve('/blog')} class="pagination__link active">{blogPage.pageLabel}</a>
				</li>
				<li>
					<a
						href={resolve(blogPage.contactHref as '/contact')}
						class="pagination__link pagination__link--cta"
					>
						{blogPage.contactLabel}
					</a>
				</li>
			</ul>
		</div>
	</section>
</AuxeroPageShell>

<style>
	.bohemcars-blog-pagination .pagination__link--cta {
		width: auto;
		min-width: 40px;
		padding-right: 18px;
		padding-left: 18px;
		white-space: nowrap;
	}
</style>
