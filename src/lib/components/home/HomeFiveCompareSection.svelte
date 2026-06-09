<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveComparePair } from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import HomeSectionCta from './HomeSectionCta.svelte';

	let {
		copy,
		pairs
	}: {
		copy: HomePageCopy;
		pairs: HomeFiveComparePair[];
	} = $props();

	const compareThumbs = $derived(pairs.flatMap((pair) => [pair.left, pair.right]).slice(0, 4));
</script>

{#if pairs.length}
	<section class="bohemcars-home-compare py-100">
		<div class="container">
			<div
				class="title-section bohemcars-home-compare__banner mb-42 flex items-center justify-between"
			>
				<h2>{copy.compareTitle}</h2>
				<HomeSectionCta href="/compare" label={copy.commonCta} />
			</div>
			<div class="bohemcars-home-compare__grid">
				{#each pairs as pair (`${pair.left.slug}:${pair.right.slug}`)}
					<div class="bohemcars-home-compare__pair">
						{@render compareVehicle(pair.left)}
						<div class="bohemcars-home-compare__divider" aria-hidden="true">VS</div>
						{@render compareVehicle(pair.right)}
					</div>
				{/each}
				<a
					class="bohemcars-home-compare__more"
					href={resolve('/compare')}
					aria-label={copy.commonCta}
				>
					<span class="bohemcars-home-compare__more-fleet" aria-hidden="true">
						{#each compareThumbs as thumb (thumb.slug)}
							<span class="bohemcars-home-compare__more-thumb">
								<img src={thumb.image} alt="" loading="lazy" />
							</span>
						{/each}
					</span>
					<span class="bohemcars-home-compare__more-cta">
						<span>{copy.commonCta}</span>
						<span class="bohemcars-home-compare__more-icon" aria-hidden="true">→</span>
					</span>
				</a>
			</div>
		</div>
	</section>
{/if}

{#snippet compareVehicle(vehicle: HomeFiveComparePair['left'])}
	<a
		class="bohemcars-home-compare__vehicle"
		href={resolve(`/inventory/${encodeURIComponent(vehicle.slug)}`)}
	>
		<span class="bohemcars-home-compare__image">
			<img src={vehicle.image} alt={vehicle.title} loading="lazy" />
		</span>
		<span class="bohemcars-home-compare__content">
			<span class="bohemcars-home-compare__brand">{vehicle.brand}</span>
			<span class="bohemcars-home-compare__title">{vehicle.title}</span>
			<span class="bohemcars-home-compare__price">{vehicle.priceLabel}</span>
		</span>
	</a>
{/snippet}

<style>
	.bohemcars-home-compare {
		background: var(--bc-bg);
		padding-top: 64px;
		padding-bottom: 64px;
	}

	.bohemcars-home-compare__banner {
		position: relative;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		background: linear-gradient(135deg, #14210f 0%, #1f3318 58%, #0f190c 100%);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
		padding: 24px 28px;
	}

	.bohemcars-home-compare__banner h2 {
		margin: 0;
		color: #ffffff;
	}

	.bohemcars-home-compare__grid {
		display: grid;
		gap: 30px;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.bohemcars-home-compare__pair {
		align-items: stretch;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		box-shadow: none;
		background: #ffffff;
		display: grid;
		gap: 18px;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		min-height: 286px;
		padding: 22px;
	}

	.bohemcars-home-compare__vehicle {
		color: #1c1c1c;
		display: flex;
		flex-direction: column;
		min-width: 0;
		text-align: center;
	}

	.bohemcars-home-compare__vehicle:hover,
	.bohemcars-home-compare__vehicle:focus-visible {
		color: #1c1c1c;
	}

	.bohemcars-home-compare__image {
		align-items: center;
		aspect-ratio: 16 / 10;
		background: var(--bc-surface-soft);
		border-radius: 8px;
		display: flex;
		justify-content: center;
		margin-bottom: 16px;
		overflow: hidden;
		padding: 12px;
		transition: background-color 0.18s ease;
	}

	.bohemcars-home-compare__vehicle:hover .bohemcars-home-compare__image,
	.bohemcars-home-compare__vehicle:focus-visible .bohemcars-home-compare__image {
		background: #e7f4c6;
	}

	.bohemcars-home-compare__image img {
		display: block;
		height: 100%;
		max-width: 100%;
		object-fit: contain;
		transform: none !important;
		width: 100%;
	}

	.bohemcars-home-compare__content {
		display: grid;
		gap: 4px;
		justify-items: center;
		min-width: 0;
	}

	.bohemcars-home-compare__brand {
		color: #6f7769;
		font-size: 13px;
		font-weight: 700;
		line-height: 18px;
		text-transform: uppercase;
	}

	.bohemcars-home-compare__title {
		color: #1c1c1c;
		display: -webkit-box;
		font-size: 18px;
		font-weight: 700;
		line-height: 24px;
		overflow: hidden;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.bohemcars-home-compare__price {
		color: #1c1c1c;
		font-size: 18px;
		font-weight: 700;
		line-height: 24px;
	}

	.bohemcars-home-compare__divider {
		align-self: center;
		background: #d9f275;
		border-radius: 999px;
		color: #14210f;
		display: inline-flex;
		font-size: 14px;
		font-weight: 700;
		height: 48px;
		align-items: center;
		justify-content: center;
		width: 48px;
	}

	.bohemcars-home-compare__more {
		display: none;
	}

	@media (max-width: 991px) {
		.bohemcars-home-compare__grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 767px) {
		.bohemcars-home-compare {
			padding-top: 6px;
			padding-bottom: 16px;
		}

		.bohemcars-home-compare :global(.title-section) {
			align-items: center;
			gap: 12px;
			margin-bottom: 14px !important;
		}

		.bohemcars-home-compare__banner {
			overflow: visible;
			border: 0;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
			padding: 0;
		}

		.bohemcars-home-compare :global(.title-section h2) {
			color: #1c1c1c;
			font-size: 24px;
			font-weight: 700;
			letter-spacing: 0;
			line-height: 30px;
		}

		/* Match the featured-cars carousel: full-bleed horizontal scroll with a peek. */
		.bohemcars-home-compare__grid {
			display: flex;
			grid-template-columns: none;
			gap: 14px;
			margin-inline: -16px;
			padding: 2px 16px;
			overflow-x: auto;
			scroll-padding-inline: 16px;
			scroll-snap-type: x proximity;
			scrollbar-width: none;
		}

		.bohemcars-home-compare__grid::-webkit-scrollbar {
			display: none;
		}

		.bohemcars-home-compare__pair {
			flex: 0 0 min(86vw, 340px);
			background: var(--bc-surface);
			grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
			gap: 8px;
			min-height: 0;
			padding: 14px 12px;
			scroll-snap-align: start;
		}

		.bohemcars-home-compare__image {
			aspect-ratio: 16 / 11;
			background: #ffffff;
			margin-bottom: 10px;
			padding: 8px;
		}

		.bohemcars-home-compare__brand {
			font-size: 12px;
			line-height: 16px;
		}

		.bohemcars-home-compare__title {
			font-size: 14px;
			line-height: 18px;
		}

		.bohemcars-home-compare__price {
			font-size: 16px;
			line-height: 22px;
		}

		.bohemcars-home-compare__divider {
			width: 34px;
			height: 34px;
			font-size: 12px;
		}

		/* No header CTA button on mobile — the carousel ends with a "view all" card. */
		.bohemcars-home-compare :global(.bohemcars-section-cta) {
			display: none;
		}

		.bohemcars-home-compare__more {
			display: flex;
			flex: 0 0 min(86vw, 340px);
			flex-direction: column;
			justify-content: space-between;
			gap: 12px;
			border: 1px solid var(--bc-border);
			border-radius: 8px;
			background: var(--bc-surface);
			color: #1c1c1c;
			padding: 14px;
			scroll-snap-align: start;
		}

		.bohemcars-home-compare__more-fleet {
			display: grid;
			width: 100%;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			grid-auto-rows: 74px;
			gap: 8px;
		}

		.bohemcars-home-compare__more-thumb {
			display: block;
			overflow: hidden;
			border: 1px solid var(--bc-border);
			border-radius: 8px;
			background: #ffffff;
		}

		.bohemcars-home-compare__more-thumb img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		.bohemcars-home-compare__more-cta {
			display: flex;
			width: 100%;
			align-items: center;
			justify-content: space-between;
			gap: 9px;
			color: #1c1c1c;
			font-size: 17px;
			font-weight: 700;
			line-height: 22px;
		}

		.bohemcars-home-compare__more-icon {
			display: inline-flex;
			width: 30px;
			height: 30px;
			flex: 0 0 30px;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			background: #98bc2a;
			color: #ffffff;
			font-size: 16px;
			line-height: 1;
		}
	}
</style>
