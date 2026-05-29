<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveHeroData, HomeFiveHeroSelect } from '$lib/auxero/home-five';

	let { hero }: { hero?: HomeFiveHeroData } = $props();
</script>

{#snippet heroSelect(select: HomeFiveHeroSelect)}
	<div class="search-cars__select-wrapper">
		<div class="search-cars__select filter-select-dropdown bg-white" data-name={select.name}>
			<label for={select.id} class="search-cars__label">{select.title}</label>
			<input type="checkbox" id={select.id} class="filter-select-dropdown__toggle" />
			<label for={select.id} class="filter-select-dropdown__text">
				<span>{select.defaultLabel}</span>
			</label>
			<div class="filter-select-dropdown__menu">
				<div class="filter-select-dropdown__list">
					<label class="filter-checkbox">
						<input type="checkbox" name={select.name} value="" checked />
						<span>{select.defaultLabel}</span>
					</label>
					{#each select.options as option (option.value)}
						<label class="filter-checkbox">
							<input type="checkbox" name={select.name} value={option.value} />
							<span>{option.label}</span>
						</label>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/snippet}

{#if hero}
	<form action={resolve('/inventory')} method="get" data-bohemcars-search-form="inventory">
		<section class="page-title page-title-style-4 effect-content-slide effect-2 flex">
			<p class="swiper-btn navigation-prev">
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M13.9487 2.71258C14.2097 2.97026 14.2335 3.37348 14.0199 3.65762L13.9487 3.73903L7.60622 10L13.9487 16.261C14.2097 16.5186 14.2335 16.9219 14.0199 17.206L13.9487 17.2874C13.6877 17.5451 13.2792 17.5685 12.9913 17.3577L12.9088 17.2874L6.04609 10.5132C5.78505 10.2555 5.76132 9.85232 5.9749 9.56818L6.04609 9.48678L12.9088 2.71258C13.196 2.42914 13.6615 2.42914 13.9487 2.71258Z"
						fill="white"
					/>
				</svg>
			</p>
			<p class="swiper-btn navigation-next">
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M6.0513 17.2874C5.79025 17.0297 5.76652 16.6265 5.98011 16.3424L6.0513 16.261L12.3938 10L6.0513 3.73903C5.79025 3.48135 5.76652 3.07813 5.98011 2.79399L6.0513 2.71258C6.31235 2.45491 6.72084 2.43148 7.00869 2.64231L7.09116 2.71258L13.9539 9.48678C14.215 9.74446 14.2387 10.1477 14.0251 10.4318L13.9539 10.5132L7.09116 17.2874C6.80401 17.5709 6.33845 17.5709 6.0513 17.2874Z"
						fill="white"
					/>
				</svg>
			</p>

			<div class="swiper-container page-title--slider sw-single">
				<div class="swiper-wrapper">
					{#each hero.backgroundImages as image (image)}
						<div class="swiper-slide">
							<div
								class="tp-showcase-slider-bg"
								data-background={image}
								style={`background-image: url('${image}')`}
							></div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Search Cars Section -->
			<div class="search-cars thumb effect-zoom-item container">
				<div class="sw-single-thumb swiper">
					<div class="swiper-wrapper">
						{#each hero.textSlides as slide (slide.id)}
							<div class="swiper-slide">
								<h1 class="search-cars__title effect-item effect-up text-center delay-3">
									{hero.heading}
								</h1>
								<p class="h7 effect-item effect-up mb-36 text-center text-white delay-4">
									{slide.subtitle}
								</p>
								<a
									href={resolve(slide.ctaHref)}
									class="btn btn-white text-primary btn-large-2 font-weight-600 effect-item effect-up mx-auto max-w-min capitalize delay-5"
								>
									{slide.ctaLabel}
								</a>
							</div>
						{/each}
					</div>
				</div>

				<div class="flat-tabs mb-16">
					<div class="overflow-x-auto">
						<ul class="menu-tab menu-tab-style1 margin-auto text-white">
							{#each hero.tabs as tab (tab.label)}
								<li class={tab.active ? 'active' : ''}>
									<span class="font-weight-600 text-white">{tab.label}</span>
								</li>
							{/each}
						</ul>
					</div>
				</div>

				<!-- Primary Search Filters -->
				<div class="search-cars__filters">
					{#each hero.primaryFilters as select (select.id)}
						{@render heroSelect(select)}
					{/each}
					<div class="search-cars__filter" id="filterToggle">
						<img src="/assets/icons/filter.svg" alt="Filter" />
					</div>
					<button
						type="submit"
						class="search-cars__search md-w-full flex items-center justify-center gap-8"
					>
						<img src="/assets/icons/search.svg" alt="search" />
						{hero.searchSubmitPrefix}
						{hero.totalMatches}
						{hero.searchSubmitSuffix}
					</button>
				</div>

				<!-- Advanced Filters Panel -->
				<div class="search-cars__advanced" id="advancedFilters">
					<div class="search-cars__advanced-content">
						<div class="search-cars__advanced-row">
							{#each hero.advancedFilters as select (select.id)}
								{@render heroSelect(select)}
							{/each}
							<div class="search-cars__range">
								<p class="search-cars__range-label">
									{hero.yearLabel}: <span id="yearMin">{hero.yearRange.min}</span> -
									<span id="yearMax">{hero.yearRange.max}</span>
								</p>
								<div class="search-cars__range-wrapper" id="yearRangeWrapper">
									<div
										id="slider-range"
										data-min={hero.yearRange.min}
										data-max={hero.yearRange.max}
										data-step="1"
										data-values={`${hero.yearRange.min}, ${hero.yearRange.max}`}
									></div>
								</div>
							</div>
						</div>
						<div class="divider mt-28 mb-24"></div>
						<div class="search-cars__features">
							<p class="h3 search-cars__features-title flex items-center gap-8">
								{hero.checksTitle}
								<img src="/assets/icons/minus.svg" alt="minus" />
							</p>
							<div class="search-cars__features-grid">
								{#each hero.features as feature, index (feature)}
									<div class="form-group">
										<input
											type="checkbox"
											id={`Home05Feature${index}`}
											name="feature"
											value={feature}
										/>
										<label for={`Home05Feature${index}`}>{feature}</label>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</form>
{/if}

<style>
	.search-cars__filters {
		align-items: stretch;
	}

	.search-cars__select-wrapper {
		min-width: 120px;
	}

	.search-cars__select {
		display: grid;
		align-content: center;
		gap: 3px;
		padding: 9px 38px 8px 12px;
	}

	.search-cars__label {
		position: static;
		max-width: 100%;
		overflow: hidden;
		color: #5f5f5f;
		font-size: 11px;
		line-height: 1.15;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.filter-select-dropdown__text span {
		overflow: hidden;
		font-size: 15px;
		line-height: 1.2;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	@media (max-width: 575px) {
		.search-cars__select-wrapper {
			min-width: 100%;
		}
	}
</style>
