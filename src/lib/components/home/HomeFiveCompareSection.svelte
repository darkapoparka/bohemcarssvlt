<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveComparePair } from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import { GitCompareArrows } from '@lucide/svelte';
	import HomeSectionCta from './HomeSectionCta.svelte';

	let { copy, pairs }: { copy: HomePageCopy; pairs: HomeFiveComparePair[] } = $props();
</script>

<section class="bohemcars-compare-section background-light py-100">
	<div class="container">
		<div class="bohemcars-compare-surface">
			<div class="title-section wow fadeInUp mb-40" data-wow-delay="0.1s">
				<h2>{copy.compareTitle}</h2>
				<HomeSectionCta href="/compare" label={copy.commonCta} />
			</div>
			<div
				class="bohemcars-compare-grid wow fadeIn lg-grid-cols-1 grid grid-cols-2 gap-30"
				data-wow-delay="0.1s"
			>
				{#each pairs as pair (`${pair.left.slug}-${pair.right.slug}`)}
					<div class="bohemcars-compare-card">
						<div class="bohemcars-compare-card__media">
							<a href={resolve(`/inventory/${encodeURIComponent(pair.left.slug)}`)}>
								<img src={pair.left.image} alt={pair.left.title} />
							</a>
							<span class="bohemcars-compare-card__vs">VS</span>
							<a href={resolve(`/inventory/${encodeURIComponent(pair.right.slug)}`)}>
								<img src={pair.right.image} alt={pair.right.title} />
							</a>
						</div>
						<div class="bohemcars-compare-card__content">
							<div class="bohemcars-compare-card__vehicles">
								<div>
									<p class="text-muted mb-4 text-xs uppercase">{pair.left.brand}</p>
									<a
										href={resolve(`/inventory/${encodeURIComponent(pair.left.slug)}`)}
										class="bohemcars-compare-card__title h7"
									>
										{pair.left.title}
									</a>
									<p class="bohemcars-compare-card__price h6">{pair.left.priceLabel}</p>
								</div>
								<div>
									<p class="text-muted mb-4 text-xs uppercase">{pair.right.brand}</p>
									<a
										href={resolve(`/inventory/${encodeURIComponent(pair.right.slug)}`)}
										class="bohemcars-compare-card__title h7"
									>
										{pair.right.title}
									</a>
									<p class="bohemcars-compare-card__price h6">{pair.right.priceLabel}</p>
								</div>
							</div>
							<a
								href={resolve(
									`/compare?ids=${encodeURIComponent(pair.left.slug)},${encodeURIComponent(pair.right.slug)}`
								)}
								class="btn btn-small btn-primary-3 bohemcars-compare-card__action font-weight-600 text-sm"
							>
								<GitCompareArrows color="#ffffff" size={18} strokeWidth={2} aria-hidden="true" />
								{copy.vehicleCard.compare}
							</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.bohemcars-compare-section {
		background: #f6f7f3;
	}

	.bohemcars-compare-surface {
		background: transparent;
		border: 0;
		border-radius: 0;
		padding: 0;
	}

	.bohemcars-compare-card {
		background: #ffffff;
		border: 1px solid #e7e7e7;
		border-radius: 8px;
		overflow: hidden;
	}

	.bohemcars-compare-card__media {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		position: relative;
	}

	.bohemcars-compare-card__media a {
		aspect-ratio: 16 / 8.6;
		display: block;
		overflow: hidden;
	}

	.bohemcars-compare-card__media img {
		height: 100%;
		object-fit: cover;
		transform: none !important;
		width: 100%;
	}

	.bohemcars-compare-card__vs {
		align-items: center;
		background: #d9f275;
		border-radius: 999px;
		color: #1c1c1c;
		display: flex;
		font-size: 13px;
		font-weight: 700;
		height: 42px;
		justify-content: center;
		left: 50%;
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 42px;
		z-index: 1;
	}

	.bohemcars-compare-card__content {
		padding: 20px;
	}

	.bohemcars-compare-card__vehicles {
		display: grid;
		gap: 18px;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		margin-bottom: 20px;
	}

	.bohemcars-compare-card__title {
		display: block;
		margin-bottom: 8px;
	}

	.bohemcars-compare-card__price {
		margin-bottom: 0;
	}

	.bohemcars-compare-card:hover {
		background: #ffffff;
		border-color: #d6dbd1;
		box-shadow: 0 8px 18px rgba(28, 28, 28, 0.05);
		transform: none;
	}

	.bohemcars-compare-card :global(.btn) {
		justify-content: center;
		width: 100%;
	}

	.bohemcars-compare-card :global(.btn svg) {
		flex: 0 0 auto;
	}

	.bohemcars-compare-card :global(.bohemcars-compare-card__action svg) {
		stroke: #ffffff !important;
	}

	@media (max-width: 575px) {
		.bohemcars-compare-surface {
			border-radius: 12px;
			padding: 24px 18px;
		}

		.bohemcars-compare-card__media,
		.bohemcars-compare-card__vehicles {
			grid-template-columns: minmax(0, 1fr);
		}

		.bohemcars-compare-card__vs {
			top: 50%;
		}
	}
</style>
