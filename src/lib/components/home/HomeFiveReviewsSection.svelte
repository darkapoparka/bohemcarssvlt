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
	let moreReviewsLabel = $derived(isEnglish ? 'View all reviews' : 'Виж всички отзиви');
	let moreReviewsHint = $derived(
		isEnglish ? 'Read more client stories' : 'Прочети още реални истории'
	);
</script>

{#if reviews.length}
	<section class="bohemcars-home-reviews bg-white py-100">
		<div class="container">
			<div class="bohemcars-reviews-panel">
				<div class="title-section wow fadeInDown mb-38" data-wow-delay="0.1s">
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
										<img class="testimonior--img" src={review.avatar} alt={review.name} />
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
								<span class="bohemcars-review-more-card__title">{moreReviewsLabel}</span>
								<span class="bohemcars-review-more-card__meta">{moreReviewsHint}</span>
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
		padding-top: 84px;
		padding-bottom: 84px;
	}

	.bohemcars-reviews-panel {
		background: #f6f7f3;
		border-radius: 8px;
		padding: 52px 56px 50px;
	}

	.bohemcars-home-reviews :global(.swiper-testimonior) {
		margin: 0;
		padding: 0;
	}

	.bohemcars-home-reviews :global(.testimonior-box) {
		background: #ffffff;
		border: 0;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		min-height: 292px;
	}

	.bohemcars-home-reviews :global(.testimonior-box--user) {
		margin-top: auto;
	}

	.bohemcars-home-reviews :global(.testimonior-box),
	.bohemcars-home-reviews :global(.testimonior-box:hover) {
		transform: none !important;
	}

	.bohemcars-home-reviews :global(.testimonior-box:hover) {
		box-shadow: 0 8px 18px rgba(28, 28, 28, 0.04);
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
			padding-top: 28px !important;
			padding-bottom: 30px !important;
		}

		.bohemcars-reviews-panel {
			margin-inline: -16px;
			border-radius: 0;
			padding: 24px 0 26px 16px;
		}

		.bohemcars-home-reviews :global(.title-section) {
			align-items: center;
			margin-bottom: 16px !important;
			padding-right: 16px;
		}

		.bohemcars-home-reviews :global(.title-section h2) {
			font-size: 24px;
			font-weight: 700;
			line-height: 30px;
		}

		.bohemcars-home-reviews :global(.title-section .bohemcars-section-cta) {
			display: none !important;
		}

		.bohemcars-home-reviews :global(.swiper-testimonior) {
			overflow-x: auto;
			padding: 0 16px 2px 0;
			scroll-padding-left: 0;
			scroll-snap-type: x proximity;
			scrollbar-width: none;
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
			min-height: 224px;
			padding: 20px;
		}

		.bohemcars-review-more-card__title {
			margin-top: 38px;
			font-size: 21px;
			line-height: 27px;
		}

		.bohemcars-home-reviews :global(.pagination-swiper-testimonior) {
			display: none !important;
		}
	}
</style>
