<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveNewsPost } from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import HomeSectionCta from './HomeSectionCta.svelte';

	let { copy, posts }: { copy: HomePageCopy; posts: HomeFiveNewsPost[] } = $props();

	let featured = $derived(posts[0]);
	let secondaryPosts = $derived(posts.slice(1, 3));
</script>

{#if featured}
	<section class="py-100">
		<div class="wow fadeIn container" data-wow-delay="0.1s">
			<div class="title-section wow fadeInDown mb-30" data-wow-delay="0.1s">
				<h2>{copy.newsTitle}</h2>
				<HomeSectionCta href="/blog" label={copy.commonCta} />
			</div>
			<div class="row">
				<div class="col-lg-6 md-mb-30">
					<a
						href={resolve(`/blog/${featured.slug}`)}
						class="post-style-2 radius-none bohemcars-no-image-zoom overflow-hidden"
					>
						<img class="post--img flex" src={featured.image} alt={featured.title} />
						<div class="content">
							<p class="h5 title mb-8 text-white">{featured.title}</p>
							<div class="flex justify-start gap-8">
								<span class="text-xs text-white">{copy.byline}</span>
								<span class="text-xs text-white">{featured.date}</span>
								<span class="text-highlight text-underline text-xs uppercase">
									{featured.category}
								</span>
							</div>
						</div>
					</a>
				</div>
				<div class="col-lg-6">
					{#each secondaryPosts as post, index (post.slug)}
						<a
							href={resolve(`/blog/${post.slug}`)}
							class={index === 0
								? 'post-style-3 bohemcars-no-image-zoom mb-20'
								: 'post-style-3 bohemcars-no-image-zoom'}
						>
							<div class="post--img">
								<img class="flex" src={post.image} alt={post.title} />
							</div>
							<div class="content">
								<p class="h5 title mb-8">{post.title}</p>
								<div class="flex justify-start gap-8">
									<span class="text-xs">{copy.byline}</span>
									<span class="text-xs">{post.date}</span>
									<span class="text-highlight text-underline text-xs uppercase">
										{post.category}
									</span>
								</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</section>
{/if}
