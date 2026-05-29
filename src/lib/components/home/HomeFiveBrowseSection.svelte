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
</script>

<section class="bohemcars-browse-section bg-white py-100">
	<div class="container">
		<div class="bohemcars-browse-section__surface">
			<div class="bohemcars-brand-strip">
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
						{#each brandCards as brand, index (brand.name)}
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

			{#if afterBrandStripHtml.trim()}
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html afterBrandStripHtml}
			{/if}

			<div class="bohemcars-type-gallery">
				<div class="title-section wow fadeInDown mb-42" data-wow-delay="0.1s">
					<h2>{copy.typeTitle}</h2>
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

	.bohemcars-browse-section :global(.swiper-outbrand-3) {
		margin: 0;
		padding: 0;
	}

	.bohemcars-browse-section :global(.out-brand-2) {
		background-color: #f8f9f6 !important;
		border: 1px solid #e7e7e7;
		border-radius: 8px;
		box-shadow: none !important;
		min-height: 168px;
	}

	.bohemcars-browse-section :global(.out-brand-2:hover),
	.bohemcars-browse-section :global(.out-brand-2.active) {
		background-color: #eef0ec !important;
		border-color: #d6dbd1;
		box-shadow: none !important;
	}

	.bohemcars-type-gallery {
		margin-top: 70px;
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

	.bohemcars-type-gallery__cta svg path {
		fill: #ffffff !important;
	}

	.bohemcars-type-gallery__cta:hover svg path {
		fill: #ffffff !important;
	}

	.bohemcars-type-gallery__grid {
		display: grid;
		gap: 22px 24px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.bohemcars-type-card {
		align-items: center;
		color: #1c1c1c;
		display: flex;
		flex-direction: column;
		min-height: 218px;
		overflow: hidden;
		padding: 8px 10px 0;
		text-align: center;
	}

	.bohemcars-type-card:hover {
		color: #98bc2a;
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
		.bohemcars-browse-section :global(.title-section) {
			align-items: flex-start;
			gap: 18px;
		}

		.bohemcars-type-gallery {
			margin-top: 44px;
		}

		.bohemcars-type-gallery__grid {
			grid-auto-columns: minmax(210px, 1fr);
			grid-auto-flow: column;
			grid-template-columns: none;
			margin-inline: -18px;
			overflow-x: auto;
			padding-inline: 18px;
			scrollbar-width: none;
		}

		.bohemcars-type-gallery__grid::-webkit-scrollbar {
			display: none;
		}
	}

	@media (min-width: 768px) and (max-width: 1199px) {
		.bohemcars-type-gallery__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
