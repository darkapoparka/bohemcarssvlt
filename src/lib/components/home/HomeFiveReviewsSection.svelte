<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveReview } from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import HomeSectionCta from './HomeSectionCta.svelte';

	let { copy, reviews }: { copy: HomePageCopy; reviews: HomeFiveReview[] } = $props();

	const stars = Array.from({ length: 5 }, (_, index) => index);
	const reviewsHref = resolve('/reviews');
	let duplicatedReviews = $derived([...reviews, ...reviews]);
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
							<div class="swiper-slide">
								<a href={reviewsHref} class="testimonior-box">
									<div class="mb-16 flex items-center gap-4">
										{#each stars as star (star)}
											<img src="/assets/icons/star.svg" alt="rating" />
										{/each}
									</div>
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
		min-height: 292px;
	}

	.bohemcars-home-reviews :global(.testimonior-box),
	.bohemcars-home-reviews :global(.testimonior-box:hover) {
		transform: none !important;
	}

	.bohemcars-home-reviews :global(.testimonior-box:hover) {
		box-shadow: 0 8px 18px rgba(28, 28, 28, 0.04);
	}

	@media (max-width: 767px) {
		.bohemcars-reviews-panel {
			padding: 30px 18px 34px;
		}
	}
</style>
