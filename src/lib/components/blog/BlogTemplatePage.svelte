<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroBlogListPageData } from '$lib/auxero/blog-list';
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { BlogPost } from '$lib/data/blog';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import BlogListGrid from './BlogListGrid.svelte';

	let {
		blogPage,
		pageDocument,
		posts,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml
	}: {
		blogPage: AuxeroBlogListPageData;
		pageDocument: AuxeroPageDocument;
		posts: BlogPost[];
		shellCopy: HomePageCopy;
		shellFooter: HomeFiveFooterData;
		shellHeader: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
		shellRuntimeHtml: string;
	} = $props();
</script>

<AuxeroPublicShell
	copy={shellCopy}
	footer={shellFooter}
	header={shellHeader}
	modals={shellModals}
	{pageDocument}
	runtimeHtml={shellRuntimeHtml}
	title="Новини — Bohemcars"
>
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
</AuxeroPublicShell>

<style>
	.bohemcars-blog-pagination .pagination__link--cta {
		width: auto;
		min-width: 40px;
		padding-right: 18px;
		padding-left: 18px;
		white-space: nowrap;
	}
</style>
