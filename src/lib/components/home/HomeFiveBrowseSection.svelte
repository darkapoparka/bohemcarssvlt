<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveBrandCard, HomeFiveTypeCard } from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import HomeSectionCta from './HomeSectionCta.svelte';

	let {
		afterBrandStripHtml = '',
		brandCards,
		copy,
		typeCards
	}: {
		afterBrandStripHtml?: string;
		brandCards: HomeFiveBrandCard[];
		copy: HomePageCopy;
		typeCards: HomeFiveTypeCard[];
	} = $props();

	const mobileBrandTitle = $derived(copy.brandTitle === 'Explore Our Brands' ? 'Brands' : 'Марки');
	const mobileTypeTitle = $derived(copy.typeTitle === 'Browse By Type' ? 'Body type' : 'Тип купе');
</script>

<section class="bohemcars-browse-section py-100">
	<div class="container">
		<div class="bohemcars-browse-section__surface">
			<div class="bohemcars-brand-strip">
				<div
					class="title-section bohemcars-section-banner bohemcars-section-banner--brand wow fadeInDown mb-34"
					data-wow-delay="0.1s"
				>
					<h2 class="bohemcars-mobile-title-swap" data-mobile-title={mobileBrandTitle}>
						{copy.brandTitle}
					</h2>
					<HomeSectionCta href="/inventory" label={copy.brandCta} />
				</div>
				<div
					class="swiper-container swiper-outbrand-3 wow fadeIn"
					data-wow-delay="0.1s"
					data-bohemcars-brand-carousel
				>
					<div class="swiper-wrapper">
						{#each brandCards as brand, index (brand.name)}
							<div class="swiper-slide">
								<a
									href={resolve(`/inventory?brand=${encodeURIComponent(brand.query)}`)}
									class={index === 0 ? 'out-brand-2 ' : 'out-brand-2'}
								>
									<span class="bohemcars-brand-logo-frame">
										<img class="out-brand--img" src={brand.image} alt="" />
									</span>
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

			{#if afterBrandStripHtml.trim()}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html afterBrandStripHtml}
			{/if}

			<div class="bohemcars-type-gallery">
				<div
					class="title-section bohemcars-section-banner bohemcars-section-banner--type wow fadeInDown mb-42"
					data-wow-delay="0.1s"
				>
					<h2 class="bohemcars-mobile-title-swap" data-mobile-title={mobileTypeTitle}>
						{copy.typeTitle}
					</h2>
					<a
						href={resolve('/inventory?view=4')}
						class="btn btn-large font-weight-600 bohemcars-type-gallery__cta"
					>
						{copy.typeCta}
						<svg
							width="21"
							height="21"
							viewBox="0 0 17 17"
							fill="none"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M8.125 0C6.51803 0 4.94714 0.476523 3.611 1.36931C2.27485 2.2621 1.23344 3.53105 0.618482 5.0157C0.00352044 6.50035 -0.157382 8.13401 0.156123 9.71011C0.469628 11.2862 1.24346 12.7339 2.37976 13.8702C3.51606 15.0065 4.9638 15.7804 6.5399 16.0939C8.11599 16.4074 9.74966 16.2465 11.2343 15.6315C12.719 15.0166 13.9879 13.9752 14.8807 12.639C15.7735 11.3029 16.25 9.73197 16.25 8.125C16.2477 5.97081 15.391 3.90551 13.8677 2.38227C12.3445 0.85903 10.2792 0.00227486 8.125 0ZM11.6922 8.56719L9.19219 11.0672C9.07492 11.1845 8.91586 11.2503 8.75 11.2503C8.58415 11.2503 8.42509 11.1845 8.30782 11.0672C8.19054 10.9499 8.12466 10.7909 8.12466 10.625C8.12466 10.4591 8.19054 10.3001 8.30782 10.1828L9.74141 8.75H5C4.83424 8.75 4.67527 8.68415 4.55806 8.56694C4.44085 8.44973 4.375 8.29076 4.375 8.125C4.375 7.95924 4.44085 7.80027 4.55806 7.68306C4.67527 7.56585 4.83424 7.5 5 7.5H9.74141L8.30782 6.06719C8.19054 5.94991 8.12466 5.79085 8.12466 5.625C8.12466 5.45915 8.19054 5.30009 8.30782 5.18281C8.42509 5.06554 8.58415 4.99965 8.75 4.99965C8.91586 4.99965 9.07492 5.06554 9.19219 5.18281L11.6922 7.68281C11.7503 7.74086 11.7964 7.80979 11.8279 7.88566C11.8593 7.96154 11.8755 8.04287 11.8755 8.125C11.8755 8.20713 11.8593 8.28846 11.8279 8.36434C11.7964 8.44021 11.7503 8.50914 11.6922 8.56719Z"
								fill="currentColor"
							/>
						</svg>
					</a>
				</div>
				<div class="bohemcars-type-gallery__grid">
					{#each typeCards as typeCard (typeCard.image)}
						<a class="bohemcars-type-card" href={resolve(typeCard.href)}>
							<span class="bohemcars-type-card__image">
								<img src={typeCard.image} alt={typeCard.label} />
							</span>
							<span class="bohemcars-type-card__label">{typeCard.label}</span>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.bohemcars-browse-section {
		overflow: hidden;
		background-color: var(--bc-bg) !important;
		padding-top: 64px;
		padding-bottom: 64px;
	}

	.bohemcars-browse-section__surface {
		background: transparent;
		box-shadow: none;
		padding: 0;
	}

	.bohemcars-brand-strip,
	.bohemcars-type-gallery {
		background: transparent;
	}

	.bohemcars-browse-section :global(.title-section) {
		align-items: center;
		display: flex;
		justify-content: space-between;
	}

	.bohemcars-section-banner {
		position: relative;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		background: linear-gradient(135deg, #14210f 0%, #1f3318 58%, #0f190c 100%);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
		padding: 24px 28px;
	}

	.bohemcars-section-banner h2 {
		color: #ffffff;
		margin: 0;
	}

	.bohemcars-section-banner--brand {
		margin-bottom: 26px !important;
	}

	.bohemcars-section-banner--type {
		margin-bottom: 30px !important;
	}

	.bohemcars-browse-section :global(.swiper-outbrand-3) {
		margin: 0;
		overflow: visible;
		padding: 0;
	}

	.bohemcars-browse-section :global(.swiper-outbrand-3 .swiper-wrapper) {
		display: grid !important;
		gap: 22px 30px;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		transform: none !important;
		width: 100% !important;
	}

	.bohemcars-browse-section :global(.swiper-outbrand-3 .swiper-slide) {
		flex: none !important;
		height: auto !important;
		margin-right: 0 !important;
		margin-top: 0 !important;
		width: auto !important;
	}

	.bohemcars-browse-section :global(.out-brand-2) {
		background-color: var(--bc-surface) !important;
		border: 0;
		border-radius: 8px;
		box-shadow: none !important;
		min-height: 168px;
	}

	.bohemcars-brand-logo-frame {
		display: grid;
		height: 82px;
		margin-bottom: 10px;
		place-items: center;
		width: 112px;
	}

	.bohemcars-brand-logo-frame :global(.out-brand--img) {
		display: block;
		height: 80px !important;
		margin: 0 !important;
		max-height: 80px;
		max-width: 112px;
		object-fit: contain;
		width: 112px !important;
	}

	/* Contrast: darken the brand count (text-muted was 2.5:1) */
	.bohemcars-browse-section :global(.out-brand-2 .text-muted) {
		color: #5a6356 !important;
	}

	.bohemcars-browse-section :global(.out-brand-2:hover),
	.bohemcars-browse-section :global(.out-brand-2.active) {
		background-color: var(--bc-surface-hover) !important;
		border-color: transparent;
		box-shadow: none !important;
	}

	.bohemcars-browse-section :global(.pagination-swiper-outbrand-3) {
		display: none !important;
	}

	.bohemcars-type-gallery {
		margin-top: 42px;
	}

	.bohemcars-type-gallery__cta {
		background: #98bc2a !important;
		border: 1px solid #98bc2a !important;
		color: #ffffff !important;
		gap: 8px;
	}

	.bohemcars-type-gallery__cta:hover {
		background: #1c1c1c !important;
		border-color: #1c1c1c !important;
		color: #ffffff !important;
		transform: none;
	}

	.bohemcars-type-gallery__cta svg {
		flex: 0 0 auto;
		height: 21px;
		width: 21px;
	}

	/* White arrow in every state */
	.bohemcars-type-gallery__cta svg path {
		fill: #ffffff !important;
	}

	.bohemcars-type-gallery__grid {
		display: grid;
		gap: 22px 24px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.bohemcars-type-card {
		align-items: center;
		background: var(--bc-surface);
		color: #1c1c1c;
		display: flex;
		flex-direction: column;
		min-height: 218px;
		overflow: hidden;
		padding: 8px 10px 0;
		text-align: center;
		border-radius: 8px;
		transition:
			background-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.bohemcars-type-card:hover {
		background-color: var(--bc-surface-hover);
		transform: none;
	}

	.bohemcars-type-card__image {
		align-items: flex-end;
		display: flex;
		flex: 1 1 auto;
		height: 150px;
		justify-content: center;
		margin-bottom: 14px;
		position: relative;
		width: 100%;
	}

	.bohemcars-type-card__image::after {
		background: radial-gradient(ellipse at center, rgba(28, 28, 28, 0.2), transparent 68%);
		bottom: 2px;
		content: '';
		height: 16px;
		left: 12%;
		position: absolute;
		right: 12%;
		z-index: 0;
	}

	.bohemcars-type-card__image img {
		display: block;
		max-height: 142px;
		max-width: 100%;
		object-fit: contain;
		position: relative;
		transform: none !important;
		z-index: 1;
	}

	.bohemcars-type-card__label {
		display: block;
		font-size: 20px;
		font-weight: 600;
		line-height: 28px;
		white-space: nowrap;
	}

	@media (max-width: 767px) {
		.bohemcars-browse-section {
			background-color: var(--bc-bg) !important;
			padding-top: 12px;
			padding-bottom: 26px;
		}

		.bohemcars-browse-section :global(.title-section) {
			align-items: center;
			display: flex !important;
			justify-content: flex-start;
			margin-bottom: 12px !important;
			text-align: left;
		}

		.bohemcars-section-banner {
			overflow: visible;
			border: 0;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
			padding: 0;
		}

		.bohemcars-section-banner h2 {
			color: #1c1c1c;
		}

		.bohemcars-mobile-title-swap {
			width: 100%;
			margin: 0;
			font-size: 0;
			line-height: 1;
			text-align: left;
			white-space: nowrap;
		}

		.bohemcars-mobile-title-swap::before {
			content: attr(data-mobile-title);
			color: #1c1c1c;
			font-size: 22px;
			font-weight: 700;
			letter-spacing: 0;
			line-height: 28px;
		}

		.bohemcars-browse-section :global(.bohemcars-section-cta),
		.bohemcars-type-gallery__cta {
			display: none !important;
		}

		.bohemcars-brand-strip {
			margin-bottom: 30px;
		}

		.bohemcars-browse-section :global(.swiper-outbrand-3) {
			margin: 0;
			overflow: visible;
			padding: 0;
		}

		.bohemcars-browse-section :global(.swiper-outbrand-3 .swiper-wrapper) {
			display: grid !important;
			width: 100% !important;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 10px;
			transform: none !important;
		}

		.bohemcars-browse-section :global(.swiper-outbrand-3 .swiper-slide) {
			width: auto !important;
			flex: none !important;
			height: auto !important;
			margin-right: 0 !important;
			margin-top: 0 !important;
		}

		.bohemcars-browse-section :global(.out-brand-2) {
			min-height: 104px;
			border: 0 !important;
			border-radius: 8px;
			background-color: var(--bc-surface) !important;
			padding: 12px 8px !important;
		}

		.bohemcars-brand-logo-frame {
			height: 34px;
			margin-bottom: 8px;
			width: 66px;
		}

		.bohemcars-brand-logo-frame :global(.out-brand--img) {
			height: 30px !important;
			max-height: 30px;
			max-width: 66px;
			width: 66px !important;
		}

		.bohemcars-browse-section :global(.out-brand-2 .h5) {
			overflow: hidden;
			max-width: 100%;
			margin: 0;
			font-size: 13px;
			font-weight: 800;
			line-height: 16px;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.bohemcars-browse-section :global(.out-brand-2 .text-muted) {
			font-size: 11px;
			line-height: 14px;
		}

		.bohemcars-browse-section :global(.pagination-swiper-outbrand-3) {
			display: none !important;
		}

		.bohemcars-type-gallery {
			margin-top: 0;
		}

		.bohemcars-type-gallery__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 12px;
			margin-inline: 0;
			overflow: visible;
			padding-inline: 0;
		}

		.bohemcars-type-card {
			min-height: 118px;
			align-items: flex-start;
			border-radius: 8px;
			background: var(--bc-surface);
			padding: 12px;
			text-align: left;
		}

		.bohemcars-type-card__image {
			height: 68px;
			align-items: center;
			justify-content: flex-start;
			margin-bottom: 8px;
		}

		.bohemcars-type-card__image::after {
			display: none;
		}

		.bohemcars-type-card__image img {
			max-width: 100%;
			max-height: 62px;
		}

		.bohemcars-type-card__label {
			font-size: 14px;
			font-weight: 800;
			line-height: 18px;
		}
	}

	@media (min-width: 768px) and (max-width: 1199px) {
		.bohemcars-browse-section :global(.swiper-outbrand-3 .swiper-wrapper) {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}

		.bohemcars-type-gallery__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
