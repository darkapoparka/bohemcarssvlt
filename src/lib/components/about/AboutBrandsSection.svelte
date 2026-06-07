<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroAboutBrandCard } from '$lib/auxero/about';

	let { brands }: { brands: AuxeroAboutBrandCard[] } = $props();
</script>

<section class="bohemcars-about-brands">
	<div class="container">
		<div class="title-section wow fadeInDown mb-34" data-wow-delay="0.1s">
			<div>
				<p class="bohemcars-about-brands__eyebrow">Марки</p>
				<h2>Марки, с които работим</h2>
				<p class="bohemcars-about-brands__copy">
					Налични автомобили и търсене по заявка от Канада според бюджет, модел и срок.
				</p>
			</div>
		</div>

		<div class="bohemcars-about-brands__grid">
			{#each brands as brand, index (brand.name)}
				<a
					href={resolve(brand.href as '/')}
					class="bohemcars-about-brand-card out-brand-2 wow fadeInUp"
					data-wow-delay={`0.${(index % 4) + 1}s`}
				>
					<span class="bohemcars-about-brand-card__logo-frame">
						<img class="out-brand--img" src={brand.image} alt="" />
					</span>
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
		padding: 42px 0 54px;
	}

	.bohemcars-about-brands :global(.title-section) {
		align-items: flex-end;
	}

	.bohemcars-about-brands__eyebrow {
		margin-bottom: 8px;
		color: #84a928;
		font-size: 13px;
		font-weight: 800;
		letter-spacing: 0;
		line-height: 18px;
		text-transform: uppercase;
	}

	.bohemcars-about-brands h2 {
		margin-bottom: 8px;
		font-size: clamp(28px, 2vw, 34px);
		font-weight: 500;
		line-height: 1.12;
	}

	.bohemcars-about-brands__copy {
		max-width: 720px;
		margin: 0;
		color: #696665;
		font-size: 16px;
		line-height: 1.55;
	}

	.bohemcars-about-brands__grid {
		display: grid;
		gap: 16px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.bohemcars-about-brand-card {
		min-height: 150px;
		border: 1px solid var(--bc-border);
		border-radius: 14px;
		background: var(--bc-surface-soft) !important;
		box-shadow: none !important;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			box-shadow 0.25s ease,
			transform 0.25s ease;
	}

	.bohemcars-about-brand-card__logo-frame {
		display: grid;
		height: 62px;
		margin-bottom: 10px;
		place-items: center;
		width: 92px;
	}

	.bohemcars-about-brand-card__logo-frame :global(.out-brand--img) {
		display: block;
		height: 56px !important;
		margin: 0 !important;
		max-height: 56px;
		max-width: 92px;
		object-fit: contain;
		width: 92px !important;
	}

	.bohemcars-about-brand-card:hover {
		border-color: #cbd8c1;
		background: #ffffff !important;
		box-shadow: 0 14px 32px rgb(20 33 15 / 0.07) !important;
		transform: translateY(-3px);
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
			padding: 38px 0 50px;
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
