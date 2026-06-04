<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveNewsPost } from '$lib/auxero/home-five';
	import { bohemcarsAssets } from '$lib/data/bohemcars';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import { ArrowRight } from '@lucide/svelte';
	import HomeSectionCta from './HomeSectionCta.svelte';

	let { copy, posts }: { copy: HomePageCopy; posts: HomeFiveNewsPost[] } = $props();

	let cards = $derived(posts.slice(0, 3));
	const readAllBlogTitle = $derived(
		copy.newsTitle === 'Bohemcars notes' ? 'Read all blog posts' : 'Виж всички статии'
	);
	const readAllBlogCopy = $derived(
		copy.newsTitle === 'Bohemcars notes'
			? 'Import, registration, and selling guides in one place.'
			: 'Съвети за внос, регистрация и продажба на автомобил.'
	);
	const readAllBlogEyebrow = $derived(
		copy.newsTitle === 'Bohemcars notes' ? 'Bohemcars blog' : 'Bohemcars блог'
	);
	const brandedNewsTitle = $derived(/bohemcars/i.test(copy.newsTitle));
	const brandFirstNewsTitle = $derived(copy.newsTitle.toLowerCase().startsWith('bohemcars'));
	const newsTitleWithoutBrand = $derived(copy.newsTitle.replace(/bohemcars/i, '').trim());
</script>

{#if cards.length}
	<section class="bohemcars-news-section py-100">
		<div class="container">
			<div class="title-section bohemcars-news-banner wow fadeInDown mb-40" data-wow-delay="0.1s">
				<h2>
					{#if brandedNewsTitle}
						{#if brandFirstNewsTitle}
							<picture class="bohemcars-news-banner__brand">
								<source media="(max-width: 767px)" srcset={bohemcarsAssets.logoLight} />
								<img src={bohemcarsAssets.logoDark} alt="Bohemcars" loading="lazy" />
							</picture>
							{#if newsTitleWithoutBrand}
								<span>{newsTitleWithoutBrand}</span>
							{/if}
						{:else}
							{#if newsTitleWithoutBrand}
								<span>{newsTitleWithoutBrand}</span>
							{/if}
							<picture class="bohemcars-news-banner__brand">
								<source media="(max-width: 767px)" srcset={bohemcarsAssets.logoLight} />
								<img src={bohemcarsAssets.logoDark} alt="Bohemcars" loading="lazy" />
							</picture>
						{/if}
					{:else}
						{copy.newsTitle}
					{/if}
				</h2>
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
				<a href={resolve('/blog')} class="bohemcars-news-all-card">
					<span class="bohemcars-news-all-card__eyebrow">{readAllBlogEyebrow}</span>
					<span class="bohemcars-news-all-card__title">{readAllBlogTitle}</span>
					<span class="bohemcars-news-all-card__copy">{readAllBlogCopy}</span>
					<span class="bohemcars-news-all-card__cta">
						{copy.readMore}
						<ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
					</span>
				</a>
			</div>
		</div>
	</section>
{/if}

<style>
	.bohemcars-news-section {
		background-color: var(--bc-bg);
		padding-top: 82px;
		padding-bottom: 86px;
	}

	.bohemcars-news-banner {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		background: linear-gradient(135deg, #14210f 0%, #1f3318 58%, #0f190c 100%);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
		padding: 24px 28px;
	}

	.bohemcars-news-banner h2 {
		display: inline-flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 14px;
		color: #ffffff;
		margin: 0;
	}

	.bohemcars-news-banner h2 span {
		color: inherit !important;
		font: inherit;
		line-height: inherit;
	}

	.bohemcars-news-banner__brand {
		display: inline-flex;
		width: clamp(198px, 18vw, 286px);
		line-height: 1;
	}

	.bohemcars-news-banner__brand img {
		display: block;
		width: 100%;
		height: auto;
	}

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

	.bohemcars-news-all-card {
		display: none;
	}

	@media (max-width: 991px) {
		.bohemcars-news-grid {
			grid-template-columns: 1fr;
			margin: 0 auto;
			max-width: 460px;
		}
	}

	@media (max-width: 767px) {
		.bohemcars-news-section {
			padding-top: 28px;
			padding-bottom: 32px;
		}

		.bohemcars-news-section :global(.title-section) {
			align-items: flex-start;
			justify-content: flex-start;
			margin-bottom: 18px !important;
			text-align: left;
		}

		.bohemcars-news-banner {
			overflow: visible;
			border: 0;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
			padding: 0;
		}

		.bohemcars-news-section :global(.title-section a) {
			display: none !important;
		}

		.bohemcars-news-section :global(.title-section h2) {
			gap: 9px;
			color: #1c1c1c;
			margin: 0;
			font-size: 26px;
			font-weight: 800;
			letter-spacing: 0;
			line-height: 32px;
			text-align: left;
		}

		.bohemcars-news-banner__brand {
			width: min(45vw, 174px);
			transform: translateY(1px);
		}

		.bohemcars-news-all-card {
			display: flex;
			min-height: 196px;
			aspect-ratio: auto;
			flex-direction: column;
			gap: 10px;
			overflow: hidden;
			border-radius: 16px;
			background: var(--bc-surface);
			color: #1c1c1c;
			padding: 22px;
		}

		.bohemcars-news-all-card:hover {
			background: var(--bc-surface-hover);
			color: #1c1c1c;
			transform: none;
		}

		.bohemcars-news-all-card__eyebrow {
			align-self: flex-start;
			border-radius: 999px;
			background: #ffffff;
			color: #607057;
			font-size: 11px;
			font-weight: 800;
			letter-spacing: 0.03em;
			line-height: 18px;
			padding: 5px 10px;
			text-transform: uppercase;
		}

		.bohemcars-news-all-card__title {
			display: block;
			max-width: 260px;
			margin-top: auto;
			font-size: 26px;
			font-weight: 900;
			letter-spacing: 0;
			line-height: 31px;
		}

		.bohemcars-news-all-card__copy {
			display: block;
			max-width: 290px;
			color: #566050;
			font-size: 14px;
			font-weight: 600;
			line-height: 20px;
		}

		.bohemcars-news-all-card__cta {
			display: inline-flex;
			align-items: center;
			gap: 7px;
			color: #86aa1f;
			font-size: 14px;
			font-weight: 900;
			line-height: 20px;
		}
	}
</style>
