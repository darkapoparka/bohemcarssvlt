<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveNewsPost } from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import { ArrowRight } from '@lucide/svelte';
	import HomeSectionCta from './HomeSectionCta.svelte';

	let { copy, posts }: { copy: HomePageCopy; posts: HomeFiveNewsPost[] } = $props();

	let cards = $derived(posts.slice(0, 3));
</script>

{#if cards.length}
	<section class="bohemcars-news-section py-100">
		<div class="container">
			<div class="title-section wow fadeInDown mb-40" data-wow-delay="0.1s">
				<h2>{copy.newsTitle}</h2>
				<HomeSectionCta href="/blog" label={copy.commonCta} />
			</div>
			<div class="bohemcars-news-grid wow fadeInUp" data-wow-delay="0.1s">
				{#each cards as post (post.slug)}
					<a href={resolve(`/blog/${post.slug}`)} class="bohemcars-news-card">
						<img
							class="bohemcars-news-card__img"
							src={post.image}
							alt={post.title}
							loading="lazy"
						/>
						<span class="bohemcars-news-card__category">{post.category}</span>
						<span class="bohemcars-news-card__content">
							<span class="bohemcars-news-card__meta">
								<span>{copy.byline}</span>
								<span aria-hidden="true">•</span>
								<span>{post.date}</span>
							</span>
							<span class="bohemcars-news-card__title">{post.title}</span>
							<span class="bohemcars-news-card__cta">
								{copy.readMore}
								<ArrowRight size={17} strokeWidth={2.4} aria-hidden="true" />
							</span>
						</span>
					</a>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.bohemcars-news-grid {
		display: grid;
		gap: 24px;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.bohemcars-news-card {
		aspect-ratio: 3 / 2;
		border-radius: 16px;
		color: #ffffff;
		display: flex;
		isolation: isolate;
		overflow: hidden;
		position: relative;
	}

	.bohemcars-news-card::after {
		background: linear-gradient(
			180deg,
			rgba(13, 20, 12, 0) 16%,
			rgba(13, 20, 12, 0.62) 44%,
			rgba(13, 20, 12, 0.97) 78%
		);
		content: '';
		inset: 0;
		position: absolute;
		z-index: 1;
	}

	.bohemcars-news-card:hover {
		color: #ffffff;
	}

	.bohemcars-news-card__img {
		height: 100%;
		left: 0;
		object-fit: cover;
		position: absolute;
		top: 0;
		width: 100%;
		z-index: 0;
	}

	.bohemcars-news-card__category {
		background: #98bc2a;
		border-radius: 999px;
		color: #1a2a16;
		font-size: 11px;
		font-weight: 800;
		left: 18px;
		letter-spacing: 0.03em;
		padding: 6px 13px;
		position: absolute;
		text-transform: uppercase;
		top: 18px;
		z-index: 2;
	}

	.bohemcars-news-card__content {
		display: flex;
		flex-direction: column;
		gap: 7px;
		margin-top: auto;
		padding: 20px 22px 20px;
		position: relative;
		z-index: 2;
	}

	.bohemcars-news-card__meta {
		align-items: center;
		color: #ffffff;
		display: flex;
		font-size: 13px;
		font-weight: 600;
		gap: 8px;
		text-shadow: 0 1px 8px rgba(13, 20, 12, 0.6);
	}

	/* The inner spans inherit a near-black template colour otherwise */
	.bohemcars-news-card__meta span {
		color: #ffffff;
	}

	.bohemcars-news-card__title {
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		color: #ffffff;
		display: -webkit-box;
		font-size: 18px;
		font-weight: 800;
		line-clamp: 2;
		line-height: 1.25;
		overflow: hidden;
	}

	.bohemcars-news-card__cta {
		align-items: center;
		color: #aed35e;
		display: inline-flex;
		font-size: 14px;
		font-weight: 800;
		gap: 7px;
		margin-top: 4px;
	}

	.bohemcars-news-card__cta :global(svg) {
		flex: 0 0 auto;
	}

	@media (max-width: 991px) {
		.bohemcars-news-grid {
			grid-template-columns: 1fr;
			margin: 0 auto;
			max-width: 460px;
		}
	}
</style>
