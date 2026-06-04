<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveBrandCard } from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import HomeSectionCta from './HomeSectionCta.svelte';

	let { cards, copy }: { cards: HomeFiveBrandCard[]; copy: HomePageCopy } = $props();
</script>

<section class="bohemcars-brand-strip background-light py-100">
	<div class="container">
		<div class="bohemcars-brand-strip__surface">
			<div class="title-section wow fadeInDown mb-34" data-wow-delay="0.1s">
				<h2>{copy.brandTitle}</h2>
				<HomeSectionCta href="/inventory" label={copy.brandCta} />
			</div>
			<div
				class="swiper-container swiper-outbrand-3 wow fadeIn"
				data-wow-delay="0.1s"
				data-bohemcars-brand-carousel
			>
				<div class="swiper-wrapper">
					{#each cards as brand, index (brand.name)}
						<div class="swiper-slide">
							<a
								href={resolve(`/inventory?brand=${encodeURIComponent(brand.query)}`)}
								class={index === 0 ? 'out-brand-2 ' : 'out-brand-2'}
							>
								<img class="out-brand--img mb-8" src={brand.image} alt={brand.name} />
								<p class="h5">{brand.name}</p>
								<p class="text-muted text-sm">{brand.count}</p>
							</a>
						</div>
					{/each}
				</div>
				<div
					class="swiper-pagination pagination-dark pagination-style pagination-swiper-outbrand-3 mt-35"
				></div>
			</div>
		</div>
	</div>
</section>

<style>
	.bohemcars-brand-strip {
		overflow: hidden;
		padding-bottom: 76px;
	}

	.bohemcars-brand-strip__surface {
		background: var(--bc-surface-soft);
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		padding: 42px 40px 36px;
	}

	.bohemcars-brand-strip :global(.title-section) {
		align-items: center;
		display: flex;
		justify-content: space-between;
	}

	.bohemcars-brand-strip :global(.swiper-outbrand-3) {
		margin: 0;
		padding: 0;
	}

	.bohemcars-brand-strip :global(.out-brand-2) {
		background-color: var(--bc-surface) !important;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		box-shadow: none !important;
		min-height: 178px;
	}

	.bohemcars-brand-strip :global(.out-brand-2:hover),
	.bohemcars-brand-strip :global(.out-brand-2.active) {
		background-color: var(--bc-surface-hover) !important;
		border-color: var(--bc-border);
		box-shadow: none !important;
	}

	@media (max-width: 767px) {
		.bohemcars-brand-strip__surface {
			padding: 28px 18px 30px;
		}

		.bohemcars-brand-strip :global(.title-section) {
			align-items: flex-start;
			gap: 18px;
		}
	}
</style>
