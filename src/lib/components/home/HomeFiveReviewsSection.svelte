<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveReview } from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';
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
										<svg
											width="20"
											height="20"
											viewBox="0 0 17 17"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M8.125 0C6.51803 0 4.94714 0.476523 3.611 1.36931C2.27485 2.2621 1.23344 3.53105 0.618482 5.0157C0.00352044 6.50035 -0.157382 8.13401 0.156123 9.71011C0.469628 11.2862 1.24346 12.7339 2.37976 13.8702C3.51606 15.0065 4.9638 15.7804 6.5399 16.0939C8.11599 16.4074 9.74966 16.2465 11.2343 15.6315C12.719 15.0166 13.9879 13.9752 14.8807 12.639C15.7735 11.3029 16.25 9.73197 16.25 8.125C16.2477 5.97081 15.391 3.90551 13.8677 2.38227C12.3445 0.85903 10.2792 0.00227486 8.125 0ZM11.6922 8.56719L9.19219 11.0672C9.07492 11.1845 8.91586 11.2503 8.75 11.2503C8.58415 11.2503 8.42509 11.1845 8.30782 11.0672C8.19054 10.9499 8.12466 10.7909 8.12466 10.625C8.12466 10.4591 8.19054 10.3001 8.30782 10.1828L9.74141 8.75H5C4.83424 8.75 4.67527 8.68415 4.55806 8.56694C4.44085 8.44973 4.375 8.29076 4.375 8.125C4.375 7.95924 4.44085 7.80027 4.55806 7.68306C4.67527 7.56585 4.83424 7.5 5 7.5H9.74141L8.30782 6.06719C8.19054 5.94991 8.12466 5.79085 8.12466 5.625C8.12466 5.45915 8.19054 5.30009 8.30782 5.18281C8.42509 5.06554 8.58415 4.99965 8.75 4.99965C8.91586 4.99965 9.07492 5.06554 9.19219 5.18281L11.6922 7.68281C11.7503 7.74086 11.7964 7.80979 11.8279 7.88566C11.8593 7.96154 11.8755 8.04287 11.8755 8.125C11.8755 8.20713 11.8593 8.28846 11.8279 8.36434C11.7964 8.44021 11.7503 8.50914 11.6922 8.56719Z"
												fill="currentColor"
											/>
										</svg>
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
		background: #1c1c1c;
		color: #ffffff;
		padding: 22px;
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
			align-items: center;
			margin-bottom: 16px !important;
			padding-right: 16px;
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
			font-weight: 700;
			line-height: 30px;
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
			min-height: 224px;
			border: 0;
			background: var(--bc-surface);
			color: #14210f;
			padding: 20px;
		}

		.bohemcars-review-more-card,
		.bohemcars-review-more-card:hover,
		.bohemcars-review-more-card:focus-visible {
			color: #14210f;
		}

		.bohemcars-review-more-card__eyebrow {
			color: #98bc2a;
			font-size: 12px;
			line-height: 16px;
		}

		.bohemcars-review-more-card__proof {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			margin-top: 16px;
		}

		.bohemcars-review-more-card__avatars {
			display: flex;
			align-items: center;
		}

		.bohemcars-review-more-card__avatars img {
			display: block;
			width: 34px;
			height: 34px;
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
			margin-top: 18px;
			color: #14210f;
			font-size: 22px;
			line-height: 27px;
		}

		.bohemcars-review-more-card__meta {
			color: #536052;
			font-size: 14px;
			line-height: 19px;
		}

		.bohemcars-review-more-card__cta {
			display: inline-flex;
			width: 100%;
			align-items: center;
			justify-content: flex-end;
			gap: 10px;
			color: #14210f;
			font-size: 19px;
			font-weight: 800;
			line-height: 26px;
		}

		.bohemcars-review-more-card__icon {
			display: inline-flex;
			width: 28px;
			height: 28px;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			background: #98bc2a;
			color: #ffffff;
		}

		.bohemcars-review-more-card__icon svg {
			display: block;
			width: 28px;
			height: 28px;
		}

		.bohemcars-home-reviews :global(.pagination-swiper-testimonior) {
			display: none !important;
		}
	}
</style>
