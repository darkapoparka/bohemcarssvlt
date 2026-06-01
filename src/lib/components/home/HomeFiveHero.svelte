<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveHeroData, HomeFiveHeroSelect } from '$lib/auxero/home-five';
	import {
		ArrowRight,
		MapPin,
		Navigation,
		PhoneCall,
		Search,
		SlidersHorizontal,
		X
	} from '@lucide/svelte';
	import { onMount } from 'svelte';

	let { hero }: { hero?: HomeFiveHeroData } = $props();

	const mobileShowroomMapHref =
		'https://www.google.com/maps/search/?api=1&query=BohemCars%20Plovdiv%20South%20Industrial%20Zone';
	const mobileShowroomPhoneHref = 'tel:+359888899911';
	const isEnglish = $derived(hero?.searchSubmitPrefix === 'Show');
	const mobileSearchPlaceholder = $derived(
		isEnglish ? 'Search brand, model, price...' : 'Търси марка, модел, цена...'
	);
	const mobileHeading = $derived(isEnglish ? 'Find your car.' : 'Намери автомобила си.');
	const mobileLocationLabel = $derived(isEnglish ? 'Showroom: Plovdiv' : 'Шоурум: Пловдив');
	const mobileAllLabel = $derived(
		isEnglish
			? `browse all ${hero?.totalMatches ?? 0} cars`
			: `разгледай всички ${hero?.totalMatches ?? 0} автомобила`
	);
	const mobileActionTabs = $derived.by(() => [
		{ active: true, href: '/inventory', label: isEnglish ? 'Buy' : 'Купи' },
		{ active: false, href: '/services', label: isEnglish ? 'Import' : 'Внос' },
		{ active: false, href: '/sell-your-car', label: isEnglish ? 'Sell' : 'Продай' }
	]);
	const mobileQuickFilters = $derived.by(() => {
		const bodyTypes =
			hero?.primaryFilters
				.find((filter) => filter.name === 'bodyType')
				?.options.slice(0, 2)
				.map((option) => ({
					href: `/inventory?bodyType=${encodeURIComponent(option.value)}`,
					label: option.label
				})) ?? [];
		const fuels =
			hero?.advancedFilters
				.find((filter) => filter.name === 'fuel')
				?.options.slice(0, 2)
				.map((option) => ({
					href: `/inventory?fuel=${encodeURIComponent(option.value)}`,
					label: option.label
				})) ?? [];

		return [...bodyTypes, ...fuels].slice(0, 4);
	});

	// Respect prefers-reduced-motion: halt the auto-rotating hero carousel.
	onMount(() => {
		if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		let tries = 0;
		const timer = setInterval(() => {
			tries += 1;
			const autoplays = Array.from(document.querySelectorAll('.page-title [class*="swiper"]'))
				.map(
					(el) =>
						(el as unknown as { swiper?: { autoplay?: { stop: () => void } } }).swiper?.autoplay
				)
				.filter((a): a is { stop: () => void } => Boolean(a));
			if (autoplays.length) {
				autoplays.forEach((a) => a.stop());
				clearInterval(timer);
			} else if (tries > 50) {
				clearInterval(timer);
			}
		}, 100);
		return () => clearInterval(timer);
	});
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
	<form
		class="bohemcars-mobile-home"
		action={resolve('/inventory')}
		method="get"
		data-bohemcars-search-form="inventory"
	>
		<input
			id="bohemcars-mobile-location-toggle"
			class="bohemcars-mobile-location-toggle"
			type="checkbox"
			aria-hidden="true"
		/>
		<section class="bohemcars-mobile-hero" aria-label={mobileHeading}>
			<div class="container">
				<div class="bohemcars-mobile-hero__copy">
					<h1>{mobileHeading}</h1>
					<label
						for="bohemcars-mobile-location-toggle"
						class="bohemcars-mobile-hero__location"
						aria-haspopup="dialog"
						aria-controls="bohemcars-mobile-location-panel"
					>
						<MapPin size={15} strokeWidth={2.25} aria-hidden="true" />
						{mobileLocationLabel}
					</label>
				</div>

				<nav class="bohemcars-mobile-hero__tabs" aria-label={hero.heading}>
					{#each mobileActionTabs as tab (tab.href)}
						<a class:active={tab.active} href={resolve(tab.href as '/')}>{tab.label}</a>
					{/each}
				</nav>

				<div class="bohemcars-mobile-hero__search">
					<Search size={22} strokeWidth={2.15} aria-hidden="true" />
					<input
						name="q"
						type="search"
						placeholder={mobileSearchPlaceholder}
						autocomplete="off"
						aria-label={mobileSearchPlaceholder}
					/>
					<button type="submit" aria-label={hero.searchSubmitPrefix}>
						<Search size={23} strokeWidth={2.25} aria-hidden="true" />
					</button>
				</div>

				<div class="bohemcars-mobile-hero__all-row">
					<a class="bohemcars-mobile-hero__all" href={resolve('/inventory')}>
						<span>{mobileAllLabel}</span>
						<ArrowRight size={18} strokeWidth={2.15} aria-hidden="true" />
					</a>
				</div>
			</div>
		</section>

		<div class="bohemcars-mobile-location-sheet">
			<label
				for="bohemcars-mobile-location-toggle"
				class="bohemcars-mobile-location-sheet__backdrop"
				aria-label={isEnglish ? 'Close location picker' : 'Затвори избор на локация'}
			></label>
			<div
				id="bohemcars-mobile-location-panel"
				class="bohemcars-mobile-location-sheet__panel"
				role="dialog"
				aria-modal="true"
				aria-labelledby="bohemcars-mobile-location-title"
			>
				<span class="bohemcars-mobile-location-sheet__handle"></span>
				<header>
					<div>
						<p>{isEnglish ? 'BohemCars showroom' : 'BohemCars шоурум'}</p>
						<h2 id="bohemcars-mobile-location-title">
							{isEnglish ? 'Plovdiv, South Industrial Zone' : 'Пловдив, Индустриална зона - Юг'}
						</h2>
					</div>
					<label
						for="bohemcars-mobile-location-toggle"
						aria-label={isEnglish ? 'Close' : 'Затвори'}
					>
						<X size={20} strokeWidth={2.2} aria-hidden="true" />
					</label>
				</header>
				<div class="bohemcars-mobile-location-map" aria-hidden="true">
					<span class="bohemcars-mobile-location-map__road road-a"></span>
					<span class="bohemcars-mobile-location-map__road road-b"></span>
					<span class="bohemcars-mobile-location-map__road road-c"></span>
					<span class="bohemcars-mobile-location-map__pin">
						<MapPin size={24} strokeWidth={2.4} aria-hidden="true" />
					</span>
					<span class="bohemcars-mobile-location-map__badge">BohemCars</span>
				</div>
				<div class="bohemcars-mobile-location-address">
					<span>{isEnglish ? 'Showroom address' : 'Адрес на шоурума'}</span>
					<strong
						>{isEnglish
							? 'Plovdiv, South Industrial Zone'
							: 'Пловдив, Южна Индустриална зона'}</strong
					>
					<p>
						{isEnglish
							? 'Vehicle viewings are by appointment. Call before visiting.'
							: 'Огледите са след уговорка. Обади се преди посещение.'}
					</p>
				</div>
				<div class="bohemcars-mobile-location-actions">
					<a href={mobileShowroomMapHref} target="_blank" rel="noreferrer">
						<Navigation size={18} strokeWidth={2.25} aria-hidden="true" />
						{isEnglish ? 'Open map' : 'Отвори карта'}
					</a>
					<a href={mobileShowroomPhoneHref}>
						<PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" />
						{isEnglish ? 'Call showroom' : 'Обади се'}
					</a>
				</div>
			</div>
		</div>
	</form>

	<section class="bohemcars-mobile-home-quick" aria-label={hero.heading}>
		<div class="container">
			<nav class="bohemcars-mobile-home-quick__scroller">
				<a href={resolve('/inventory')}>
					<SlidersHorizontal size={18} strokeWidth={2.2} aria-hidden="true" />
					{isEnglish ? 'Filters' : 'Филтри'}
				</a>
				{#each mobileQuickFilters as filter (filter.href)}
					<a href={resolve(filter.href as '/inventory')}>{filter.label}</a>
				{/each}
			</nav>
		</div>
	</section>

	<form
		class="bohemcars-desktop-hero"
		action={resolve('/inventory')}
		method="get"
		data-bohemcars-search-form="inventory"
	>
		<section class="page-title page-title-style-4 effect-content-slide effect-2 flex">
			<button type="button" class="swiper-btn navigation-prev" aria-label="Предишен слайд">
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
			</button>
			<button type="button" class="swiper-btn navigation-next" aria-label="Следващ слайд">
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
			</button>

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
						{#each hero.textSlides as slide, index (slide.id)}
							<div class="swiper-slide">
								{#if index === 0}
									<h1 class="search-cars__title effect-item effect-up text-center delay-3">
										{slide.heading}
									</h1>
								{:else}
									<p class="search-cars__title effect-item effect-up text-center delay-3">
										{slide.heading}
									</p>
								{/if}
								<p class="h7 effect-item effect-up text-center text-white delay-4">
									{slide.subtitle}
								</p>
								<a
									href={resolve(slide.ctaHref)}
									class="search-cars__slide-cta btn effect-line-primary effect-item effect-up delay-5"
								>
									{slide.ctaLabel}
									<ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
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
	:global(.page-title.page-title-style-4 .tp-showcase-slider-bg::after) {
		background:
			linear-gradient(180deg, rgba(28, 28, 28, 0.08), rgba(28, 28, 28, 0.18)),
			linear-gradient(
				90deg,
				rgba(28, 28, 28, 0.2),
				rgba(28, 28, 28, 0.06) 50%,
				rgba(28, 28, 28, 0.18)
			);
	}

	:global(.page-title.page-title-style-4 .tp-showcase-slider-bg) {
		background-position: center bottom;
	}

	.bohemcars-mobile-home,
	.bohemcars-mobile-home-quick {
		display: none;
	}

	:global(.page-title.page-title-style-4 .search-cars) {
		padding-top: 4px;
	}

	:global(.page-title.page-title-style-4 .sw-single-thumb) {
		overflow: hidden;
	}

	:global(.page-title.page-title-style-4 .sw-single-thumb .swiper-slide) {
		opacity: 0 !important;
		pointer-events: none !important;
		visibility: hidden;
	}

	:global(.page-title.page-title-style-4 .sw-single-thumb .swiper-slide-active) {
		opacity: 1 !important;
		pointer-events: auto !important;
		visibility: visible;
	}

	.search-cars__title {
		font-size: clamp(44px, 4.1vw, 68px);
		font-weight: 600;
		letter-spacing: 0;
		line-height: 1.08;
		margin-bottom: 16px;
		text-shadow: 0 4px 20px rgba(12, 21, 23, 0.2);
	}

	.search-cars p:not(.search-cars__title) {
		text-shadow: 0 2px 12px rgba(12, 21, 23, 0.18);
	}

	.search-cars__slide-cta {
		gap: 8px;
		width: fit-content;
		min-height: 42px;
		margin: 18px auto 0;
		padding: 11px 22px;
		border: 1px solid rgba(255, 255, 255, 0.54);
		border-radius: 999px;
		background: rgba(152, 188, 42, 0.92);
		box-shadow: none;
		backdrop-filter: blur(10px);
		color: #ffffff;
		font-size: 15px;
		font-weight: 700;
		line-height: 1;
		text-shadow: 0 2px 10px rgba(12, 21, 23, 0.18);
	}

	.search-cars__slide-cta::after {
		background-color: #1c1c1c;
	}

	.search-cars__slide-cta:hover,
	.search-cars__slide-cta:focus-visible {
		border-color: #1c1c1c;
		box-shadow: none;
		color: #ffffff;
	}

	.search-cars__slide-cta :global(svg) {
		display: block;
		flex: 0 0 18px;
		width: 18px;
		height: 18px;
		color: inherit;
	}

	.search-cars__slide-cta :global(svg path) {
		fill: none !important;
		stroke: #ffffff !important;
		stroke-width: 1.8;
	}

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
		.search-cars__title {
			font-size: 40px;
			line-height: 1.12;
		}

		.search-cars__slide-cta {
			margin-top: 14px;
		}

		.search-cars__select-wrapper {
			min-width: 100%;
		}
	}

	@media (max-width: 767.98px) {
		.bohemcars-desktop-hero {
			display: none;
		}

		.bohemcars-mobile-home,
		.bohemcars-mobile-home-quick {
			display: block;
		}

		.bohemcars-mobile-home {
			margin: 0;
			background: #8fc51d;
			color: #ffffff;
		}

		.bohemcars-mobile-location-toggle {
			position: fixed;
			width: 1px;
			height: 1px;
			opacity: 0;
			pointer-events: none;
		}

		.bohemcars-mobile-hero {
			padding: 20px 0 18px;
			background: #8fc51d;
		}

		.bohemcars-mobile-hero :global(.container),
		.bohemcars-mobile-home-quick :global(.container) {
			width: 100%;
			max-width: 480px;
			padding-right: 16px;
			padding-left: 16px;
		}

		.bohemcars-mobile-hero__copy {
			display: grid;
			justify-items: center;
			margin-bottom: 14px;
			text-align: center;
		}

		.bohemcars-mobile-hero__copy h1 {
			margin: 0 0 5px;
			color: #ffffff;
			font-size: 24px;
			font-weight: 800;
			line-height: 31px;
			letter-spacing: 0;
		}

		.bohemcars-mobile-hero__location {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: 5px;
			border: 0;
			background: transparent;
			color: rgba(255, 255, 255, 0.92);
			font-size: 14px;
			font-weight: 800;
			line-height: 20px;
			padding: 0;
			cursor: pointer;
			text-decoration: underline;
			text-decoration-thickness: 1.5px;
			text-underline-offset: 4px;
		}

		.bohemcars-mobile-hero__location :global(svg) {
			flex: 0 0 auto;
			color: currentColor;
			stroke: currentColor;
		}

		.bohemcars-mobile-hero__tabs {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 0;
			height: 52px;
			margin-bottom: 13px;
			padding: 5px;
			border-radius: 14px;
			background: rgba(255, 255, 255, 0.23);
		}

		.bohemcars-mobile-hero__tabs a {
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 9px;
			color: #ffffff;
			font-size: 15px;
			font-weight: 800;
			line-height: 20px;
			text-align: center;
		}

		.bohemcars-mobile-hero__tabs a.active {
			background: #ffffff;
			color: #1c1c1c;
			box-shadow: 0 8px 18px rgba(44, 85, 10, 0.1);
		}

		.bohemcars-mobile-hero__search {
			display: flex;
			height: 62px;
			align-items: center;
			gap: 10px;
			margin-bottom: 13px;
			padding: 7px 8px 7px 18px;
			border-radius: 999px;
			background: #ffffff;
			color: #1c1c1c;
			box-shadow: none;
		}

		.bohemcars-mobile-hero__search :global(svg) {
			flex: 0 0 auto;
			color: #1c1c1c;
			stroke: currentColor;
		}

		.bohemcars-mobile-hero__search input {
			min-width: 0;
			height: 100%;
			flex: 1 1 auto;
			border: 0 !important;
			border-radius: 0;
			background: transparent !important;
			box-shadow: none !important;
			color: #1c1c1c;
			font-size: 15px;
			font-weight: 500;
			line-height: 20px;
			outline: 0;
			padding: 0;
			appearance: none;
		}

		.bohemcars-mobile-hero__search input::placeholder {
			color: #8a8f86;
			opacity: 1;
		}

		.bohemcars-mobile-hero__search button {
			display: flex;
			width: 48px;
			height: 48px;
			align-items: center;
			justify-content: center;
			flex: 0 0 48px;
			border: 0;
			border-radius: 999px;
			background: #6f9f0c;
			color: #ffffff;
			cursor: pointer;
		}

		.bohemcars-mobile-hero__search button:hover,
		.bohemcars-mobile-hero__search button:focus-visible {
			background: #1c1c1c;
			color: #ffffff;
			outline: 0;
		}

		.bohemcars-mobile-hero__search button :global(svg),
		.bohemcars-mobile-hero__search button :global(path),
		.bohemcars-mobile-hero__search button :global(circle),
		.bohemcars-mobile-hero__search button :global(line) {
			color: #ffffff;
			stroke: #ffffff !important;
		}

		.bohemcars-mobile-hero__all-row {
			display: flex;
			width: 100%;
			min-width: 0;
			align-items: center;
			justify-content: center;
			gap: 8px;
		}

		.bohemcars-mobile-hero__all {
			display: inline-flex;
			min-height: 40px;
			min-width: 0;
			align-items: center;
			justify-content: center;
			gap: 7px;
			flex: 0 1 auto;
			max-width: 100%;
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.2);
			padding: 0 12px;
			color: #ffffff !important;
			font-size: 15px;
			font-weight: 800;
			line-height: 22px;
			text-decoration: none;
		}

		.bohemcars-mobile-hero__all span {
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.bohemcars-mobile-hero__all:hover,
		.bohemcars-mobile-hero__all:focus-visible {
			background: #ffffff;
			color: #1c1c1c !important;
			outline: 0;
		}

		.bohemcars-mobile-hero__all :global(svg) {
			flex: 0 0 auto;
			color: currentColor;
			stroke: currentColor;
		}

		.bohemcars-mobile-location-sheet {
			position: fixed;
			inset: 0;
			z-index: 1200;
			display: block;
			visibility: hidden;
			pointer-events: none;
		}

		.bohemcars-mobile-location-sheet__backdrop {
			position: absolute;
			inset: 0;
			border: 0;
			background: rgba(0, 0, 0, 0.34);
			padding: 0;
		}

		.bohemcars-mobile-location-sheet__panel {
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			display: grid;
			gap: 12px;
			border-radius: 22px 22px 0 0;
			background: #ffffff;
			padding: 10px 16px max(20px, env(safe-area-inset-bottom));
			box-shadow: 0 -18px 34px rgba(17, 24, 39, 0.18);
			color: #111111;
		}

		:global(.bohemcars-mobile-location-toggle:checked ~ .bohemcars-mobile-location-sheet) {
			visibility: visible;
			pointer-events: auto;
		}

		.bohemcars-mobile-location-sheet__handle {
			justify-self: center;
			width: 42px;
			height: 4px;
			border-radius: 999px;
			background: #dce3dc;
		}

		.bohemcars-mobile-location-sheet__panel header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 14px;
		}

		.bohemcars-mobile-location-sheet__panel header p,
		.bohemcars-mobile-location-sheet__panel header h2 {
			margin: 0;
			letter-spacing: 0;
		}

		.bohemcars-mobile-location-sheet__panel header p {
			color: #8fbd24;
			font-size: 11px;
			font-weight: 900;
			line-height: 14px;
			text-transform: uppercase;
		}

		.bohemcars-mobile-location-sheet__panel header h2 {
			color: #111111;
			font-size: 20px;
			font-weight: 900;
			line-height: 26px;
		}

		.bohemcars-mobile-location-sheet__panel header label {
			display: flex;
			width: 40px;
			height: 40px;
			align-items: center;
			justify-content: center;
			flex: 0 0 40px;
			border: 0;
			border-radius: 999px;
			background: #eef1f5;
			color: #111111;
			cursor: pointer;
			padding: 0;
		}

		.bohemcars-mobile-location-map {
			position: relative;
			min-height: 156px;
			overflow: hidden;
			border-radius: 12px;
			background:
				linear-gradient(135deg, rgba(217, 242, 117, 0.68), rgba(143, 197, 29, 0.2)), #edf2e8;
		}

		.bohemcars-mobile-location-map::before,
		.bohemcars-mobile-location-map::after {
			position: absolute;
			content: '';
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.72);
		}

		.bohemcars-mobile-location-map::before {
			top: 34px;
			right: -28px;
			left: -20px;
			height: 16px;
			transform: rotate(-13deg);
		}

		.bohemcars-mobile-location-map::after {
			right: -16px;
			bottom: 30px;
			left: -26px;
			height: 18px;
			transform: rotate(16deg);
		}

		.bohemcars-mobile-location-map__road {
			position: absolute;
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.58);
		}

		.bohemcars-mobile-location-map__road.road-a {
			top: -22px;
			left: 42px;
			width: 18px;
			height: 205px;
			transform: rotate(31deg);
		}

		.bohemcars-mobile-location-map__road.road-b {
			top: 62px;
			right: 42px;
			width: 14px;
			height: 128px;
			transform: rotate(-22deg);
		}

		.bohemcars-mobile-location-map__road.road-c {
			top: 74px;
			right: -26px;
			width: 190px;
			height: 12px;
			transform: rotate(-8deg);
		}

		.bohemcars-mobile-location-map__pin {
			position: absolute;
			top: 50%;
			left: 50%;
			display: flex;
			width: 48px;
			height: 48px;
			align-items: center;
			justify-content: center;
			border-radius: 999px;
			background: #111111;
			color: #d9f275;
			transform: translate(-50%, -50%);
			box-shadow: 0 12px 26px rgba(17, 17, 17, 0.22);
		}

		.bohemcars-mobile-location-map__pin :global(svg) {
			color: currentColor;
			stroke: currentColor;
		}

		.bohemcars-mobile-location-map__badge {
			position: absolute;
			right: 12px;
			bottom: 12px;
			border-radius: 999px;
			background: #ffffff;
			padding: 7px 11px;
			color: #111111;
			font-size: 12px;
			font-weight: 900;
			line-height: 14px;
			box-shadow: 0 8px 20px rgba(17, 24, 39, 0.12);
		}

		.bohemcars-mobile-location-address {
			display: grid;
			gap: 4px;
			border-radius: 10px;
			background: #eef1f5;
			padding: 12px;
		}

		.bohemcars-mobile-location-address span {
			color: #6b7280;
			font-size: 11px;
			font-weight: 900;
			line-height: 14px;
			text-transform: uppercase;
		}

		.bohemcars-mobile-location-address strong {
			color: #111111;
			font-size: 16px;
			font-weight: 900;
			line-height: 21px;
		}

		.bohemcars-mobile-location-address p {
			margin: 0;
			color: #4b5563;
			font-size: 13px;
			font-weight: 800;
			line-height: 18px;
		}

		.bohemcars-mobile-location-actions {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 9px;
		}

		.bohemcars-mobile-location-actions a {
			display: flex;
			min-height: 48px;
			align-items: center;
			justify-content: center;
			gap: 8px;
			border-radius: 8px;
			background: #111111;
			padding: 0 12px;
			color: #ffffff;
			font-size: 14px;
			font-weight: 900;
			line-height: 18px;
			text-align: center;
			text-decoration: none;
		}

		.bohemcars-mobile-location-actions a:first-child {
			background: #d9f275;
			color: #111111;
		}

		.bohemcars-mobile-location-actions :global(svg) {
			flex: 0 0 auto;
			color: currentColor;
			stroke: currentColor;
		}

		.bohemcars-mobile-home-quick {
			background: #ffffff;
			padding: 12px 0 14px;
			overflow: hidden;
		}

		.bohemcars-mobile-home-quick__scroller {
			display: flex;
			gap: 10px;
			overflow-x: auto;
			padding-bottom: 2px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.bohemcars-mobile-home-quick__scroller::-webkit-scrollbar {
			display: none;
		}

		.bohemcars-mobile-home-quick__scroller a {
			display: inline-flex;
			min-width: max-content;
			height: 44px;
			align-items: center;
			justify-content: center;
			gap: 7px;
			flex: 0 0 auto;
			padding: 0 15px;
			border-radius: 8px;
			background: #f0f3ed;
			color: #1c1c1c;
			font-size: 14px;
			font-weight: 800;
			line-height: 18px;
			text-decoration: none;
		}

		.bohemcars-mobile-home-quick__scroller a:hover,
		.bohemcars-mobile-home-quick__scroller a:focus-visible {
			background: #e4eadf;
			color: #1c1c1c;
			outline: 0;
		}

		.bohemcars-mobile-home-quick__scroller :global(svg) {
			flex: 0 0 auto;
			color: inherit;
			stroke: currentColor;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .header.header-style-4) {
			border-bottom: 0 !important;
			background: #8fc51d !important;
			box-shadow: none !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4) {
			height: 64px !important;
			min-height: 64px !important;
			background: #8fc51d !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .header-container-fluid) {
			background: #8fc51d !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .logo a) {
			display: flex;
			width: 184px;
			height: 38px;
			align-items: center;
			background: none;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .logo img) {
			width: 176px !important;
			max-width: 176px;
			height: auto;
			opacity: 1;
			filter: brightness(0) invert(1) !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-call) {
			background: rgba(255, 255, 255, 0.22);
			color: #ffffff;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-call:hover),
		:global(
			body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-call:focus-visible
		) {
			background: rgba(255, 255, 255, 0.3);
			color: #ffffff;
		}
	}
</style>
