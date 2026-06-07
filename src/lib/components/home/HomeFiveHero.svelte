<script lang="ts">
	import { resolve } from '$app/paths';
	import type {
		HomeFiveHeroAction,
		HomeFiveHeroActionMode,
		HomeFiveHeroData,
		HomeFiveHeroSelect
	} from '$lib/auxero/home-five';
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
	import HeroFilterPopover from './HeroFilterPopover.svelte';

	let { hero }: { hero?: HomeFiveHeroData } = $props();

	const mobileShowroomMapHref =
		'https://www.google.com/maps/search/?api=1&query=BohemCars%20Plovdiv%20South%20Industrial%20Zone';
	const mobileShowroomPhoneHref = 'tel:+359888899911';
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
	let mobileModeOverride = $state<HomeFiveHeroActionMode | null>(null);
	const mobileMode = $derived(mobileModeOverride ?? activeMode);
	const activeMobileAction = $derived.by(
		() => hero?.actions.find((action) => action.mode === mobileMode) ?? hero?.actions[0]
	);
	const activeMobileActionHref = $derived(activeMobileAction?.actionHref ?? '/inventory');
	const selectMobileMode = (mode: HomeFiveHeroActionMode) => {
		mobileModeOverride = mode;
	};

	// Desktop buy box — rich popover fields replace the cramped CSS dropdowns.
	// Selection lives here so the model list can cascade off the chosen make(s),
	// and so each field renders hidden inputs that preserve the GET /inventory contract.
	const brandFilter = $derived(hero?.primaryFilters.find((filter) => filter.name === 'brand'));
	const modelFilter = $derived(hero?.primaryFilters.find((filter) => filter.name === 'q'));
	const bodyFilter = $derived(hero?.primaryFilters.find((filter) => filter.name === 'bodyType'));
	const priceFilter = $derived(hero?.primaryFilters.find((filter) => filter.name === 'maxPrice'));

	let brandSelection = $state<string[]>([]);
	let modelSelection = $state<string[]>([]);
	let bodySelection = $state<string[]>([]);
	let priceSelection = $state<string[]>([]);

	const modelOptions = $derived.by(() => {
		const all = modelFilter?.options ?? [];
		if (!brandSelection.length) return all;
		return all.filter((option) => option.brand && brandSelection.includes(option.brand));
	});

	// Drop a chosen model once it no longer belongs to the selected make(s).
	$effect(() => {
		const valid = new Set(modelOptions.map((option) => option.value));
		if (modelSelection.some((value) => !valid.has(value))) {
			modelSelection = modelSelection.filter((value) => valid.has(value));
		}
	});
	const mobileSearchPlaceholder = $derived(
		activeMobileAction?.placeholder ??
			(isEnglish ? 'Search brand, model, price...' : 'Търси марка, модел, цена...')
	);
	const mobileHeading = $derived(
		activeMobileAction?.mobileHeading ?? (isEnglish ? 'Find your car.' : 'Намери автомобила си.')
	);
	const mobileModeHeading = $derived.by(() => {
		if (activeMobileAction?.mode === 'import') {
			return isEnglish ? 'Import a car' : 'Внеси автомобил';
		}

		if (activeMobileAction?.mode === 'sell') {
			return isEnglish ? 'Sell your car' : 'Продай автомобил';
		}

		return isEnglish ? 'Buy a car' : 'Купи автомобил';
	});
	const mobileSearchDrawerTitle = $derived(
		activeMobileAction?.drawerTitle ?? (isEnglish ? 'Find a car' : 'Намери автомобил')
	);
	const mobileSearchDrawerKicker = $derived(
		activeMobileAction?.drawerKicker ?? (isEnglish ? 'Search' : 'Търсене')
	);
	const mobileSearchDrawerClose = $derived(isEnglish ? 'Close search' : 'Затвори търсенето');
	const mobileAllLabel = $derived(
		activeMobileAction?.secondaryLabel ?? (isEnglish ? 'Browse all' : 'Разгледай всички')
	);
	const mobileShowAllCommand = $derived(isEnglish ? 'Show all' : 'Покажи всички');
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
	const quickLinksForMode = (mode: string) => {
		if (mode === 'import') {
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

		if (mode === 'sell') {
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
	};
	const activeMobileQuickLinks = $derived.by(() => quickLinksForMode(mobileMode));
	let mobileSearchOpen = $state(false);
	const openMobileSearch = () => {
		mobileSearchOpen = true;
	};
	const closeMobileSearch = () => {
		mobileSearchOpen = false;
	};
	const modeAllText = (action: { mode: string; secondaryLabel?: string }) =>
		action.mode === 'buy' && hero
			? `${isEnglish ? 'All' : 'Всички'} ${hero.totalMatches} ${hero.searchSubmitSuffix}`
			: (action.secondaryLabel ?? mobileAllLabel);
	const drawerSubmitLabel = (tab: HomeFiveHeroAction) =>
		tab.mode === 'buy' ? mobileShowAllCommand : tab.submitLabel;
	const drawerSubmitAriaLabel = (tab: HomeFiveHeroAction) =>
		tab.mode === 'buy' && hero
			? `${hero.searchSubmitPrefix} ${hero.totalMatches} ${hero.searchSubmitSuffix}`
			: tab.submitLabel;
	const desktopIntentTitle = $derived(
		activeAction?.drawerTitle ?? (isEnglish ? 'Find a car' : 'Намери автомобил')
	);
	const desktopIntentPlaceholder = $derived(
		activeAction?.placeholder ??
			(isEnglish ? 'Search brand, model, price...' : 'Търси марка, модел, цена...')
	);

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
		action={resolve(activeMobileActionHref)}
		method="get"
		data-bohemcars-search-form={activeMobileAction?.mode ?? 'buy'}
	>
		<input
			id="bohemcars-mobile-location-toggle"
			class="bohemcars-mobile-location-toggle"
			type="checkbox"
			tabindex="-1"
			aria-hidden="true"
		/>
		<section class="bohemcars-mobile-hero" aria-label={mobileHeading}>
			<div class="container">
				<div class="bohemcars-mobile-hero__copy">
					<h1>{mobileModeHeading}</h1>
				</div>

				<div class="bohemcars-mobile-hero__search-module">
					<div class="bohemcars-mobile-hero__tabs" aria-label={hero.heading} role="tablist">
						{#each mobileActionTabs as tab (tab.mode)}
							<button
								type="button"
								role="tab"
								class={`bohemcars-mobile-hero__tab bohemcars-mobile-hero__tab--${tab.mode} ${tab.mode === mobileMode ? 'active' : ''}`}
								aria-selected={tab.mode === mobileMode}
								onclick={() => selectMobileMode(tab.mode)}
							>
								{tab.label}
							</button>
						{/each}
					</div>

					<div class="bohemcars-mobile-hero__search">
						<button
							type="button"
							class="bohemcars-mobile-hero__search-label"
							aria-haspopup="dialog"
							aria-controls="bohemcars-mobile-search-panel"
							aria-expanded={mobileSearchOpen}
							onclick={openMobileSearch}
						>
							<span>{mobileSearchPlaceholder}</span>
						</button>
						<button
							type="button"
							class="bohemcars-mobile-hero__search-action"
							aria-label={hero.searchSubmitPrefix}
							aria-controls="bohemcars-mobile-search-panel"
							aria-expanded={mobileSearchOpen}
							onclick={openMobileSearch}
						>
							<Search size={23} strokeWidth={2.25} aria-hidden="true" />
						</button>
					</div>
				</div>

				<div class="bohemcars-mobile-hero__all-row">
					<a
						class="bohemcars-mobile-hero__all"
						href={resolve((activeMobileAction?.secondaryHref ?? '/inventory') as '/')}
					>
						<span>{activeMobileAction ? modeAllText(activeMobileAction) : mobileAllLabel}</span>
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
				tabindex="-1"
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

		<div class={`bohemcars-mobile-search-sheet ${mobileSearchOpen ? 'is-open' : ''}`}>
			<button
				type="button"
				class="bohemcars-mobile-search-sheet__backdrop"
				aria-label={mobileSearchDrawerClose}
				onclick={closeMobileSearch}
			></button>
			<div
				id="bohemcars-mobile-search-panel"
				class="bohemcars-mobile-search-sheet__panel"
				role="dialog"
				aria-modal="true"
				aria-label={mobileSearchDrawerTitle}
				aria-hidden={!mobileSearchOpen}
			>
				<span class="bohemcars-mobile-search-sheet__handle"></span>
				{#if activeMobileAction}
					<div class="bc-drawer bc-drawer--{activeMobileAction.mode}">
						<header>
							<div>
								<p>{activeMobileAction.drawerKicker ?? mobileSearchDrawerKicker}</p>
								<h2>{activeMobileAction.drawerTitle ?? mobileSearchDrawerTitle}</h2>
							</div>
							<button
								type="button"
								class="bohemcars-mobile-search-sheet__close"
								aria-label={mobileSearchDrawerClose}
								onclick={closeMobileSearch}
							>
								<X size={20} strokeWidth={2.2} aria-hidden="true" />
							</button>
						</header>
						<div class="bohemcars-mobile-search-sheet__field">
							<Search size={20} strokeWidth={2.15} aria-hidden="true" />
							<input
								name={activeMobileAction.inputName ?? 'q'}
								type="search"
								placeholder={activeMobileAction.placeholder ?? mobileSearchPlaceholder}
								autocomplete="off"
								aria-label={activeMobileAction.placeholder ?? mobileSearchPlaceholder}
							/>
						</div>
						<div class="bohemcars-mobile-search-sheet__body">
							{#if activeMobileAction.mode === 'buy'}
								{#each hero.primaryFilters.slice(0, 3) as select (select.id)}
									<section
										class={`bohemcars-mobile-search-sheet__group ${select.name === 'brand' ? 'bohemcars-mobile-search-sheet__group--logos' : ''}`}
									>
										<p>{select.title}</p>
										<div>
											{#each select.options.slice(0, 8) as option (option.value)}
												<a
													href={resolve(
														inventoryFilterHref(select.name, option.value) as '/inventory'
													)}
												>
													{#if select.name === 'brand' && option.image}
														<span class="bohemcars-mobile-brand-chip__logo">
															<img
																src={option.image}
																alt=""
																aria-hidden="true"
																loading="lazy"
																decoding="async"
															/>
														</span>
														<span>{option.shortLabel ?? option.label}</span>
													{:else}
														{option.label}
													{/if}
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
							{:else}
								<p class="bohemcars-mobile-search-sheet__hint">{activeMobileAction.helper}</p>
							{/if}
						</div>
						<div class="bohemcars-mobile-search-sheet__actions">
							<a href={resolve((activeMobileAction.secondaryHref ?? '/inventory') as '/')}
								>{activeMobileAction.secondaryLabel ?? mobileAllLabel}</a
							>
							<button
								type="submit"
								formaction={resolve(activeMobileAction.actionHref)}
								aria-label={drawerSubmitAriaLabel(activeMobileAction)}
							>
								{drawerSubmitLabel(activeMobileAction)}
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</form>

	{#if mobileActionTabs.length}
		<section class="bohemcars-mobile-home-quick" aria-label={hero.heading}>
			<div class="container">
				<nav class="bohemcars-mobile-home-quick__scroller bc-quick bc-quick--{mobileMode}">
					{#if mobileMode === 'buy'}
						<button
							type="button"
							class="bohemcars-mobile-home-quick__filter"
							aria-haspopup="dialog"
							aria-controls="bohemcars-mobile-search-panel"
							aria-expanded={mobileSearchOpen}
							aria-label={isEnglish ? 'Open filters' : 'Отвори филтри'}
							onclick={openMobileSearch}
						>
							<SlidersHorizontal size={18} strokeWidth={2.2} aria-hidden="true" />
						</button>
					{/if}
					{#each activeMobileQuickLinks as filter (filter.href)}
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
					{#each hero.textSlides as slide, index (slide.id)}
						<div class="swiper-slide" class:swiper-slide-active={index === 0}>
							<div class="tp-showcase-slider-bg"></div>
						</div>
					{/each}
				</div>
			</div>

			<div class="bohemcars-hero-cars" aria-hidden="true">
				<img
					class="bohemcars-hero-car bohemcars-hero-car--left"
					src="/assets/bohemcars/megamenu/inventory-bmw-x5-cutout.webp"
					alt=""
					loading="lazy"
				/>
				<img
					class="bohemcars-hero-car bohemcars-hero-car--right"
					src="/assets/bohemcars/megamenu/inventory-audi-sq5-cutout.webp"
					alt=""
					loading="lazy"
				/>
			</div>

			<!-- Search Cars Section -->
			<div class="search-cars thumb effect-zoom-item container">
				<h1 class="bohemcars-hero-accessible-title">{hero.heading}</h1>
				<div class="sw-single-thumb swiper">
					<div class="swiper-wrapper">
						{#each hero.textSlides as slide, index (slide.id)}
							<div class="swiper-slide" class:swiper-slide-active={index === 0}>
								<p class="search-cars__title effect-item effect-up text-center delay-3">
									{slide.heading}
								</p>
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
						{#if brandFilter}
							<HeroFilterPopover
								select={brandFilter}
								bind:selected={brandSelection}
								mode="multi"
								variant="grid"
								searchable
								{isEnglish}
							/>
						{/if}
						{#if modelFilter}
							<HeroFilterPopover
								select={modelFilter}
								options={modelOptions}
								bind:selected={modelSelection}
								mode="single"
								variant="list"
								searchable
								{isEnglish}
								emptyHint={isEnglish ? 'No models for this make' : 'Няма модели за тази марка'}
							/>
						{/if}
						{#if bodyFilter}
							<HeroFilterPopover
								select={bodyFilter}
								bind:selected={bodySelection}
								mode="multi"
								variant="list"
								{isEnglish}
							/>
						{/if}
						{#if priceFilter}
							<HeroFilterPopover
								select={priceFilter}
								bind:selected={priceSelection}
								mode="single"
								variant="list"
								{isEnglish}
							/>
						{/if}
						<button
							type="submit"
							class="search-cars__search md-w-full flex items-center justify-center gap-8"
						>
							<img src="/assets/icons/search.svg" alt="search" />
							{activeSubmitLabel}
						</button>
					{:else}
						<label class="search-cars__intent-field">
							<span>{desktopIntentTitle}</span>
							<input
								name={activeAction?.inputName ?? 'vehicle'}
								type="search"
								placeholder={desktopIntentPlaceholder}
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
		padding-top: 24px !important;
		padding-bottom: 24px !important;
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
			margin-top: clamp(40px, 4.4vw, 60px) !important;
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

	.bohemcars-hero-accessible-title {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
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

	.search-cars__search {
		height: 66px;
	}

	.search-cars__search {
		width: 272px;
		padding: 13px 16px;
		font-size: 16px;
		font-weight: 600;
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
		:global(body.auxero-template-home-05-html) {
			--bohemcars-mobile-hero-top: #a7c936;
			--bohemcars-mobile-hero-bg: #98bc2a;
			--bohemcars-mobile-hero-bottom: #8fb526;
			--bohemcars-mobile-hero-fill: linear-gradient(
				180deg,
				var(--bohemcars-mobile-hero-top) 0%,
				var(--bohemcars-mobile-hero-bg) 48%,
				var(--bohemcars-mobile-hero-bottom) 100%
			);
			--bohemcars-mobile-ink: #1c1c1c;
			--bohemcars-mobile-ink-muted: rgba(28, 28, 28, 0.82);
			--bohemcars-mobile-ink-strong: #1c1c1c;
			--bohemcars-mobile-cta: rgba(251, 252, 247, 0.32);
			--bohemcars-mobile-cta-hover: rgba(251, 252, 247, 0.44);
			--bohemcars-mobile-cta-ink: #14210f;
			--bohemcars-mobile-action: #14210f;
			--bohemcars-mobile-action-hover: #20350f;
			--bohemcars-mobile-surface: #fbfcf7;
		}

		.bohemcars-desktop-hero {
			display: none;
		}

		.bohemcars-mobile-home,
		.bohemcars-mobile-home-quick {
			display: block;
		}

		.bohemcars-mobile-home {
			margin: 0;
			background:
				radial-gradient(132% 118% at 50% 42%, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 56%),
				radial-gradient(165% 92% at 50% 117%, rgba(13, 23, 8, 0.22), rgba(13, 23, 8, 0) 62%),
				var(--bohemcars-mobile-hero-fill, var(--bohemcars-mobile-hero-bg, #4f7012));
			color: var(--bohemcars-mobile-ink, #ffffff);
		}

		.bohemcars-mobile-location-toggle {
			position: fixed;
			width: 1px;
			height: 1px;
			opacity: 0;
			pointer-events: none;
		}

		.bohemcars-mobile-hero {
			padding: 10px 0 13px;
			background: transparent;
		}

		.bohemcars-mobile-hero :global(.container),
		.bohemcars-mobile-home-quick :global(.container) {
			width: 100%;
			max-width: 480px;
			padding-right: 16px;
			padding-left: 16px;
		}

		/* Heading mirrors the active Buy/Import/Sell tab, so keep it for SEO/a11y
		   but visually hidden — the tab row is the real heading. */
		.bohemcars-mobile-hero__copy {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
			border: 0;
		}

		.bohemcars-mobile-hero__search-module {
			display: grid;
			gap: 10px;
			margin-bottom: 9px;
			padding: 0;
		}

		.bohemcars-mobile-hero__tabs {
			position: relative;
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 0;
			min-height: 48px;
			border: 0;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
			padding: 0;
		}

		.bohemcars-mobile-hero__tabs button {
			position: relative;
			display: flex;
			min-height: 48px;
			width: 100%;
			align-items: center;
			justify-content: center;
			border: 0;
			border-radius: 0;
			background: transparent;
			color: var(--bohemcars-mobile-ink-muted, rgba(255, 255, 255, 0.88));
			font-size: 17px;
			font-weight: 600;
			letter-spacing: 0;
			line-height: 22px;
			text-align: center;
			text-decoration: none;
			cursor: pointer;
			user-select: none;
			-webkit-user-select: none;
			z-index: 1;
			transition: color 0.18s ease;
		}

		.bohemcars-mobile-hero__tab.active {
			background: transparent;
			box-shadow: none;
			color: var(--bohemcars-mobile-ink-strong, #ffffff);
			font-weight: 700;
		}

		/* Showroom intent tabs: one full rail, with only the selected intent emphasized. */
		.bohemcars-mobile-hero__tabs::after {
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			height: 2px;
			border-radius: 0;
			background: rgba(20, 33, 15, 0.1);
			content: '';
			pointer-events: none;
		}

		.bohemcars-mobile-hero__tabs button::after {
			position: absolute;
			right: 0;
			bottom: -1px;
			left: 0;
			z-index: 1;
			height: 4px;
			border-radius: 999px;
			background: transparent;
			content: '';
			transition: background-color 0.18s ease;
		}

		.bohemcars-mobile-hero__tab.active::after {
			background: #14210f;
		}

		.bohemcars-mobile-hero__tab:focus-visible {
			outline: 2px solid rgba(28, 28, 28, 0.64);
			outline-offset: 3px;
		}

		@media (hover: hover) and (pointer: fine) {
			.bohemcars-mobile-hero__tabs button:hover {
				color: var(--bohemcars-mobile-ink-strong, #ffffff);
			}
		}

		.bohemcars-mobile-search-sheet__panel .bc-drawer {
			display: grid;
			min-height: 0;
			gap: 13px;
			grid-template-rows: max-content max-content minmax(0, 1fr) max-content;
			overflow: hidden;
		}

		.bohemcars-mobile-hero__search {
			display: flex;
			height: 58px;
			align-items: center;
			gap: 10px;
			padding: 6px 6px 6px 20px;
			border: 0;
			border-radius: 999px;
			background: var(--bohemcars-mobile-surface, #ffffff);
			color: #1c1c1c;
			box-shadow: 0 8px 16px rgba(32, 53, 15, 0.14);
		}

		.bohemcars-mobile-hero__search :global(svg) {
			flex: 0 0 auto;
			color: currentColor;
			stroke: currentColor;
		}

		.bohemcars-mobile-hero__search-label {
			display: flex;
			min-width: 0;
			height: 100%;
			flex: 1 1 auto;
			align-items: center;
			border: 0;
			background: transparent;
			color: #1c1c1c;
			cursor: pointer;
			padding: 0;
			text-align: left;
		}

		.bohemcars-mobile-hero__search-label span {
			min-width: 0;
			overflow: hidden;
			color: #1c1c1c;
			font-size: 16px;
			font-weight: 400;
			line-height: 22px;
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
			background: var(--bohemcars-mobile-action, #4f7012);
			box-shadow: none !important;
			color: #ffffff;
			cursor: pointer;
			padding: 0;
			transition: background-color 0.18s ease;
		}

		.bohemcars-mobile-hero__search-action:hover,
		.bohemcars-mobile-hero__search-action:focus-visible {
			background: var(--bohemcars-mobile-action-hover, #1c1c1c);
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
			min-height: 40px;
			min-width: 0;
			align-items: center;
			justify-content: center;
			gap: 6px;
			flex: 0 1 auto;
			max-width: 100%;
			border-radius: 13px;
			background: rgba(255, 255, 255, 0.94);
			border: 1px solid rgba(255, 255, 255, 0.72);
			box-shadow: 0 6px 14px rgba(20, 33, 15, 0.18);
			padding: 0 14px;
			color: #14210f !important;
			font-size: 14px;
			font-weight: 800;
			line-height: 16px;
			text-decoration: none;
			transition: background-color 0.18s ease;
		}

		.bohemcars-mobile-hero__all span {
			min-width: 0;
			overflow: hidden;
			color: var(--bohemcars-mobile-cta-ink, #ffffff);
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.bohemcars-mobile-hero__all:hover,
		.bohemcars-mobile-hero__all:focus-visible {
			background: #ffffff;
			color: #14210f !important;
			outline: 2px solid rgba(20, 33, 15, 0.72);
			outline-offset: 2px;
		}

		.bohemcars-mobile-hero__all:hover span,
		.bohemcars-mobile-hero__all:focus-visible span {
			color: var(--bohemcars-mobile-cta-ink, #ffffff);
		}

		.bohemcars-mobile-hero__all :global(svg),
		.bohemcars-mobile-hero__all :global(path),
		.bohemcars-mobile-hero__all :global(line),
		.bohemcars-mobile-hero__all :global(polyline) {
			flex: 0 0 auto;
			color: var(--bohemcars-mobile-cta-ink, #ffffff) !important;
			stroke: var(--bohemcars-mobile-cta-ink, #ffffff) !important;
		}

		.bohemcars-mobile-hero__all :global(svg) {
			width: 16px;
			height: 16px;
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
			background: var(--bc-bg);
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
			background: var(--bc-border);
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
			width: 44px;
			height: 44px;
			align-items: center;
			justify-content: center;
			flex: 0 0 44px;
			border: 0;
			border-radius: 999px;
			background: var(--bc-surface);
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
			background: var(--bc-surface);
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
			height: 100dvh;
			z-index: 1200;
			visibility: hidden;
			pointer-events: none;
		}

		.bohemcars-mobile-search-sheet__backdrop {
			position: absolute;
			inset: 0;
			display: block;
			border: 0;
			background: rgba(0, 0, 0, 0.34);
			opacity: 0;
			padding: 0;
			transition: opacity 0.18s ease;
		}

		.bohemcars-mobile-search-sheet__panel {
			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;
			display: grid;
			max-height: min(88dvh, 680px);
			gap: 13px;
			grid-template-rows: max-content minmax(0, 1fr);
			overflow: hidden;
			border-radius: 22px 22px 0 0;
			background: var(--bc-bg);
			padding: 10px 16px max(20px, env(safe-area-inset-bottom));
			box-shadow: 0 -18px 34px rgba(17, 24, 39, 0.18);
			color: #111111;
			transform: translateY(100%);
			transition: transform 0.22s ease;
			-webkit-overflow-scrolling: touch;
		}

		.bohemcars-mobile-search-sheet:global(.is-open) {
			visibility: visible !important;
			pointer-events: auto !important;
		}

		.bohemcars-mobile-search-sheet:global(.is-open) .bohemcars-mobile-search-sheet__backdrop {
			opacity: 1 !important;
		}

		.bohemcars-mobile-search-sheet:global(.is-open) .bohemcars-mobile-search-sheet__panel {
			transform: translateY(0) !important;
		}

		.bohemcars-mobile-search-sheet__handle {
			justify-self: center;
			width: 42px;
			height: 4px;
			border-radius: 999px;
			background: var(--bc-border);
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

		.bohemcars-mobile-search-sheet__close {
			display: flex;
			width: 44px;
			height: 44px;
			align-items: center;
			justify-content: center;
			flex: 0 0 44px;
			border: 0;
			border-radius: 999px;
			background: var(--bc-surface);
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
			background: var(--bc-surface);
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

		.bohemcars-mobile-search-sheet__body {
			display: grid;
			min-height: 0;
			gap: 13px;
			overflow-y: auto;
			padding-right: 1px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.bohemcars-mobile-search-sheet__body::-webkit-scrollbar {
			display: none;
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

		.bohemcars-mobile-search-sheet__group--logos div {
			flex-wrap: nowrap;
			overflow-x: auto;
			padding-bottom: 2px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.bohemcars-mobile-search-sheet__group--logos div::-webkit-scrollbar {
			display: none;
		}

		.bohemcars-mobile-search-sheet__group a {
			display: inline-flex;
			min-height: 44px;
			align-items: center;
			border-radius: 9px;
			background: var(--bc-surface);
			padding: 0 12px;
			color: #111111;
			font-size: 14px;
			font-weight: 800;
			line-height: 18px;
			text-decoration: none;
		}

		.bohemcars-mobile-search-sheet__group--logos a {
			width: 86px;
			min-width: 86px;
			min-height: 68px;
			justify-content: center;
			flex-direction: column;
			gap: 6px;
			padding: 8px 5px;
			font-size: 12px;
			text-align: center;
		}

		.bohemcars-mobile-brand-chip__logo {
			display: flex;
			width: 38px;
			height: 28px;
			align-items: center;
			justify-content: center;
			flex: 0 0 28px;
		}

		.bohemcars-mobile-brand-chip__logo img {
			display: block;
			max-width: 38px;
			max-height: 26px;
			object-fit: contain;
		}

		.bohemcars-mobile-search-sheet__group--logos a > span:last-child {
			max-width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
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
			background: var(--bc-surface);
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
			background: var(--bc-surface);
			padding: 0 12px;
			color: #111111;
			font-size: 14px;
			font-weight: 900;
			line-height: 18px;
			text-align: center;
			text-decoration: none;
			white-space: nowrap;
		}

		.bohemcars-mobile-search-sheet__actions button {
			background: #111111;
			color: #ffffff;
			cursor: pointer;
		}

		.bohemcars-mobile-home-quick {
			background: var(--bc-bg);
			margin: 0;
			padding: 8px 0 9px;
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
		.bohemcars-mobile-home-quick__scroller button {
			display: inline-flex;
			min-width: max-content;
			min-height: 42px;
			align-items: center;
			justify-content: center;
			gap: 8px;
			flex: 0 0 auto;
			padding: 0 12px;
			border: 0;
			border-radius: 10px;
			background: #eef2ec;
			box-shadow: none;
			color: #1c1c1c;
			cursor: pointer;
			font-size: 14px;
			font-weight: 700;
			line-height: 18px;
			text-decoration: none;
			white-space: nowrap;
		}

		.bohemcars-mobile-home-quick__scroller .bohemcars-mobile-home-quick__filter {
			width: 44px;
			min-width: 44px;
			padding: 0;
		}

		.bohemcars-mobile-home-quick__scroller a:hover,
		.bohemcars-mobile-home-quick__scroller a:focus-visible,
		.bohemcars-mobile-home-quick__scroller button:hover,
		.bohemcars-mobile-home-quick__scroller button:focus-visible {
			background: #dfe9c7;
			box-shadow: none;
			color: #1c1c1c;
		}

		.bohemcars-mobile-home-quick__scroller a:focus-visible,
		.bohemcars-mobile-home-quick__scroller button:focus-visible {
			outline: 2px solid rgba(28, 28, 28, 0.7);
			outline-offset: 3px;
		}

		.bohemcars-mobile-home-quick__scroller :global(svg) {
			flex: 0 0 auto;
			color: inherit;
			stroke: currentColor;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .header.header-style-4) {
			border-bottom: 0 !important;
			background: var(--bohemcars-mobile-hero-top, #4f7012) !important;
			box-shadow: none !important;
			height: 56px !important;
			min-height: 56px !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4) {
			height: 56px !important;
			min-height: 56px !important;
			background: var(--bohemcars-mobile-hero-top, #4f7012) !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .header-container-fluid) {
			background: var(--bohemcars-mobile-hero-top, #4f7012) !important;
			height: 56px !important;
			min-height: 56px !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .header-inner) {
			height: 56px !important;
			min-height: 56px !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .header-actions) {
			top: 8px;
			gap: 8px;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .logo a) {
			display: flex;
			width: 204px;
			height: 36px;
			align-items: center;
			background: none;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .logo img) {
			width: 196px !important;
			max-width: 196px;
			height: auto;
			opacity: 1;
			filter: brightness(0) saturate(100%) invert(17%) sepia(23%) saturate(1233%) hue-rotate(49deg)
				brightness(95%) contrast(96%) !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-call),
		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-map) {
			width: 40px;
			height: 40px;
			border: 1px solid rgba(255, 255, 255, 0.5) !important;
			background: rgba(255, 255, 255, 0.3);
			box-sizing: border-box;
			box-shadow: none;
			color: #20350f;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-call svg),
		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-map svg) {
			width: 17px;
			height: 17px;
			color: #20350f !important;
			fill: none;
			stroke: #20350f !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-call svg *),
		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-map svg *) {
			fill: none !important;
			stroke: #20350f !important;
		}

		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-call:hover),
		:global(
			body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-call:focus-visible
		),
		:global(body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-map:hover),
		:global(
			body.auxero-template-home-05-html .header-wrapper-style-4 .bohemcars-mobile-map:focus-visible
		) {
			border: 0 !important;
			background: rgba(255, 255, 255, 0.28);
			color: #20350f;
			outline: 2px solid rgba(32, 53, 15, 0.64);
			outline-offset: 2px;
		}
	}
</style>
