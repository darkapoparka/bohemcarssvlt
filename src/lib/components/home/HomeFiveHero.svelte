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
	const mobileSearchToggleId = 'bohemcars-mobile-search-toggle';
	const inventoryFilterHref = (name: string, value: string) =>
		`/inventory?${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
	const isEnglish = $derived(hero?.searchSubmitPrefix === 'Show');
	const activeMode = $derived(hero?.activeMode ?? 'buy');
	const activeAction = $derived.by(
		() => hero?.actions.find((action) => action.mode === activeMode) ?? hero?.actions[0]
	);
	const activeActionHref = $derived(activeAction?.actionHref ?? '/inventory');
	const activeSubmitLabel = $derived(
		activeAction?.mode === 'buy' && hero
			? `${hero.searchSubmitPrefix} ${hero.totalMatches} ${hero.searchSubmitSuffix}`
			: (activeAction?.submitLabel ?? '')
	);
	const isInventoryMode = $derived(activeAction?.mode === 'buy');
	const mobileSearchPlaceholder = $derived(
		activeAction?.placeholder ??
			(isEnglish ? 'Search brand, model, price...' : 'Търси марка, модел, цена...')
	);
	const mobileHeading = $derived(
		activeAction?.mobileHeading ?? (isEnglish ? 'Find your car.' : 'Намери автомобила си.')
	);
	const mobileSearchDrawerTitle = $derived(
		activeAction?.drawerTitle ?? (isEnglish ? 'Find a car' : 'Намери автомобил')
	);
	const mobileSearchDrawerKicker = $derived(
		activeAction?.drawerKicker ?? (isEnglish ? 'Search' : 'Търсене')
	);
	const mobileSearchDrawerClose = $derived(isEnglish ? 'Close search' : 'Затвори търсенето');
	const mobileAllLabel = $derived(
		activeAction?.secondaryLabel ?? (isEnglish ? 'Browse all' : 'Разгледай всички')
	);
	// In buy mode show the live inventory count ("Всички 340 коли") as the browse
	// affordance — mirrors the count pill that makes the sibling builds scan faster.
	const mobileAllCount = $derived(
		isInventoryMode && hero
			? `${isEnglish ? 'All' : 'Всички'} ${hero.totalMatches} ${hero.searchSubmitSuffix}`
			: mobileAllLabel
	);
	const mobileActionTabs = $derived.by(() => hero?.actions ?? []);
	const mobileQuickFilters = $derived(
		isEnglish
			? [
					{ href: '/inventory?maxPrice=10000', label: 'Under 10k' },
					{ href: '/inventory?maxPrice=20000', label: 'Under 20k' },
					{ href: '/inventory?maxPrice=30000', label: 'Under 30k' },
					{ href: '/inventory?status=New%20listing', label: 'New listings' },
					{ href: '/inventory?status=Available', label: 'In stock' }
				]
			: [
					{ href: '/inventory?maxPrice=10000', label: 'До 10 000' },
					{ href: '/inventory?maxPrice=20000', label: 'До 20 000' },
					{ href: '/inventory?maxPrice=30000', label: 'До 30 000' },
					{ href: '/inventory?status=New%20listing', label: 'Нови обяви' },
					{ href: '/inventory?status=Available', label: 'Налични' }
				]
	);
	const mobileModeQuickLinks = $derived.by(() => {
		if (activeAction?.mode === 'import') {
			return isEnglish
				? [
						{ href: '/calculator', label: 'Import calculator' },
						{ href: '/services', label: 'Import process' },
						{ href: '/agents', label: 'Consultant' },
						{ href: '/contact', label: 'Ask Bohemcars' },
						{ href: '/inventory', label: 'Available cars' }
					]
				: [
						{ href: '/calculator', label: 'Калкулатор' },
						{ href: '/services', label: 'Процес по внос' },
						{ href: '/agents', label: 'Консултант' },
						{ href: '/contact', label: 'Попитай Bohemcars' },
						{ href: '/inventory', label: 'Налични коли' }
					];
		}

		if (activeAction?.mode === 'sell') {
			return isEnglish
				? [
						{ href: '/sell-your-car', label: 'Valuation form' },
						{ href: '/services', label: 'Selling process' },
						{ href: '/agents', label: 'Consultant' },
						{ href: '/contact', label: 'Ask Bohemcars' },
						{ href: '/inventory', label: 'Available cars' }
					]
				: [
						{ href: '/sell-your-car', label: 'Оценка' },
						{ href: '/services', label: 'Как продаваме' },
						{ href: '/agents', label: 'Консултант' },
						{ href: '/contact', label: 'Попитай Bohemcars' },
						{ href: '/inventory', label: 'Налични коли' }
					];
		}

		return mobileQuickFilters;
	});

	// The hero reads as a single static block — the three intents live in the
	// Купи/Внос/Продай tabs below, so we halt the template's auto-rotating slider
	// (and the nav arrows are removed from the markup).
	onMount(() => {
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
		action={resolve(activeActionHref)}
		method="get"
		data-bohemcars-search-form={activeAction?.mode ?? 'buy'}
	>
		<input
			id="bohemcars-mobile-location-toggle"
			class="bohemcars-mobile-location-toggle"
			type="checkbox"
			aria-hidden="true"
		/>
		<input
			id={mobileSearchToggleId}
			class="bohemcars-mobile-search-toggle"
			type="checkbox"
			aria-label={mobileSearchDrawerTitle}
		/>
		<section class="bohemcars-mobile-hero" aria-label={mobileHeading}>
			<div class="container">
				<div class="bohemcars-mobile-hero__copy">
					<h1>{mobileHeading}</h1>
				</div>

				<div class="bohemcars-mobile-hero__search-module">
					<nav class="bohemcars-mobile-hero__tabs" aria-label={hero.heading}>
						{#each mobileActionTabs as tab (tab.mode)}
							<a
								class:active={tab.mode === activeMode}
								href={resolve(tab.tabHref)}
								aria-current={tab.mode === activeMode ? 'page' : undefined}
							>
								{tab.label}
							</a>
						{/each}
					</nav>

					<div class="bohemcars-mobile-hero__search">
						<label
							class="bohemcars-mobile-hero__search-label"
							for={mobileSearchToggleId}
							aria-haspopup="dialog"
							aria-controls="bohemcars-mobile-search-panel"
						>
							<Search size={22} strokeWidth={2.15} aria-hidden="true" />
							<span>{mobileSearchPlaceholder}</span>
						</label>
						<label
							class="bohemcars-mobile-hero__search-action"
							for={mobileSearchToggleId}
							aria-label={hero.searchSubmitPrefix}
							aria-controls="bohemcars-mobile-search-panel"
						>
							<Search size={23} strokeWidth={2.25} aria-hidden="true" />
						</label>
					</div>
				</div>

				<div class="bohemcars-mobile-hero__all-row">
					<a class="bohemcars-mobile-hero__all" href={resolve('/inventory')}>
						<span>{mobileAllCount}</span>
						<ArrowRight size={16} strokeWidth={2.3} aria-hidden="true" />
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

		<div class="bohemcars-mobile-search-sheet">
			<label
				for={mobileSearchToggleId}
				class="bohemcars-mobile-search-sheet__backdrop"
				aria-label={mobileSearchDrawerClose}
			></label>
			<div
				id="bohemcars-mobile-search-panel"
				class="bohemcars-mobile-search-sheet__panel"
				role="dialog"
				aria-modal="true"
				aria-labelledby="bohemcars-mobile-search-title"
			>
				<span class="bohemcars-mobile-search-sheet__handle"></span>
				<header>
					<div>
						<p>{mobileSearchDrawerKicker}</p>
						<h2 id="bohemcars-mobile-search-title">{mobileSearchDrawerTitle}</h2>
					</div>
					<label for={mobileSearchToggleId} aria-label={mobileSearchDrawerClose}>
						<X size={20} strokeWidth={2.2} aria-hidden="true" />
					</label>
				</header>
				<div class="bohemcars-mobile-search-sheet__field">
					<Search size={20} strokeWidth={2.15} aria-hidden="true" />
					<input
						name={activeAction?.inputName ?? 'q'}
						type="search"
						placeholder={mobileSearchPlaceholder}
						autocomplete="off"
						required={!isInventoryMode}
						aria-label={mobileSearchPlaceholder}
					/>
				</div>
				{#if isInventoryMode}
					{#each hero.primaryFilters.slice(0, 3) as select (select.id)}
						<section class="bohemcars-mobile-search-sheet__group">
							<p>{select.title}</p>
							<div>
								{#each select.options.slice(0, 8) as option (option.value)}
									<a href={resolve(inventoryFilterHref(select.name, option.value) as '/inventory')}>
										{option.label}
									</a>
								{/each}
							</div>
						</section>
					{/each}
					<section class="bohemcars-mobile-search-sheet__group">
						<p>{isEnglish ? 'Fuel' : 'Гориво'}</p>
						<div>
							{#each hero.advancedFilters[0]?.options.slice(0, 6) ?? [] as option (option.value)}
								<a href={resolve(inventoryFilterHref('fuel', option.value) as '/inventory')}>
									{option.label}
								</a>
							{/each}
						</div>
					</section>
				{:else if activeAction}
					<p class="bohemcars-mobile-search-sheet__hint">{activeAction.helper}</p>
				{/if}
				<div class="bohemcars-mobile-search-sheet__actions">
					<a href={resolve(activeAction?.secondaryHref ?? '/inventory')}>{mobileAllLabel}</a>
					<button type="submit">
						{activeSubmitLabel}
					</button>
				</div>
			</div>
		</div>
	</form>

	{#if mobileModeQuickLinks.length}
		<section class="bohemcars-mobile-home-quick" aria-label={hero.heading}>
			<div class="container">
				<nav class="bohemcars-mobile-home-quick__scroller">
					{#if isInventoryMode}
						<label
							class="bohemcars-mobile-home-quick__filter"
							for={mobileSearchToggleId}
							aria-haspopup="dialog"
							aria-controls="bohemcars-mobile-search-panel"
							aria-label={isEnglish ? 'Open filters' : 'Отвори филтри'}
						>
							<SlidersHorizontal size={18} strokeWidth={2.2} aria-hidden="true" />
						</label>
					{/if}
					{#each mobileModeQuickLinks as filter (filter.href)}
						<a href={resolve(filter.href as '/')}>{filter.label}</a>
					{/each}
				</nav>
			</div>
		</section>
	{/if}

	<form
		class="bohemcars-desktop-hero"
		action={resolve(activeActionHref)}
		method="get"
		data-bohemcars-search-form={activeAction?.mode ?? 'buy'}
	>
		<section class="page-title page-title-style-4 effect-content-slide effect-2 flex">
			<div class="swiper-container page-title--slider sw-single">
				<div class="swiper-wrapper">
					{#each hero.textSlides.slice(0, 1) as slide (slide.id)}
						<div class="swiper-slide">
							<div class="tp-showcase-slider-bg"></div>
						</div>
					{/each}
				</div>
			</div>

			<div class="bohemcars-hero-cars" aria-hidden="true">
				<img
					class="bohemcars-hero-car bohemcars-hero-car--left"
					src="/assets/bohemcars/megamenu/inventory-bmw-x5-cutout.png"
					alt=""
					loading="eager"
				/>
				<img
					class="bohemcars-hero-car bohemcars-hero-car--right"
					src="/assets/bohemcars/megamenu/inventory-audi-sq5-cutout.png"
					alt=""
					loading="eager"
				/>
			</div>

			<!-- Search Cars Section -->
			<div class="search-cars thumb effect-zoom-item container">
				<div class="sw-single-thumb swiper">
					<div class="swiper-wrapper">
						{#each hero.textSlides.slice(0, 1) as slide, index (slide.id)}
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
							</div>
						{/each}
					</div>
				</div>

				<div class="flat-tabs mb-16">
					<div class="overflow-x-auto">
						<ul class="menu-tab menu-tab-style1 margin-auto text-white">
							{#each hero.actions as tab (tab.mode)}
								<li class={tab.mode === activeMode ? 'active' : ''}>
									<a
										href={resolve(tab.tabHref)}
										aria-current={tab.mode === activeMode ? 'page' : undefined}
									>
										<span class="font-weight-600 text-white">{tab.label}</span>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				</div>

				<!-- Primary Search Filters -->
				<div class="search-cars__filters">
					{#if isInventoryMode}
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
							{activeSubmitLabel}
						</button>
					{:else}
						<label class="search-cars__intent-field">
							<span>{mobileSearchDrawerTitle}</span>
							<input
								name={activeAction?.inputName ?? 'vehicle'}
								type="search"
								placeholder={mobileSearchPlaceholder}
								required
								autocomplete="off"
							/>
						</label>
						<button
							type="submit"
							class="search-cars__search search-cars__search--intent md-w-full flex items-center justify-center gap-8"
						>
							<img src="/assets/icons/search.svg" alt="search" />
							{activeSubmitLabel}
						</button>
					{/if}
				</div>

				<!-- Advanced Filters Panel -->
				<div
					class:search-cars__advanced--hidden={!isInventoryMode}
					class="search-cars__advanced"
					id="advancedFilters"
				>
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
	:global(.page-title.page-title-style-4) {
		height: auto !important;
		min-height: 0 !important;
		align-items: center;
		padding-top: 42px !important;
		padding-bottom: 42px !important;
		background:
			radial-gradient(ellipse at 50% 111%, rgb(184 224 70 / 0.52) 0 18%, transparent 53%),
			radial-gradient(circle at 50% 24%, rgb(255 255 255 / 0.13) 0 12%, transparent 41%),
			linear-gradient(115deg, #10170f 0%, #1b2719 48%, #344521 100%);
	}

	/* Let the hero collapse to its real content height (the template swiper
	   otherwise stretches it ~180px taller than the search module needs). */
	:global(.page-title.page-title-style-4 .search-cars) {
		height: auto !important;
		min-height: 0 !important;
		position: relative;
		z-index: 7;
	}

	.bohemcars-hero-cars {
		position: absolute;
		inset: 0;
		z-index: 4;
		overflow: hidden;
		pointer-events: none;
	}

	.bohemcars-hero-cars::before {
		position: absolute;
		right: 4%;
		bottom: 18px;
		left: 4%;
		height: 118px;
		border-radius: 999px;
		background: radial-gradient(ellipse at center, rgb(205 242 94 / 0.32), transparent 68%);
		content: '';
		filter: blur(2px);
		opacity: 0.8;
	}

	.bohemcars-hero-car {
		position: absolute;
		top: 43%;
		width: min(28vw, 438px);
		height: auto;
		user-select: none;
		filter: drop-shadow(0 26px 24px rgb(0 0 0 / 0.38));
		transform: translateY(-50%);
	}

	.bohemcars-hero-car--left {
		left: 0.8%;
	}

	.bohemcars-hero-car--right {
		right: 0.8%;
		transform: translateY(-50%) scaleX(-1);
	}

	:global(.page-title.page-title-style-4 .tp-showcase-slider-bg::after) {
		background:
			linear-gradient(
				180deg,
				rgba(4, 7, 5, 0.1) 0%,
				rgba(4, 7, 5, 0.02) 42%,
				rgba(7, 13, 9, 0.34) 78%,
				rgba(5, 9, 6, 0.54) 100%
			),
			linear-gradient(90deg, rgba(0, 0, 0, 0.44), rgba(0, 0, 0, 0.04) 50%, rgba(0, 0, 0, 0.38));
	}

	:global(.page-title.page-title-style-4 .tp-showcase-slider-bg) {
		background: none !important;
		background-position: center bottom;
	}

	:global(.page-title.page-title-style-4 .search-cars__title),
	:global(.page-title.page-title-style-4 .search-cars .h7),
	:global(.page-title.page-title-style-4 .menu-tab-style1 .font-weight-600) {
		color: #ffffff !important;
		text-shadow: 0 4px 22px rgb(0 0 0 / 0.4);
	}

	:global(.page-title.page-title-style-4 .menu-tab-style1 a:focus-visible) {
		outline-color: rgb(255 255 255 / 0.72);
	}

	.bohemcars-mobile-home,
	.bohemcars-mobile-home-quick {
		display: none;
	}

	:global(.page-title.page-title-style-4 .search-cars) {
		padding-top: 4px;
	}

	@media (min-width: 768px) {
		:global(.page-title.page-title-style-4 .flat-tabs) {
			margin-top: clamp(40px, 4.4vw, 60px);
		}

		:global(.page-title.page-title-style-4 .search-cars__filters) {
			padding: 15px 16px;
			border-color: rgba(255, 255, 255, 0.14);
			background: rgba(255, 255, 255, 0.14);
			box-shadow: 0 20px 44px rgba(0, 0, 0, 0.18);
			backdrop-filter: blur(10px);
		}
	}

	@media (max-width: 1199px) {
		.bohemcars-hero-car {
			width: min(31vw, 380px);
		}
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
		font-size: clamp(44px, 4vw, 64px);
		font-weight: 600;
		letter-spacing: 0;
		line-height: 1.08;
		margin-bottom: 14px;
		text-shadow: 0 4px 22px rgba(0, 0, 0, 0.4);
	}

	.search-cars p:not(.search-cars__title) {
		text-shadow: 0 2px 12px rgba(0, 0, 0, 0.34);
	}

	:global(.page-title.page-title-style-4 .menu-tab-style1 a:focus-visible) {
		outline: 2px solid rgba(255, 255, 255, 0.72);
		outline-offset: 4px;
	}

	.search-cars__filters {
		align-items: stretch;
	}

	.search-cars__select-wrapper {
		min-width: 120px;
	}

	.search-cars__select {
		display: grid;
		min-height: 62px;
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

	.search-cars__intent-field {
		display: grid;
		min-width: min(520px, 100%);
		flex: 1 1 auto;
		align-content: center;
		gap: 4px;
		border-radius: 8px;
		background: #ffffff;
		padding: 9px 18px;
	}

	.search-cars__intent-field span {
		color: #5f5f5f;
		font-size: 11px;
		font-weight: 700;
		line-height: 1.15;
	}

	.search-cars__intent-field input {
		width: 100%;
		height: 25px;
		border: 0 !important;
		background: transparent !important;
		box-shadow: none !important;
		color: #1c1c1c;
		font-size: 16px;
		font-weight: 700;
		line-height: 1.2;
		outline: 0;
		padding: 0 !important;
	}

	.search-cars__intent-field input::placeholder {
		color: #858585;
		opacity: 1;
	}

	.search-cars__search--intent {
		min-width: 210px;
	}

	.search-cars__filter,
	.search-cars__search {
		height: 66px;
	}

	.search-cars__search {
		width: 272px;
		padding: 13px 16px;
		font-size: 16px;
		font-weight: 700;
	}

	.search-cars__advanced--hidden {
		display: none !important;
	}

	@media (max-width: 575px) {
		.search-cars__title {
			font-size: 40px;
			line-height: 1.12;
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

		.bohemcars-mobile-location-toggle,
		.bohemcars-mobile-search-toggle {
			position: fixed;
			width: 1px;
			height: 1px;
			opacity: 0;
			pointer-events: none;
		}

		.bohemcars-mobile-hero {
			padding: 15px 0 13px;
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
			margin-bottom: 10px;
			text-align: center;
		}

		.bohemcars-mobile-hero__copy h1 {
			margin: 0;
			color: #ffffff;
			font-size: 23px;
			font-weight: 800;
			line-height: 29px;
			letter-spacing: 0;
		}

		.bohemcars-mobile-hero__search-module {
			display: grid;
			gap: 10px;
			margin-bottom: 8px;
			padding: 0;
		}

		.bohemcars-mobile-hero__tabs {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 0;
			height: 37px;
			border-bottom: 0;
			border-radius: 0;
			background: transparent;
		}

		.bohemcars-mobile-hero__tabs a {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 0;
			color: rgba(255, 255, 255, 0.9);
			font-size: 15px;
			font-weight: 800;
			line-height: 20px;
			text-align: center;
		}

		.bohemcars-mobile-hero__tabs a.active {
			background: transparent;
			color: #ffffff;
			box-shadow: none;
		}

		.bohemcars-mobile-hero__tabs a::after {
			position: absolute;
			right: 14px;
			bottom: -1px;
			left: 14px;
			height: 3px;
			border-radius: 999px 999px 0 0;
			background: transparent;
			content: '';
		}

		.bohemcars-mobile-hero__tabs a.active::after,
		.bohemcars-mobile-hero__tabs a:hover::after,
		.bohemcars-mobile-hero__tabs a:focus-visible::after {
			background: #ffffff;
		}

		.bohemcars-mobile-hero__tabs a:focus-visible {
			outline: 2px solid rgba(255, 255, 255, 0.72);
			outline-offset: 3px;
		}

		.bohemcars-mobile-hero__search {
			display: flex;
			height: 56px;
			align-items: center;
			gap: 10px;
			padding: 6px 6px 6px 20px;
			border-radius: 999px;
			background: #ffffff;
			color: #1c1c1c;
			box-shadow: 0 8px 22px rgba(26, 42, 22, 0.14);
		}

		.bohemcars-mobile-hero__search :global(svg) {
			flex: 0 0 auto;
			color: #1c1c1c;
			stroke: currentColor;
		}

		.bohemcars-mobile-hero__search-label {
			display: flex;
			min-width: 0;
			height: 100%;
			flex: 1 1 auto;
			align-items: center;
			gap: 10px;
			color: #1c1c1c;
			cursor: pointer;
		}

		.bohemcars-mobile-hero__search-label span {
			min-width: 0;
			overflow: hidden;
			color: #8a8f86;
			font-size: 15px;
			font-weight: 600;
			line-height: 20px;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.bohemcars-mobile-hero__search-action {
			display: flex;
			width: 44px;
			height: 44px;
			align-items: center;
			justify-content: center;
			flex: 0 0 44px;
			border: 0 !important;
			border-radius: 999px;
			background: #6f9f0c;
			box-shadow: none !important;
			color: #ffffff;
			cursor: pointer;
			padding: 0;
			transition: background-color 0.18s ease;
		}

		.bohemcars-mobile-hero__search-action:hover,
		.bohemcars-mobile-hero__search-action:focus-visible {
			background: #1c1c1c;
			color: #ffffff;
			outline: 0;
		}

		.bohemcars-mobile-hero__search-action :global(svg),
		.bohemcars-mobile-hero__search-action :global(path),
		.bohemcars-mobile-hero__search-action :global(circle),
		.bohemcars-mobile-hero__search-action :global(line) {
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
			min-height: 34px;
			min-width: 0;
			align-items: center;
			justify-content: center;
			gap: 6px;
			flex: 0 1 auto;
			max-width: 100%;
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.18);
			padding: 0 15px;
			color: #ffffff !important;
			font-size: 13px;
			font-weight: 800;
			line-height: 20px;
			text-decoration: none;
			transition: background-color 0.18s ease;
		}

		.bohemcars-mobile-hero__all span {
			min-width: 0;
			overflow: hidden;
			color: #ffffff;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.bohemcars-mobile-hero__all:hover,
		.bohemcars-mobile-hero__all:focus-visible {
			background: rgba(255, 255, 255, 0.28);
			color: #ffffff !important;
			outline: 0;
		}

		.bohemcars-mobile-hero__all :global(svg) {
			flex: 0 0 auto;
			color: #ffffff;
			stroke: #ffffff;
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

		.bohemcars-mobile-search-sheet {
			position: fixed;
			inset: 0;
			z-index: 1200;
			visibility: hidden;
			pointer-events: none;
		}

		.bohemcars-mobile-search-sheet__backdrop {
			position: absolute;
			inset: 0;
			display: block;
			background: rgba(0, 0, 0, 0.34);
			opacity: 0;
			transition: opacity 0.18s ease;
		}

		.bohemcars-mobile-search-sheet__panel {
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			display: grid;
			max-height: 88vh;
			gap: 13px;
			overflow-y: auto;
			border-radius: 22px 22px 0 0;
			background: #ffffff;
			padding: 10px 16px max(20px, env(safe-area-inset-bottom));
			box-shadow: 0 -18px 34px rgba(17, 24, 39, 0.18);
			color: #111111;
			transform: translateY(100%);
			transition: transform 0.22s ease;
			-webkit-overflow-scrolling: touch;
		}

		:global(.bohemcars-mobile-search-toggle:checked ~ .bohemcars-mobile-search-sheet) {
			visibility: visible;
			pointer-events: auto;
		}

		:global(
			.bohemcars-mobile-search-toggle:checked
				~ .bohemcars-mobile-search-sheet
				.bohemcars-mobile-search-sheet__backdrop
		) {
			opacity: 1;
		}

		:global(
			.bohemcars-mobile-search-toggle:checked
				~ .bohemcars-mobile-search-sheet
				.bohemcars-mobile-search-sheet__panel
		) {
			transform: translateY(0);
		}

		.bohemcars-mobile-search-sheet__handle {
			justify-self: center;
			width: 42px;
			height: 4px;
			border-radius: 999px;
			background: #dce3dc;
		}

		.bohemcars-mobile-search-sheet__panel header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 14px;
		}

		.bohemcars-mobile-search-sheet__panel header p,
		.bohemcars-mobile-search-sheet__panel header h2 {
			margin: 0;
			letter-spacing: 0;
		}

		.bohemcars-mobile-search-sheet__panel header p {
			color: #8fbd24;
			font-size: 11px;
			font-weight: 900;
			line-height: 14px;
			text-transform: uppercase;
		}

		.bohemcars-mobile-search-sheet__panel header h2 {
			color: #111111;
			font-size: 20px;
			font-weight: 900;
			line-height: 26px;
		}

		.bohemcars-mobile-search-sheet__panel header label {
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

		.bohemcars-mobile-search-sheet__field {
			display: flex;
			min-height: 52px;
			align-items: center;
			gap: 10px;
			border-radius: 12px;
			background: #eef1f5;
			padding: 0 13px;
			color: #111111;
		}

		.bohemcars-mobile-search-sheet__field input {
			min-width: 0;
			width: 100%;
			height: 50px;
			flex: 1 1 auto;
			border: 0 !important;
			border-radius: 0 !important;
			background: transparent !important;
			box-shadow: none !important;
			color: #111111;
			font-size: 16px;
			font-weight: 700;
			line-height: 22px;
			outline: 0;
			padding: 0 !important;
			appearance: none;
		}

		.bohemcars-mobile-search-sheet__group {
			display: grid;
			gap: 8px;
		}

		.bohemcars-mobile-search-sheet__group p {
			margin: 0;
			color: #728093;
			font-size: 11px;
			font-weight: 900;
			line-height: 14px;
			text-transform: uppercase;
		}

		.bohemcars-mobile-search-sheet__group div {
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
		}

		.bohemcars-mobile-search-sheet__group a {
			display: inline-flex;
			min-height: 38px;
			align-items: center;
			border-radius: 9px;
			background: #eef1f5;
			padding: 0 12px;
			color: #111111;
			font-size: 14px;
			font-weight: 800;
			line-height: 18px;
			text-decoration: none;
		}

		.bohemcars-mobile-search-sheet__group a:hover,
		.bohemcars-mobile-search-sheet__group a:focus-visible {
			background: #d9f275;
			color: #111111;
			outline: 0;
		}

		.bohemcars-mobile-search-sheet__hint {
			margin: 0;
			border-radius: 12px;
			background: #eef1f5;
			padding: 12px 13px;
			color: #4b5563;
			font-size: 14px;
			font-weight: 800;
			line-height: 20px;
		}

		.bohemcars-mobile-search-sheet__actions {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			gap: 9px;
		}

		.bohemcars-mobile-search-sheet__actions a,
		.bohemcars-mobile-search-sheet__actions button {
			display: flex;
			min-height: 48px;
			align-items: center;
			justify-content: center;
			border: 0;
			border-radius: 8px;
			background: #eef1f5;
			padding: 0 12px;
			color: #111111;
			font-size: 14px;
			font-weight: 900;
			line-height: 18px;
			text-align: center;
			text-decoration: none;
		}

		.bohemcars-mobile-search-sheet__actions button {
			background: #111111;
			color: #ffffff;
			cursor: pointer;
		}

		.bohemcars-mobile-home-quick {
			background: #ffffff;
			margin: 0;
			padding: 7px 0 9px;
			border: 0;
			box-shadow: none;
			overflow: hidden;
		}

		.bohemcars-mobile-home-quick__scroller {
			display: flex;
			gap: 8px;
			overflow-x: auto;
			padding-bottom: 2px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.bohemcars-mobile-home-quick__scroller::-webkit-scrollbar {
			display: none;
		}

		.bohemcars-mobile-home-quick__scroller a,
		.bohemcars-mobile-home-quick__scroller label {
			display: inline-flex;
			min-width: max-content;
			min-height: 42px;
			align-items: center;
			justify-content: center;
			gap: 8px;
			flex: 0 0 auto;
			padding: 0 13px;
			border-radius: 11px;
			background: #eef1f5;
			color: #1c1c1c;
			cursor: pointer;
			font-size: 14px;
			font-weight: 700;
			line-height: 18px;
			text-decoration: none;
			white-space: nowrap;
		}

		.bohemcars-mobile-home-quick__scroller .bohemcars-mobile-home-quick__filter {
			width: 42px;
			min-width: 42px;
			padding: 0;
		}

		.bohemcars-mobile-home-quick__scroller a:hover,
		.bohemcars-mobile-home-quick__scroller a:focus-visible,
		.bohemcars-mobile-home-quick__scroller label:hover,
		.bohemcars-mobile-home-quick__scroller label:focus-visible {
			background: #d9f275;
			box-shadow: inset 0 0 0 1px rgba(87, 118, 13, 0.08);
			color: #1c1c1c;
			outline: 2px solid #1c1c1c;
			outline-offset: 2px;
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
			height: 56px !important;
			min-height: 56px !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4) {
			height: 56px !important;
			min-height: 56px !important;
			background: #8fc51d !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .header-container-fluid) {
			background: #8fc51d !important;
			height: 56px !important;
			min-height: 56px !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .header-inner) {
			height: 56px !important;
			min-height: 56px !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .header-actions) {
			top: 11px;
			gap: 8px;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .logo a) {
			display: flex;
			width: 184px;
			height: 34px;
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

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-call),
		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-map) {
			width: 34px;
			height: 34px;
			border: 1px solid rgba(255, 255, 255, 0.2);
			background: rgba(255, 255, 255, 0.22);
			box-sizing: border-box;
			color: #1c1c1c;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-call svg),
		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-map svg) {
			width: 18px;
			height: 18px;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-call),
		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-map) {
			background: rgba(255, 255, 255, 0.22);
			color: #1c1c1c;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-call:hover),
		:global(
			body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-call:focus-visible
		),
		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-map:hover),
		:global(
			body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-map:focus-visible
		) {
			background: rgba(255, 255, 255, 0.3);
			color: #1c1c1c;
		}
	}
</style>
