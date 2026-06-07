<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveReview } from '$lib/auxero/home-five';
	import { bohemcarsAssets } from '$lib/data/bohemcars';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import { ArrowRight } from '@lucide/svelte';
	import HomeSectionCta from './HomeSectionCta.svelte';

	let { copy, reviews }: { copy: HomePageCopy; reviews: HomeFiveReview[] } = $props();

	const reviewsHref = resolve('/reviews');
	const isEnglish = $derived(copy.reviewsTitle === 'Client Reviews');
	const starsLabel = $derived(isEnglish ? '5 out of 5 stars' : '5 от 5 звезди');
	let duplicatedReviews = $derived([...reviews, ...reviews]);
	let moreCardReviews = $derived(reviews.slice(0, 3));
	let moreReviewsLabel = $derived(isEnglish ? 'View all reviews' : 'Виж всички отзиви');
	let moreReviewsHint = $derived(
		isEnglish ? 'Read more client stories' : 'Прочети още реални истории'
	);
</script>

{#if reviews.length}
	<section class="bohemcars-home-reviews py-100">
		<div class="container">
			<div class="bohemcars-reviews-panel">
				<div
					class="title-section bohemcars-reviews-banner wow fadeInDown mb-38"
					data-wow-delay="0.1s"
				>
					<h2>{copy.reviewsTitle}</h2>
					<HomeSectionCta href="/reviews" label={copy.commonCta} />
				</div>
				<div class="swiper-container swiper-testimonior wow fadeIn" data-wow-delay="0.1s">
					<div class="swiper-wrapper">
						{#each duplicatedReviews as review, index (`${review.name}-${index}`)}
							<div class="swiper-slide" class:bohemcars-review-extra={index >= reviews.length}>
								<a href={reviewsHref} class="testimonior-box">
									<div
										class="bohemcars-review-stars mb-16"
										role="img"
										aria-label={starsLabel}
									></div>
									<p class="testimonior-box--desc mb-16">{review.text}</p>
									<div class="testimonior-box--user">
										<img
											class="testimonior--img"
											src={review.avatar}
											alt={review.name}
											loading="lazy"
										/>
										<div class="testimonior-box--user-content">
											<p class="h5 title">{review.name}</p>
											<p class="desc">{review.role}</p>
										</div>
									</div>
								</a>
							</div>
						{/each}
						<div class="swiper-slide bohemcars-review-more-slide">
							<a href={reviewsHref} class="bohemcars-review-more-card">
								<span class="bohemcars-review-more-card__topline">
									<img
										class="bohemcars-review-more-card__brand"
										src={bohemcarsAssets.logoLight}
										alt="Bohemcars"
										loading="lazy"
									/>
								</span>
								<span class="bohemcars-review-more-card__eyebrow">{copy.reviewsTitle}</span>
								<span class="bohemcars-review-more-card__proof" aria-hidden="true">
									<span class="bohemcars-review-more-card__avatars">
										{#each moreCardReviews as review (review.name)}
											<img src={review.avatar} alt="" loading="lazy" />
										{/each}
									</span>
									<span class="bohemcars-review-more-card__stars">★★★★★</span>
								</span>
								<span class="bohemcars-review-more-card__title">{moreReviewsLabel}</span>
								<span class="bohemcars-review-more-card__meta">{moreReviewsHint}</span>
								<span class="bohemcars-review-more-card__cta">
									<span>{copy.commonCta}</span>
									<span class="bohemcars-review-more-card__icon" aria-hidden="true">
										<ArrowRight size={16} strokeWidth={2.7} />
									</span>
								</span>
							</a>
						</div>
					</div>
					<div
						class="swiper-pagination pagination-dark pagination-style pagination-swiper-testimonior mt-35"
					></div>
				</div>
			</div>
		</div>
	</section>
{/if}

<style>
	.bohemcars-home-reviews {
		background-color: var(--bc-bg) !important;
		padding-top: 64px;
		padding-bottom: 64px;
	}

	.bohemcars-reviews-panel {
		background: transparent;
		border-radius: 0;
		padding: 0;
	}

	.bohemcars-reviews-banner {
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

	.bohemcars-reviews-banner h2 {
		color: #ffffff;
		margin: 0;
	}

	.bohemcars-home-reviews :global(.swiper-testimonior) {
		margin: 0;
		padding: 0;
	}

	.bohemcars-home-reviews :global(.testimonior-box) {
		background: var(--bc-surface);
		border: 0;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		min-height: 292px;
		transition: background-color 0.18s ease;
	}

	.bohemcars-home-reviews :global(.testimonior-box--user) {
		margin-top: auto;
	}

	.bohemcars-home-reviews :global(.testimonior-box),
	.bohemcars-home-reviews :global(.testimonior-box:hover) {
		transform: none !important;
	}

	.bohemcars-home-reviews :global(.testimonior-box:hover) {
		background: var(--bc-surface-hover);
		box-shadow: none;
	}

	.bohemcars-review-stars {
		position: relative;
		min-height: 20px;
	}

	.bohemcars-review-stars::before {
		content: '★★★★★';
		color: #98bc2a;
		font-size: 18px;
		letter-spacing: 2px;
		line-height: 20px;
	}

	.bohemcars-review-more-slide {
		display: none;
	}

	.bohemcars-review-more-card {
		display: flex;
		min-height: 100%;
		flex-direction: column;
		justify-content: space-between;
		border-radius: 8px;
		background:
			linear-gradient(135deg, rgba(152, 188, 42, 0.16), transparent 34%),
			linear-gradient(135deg, #14210f 0%, #1a2a16 66%, #0d160a 100%);
		color: #ffffff;
		isolation: isolate;
		overflow: hidden;
		padding: 22px;
		position: relative;
	}

	.bohemcars-review-more-card::after {
		position: absolute;
		inset: 0;
		background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
		background-size: 18px 18px;
		content: '';
		opacity: 0.24;
		pointer-events: none;
		z-index: -1;
	}

	.bohemcars-review-more-card,
	.bohemcars-review-more-card:hover,
	.bohemcars-review-more-card:focus-visible {
		color: #ffffff;
		transform: none !important;
	}

	.bohemcars-review-more-card__eyebrow {
		color: #d9f275;
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0;
		line-height: 16px;
		text-transform: uppercase;
	}

	.bohemcars-review-more-card__topline {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.bohemcars-review-more-card__brand {
		display: block;
		width: min(148px, 48%);
		height: auto;
		box-sizing: border-box;
		border-radius: 999px;
		background: rgb(255 255 255 / 0.92);
		padding: 6px 9px;
	}

	.bohemcars-review-more-card__cta span {
		color: inherit;
	}

	.bohemcars-review-more-card__title {
		display: block;
		margin-top: 44px;
		color: #ffffff;
		font-size: 22px;
		font-weight: 700;
		line-height: 28px;
	}

	.bohemcars-review-more-card__meta {
		color: rgb(255 255 255 / 0.72);
		font-size: 13px;
		font-weight: 500;
		line-height: 18px;
	}

	@media (max-width: 767px) {
		.bohemcars-home-reviews {
			background-color: var(--bc-bg) !important;
			padding-top: 28px !important;
			padding-bottom: 30px !important;
		}

		.bohemcars-reviews-panel {
			margin-inline: -16px;
			border-radius: 0;
			background: transparent !important;
			padding: 0 0 0 16px;
		}

		.bohemcars-home-reviews :global(.title-section) {
			align-items: flex-start;
			justify-content: flex-start;
			margin-bottom: 16px !important;
			padding-right: 16px;
			text-align: left;
		}

		.bohemcars-reviews-banner {
			overflow: visible;
			border: 0;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
			padding: 0 16px 0 0;
		}

		.bohemcars-home-reviews :global(.title-section h2) {
			color: #1c1c1c;
			font-size: 24px;
			font-weight: 800;
			letter-spacing: 0;
			line-height: 30px;
			text-align: left;
		}

		.bohemcars-home-reviews :global(.title-section .bohemcars-section-cta) {
			display: none !important;
		}

		.bohemcars-home-reviews :global(.swiper-testimonior) {
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;
			overscroll-behavior-x: contain;
			padding: 0 16px 2px 0;
			scroll-padding-left: 0;
			scroll-snap-type: x proximity;
			scrollbar-width: none;
			touch-action: pan-x;
		}

		.bohemcars-home-reviews :global(.swiper-testimonior::-webkit-scrollbar) {
			display: none;
		}

		.bohemcars-home-reviews :global(.swiper-wrapper) {
			display: flex !important;
			width: max-content !important;
			gap: 12px;
			transform: none !important;
		}

		.bohemcars-home-reviews :global(.swiper-slide) {
			flex: 0 0 min(78vw, 292px);
			width: min(78vw, 292px) !important;
			height: auto !important;
			scroll-snap-align: start;
		}

		.bohemcars-home-reviews :global(.swiper-slide.bohemcars-review-extra) {
			display: none !important;
		}

		.bohemcars-review-more-slide {
			display: block !important;
		}

		.bohemcars-home-reviews :global(.testimonior-box) {
			min-height: 224px;
			background: var(--bc-surface);
			padding: 18px !important;
		}

		.bohemcars-review-stars {
			min-height: 18px;
		}

		.bohemcars-review-stars::before {
			font-size: 15px;
			letter-spacing: 0;
			line-height: 18px;
		}

		.bohemcars-home-reviews :global(.testimonior-box--desc) {
			margin-bottom: 18px !important;
			font-size: 14px;
			line-height: 21px;
		}

		.bohemcars-home-reviews :global(.testimonior--img) {
			width: 42px;
			height: 42px;
		}

		.bohemcars-home-reviews :global(.testimonior-box--user .title) {
			font-size: 16px;
			line-height: 21px;
		}

		.bohemcars-home-reviews :global(.testimonior-box--user .desc) {
			font-size: 12px;
			line-height: 16px;
		}

		.bohemcars-review-more-card {
			height: 100%;
			min-height: 232px;
			border: 0;
			background:
				linear-gradient(135deg, rgba(152, 188, 42, 0.2), transparent 38%),
				linear-gradient(135deg, #14210f 0%, #1a2a16 70%, #0d160a 100%);
			color: #ffffff;
			padding: 18px 20px;
		}

		.bohemcars-review-more-card,
		.bohemcars-review-more-card:hover,
		.bohemcars-review-more-card:focus-visible {
			color: #ffffff;
		}

		.bohemcars-review-more-card__eyebrow {
			display: block;
			margin-top: 12px;
			color: #d9f275;
			font-size: 12px;
			font-weight: 800;
			line-height: 15px;
			text-transform: uppercase;
		}

		.bohemcars-review-more-card__topline {
			align-items: center;
			justify-content: flex-start;
		}

		.bohemcars-review-more-card__brand {
			width: 132px;
			max-width: 56%;
			padding: 5px 9px;
		}

		.bohemcars-review-more-card__proof {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			margin-top: 11px;
		}

		.bohemcars-review-more-card__avatars {
			display: flex;
			align-items: center;
		}

		.bohemcars-review-more-card__avatars img {
			display: block;
			width: 32px;
			height: 32px;
			border: 2px solid #ffffff;
			border-radius: 50%;
			object-fit: cover;
		}

		.bohemcars-review-more-card__avatars img + img {
			margin-left: -10px;
		}

		.bohemcars-review-more-card__stars {
			color: #98bc2a;
			font-size: 13px;
			letter-spacing: 1px;
			line-height: 16px;
			white-space: nowrap;
		}

		.bohemcars-review-more-card__title {
			margin-top: 12px;
			color: #ffffff;
			font-size: 21px;
			line-height: 26px;
		}

		.bohemcars-review-more-card__meta {
			color: rgb(255 255 255 / 0.72);
			font-size: 13px;
			line-height: 18px;
		}

		.bohemcars-review-more-card__cta {
			display: inline-flex;
			width: fit-content;
			align-items: center;
			justify-content: center;
			gap: 9px;
			margin-left: auto;
			border-radius: 999px;
			background: #d9f275;
			color: #14210f;
			font-size: 14px;
			font-weight: 800;
			line-height: 20px;
			padding: 7px 8px 7px 14px;
		}

		.bohemcars-review-more-card__icon {
			display: inline-flex;
			width: 22px;
			height: 22px;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			background: #14210f;
			color: #ffffff;
		}

		.bohemcars-review-more-card__icon :global(svg) {
			display: block;
			width: 14px;
			height: 14px;
		}

		.bohemcars-review-more-card__icon :global(svg),
		.bohemcars-review-more-card__icon :global(path),
		.bohemcars-review-more-card__icon :global(line),
		.bohemcars-review-more-card__icon :global(polyline) {
			color: #ffffff !important;
			stroke: #ffffff !important;
		}

		.bohemcars-home-reviews :global(.pagination-swiper-testimonior) {
			display: none !important;
		}
	}
</style>
