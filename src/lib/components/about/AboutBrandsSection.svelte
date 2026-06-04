<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroAboutBrandCard } from '$lib/auxero/about';

	let { brands }: { brands: AuxeroAboutBrandCard[] } = $props();
</script>

<section class="bohemcars-about-brands">
	<div class="container">
		<div class="title-section wow fadeInDown mb-34" data-wow-delay="0.1s">
			<h2>Марки, с които работим</h2>
			<a href={resolve('/inventory')} class="btn btn-line-style-2 btn-large font-weight-600">
				Виж наличните
			</a>
		</div>

		<div class="bohemcars-about-brands__grid">
			{#each brands as brand, index (brand.name)}
				<a
					href={resolve(brand.href as '/')}
					class="bohemcars-about-brand-card out-brand-2 wow fadeInUp"
					data-wow-delay={`0.${(index % 4) + 1}s`}
				>
					<img class="out-brand--img mb-8" src={brand.image} alt={brand.name} />
					<p class="h5">{brand.name}</p>
					<p class="text-muted text-sm">{brand.count}</p>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.bohemcars-about-brands {
		background: var(--bc-bg);
		padding: 48px 0 56px;
	}

	.bohemcars-about-brands :global(.title-section) {
		align-items: center;
	}

	.bohemcars-about-brands__grid {
		display: grid;
		gap: 16px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.bohemcars-about-brand-card {
		min-height: 156px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface) !important;
		box-shadow: none !important;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease;
	}

	.bohemcars-about-brand-card:hover {
		border-color: var(--primary);
		background: var(--bc-surface-hover) !important;
		box-shadow: none !important;
	}

	.bohemcars-about-brand-card :global(.text-muted) {
		color: #5a6356 !important;
	}

	@media (max-width: 1199px) {
		.bohemcars-about-brands__grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 767px) {
		.bohemcars-about-brands {
			padding: 44px 0 58px;
		}

		.bohemcars-about-brands :global(.title-section) {
			align-items: flex-start;
			flex-direction: column;
			gap: 14px;
		}

		.bohemcars-about-brands__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
