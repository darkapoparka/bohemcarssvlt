<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroReviewCard as AuxeroReviewCardData } from '$lib/auxero/reviews';
	import ReviewCard from '$lib/components/reviews/AuxeroReviewCard.svelte';

	let { reviews }: { reviews: AuxeroReviewCardData[] } = $props();
</script>

<section>
	<div class="wow fadeIn container" data-wow-delay="0.3s">
		<div class="title-section mb-40">
			<h2>Отзиви от клиенти</h2>
			<a
				href={resolve('/reviews')}
				class="btn btn-line-style-2 effect-line-primary hover-fill-white btn-large">Виж всички</a
			>
		</div>
		<div class="swiper-container swiper-testimonior">
			<div class="swiper-wrapper">
				{#each reviews as review (review.id)}
					<div class="swiper-slide">
						<ReviewCard card={review} />
					</div>
				{/each}
			</div>
			<div
				class="swiper-pagination pagination-dark pagination-style pagination-swiper-testimonior mt-35"
			></div>
		</div>
	</div>
</section>
