<script lang="ts">
	import { Star } from '@lucide/svelte';

	const reviews = [
		{
			name: 'Kristin Watson',
			avatar: '/assets/images/avatar/avatar-1.png',
			text: 'The listing detail page answered the finance questions before I even called.'
		},
		{
			name: 'Robert Fox',
			avatar: '/assets/images/avatar/avatar-3.png',
			text: 'Filters were fast, photos were clear, and the dealer response was immediate.'
		},
		{
			name: 'Jenny Wilson',
			avatar: '/assets/images/avatar/avatar-4.png',
			text: 'I compared three cars and saved the exact one I wanted for a weekend test drive.'
		}
	];
</script>

<section class="section reviews-band">
	<div class="container">
		<div class="section-title">
			<div>
				<p class="eyebrow">Clients Reviews</p>
				<h2>What Drivers Say</h2>
			</div>
			<a class="btn btn-line" href="/reviews">View All Reviews</a>
		</div>
		<div class="reviews-grid">
			{#each reviews as review (review.name)}
				<article class="review-card">
					<div class="stars" aria-label="5 star review">
						{#each [0, 1, 2, 3, 4] as index (index)}
							<Star size={17} fill="currentColor" />
						{/each}
					</div>
					<p>{review.text}</p>
					<div class="review-card__person">
						<img src={review.avatar} alt={review.name} />
						<span>{review.name}</span>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>
