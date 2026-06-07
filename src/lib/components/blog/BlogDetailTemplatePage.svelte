<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroBlogDetailContent } from '$lib/auxero/blog-detail';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import BlogDetailMainContent from './BlogDetailMainContent.svelte';
	import BlogDetailRelatedCard from './BlogDetailRelatedCard.svelte';
	import BlogDetailSidebar from './BlogDetailSidebar.svelte';

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

	let post = $derived(content.post);
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeDetailHtml} afterHtml={afterDetailHtml}>
	<div data-bohemcars-blog-detail-page>
		<section class="blog-details-banner">
			<img
				class="overlay-image"
				src="/assets/images/blog/overlay-blogdetails.webp"
				alt="blog-details-banner"
			/>
			<div class="breadcrumb-wrapper">
				<div class="container">
					<ul class="breadcrumb">
						<li><a class="text-white" href={resolve('/')}>Начало</a></li>
						<li><img src="/assets/icons/right.svg" alt="chevron-right" /></li>
						<li><a class="text-white" href={resolve('/blog')}>Съвети</a></li>
						<li><img src="/assets/icons/right.svg" alt="chevron-right" /></li>
						<li><span class="text-muted">{post.title}</span></li>
					</ul>
				</div>
			</div>
			<div class="image flex"><img src={post.image} alt={post.title} /></div>
			<div class="content">
				<div class="container">
					<h1 class="letter-spacing-1 mb-20 text-white">{post.title}</h1>
					<ul class="flex flex-wrap items-center gap-20">
						<li><a class="text-white" href={resolve('/agents')}>от Bohemcars</a></li>
						<li><a class="text-white" href={resolve('/blog')}>{post.date}</a></li>
						<li>
							<a class="text-highlight text-underline uppercase" href={resolve('/blog')}>
								{post.category}
							</a>
						</li>
					</ul>
				</div>
			</div>
		</section>

		<section>
			<div class="tf-spacing"></div>
			<div class="innerpage-container container">
				<BlogDetailMainContent {content} />
				<BlogDetailSidebar posts={content.related} sidebar={content.sidebar} />
			</div>
		</section>

		<section class="py-100">
			<div class="container">
				<h2 class="mb-40">{content.relatedTitle}</h2>
				<div class="md-grid-cols-1 grid grid-cols-3 gap-x-30 gap-y-40">
					{#each content.related as relatedPost (relatedPost.slug)}
						<BlogDetailRelatedCard post={relatedPost} />
					{/each}
				</div>
			</div>
		</section>
	</div>
</AuxeroPageShell>
