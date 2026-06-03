<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		ArrowUpDown,
		BadgeEuro,
		Car,
		ChevronDown,
		Fuel,
		Gauge,
		Search,
		Shapes,
		SlidersHorizontal,
		Sparkles,
		X
	} from '@lucide/svelte';
	import type { AuxeroInventoryVehicleCard } from '$lib/auxero/inventory';
	import type { InventoryMobileData } from '$lib/auxero/inventory-mobile';
	import type { InventoryCopy } from '$lib/i18n/messages';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { Drawer } from 'vaul-svelte';

	type FilterDrawerMode =
		| 'all'
		| 'brand'
		| 'model'
		| 'sort'
		| 'fuel'
		| 'mileage'
		| 'body'
		| 'price'
		| 'extras';
	type FilterDraft = {
		body: string;
		brand: string;
		feature: string;
		fuel: string;
		mileage: string;
		model: string;
		price: string;
		sort: string;
		transmission: string;
		year: string;
	};
	type InventoryMobileOption = InventoryMobileData['brandOptions'][number];

	let {
		cards,
		copy,
		mobile
	}: {
		cards: AuxeroInventoryVehicleCard[];
		copy: InventoryCopy;
		mobile: InventoryMobileData;
	} = $props();

	const filterDrawerIds = {
		all: 'bohemcars-inventory-mobile-filter-drawer',
		body: 'bohemcars-inventory-mobile-body-drawer',
		brand: 'bohemcars-inventory-mobile-brand-drawer',
		extras: 'bohemcars-inventory-mobile-extras-drawer',
		fuel: 'bohemcars-inventory-mobile-fuel-drawer',
		mileage: 'bohemcars-inventory-mobile-mileage-drawer',
		model: 'bohemcars-inventory-mobile-model-drawer',
		price: 'bohemcars-inventory-mobile-price-drawer',
		sort: 'bohemcars-inventory-mobile-sort-drawer'
	} as const;
	const activeOptionValue = (options: InventoryMobileData['brandOptions']) =>
		options.find((option) => option.active)?.value ?? '';
	const normalizedOptionQuery = (value: string) => value.trim().toLocaleLowerCase();
	const optionSearchText = (option: InventoryMobileOption) =>
		`${option.label} ${option.value}`.toLocaleLowerCase();
	const rangeParams = (value: string) => {
		const [min, max] = value.split('-');

		return {
			max: max ? Number(max) : undefined,
			min: min ? Number(min) : undefined
		};
	};
	const currentFilterDraft = (): FilterDraft => ({
		body: activeOptionValue(mobile.bodyOptions),
		brand: activeOptionValue(mobile.brandOptions),
		feature: activeOptionValue(mobile.featureOptions),
		fuel: activeOptionValue(mobile.fuelOptions),
		mileage: activeOptionValue(mobile.mileageOptions),
		model: activeOptionValue(mobile.modelOptions) || mobile.searchValue,
		price: activeOptionValue(mobile.priceOptions),
		sort: activeOptionValue(mobile.sortOptions) || 'best-match',
		transmission: activeOptionValue(mobile.transmissionOptions),
		year: activeOptionValue(mobile.yearOptions)
	});

	let searchDrawerOpen = $state(false);
	let filterDrawerOpen = $state(false);
	let filterDrawerMode = $state<FilterDrawerMode>('all');
	let filterDraft = $state<FilterDraft>(currentFilterDraft());
	let brandDrawerQuery = $state('');
	let modelDrawerQuery = $state('');

	const brandSelected = $derived(
		mobile.brandOptions.some((option) => option.active && option.value)
	);
	const modelSelected = $derived(Boolean(mobile.searchValue));
	const bodySelected = $derived(mobile.bodyOptions.some((option) => option.active && option.value));
	const bodyValue = $derived(
		mobile.bodyOptions.find((option) => option.active && option.value)?.label ?? mobile.countLabel
	);
	const extrasSelected = $derived(
		mobile.featureOptions.some((option) => option.active && option.value)
	);
	const fuelSelected = $derived(mobile.fuelOptions.some((option) => option.active && option.value));
	const mileageSelected = $derived(
		mobile.mileageOptions.some((option) => option.active && option.value)
	);
	const priceSelected = $derived(
		mobile.priceOptions.some((option) => option.active && option.value)
	);
	const transmissionSelected = $derived(
		mobile.transmissionOptions.some((option) => option.active && option.value)
	);
	const yearSelected = $derived(mobile.yearOptions.some((option) => option.active && option.value));
	const drawerFilterSelected = $derived(
		bodySelected ||
			extrasSelected ||
			fuelSelected ||
			mileageSelected ||
			priceSelected ||
			transmissionSelected ||
			yearSelected
	);
	const sortSelected = $derived(
		mobile.sortOptions.some((option) => option.active && option.value !== 'best-match')
	);
	const hasActiveFilters = $derived(mobile.activeFilters.length > 0);
	const filterDrawerId = $derived(filterDrawerIds[filterDrawerMode]);
	const filterDrawerKicker = $derived(
		filterDrawerMode === 'sort' ? mobile.sortLabel : mobile.filterLabel
	);
	const filterDrawerTitle = $derived.by(() => {
		if (filterDrawerMode === 'body') return mobile.bodyLabel;
		if (filterDrawerMode === 'brand') return mobile.brandLabel;
		if (filterDrawerMode === 'extras') return mobile.extrasLabel;
		if (filterDrawerMode === 'fuel') return mobile.fuelLabel;
		if (filterDrawerMode === 'mileage') return mobile.mileageLabel;
		if (filterDrawerMode === 'model') return mobile.modelLabel;
		if (filterDrawerMode === 'price') return mobile.priceLabel;
		if (filterDrawerMode === 'sort') return mobile.sortLabel;

		return mobile.drawerTitle;
	});
	const stagedModelOptions = $derived.by(() => {
		const options =
			mobile.modelOptionsByBrand[filterDraft.brand] ??
			mobile.modelOptionsByBrand[''] ??
			mobile.modelOptions;

		return options.map((option) => ({
			...option,
			active: filterDraft.model === option.value
		}));
	});
	const visibleBrandOptions = $derived.by(() => {
		const query = normalizedOptionQuery(brandDrawerQuery);

		return mobile.brandOptions.filter((option) => {
			if (!option.value) return !query;

			return !query || optionSearchText(option).includes(query);
		});
	});
	const visibleStagedModelOptions = $derived.by(() => {
		const query = normalizedOptionQuery(modelDrawerQuery);

		return stagedModelOptions.filter(
			(option) => !query || optionSearchText(option).includes(query)
		);
	});
	const filterDraftChanged = $derived.by(() => {
		const current = currentFilterDraft();

		return (
			filterDraft.brand !== current.brand ||
			filterDraft.model !== current.model ||
			filterDraft.body !== current.body ||
			filterDraft.feature !== current.feature ||
			filterDraft.fuel !== current.fuel ||
			filterDraft.mileage !== current.mileage ||
			filterDraft.price !== current.price ||
			filterDraft.sort !== current.sort ||
			filterDraft.transmission !== current.transmission ||
			filterDraft.year !== current.year
		);
	});

	const resetFilterDraft = () => {
		filterDraft = currentFilterDraft();
	};
	const selectDraftOption = (key: keyof FilterDraft, value: string) => {
		if (key === 'brand') {
			filterDraft.brand = filterDraft.brand === value ? '' : value;
			filterDraft.model = '';
			modelDrawerQuery = '';
			return;
		}

		if (key === 'sort') {
			filterDraft.sort = value || 'best-match';
			return;
		}

		filterDraft[key] = filterDraft[key] === value ? '' : value;
	};
	const filterDraftHref = () => {
		const params = new SvelteURLSearchParams(window.location.search);
		const setParam = (key: string, value: string, defaultValue = '') => {
			if (!value || value === defaultValue) {
				params.delete(key);
				return;
			}

			params.set(key, value);
		};

		setParam('brand', filterDraft.brand);
		params.delete('query');
		params.delete('keyword');
		params.delete('model');
		setParam('q', filterDraft.model);
		params.delete('body');
		params.delete('bodystyle');
		setParam('bodyType', filterDraft.body);
		params.delete('equipment');
		params.delete('extra');
		params.delete('features');
		setParam('feature', filterDraft.feature);
		params.delete('FuelType');
		setParam('fuel', filterDraft.fuel);
		params.delete('mileageFrom');
		params.delete('mileageTo');
		const mileage = rangeParams(filterDraft.mileage);
		setParam('minMileage', mileage.min ? String(mileage.min) : '');
		setParam('maxMileage', mileage.max ? String(mileage.max) : '');
		params.delete('price');
		params.delete('priceFrom');
		params.delete('priceTo');
		const price = rangeParams(filterDraft.price);
		setParam('minPrice', price.min ? String(price.min) : '');
		setParam('maxPrice', price.max ? String(price.max) : '');
		setParam('sort', filterDraft.sort, 'best-match');
		params.delete('Transmission');
		params.delete('gearbox');
		setParam('transmission', filterDraft.transmission);
		params.delete('yearFrom');
		params.delete('yearTo');
		const year = rangeParams(filterDraft.year);
		setParam('minYear', year.min ? String(year.min) : '');
		setParam('maxYear', year.max ? String(year.max) : '');

		const query = params.toString();

		return `/inventory${query ? `?${query}` : ''}`;
	};
	const navigateToFilterDraft = (href = filterDraftHref()) => {
		const queryStart = href.indexOf('?');
		filterDrawerOpen = false;

		window.location.assign(
			`${resolve('/inventory')}${queryStart === -1 ? '' : href.slice(queryStart)}`
		);
	};
	const applyFilterDraft = () => {
		if (!filterDraftChanged) {
			closeFilterDrawer();
			return;
		}

		navigateToFilterDraft();
	};
	const selectFilterOption = (key: keyof FilterDraft, value: string) => {
		const previousHref = filterDraftHref();
		selectDraftOption(key, value);

		if (filterDrawerMode === 'all') return;

		const nextHref = filterDraftHref();
		if (nextHref === previousHref) {
			closeFilterDrawer();
			return;
		}

		navigateToFilterDraft(nextHref);
	};

	const openSearchDrawer = () => {
		filterDrawerOpen = false;
		searchDrawerOpen = true;
	};
	const closeSearchDrawer = () => {
		searchDrawerOpen = false;
	};
	const openFilterDrawer = (mode: FilterDrawerMode = 'all') => {
		searchDrawerOpen = false;
		filterDrawerMode = mode;
		resetFilterDraft();
		if (mode === 'brand') brandDrawerQuery = '';
		if (mode === 'model') modelDrawerQuery = '';
		filterDrawerOpen = true;
	};
	const closeFilterDrawer = () => {
		filterDrawerOpen = false;
	};
	const fallbackImage = '/assets/images/card/card-48.jpg';
	const useFallbackImage = (event: Event) => {
		const image = event.currentTarget as HTMLImageElement;

		if (!image.src.endsWith(fallbackImage)) {
			image.src = fallbackImage;
		}
	};
	const mobileImage = (card: AuxeroInventoryVehicleCard) => card.image;
</script>

<div class="bohemcars-inventory-mobile">
	<main class="bohemcars-inventory-mobile__main">
		<div class="bohemcars-inventory-mobile__search">
			<div class="bohemcars-inventory-mobile__search-field">
				<button
					type="button"
					class="bohemcars-inventory-mobile__search-label"
					aria-haspopup="dialog"
					aria-controls="bohemcars-inventory-mobile-search-drawer"
					aria-expanded={searchDrawerOpen}
					onclick={openSearchDrawer}
				>
					<Search size={21} strokeWidth={2.15} aria-hidden="true" />
					<span class:active={Boolean(mobile.searchValue)}>
						{mobile.searchValue || mobile.searchPlaceholder}
					</span>
				</button>
				<button
					type="button"
					class="bohemcars-inventory-mobile__search-action"
					aria-label={mobile.searchLabel}
					aria-controls="bohemcars-inventory-mobile-search-drawer"
					aria-expanded={searchDrawerOpen}
					onclick={openSearchDrawer}
				>
					<Search size={21} strokeWidth={2.25} aria-hidden="true" />
				</button>
			</div>
		</div>

		<nav class="bohemcars-inventory-mobile__tools" aria-label={mobile.filterLabel}>
			<button
				type="button"
				class="bohemcars-inventory-mobile__tool-choice"
				class:active={drawerFilterSelected}
				aria-haspopup="dialog"
				aria-controls={filterDrawerIds.all}
				aria-expanded={filterDrawerOpen && filterDrawerMode === 'all'}
				onclick={() => openFilterDrawer('all')}
			>
				<SlidersHorizontal size={18} strokeWidth={2.2} aria-hidden="true" />
				<span>{mobile.filterLabel}</span>
				{#if hasActiveFilters}
					<strong>{mobile.activeFilters.length}</strong>
				{/if}
			</button>
			<button
				type="button"
				class="bohemcars-inventory-mobile__tool-choice"
				class:active={sortSelected}
				aria-label={`${mobile.sortLabel}: ${mobile.sortValue}`}
				aria-haspopup="dialog"
				aria-controls={filterDrawerIds.sort}
				aria-expanded={filterDrawerOpen && filterDrawerMode === 'sort'}
				onclick={() => openFilterDrawer('sort')}
			>
				<ArrowUpDown size={18} strokeWidth={2.2} aria-hidden="true" />
				<span>{mobile.sortLabel}</span>
				{#if sortSelected}
					<strong>{mobile.sortValue}</strong>
				{/if}
			</button>
			<button
				type="button"
				class="bohemcars-inventory-mobile__tool-choice"
				class:active={brandSelected}
				aria-label={`${mobile.brandLabel}: ${mobile.brandValue}`}
				aria-haspopup="dialog"
				aria-controls={filterDrawerIds.brand}
				aria-expanded={filterDrawerOpen && filterDrawerMode === 'brand'}
				onclick={() => openFilterDrawer('brand')}
			>
				<Car size={18} strokeWidth={2.2} aria-hidden="true" />
				<span>{mobile.brandLabel}</span>
				{#if brandSelected}
					<strong>{mobile.brandValue}</strong>
				{/if}
				<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
			</button>
			<button
				type="button"
				class="bohemcars-inventory-mobile__tool-choice"
				class:active={modelSelected}
				aria-label={`${mobile.modelLabel}: ${mobile.modelValue}`}
				aria-haspopup="dialog"
				aria-controls={filterDrawerIds.model}
				aria-expanded={filterDrawerOpen && filterDrawerMode === 'model'}
				onclick={() => openFilterDrawer('model')}
			>
				<span>{mobile.modelLabel}</span>
				{#if modelSelected}
					<strong>{mobile.modelValue}</strong>
				{/if}
				<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
			</button>
			<button
				type="button"
				class="bohemcars-inventory-mobile__tool-choice"
				class:active={fuelSelected}
				aria-label={`${mobile.fuelLabel}: ${mobile.fuelValue}`}
				aria-haspopup="dialog"
				aria-controls={filterDrawerIds.fuel}
				aria-expanded={filterDrawerOpen && filterDrawerMode === 'fuel'}
				onclick={() => openFilterDrawer('fuel')}
			>
				<Fuel size={18} strokeWidth={2.2} aria-hidden="true" />
				<span>{mobile.fuelLabel}</span>
				{#if fuelSelected}
					<strong>{mobile.fuelValue}</strong>
				{/if}
				<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
			</button>
			<button
				type="button"
				class="bohemcars-inventory-mobile__tool-choice"
				class:active={mileageSelected}
				aria-label={`${mobile.mileageLabel}: ${mobile.mileageValue}`}
				aria-haspopup="dialog"
				aria-controls={filterDrawerIds.mileage}
				aria-expanded={filterDrawerOpen && filterDrawerMode === 'mileage'}
				onclick={() => openFilterDrawer('mileage')}
			>
				<Gauge size={18} strokeWidth={2.2} aria-hidden="true" />
				<span>{mobile.mileageLabel}</span>
				{#if mileageSelected}
					<strong>{mobile.mileageValue}</strong>
				{/if}
				<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
			</button>
			<button
				type="button"
				class="bohemcars-inventory-mobile__tool-choice"
				class:active={bodySelected}
				aria-label={`${mobile.bodyLabel}: ${bodyValue}`}
				aria-haspopup="dialog"
				aria-controls={filterDrawerIds.body}
				aria-expanded={filterDrawerOpen && filterDrawerMode === 'body'}
				onclick={() => openFilterDrawer('body')}
			>
				<Shapes size={18} strokeWidth={2.2} aria-hidden="true" />
				<span>{mobile.bodyRailLabel}</span>
				{#if bodySelected}
					<strong>{bodyValue}</strong>
				{/if}
				<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
			</button>
			<button
				type="button"
				class="bohemcars-inventory-mobile__tool-choice"
				class:active={priceSelected}
				aria-label={`${mobile.priceLabel}: ${mobile.priceValue}`}
				aria-haspopup="dialog"
				aria-controls={filterDrawerIds.price}
				aria-expanded={filterDrawerOpen && filterDrawerMode === 'price'}
				onclick={() => openFilterDrawer('price')}
			>
				<BadgeEuro size={18} strokeWidth={2.2} aria-hidden="true" />
				<span>{mobile.priceLabel}</span>
				{#if priceSelected}
					<strong>{mobile.priceValue}</strong>
				{/if}
				<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
			</button>
			<button
				type="button"
				class="bohemcars-inventory-mobile__tool-choice"
				class:active={extrasSelected}
				aria-label={`${mobile.extrasLabel}: ${mobile.featureValue}`}
				aria-haspopup="dialog"
				aria-controls={filterDrawerIds.extras}
				aria-expanded={filterDrawerOpen && filterDrawerMode === 'extras'}
				onclick={() => openFilterDrawer('extras')}
			>
				<Sparkles size={18} strokeWidth={2.2} aria-hidden="true" />
				<span>{mobile.extrasLabel}</span>
				{#if extrasSelected}
					<strong>{mobile.featureValue}</strong>
				{/if}
				<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
			</button>
			{#if hasActiveFilters}
				<a
					class="bohemcars-inventory-mobile__tool-clear"
					href={resolve(mobile.clearHref as '/inventory')}
				>
					{copy.reset}
				</a>
			{/if}
		</nav>

		<section class="bohemcars-inventory-mobile__cards" aria-label={mobile.countLabel}>
			{#each cards as card (card.slug)}
				<article class="bohemcars-inventory-mobile-card">
					<a
						class="bohemcars-inventory-mobile-card__image"
						href={resolve('/inventory/[slug]', { slug: card.slug })}
					>
						<img src={mobileImage(card)} alt={card.title} onerror={useFallbackImage} />
						<span>{card.tag}</span>
					</a>
					<div class="bohemcars-inventory-mobile-card__body">
						<p>{card.brand}</p>
						<h2>
							<a href={resolve('/inventory/[slug]', { slug: card.slug })}>{card.title}</a>
						</h2>
						<strong>{card.priceLabel}</strong>
						<small>{card.monthlyLabel}</small>
						<ul>
							<li><Gauge size={14} strokeWidth={2} aria-hidden="true" />{card.mileageLabel}</li>
							<li>{card.year}</li>
							<li><Fuel size={14} strokeWidth={2} aria-hidden="true" />{card.fuel}</li>
							<li>{card.transmission}</li>
						</ul>
					</div>
				</article>
			{:else}
				<div class="bohemcars-inventory-mobile__empty">
					<h2>{copy.emptyTitle}</h2>
					<p>{copy.emptyBody}</p>
					<a href={resolve('/inventory')}>{copy.reset}</a>
				</div>
			{/each}
		</section>
	</main>

	<Drawer.Root bind:open={searchDrawerOpen} direction="bottom">
		<Drawer.Overlay class="bohemcars-inventory-mobile-drawer__backdrop">
			<span>{mobile.closeLabel}</span>
		</Drawer.Overlay>
		<Drawer.Content
			id="bohemcars-inventory-mobile-search-drawer"
			class="bohemcars-inventory-mobile-drawer__sheet bohemcars-inventory-mobile-drawer__sheet--search"
		>
			<Drawer.Handle class="bohemcars-inventory-mobile-drawer__handle" />
			<header>
				<div>
					<p>{mobile.searchLabel}</p>
					<Drawer.Title>
						<span class="bohemcars-inventory-mobile-drawer__title">
							{mobile.searchDrawerTitle}
						</span>
					</Drawer.Title>
				</div>
				<button type="button" aria-label={mobile.closeLabel} onclick={closeSearchDrawer}>
					<X size={20} strokeWidth={2.25} aria-hidden="true" />
				</button>
			</header>
			<Drawer.Description>
				<span class="bohemcars-inventory-mobile-drawer__description">
					{mobile.searchPlaceholder}
				</span>
			</Drawer.Description>
			<form
				class="bohemcars-inventory-mobile-drawer__search-form"
				action={resolve('/inventory')}
				method="get"
			>
				{#each mobile.hiddenInputs as input (`${input.name}-${input.value}`)}
					<input type="hidden" name={input.name} value={input.value} />
				{/each}
				<div
					class="bohemcars-inventory-mobile-drawer__search-box bohemcars-inventory-mobile-drawer__search-box--submit"
				>
					<input
						name="q"
						type="search"
						value={mobile.searchValue}
						placeholder={mobile.searchPlaceholder}
						autocomplete="off"
						aria-label={mobile.searchPlaceholder}
					/>
					<button
						type="submit"
						class="bohemcars-inventory-mobile-drawer__search-submit"
						aria-label={mobile.searchLabel}
					>
						<span>{mobile.searchLabel}</span>
					</button>
				</div>
			</form>
			<div class="bohemcars-inventory-mobile-drawer__group">
				<p>{mobile.brandLabel}</p>
				<div>
					{#each mobile.brandOptions.slice(1, 7) as option (option.value)}
						<a
							class:active={option.active}
							href={resolve(option.href as '/inventory')}
							aria-current={option.active ? 'page' : undefined}
						>
							{option.label}
						</a>
					{/each}
				</div>
			</div>
			<div class="bohemcars-inventory-mobile-drawer__group">
				<p>{mobile.bodyLabel}</p>
				<div>
					{#each mobile.bodyOptions.slice(1, 7) as option (option.value)}
						<a
							class:active={option.active}
							href={resolve(option.href as '/inventory')}
							aria-current={option.active ? 'page' : undefined}
						>
							{option.label}
						</a>
					{/each}
				</div>
			</div>
			<a class="bohemcars-inventory-mobile-drawer__clear" href={resolve('/inventory')}>
				{mobile.countLabel}
			</a>
		</Drawer.Content>
	</Drawer.Root>

	<Drawer.Root bind:open={filterDrawerOpen} direction="bottom">
		<Drawer.Overlay class="bohemcars-inventory-mobile-drawer__backdrop">
			<span>{mobile.closeLabel}</span>
		</Drawer.Overlay>
		<Drawer.Content
			id={filterDrawerId}
			class="bohemcars-inventory-mobile-drawer__sheet bohemcars-inventory-mobile-drawer__sheet--filters"
		>
			<Drawer.Handle class="bohemcars-inventory-mobile-drawer__handle" />
			<header>
				<div>
					<p>{filterDrawerKicker}</p>
					<Drawer.Title>
						<span class="bohemcars-inventory-mobile-drawer__title">
							{filterDrawerTitle}
						</span>
					</Drawer.Title>
				</div>
				<button type="button" aria-label={mobile.closeLabel} onclick={closeFilterDrawer}>
					<X size={20} strokeWidth={2.25} aria-hidden="true" />
				</button>
			</header>
			<Drawer.Description>
				<span class="bohemcars-inventory-mobile-drawer__description">
					{mobile.countLabel}
				</span>
			</Drawer.Description>
			{#if filterDrawerMode === 'brand'}
				<div class="bohemcars-inventory-mobile-drawer__group">
					<label class="bohemcars-inventory-mobile-drawer__search-box">
						<Search size={19} strokeWidth={2.15} aria-hidden="true" />
						<input
							type="search"
							bind:value={brandDrawerQuery}
							placeholder={mobile.brandSearchPlaceholder}
							autocomplete="off"
							autocapitalize="none"
							spellcheck="false"
							enterkeyhint="search"
							aria-label={mobile.brandSearchPlaceholder}
						/>
					</label>
					{#if visibleBrandOptions.length}
						<div>
							{#each visibleBrandOptions as option (option.value)}
								<button
									type="button"
									class:active={filterDraft.brand === option.value}
									aria-pressed={filterDraft.brand === option.value}
									onclick={() => selectFilterOption('brand', option.value)}
								>
									{#if option.image}
										<img
											class="bohemcars-inventory-mobile-drawer__brand-logo"
											src={option.image}
											alt=""
											aria-hidden="true"
											loading="lazy"
											decoding="async"
										/>
									{/if}
									<span>{option.label}</span>
									{#if option.countLabel}
										<small>{option.countLabel}</small>
									{/if}
								</button>
							{/each}
						</div>
					{:else}
						<span class="bohemcars-inventory-mobile-drawer__empty-option">
							{mobile.noMatchesLabel}
						</span>
					{/if}
				</div>
			{/if}
			{#if filterDrawerMode === 'model'}
				<div class="bohemcars-inventory-mobile-drawer__group">
					<label class="bohemcars-inventory-mobile-drawer__search-box">
						<Search size={19} strokeWidth={2.15} aria-hidden="true" />
						<input
							type="search"
							bind:value={modelDrawerQuery}
							placeholder={mobile.modelSearchPlaceholder}
							autocomplete="off"
							autocapitalize="none"
							spellcheck="false"
							enterkeyhint="search"
							aria-label={mobile.modelSearchPlaceholder}
						/>
					</label>
					{#if visibleStagedModelOptions.length}
						<div>
							{#each visibleStagedModelOptions as option (option.value)}
								<button
									type="button"
									class:active={option.active}
									aria-pressed={option.active}
									onclick={() => selectFilterOption('model', option.value)}
								>
									<span>{option.label}</span>
									{#if option.countLabel}
										<small>{option.countLabel}</small>
									{/if}
								</button>
							{/each}
						</div>
					{:else}
						<span class="bohemcars-inventory-mobile-drawer__empty-option">
							{mobile.noMatchesLabel}
						</span>
					{/if}
				</div>
			{/if}
			{#if filterDrawerMode === 'all' || filterDrawerMode === 'body'}
				<div class="bohemcars-inventory-mobile-drawer__group">
					<p>{mobile.bodyLabel}</p>
					<div>
						{#each mobile.bodyOptions as option (option.value)}
							<button
								type="button"
								class:active={filterDraft.body === option.value}
								aria-pressed={filterDraft.body === option.value}
								onclick={() => selectFilterOption('body', option.value)}
							>
								<span>{option.label}</span>
								{#if option.countLabel}
									<small>{option.countLabel}</small>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/if}
			{#if filterDrawerMode === 'sort'}
				<div class="bohemcars-inventory-mobile-drawer__group">
					<p>{mobile.sortLabel}</p>
					<div>
						{#each mobile.sortOptions as option (option.value)}
							<button
								type="button"
								class:active={filterDraft.sort === option.value}
								aria-pressed={filterDraft.sort === option.value}
								onclick={() => selectFilterOption('sort', option.value)}
							>
								<span>{option.label}</span>
							</button>
						{/each}
					</div>
				</div>
			{/if}
			{#if filterDrawerMode === 'all' || filterDrawerMode === 'fuel'}
				<div class="bohemcars-inventory-mobile-drawer__group">
					<p>{mobile.fuelLabel}</p>
					<div>
						{#each mobile.fuelOptions as option (option.value)}
							<button
								type="button"
								class:active={filterDraft.fuel === option.value}
								aria-pressed={filterDraft.fuel === option.value}
								onclick={() => selectFilterOption('fuel', option.value)}
							>
								<span>{option.label}</span>
								{#if option.countLabel}
									<small>{option.countLabel}</small>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/if}
			{#if filterDrawerMode === 'all' || filterDrawerMode === 'mileage'}
				<div class="bohemcars-inventory-mobile-drawer__group">
					<p>{mobile.mileageLabel}</p>
					<div>
						{#each mobile.mileageOptions as option (option.value)}
							<button
								type="button"
								class:active={filterDraft.mileage === option.value}
								aria-pressed={filterDraft.mileage === option.value}
								onclick={() => selectFilterOption('mileage', option.value)}
							>
								<span>{option.label}</span>
								{#if option.countLabel}
									<small>{option.countLabel}</small>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/if}
			{#if filterDrawerMode === 'all' || filterDrawerMode === 'price'}
				<div class="bohemcars-inventory-mobile-drawer__group">
					<p>{mobile.priceLabel}</p>
					<div>
						{#each mobile.priceOptions as option (option.value)}
							<button
								type="button"
								class:active={filterDraft.price === option.value}
								aria-pressed={filterDraft.price === option.value}
								onclick={() => selectFilterOption('price', option.value)}
							>
								<span>{option.label}</span>
								{#if option.countLabel}
									<small>{option.countLabel}</small>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/if}
			{#if filterDrawerMode === 'all'}
				<div class="bohemcars-inventory-mobile-drawer__group">
					<p>{mobile.yearLabel}</p>
					<div>
						{#each mobile.yearOptions as option (option.value)}
							<button
								type="button"
								class:active={filterDraft.year === option.value}
								aria-pressed={filterDraft.year === option.value}
								onclick={() => selectFilterOption('year', option.value)}
							>
								<span>{option.label}</span>
								{#if option.countLabel}
									<small>{option.countLabel}</small>
								{/if}
							</button>
						{/each}
					</div>
				</div>
				<div class="bohemcars-inventory-mobile-drawer__group">
					<p>{mobile.transmissionLabel}</p>
					<div>
						{#each mobile.transmissionOptions as option (option.value)}
							<button
								type="button"
								class:active={filterDraft.transmission === option.value}
								aria-pressed={filterDraft.transmission === option.value}
								onclick={() => selectFilterOption('transmission', option.value)}
							>
								<span>{option.label}</span>
								{#if option.countLabel}
									<small>{option.countLabel}</small>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/if}
			{#if filterDrawerMode === 'all' || filterDrawerMode === 'extras'}
				<div class="bohemcars-inventory-mobile-drawer__group">
					<p>{mobile.extrasLabel}</p>
					<div>
						{#each mobile.featureOptions as option (option.value)}
							<button
								type="button"
								class:active={filterDraft.feature === option.value}
								aria-pressed={filterDraft.feature === option.value}
								onclick={() => selectFilterOption('feature', option.value)}
							>
								<span>{option.label}</span>
								{#if option.countLabel}
									<small>{option.countLabel}</small>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/if}
			{#if filterDrawerMode === 'all'}
				<div class="bohemcars-inventory-mobile-drawer__actions">
					<a
						class="bohemcars-inventory-mobile-drawer__clear"
						href={resolve(mobile.clearHref as '/')}
					>
						{copy.reset}
					</a>
					<button
						type="button"
						class="bohemcars-inventory-mobile-drawer__done"
						onclick={applyFilterDraft}
					>
						{filterDraftChanged ? mobile.applyLabel : mobile.showResultsLabel}
					</button>
				</div>
			{/if}
		</Drawer.Content>
	</Drawer.Root>
</div>

<style>
	.bohemcars-inventory-mobile {
		min-height: 100vh;
		background: #ffffff;
		color: #111111;
	}

	.bohemcars-inventory-mobile__main {
		display: grid;
		gap: 10px;
		padding: 14px 14px 92px;
	}

	.bohemcars-inventory-mobile__search {
		display: block;
	}

	.bohemcars-inventory-mobile__search-field {
		display: flex;
		min-height: 52px;
		min-width: 0;
		align-items: center;
		gap: 12px;
		border: 1px solid #dce3dc;
		border-radius: 999px;
		background: #eef1f5;
		padding: 5px 5px 5px 15px;
		color: #1c1c1c;
	}

	.bohemcars-inventory-mobile__search-label {
		display: flex;
		min-width: 0;
		height: 44px !important;
		flex: 1 1 auto;
		align-items: center;
		gap: 12px;
		border: 0;
		background: transparent;
		color: #1c1c1c;
		cursor: pointer;
		padding: 0;
		text-align: left;
	}

	.bohemcars-inventory-mobile__search-label span {
		display: block;
		min-width: 0;
		overflow: hidden;
		color: #9ba0a5;
		font-size: 16px;
		font-weight: 700;
		line-height: 22px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.bohemcars-inventory-mobile__search-label span.active {
		color: #1c1c1c;
	}

	.bohemcars-inventory-mobile__search-label :global(svg) {
		flex: 0 0 21px;
	}

	.bohemcars-inventory-mobile__search-action {
		display: flex;
		width: 44px;
		height: 44px;
		align-items: center;
		justify-content: center;
		flex: 0 0 44px;
		border: 0 !important;
		border-radius: 999px;
		background: #1c1c1c;
		box-shadow: none !important;
		color: #ffffff;
		cursor: pointer;
		padding: 0;
	}

	.bohemcars-inventory-mobile__search-action :global(svg),
	.bohemcars-inventory-mobile__search-action :global(path) {
		stroke: #ffffff;
	}

	.bohemcars-inventory-mobile__search-label:focus-visible,
	.bohemcars-inventory-mobile__search-action:focus-visible {
		outline: 2px solid #1c1c1c;
		outline-offset: 2px;
	}

	.bohemcars-inventory-mobile__tools {
		display: flex;
		gap: 8px;
		margin: 0 -14px;
		overflow-x: auto;
		padding: 0 14px 2px;
		scrollbar-width: none;
	}

	.bohemcars-inventory-mobile__tools::-webkit-scrollbar {
		display: none;
	}

	.bohemcars-inventory-mobile__tools a,
	.bohemcars-inventory-mobile__tools button {
		display: inline-flex;
		flex: 0 0 auto;
		min-height: 44px;
		align-items: center;
		gap: 8px;
		border: 0;
		border-radius: 11px;
		background: #eef1f5;
		padding: 0 13px;
		appearance: none;
		color: #1c1c1c;
		cursor: pointer;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
		text-decoration: none;
		white-space: nowrap;
	}

	.bohemcars-inventory-mobile__tools button.active {
		background: #d9f275;
		box-shadow: inset 0 0 0 1px rgba(87, 118, 13, 0.08);
		color: #1c1c1c;
	}

	.bohemcars-inventory-mobile__tools button:focus-visible,
	.bohemcars-inventory-mobile__tools a:focus-visible {
		background: #d9f275;
		box-shadow: inset 0 0 0 1px rgba(87, 118, 13, 0.08);
		color: #1c1c1c;
		outline: 2px solid #1c1c1c;
		outline-offset: 2px;
	}

	.bohemcars-inventory-mobile__tools button.bohemcars-inventory-mobile__tool-choice {
		gap: 6px;
		padding-right: 10px;
	}

	.bohemcars-inventory-mobile__tool-choice span {
		color: #1c1c1c;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
	}

	.bohemcars-inventory-mobile__tool-choice.active span {
		color: #5d7e16;
		font-size: 10px;
		font-weight: 900;
		line-height: 12px;
		text-transform: uppercase;
	}

	.bohemcars-inventory-mobile__tool-choice strong {
		display: block;
		max-width: min(42vw, 138px);
		overflow: hidden;
		color: #111111;
		font-size: 14px;
		font-weight: 900;
		line-height: 18px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.bohemcars-inventory-mobile__tool-choice :global(svg) {
		flex: 0 0 auto;
	}

	.bohemcars-inventory-mobile__tool-clear {
		min-height: 34px;
		border: 1px solid #d7ded7;
		border-radius: 999px;
		background: #ffffff;
		font-size: 13px;
	}

	.bohemcars-inventory-mobile__cards {
		display: grid;
		gap: 10px;
		margin-top: 8px;
	}

	.bohemcars-inventory-mobile-card {
		display: grid;
		grid-template-columns: 132px minmax(0, 1fr);
		min-height: 154px;
		overflow: hidden;
		border: 1px solid #d8e0dc;
		border-radius: 8px;
		background: #eef1f5;
	}

	.bohemcars-inventory-mobile-card__image {
		position: relative;
		display: block;
		min-height: 154px;
		overflow: hidden;
	}

	.bohemcars-inventory-mobile-card__image img {
		display: block;
		width: 100%;
		height: 100%;
		min-height: 154px;
		object-fit: cover;
	}

	.bohemcars-inventory-mobile-card__image span {
		position: absolute;
		top: 8px;
		left: 8px;
		min-height: 24px;
		border-radius: 999px;
		background: #8fbd24;
		padding: 0 8px;
		color: #ffffff;
		font-size: 10px;
		font-weight: 900;
		line-height: 24px;
		text-transform: uppercase;
	}

	.bohemcars-inventory-mobile-card__body {
		display: grid;
		align-content: start;
		padding: 9px 10px;
	}

	.bohemcars-inventory-mobile-card__body p {
		margin: 0 0 1px;
		color: #728093;
		font-size: 11px;
		font-weight: 900;
		line-height: 13px;
		text-transform: uppercase;
	}

	.bohemcars-inventory-mobile-card__body h2 {
		display: -webkit-box;
		min-height: 40px;
		margin: 0 0 5px;
		overflow: hidden;
		color: #101010;
		font-size: 16px;
		font-weight: 900;
		line-height: 20px;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.bohemcars-inventory-mobile-card__body h2 a {
		color: inherit;
		font-size: inherit;
		font-weight: 500;
		line-height: inherit;
	}

	.bohemcars-inventory-mobile-card__body strong {
		color: #8fbd24;
		font-size: 18px;
		font-weight: 900;
		line-height: 21px;
	}

	.bohemcars-inventory-mobile-card__body small {
		margin-bottom: 7px;
		color: #67717d;
		font-size: 11px;
		font-weight: 800;
		line-height: 14px;
	}

	.bohemcars-inventory-mobile-card__body ul {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.bohemcars-inventory-mobile-card__body li {
		display: flex;
		min-width: 0;
		min-height: 25px;
		align-items: center;
		justify-content: center;
		gap: 4px;
		overflow: hidden;
		border-radius: 7px;
		background: #ffffff;
		padding: 0 5px;
		color: #4b5563;
		font-size: 11px;
		font-weight: 800;
		line-height: 13px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.bohemcars-inventory-mobile__empty {
		border-radius: 8px;
		background: #eef1f5;
		padding: 18px;
	}

	.bohemcars-inventory-mobile__empty h2 {
		margin: 0 0 6px;
		font-size: 18px;
		line-height: 24px;
	}

	.bohemcars-inventory-mobile__empty p {
		margin: 0 0 12px;
		color: #67717d;
	}

	.bohemcars-inventory-mobile__empty a {
		color: #8fbd24;
		font-weight: 900;
	}

	:global(.bohemcars-inventory-mobile-drawer__backdrop) {
		position: fixed;
		inset: 0;
		display: block;
		z-index: 1200;
		border: 0;
		background: rgba(17, 17, 17, 0.34);
		cursor: pointer;
	}

	:global(.bohemcars-inventory-mobile-drawer__backdrop span) {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	.bohemcars-inventory-mobile :global(.bohemcars-inventory-mobile-drawer__sheet[data-vaul-drawer]) {
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
		display: grid;
		z-index: 1201;
		height: min(86dvh, 720px);
		max-height: min(86dvh, 720px);
		align-content: start;
		gap: 16px;
		grid-auto-rows: max-content;
		overflow-y: auto;
		border-radius: 18px 18px 0 0;
		background: #ffffff;
		outline: 0;
		padding: 10px 16px max(22px, env(safe-area-inset-bottom));
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}

	.bohemcars-inventory-mobile
		:global(.bohemcars-inventory-mobile-drawer__sheet--search[data-vaul-drawer]) {
		height: min(76dvh, 640px);
		max-height: min(76dvh, 640px);
	}

	.bohemcars-inventory-mobile
		:global(.bohemcars-inventory-mobile-drawer__sheet--filters[data-vaul-drawer]) {
		height: min(90dvh, 760px);
		max-height: min(90dvh, 760px);
		padding-bottom: 0;
	}

	.bohemcars-inventory-mobile
		:global(.bohemcars-inventory-mobile-drawer__sheet[data-vaul-drawer][data-state='open']) {
		transform: translate3d(0, 0, 0) !important;
	}

	:global(.bohemcars-inventory-mobile-drawer__sheet[data-vaul-drawer]::-webkit-scrollbar) {
		display: none;
	}

	:global(.bohemcars-inventory-mobile-drawer__handle) {
		width: 44px;
		height: 5px;
		justify-self: center;
		border-radius: 999px;
		background: #d7ded7;
	}

	:global(.bohemcars-inventory-mobile-drawer__sheet header) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	:global(.bohemcars-inventory-mobile-drawer__sheet header div) {
		min-width: 0;
	}

	:global(.bohemcars-inventory-mobile-drawer__sheet header p) {
		margin: 0 0 2px;
		color: #8fbd24;
		font-size: 11px;
		font-weight: 900;
		line-height: 14px;
		text-transform: uppercase;
	}

	.bohemcars-inventory-mobile-drawer__title {
		display: block;
		color: #111111;
		font-size: 22px;
		font-weight: 900;
		line-height: 28px;
	}

	.bohemcars-inventory-mobile-drawer__description {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	:global(.bohemcars-inventory-mobile-drawer__sheet header button) {
		display: flex;
		width: 38px;
		height: 38px;
		align-items: center;
		justify-content: center;
		flex: 0 0 38px;
		border: 0;
		border-radius: 50%;
		background: #eef1f5;
		color: #111111;
		cursor: pointer;
		padding: 0;
	}

	.bohemcars-inventory-mobile-drawer__search-form {
		display: grid;
		gap: 10px;
	}

	.bohemcars-inventory-mobile-drawer__search-box {
		display: flex;
		min-height: 50px;
		align-items: center;
		gap: 10px;
		border-radius: 999px;
		background: #eef1f5;
		padding: 0 13px;
		color: #111111;
	}

	.bohemcars-inventory-mobile-drawer__search-box--submit {
		padding-right: 6px;
	}

	.bohemcars-inventory-mobile-drawer__search-box input {
		min-width: 0;
		width: 100%;
		height: 48px;
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

	.bohemcars-inventory-mobile-drawer__search-box input::-webkit-search-cancel-button {
		appearance: none;
	}

	.bohemcars-inventory-mobile-drawer__search-box:focus-within {
		outline: 2px solid #1c1c1c;
		outline-offset: 2px;
	}

	.bohemcars-inventory-mobile-drawer__search-submit {
		display: inline-flex;
		min-width: 58px;
		height: 38px;
		align-items: center;
		justify-content: center;
		flex: 0 0 auto;
		border: 0;
		border-radius: 999px;
		background: #1c1c1c;
		appearance: none;
		color: #ffffff;
		cursor: pointer;
		font-size: 12px;
		font-weight: 900;
		line-height: 16px;
		padding: 0 13px;
		text-transform: uppercase;
	}

	:global(.bohemcars-inventory-mobile-drawer__search-submit span) {
		color: #ffffff;
		font-size: 12px;
		font-weight: 900;
		letter-spacing: 0;
		line-height: 16px;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.bohemcars-inventory-mobile-drawer__search-submit:focus-visible,
	.bohemcars-inventory-mobile-drawer__group a:focus-visible,
	.bohemcars-inventory-mobile-drawer__group button:focus-visible,
	.bohemcars-inventory-mobile-drawer__clear:focus-visible,
	.bohemcars-inventory-mobile-drawer__done:focus-visible {
		outline: 2px solid #1c1c1c;
		outline-offset: 2px;
	}

	.bohemcars-inventory-mobile-drawer__group {
		display: grid;
		gap: 9px;
	}

	.bohemcars-inventory-mobile-drawer__group p {
		margin: 0;
		color: #728093;
		font-size: 12px;
		font-weight: 900;
		line-height: 16px;
		text-transform: uppercase;
	}

	.bohemcars-inventory-mobile-drawer__group div {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.bohemcars-inventory-mobile-drawer__group a,
	.bohemcars-inventory-mobile-drawer__group button,
	.bohemcars-inventory-mobile-drawer__clear {
		display: inline-flex;
		min-height: 38px;
		align-items: center;
		gap: 7px;
		border: 0;
		border-radius: 9px;
		background: #eef1f5;
		padding: 0 12px;
		appearance: none;
		color: #111111;
		cursor: pointer;
		font-size: 14px;
		font-weight: 800;
		line-height: 18px;
		text-align: left;
	}

	.bohemcars-inventory-mobile-drawer__group a.active,
	.bohemcars-inventory-mobile-drawer__group button.active {
		background: #d9f275;
	}

	.bohemcars-inventory-mobile-drawer__brand-logo {
		width: 24px;
		height: 20px;
		flex: 0 0 24px;
		object-fit: contain;
	}

	.bohemcars-inventory-mobile-drawer__group button span {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.bohemcars-inventory-mobile-drawer__group button small {
		display: inline-flex;
		min-width: 21px;
		height: 21px;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: #ffffff;
		color: #67717d;
		font-size: 11px;
		font-weight: 900;
		line-height: 21px;
	}

	.bohemcars-inventory-mobile-drawer__empty-option {
		display: inline-flex;
		min-height: 40px;
		align-items: center;
		border-radius: 9px;
		background: #f5f7fa;
		color: #728093;
		font-size: 14px;
		font-weight: 800;
		line-height: 18px;
		padding: 0 12px;
	}

	.bohemcars-inventory-mobile-drawer__actions {
		position: sticky;
		bottom: 0;
		z-index: 3;
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		gap: 9px;
		margin: 2px -16px 0;
		border-top: 1px solid #e6ebdf;
		background: #ffffff;
		padding: 12px 16px max(14px, env(safe-area-inset-bottom));
		box-shadow: 0 -14px 22px rgba(255, 255, 255, 0.95);
	}

	.bohemcars-inventory-mobile-drawer__clear {
		justify-content: center;
		min-height: 50px;
		border-radius: 10px;
		background: #eef1f5;
		color: #1c1c1c;
	}

	.bohemcars-inventory-mobile-drawer__done {
		display: inline-flex;
		min-height: 50px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 10px;
		background: #b9ee39;
		appearance: none;
		color: #14210a;
		cursor: pointer;
		font-size: 15px;
		font-weight: 900;
		line-height: 19px;
	}

	@media (max-width: 399px) {
		.bohemcars-inventory-mobile-card {
			grid-template-columns: 124px minmax(0, 1fr);
		}
	}
</style>
