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
								<span class="bohemcars-news-card__icon" aria-hidden="true">
									<ArrowRight size={14} strokeWidth={2.7} />
								</span>
							</span>
						</span>
					</a>
				{/each}
				<a href={resolve('/blog')} class="bohemcars-news-all-card">
					<span class="bohemcars-news-all-card__topline">
						<img
							class="bohemcars-news-all-card__brand"
							src={bohemcarsAssets.logoLight}
							alt="Bohemcars"
							loading="lazy"
						/>
					</span>
					<span class="bohemcars-news-all-card__title">{readAllBlogTitle}</span>
					<span class="bohemcars-news-all-card__copy">{readAllBlogCopy}</span>
					<span class="bohemcars-news-all-card__cta">
						<span>{copy.readMore}</span>
						<span class="bohemcars-news-all-card__icon" aria-hidden="true">
							<ArrowRight size={15} strokeWidth={2.7} />
						</span>
					</span>
				</a>
			</div>
		</div>
	</section>
{/if}

<style>
	.bohemcars-news-section {
		background-color: var(--bc-bg);
		padding-top: 64px;
		padding-bottom: 64px;
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
		width: fit-content;
		border-radius: 999px;
		background: #d9f275;
		color: #14210f;
		display: inline-flex;
		font-size: 14px;
		font-weight: 800;
		gap: 9px;
		margin-top: 5px;
		padding: 7px 8px 7px 14px;
	}

	.bohemcars-news-card__cta :global(svg) {
		flex: 0 0 auto;
	}

	.bohemcars-news-card__icon {
		display: inline-flex;
		width: 22px;
		height: 22px;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: #14210f;
		color: #ffffff;
	}

	.bohemcars-news-card__icon :global(svg),
	.bohemcars-news-card__icon :global(path),
	.bohemcars-news-card__icon :global(line),
	.bohemcars-news-card__icon :global(polyline) {
		color: #ffffff !important;
		stroke: #ffffff !important;
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
			font-size: 24px;
			font-weight: 800;
			letter-spacing: 0;
			line-height: 30px;
			text-align: left;
		}

		.bohemcars-news-banner__brand {
			width: min(45vw, 174px);
			transform: translateY(1px);
		}

		.bohemcars-news-grid {
			gap: 18px;
		}

		.bohemcars-news-card {
			aspect-ratio: 1.9 / 1;
			border-radius: 14px;
		}

		.bohemcars-news-card::after {
			background: linear-gradient(
				180deg,
				rgba(13, 20, 12, 0.06) 0%,
				rgba(13, 20, 12, 0.52) 34%,
				rgba(13, 20, 12, 0.98) 74%
			);
		}

		.bohemcars-news-card__category {
			left: 18px;
			top: 14px;
			font-size: 10.5px;
			line-height: 16px;
			padding: 5px 11px;
		}

		.bohemcars-news-card__content {
			gap: 4px;
			margin-top: auto;
			padding: 0 20px 13px;
		}

		.bohemcars-news-card__meta {
			font-size: 13.5px;
			line-height: 18px;
		}

		.bohemcars-news-card__title {
			-webkit-line-clamp: 2;
			font-size: 19px;
			line-clamp: 2;
			line-height: 22px;
		}

		.bohemcars-news-card__cta {
			margin-top: 2px;
			gap: 8px;
			font-size: 14.5px;
			line-height: 20px;
			padding: 6px 8px 6px 13px;
		}

		.bohemcars-news-all-card {
			display: flex;
			min-height: 184px;
			aspect-ratio: auto;
			flex-direction: column;
			gap: 8px;
			overflow: hidden;
			border-radius: 16px;
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.34), transparent 34%), #98bc2a;
			color: #1c1c1c;
			padding: 20px;
			position: relative;
			isolation: isolate;
		}

		.bohemcars-news-all-card::after {
			position: absolute;
			inset: 0;
			background-image: linear-gradient(135deg, rgba(26, 42, 22, 0.12) 1px, transparent 1px);
			background-size: 18px 18px;
			content: '';
			opacity: 0.22;
			pointer-events: none;
			z-index: -1;
		}

		.bohemcars-news-all-card:hover {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.34), transparent 34%), #8fb321;
			color: #1c1c1c;
			transform: none;
		}

		.bohemcars-news-all-card__topline {
			display: flex;
			align-items: flex-start;
			justify-content: flex-start;
		}

		.bohemcars-news-all-card__brand {
			display: block;
			width: 134px;
			max-width: 52%;
			height: auto;
			box-sizing: border-box;
			border-radius: 999px;
			background: rgb(255 255 255 / 0.86);
			padding: 6px 9px;
		}

		.bohemcars-news-all-card__title {
			display: block;
			max-width: 260px;
			margin-top: 8px;
			font-size: 24px;
			font-weight: 900;
			letter-spacing: 0;
			line-height: 28px;
		}

		.bohemcars-news-all-card__copy {
			display: block;
			max-width: 290px;
			color: #25351f;
			font-size: 14px;
			font-weight: 600;
			line-height: 20px;
		}

		.bohemcars-news-all-card__cta {
			display: inline-flex;
			width: fit-content;
			align-items: center;
			justify-content: center;
			gap: 9px;
			margin-top: 4px;
			border-radius: 999px;
			background: #14210f;
			color: #ffffff;
			font-size: 14px;
			font-weight: 900;
			line-height: 20px;
			padding: 8px 10px 8px 16px;
		}

		.bohemcars-news-all-card__cta span {
			color: inherit;
		}

		.bohemcars-news-all-card__icon {
			display: inline-flex;
			width: 24px;
			height: 24px;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			background: #ffffff;
			color: #14210f;
		}

		.bohemcars-news-all-card__icon :global(svg),
		.bohemcars-news-all-card__icon :global(path),
		.bohemcars-news-all-card__icon :global(line),
		.bohemcars-news-all-card__icon :global(polyline) {
			color: #14210f !important;
			stroke: #14210f !important;
		}
	}
</style>
