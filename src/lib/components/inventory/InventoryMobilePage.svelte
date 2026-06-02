<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		ArrowUpDown,
		Car,
		ChevronDown,
		Fuel,
		Gauge,
		Search,
		SlidersHorizontal,
		X
	} from '@lucide/svelte';
	import type { AuxeroInventoryVehicleCard } from '$lib/auxero/inventory';
	import type { InventoryMobileData } from '$lib/auxero/inventory-mobile';
	import type { InventoryCopy } from '$lib/i18n/messages';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { Drawer } from 'vaul-svelte';

	type FilterDrawerMode = 'all' | 'brand' | 'model' | 'sort';
	type FilterDraft = {
		body: string;
		brand: string;
		fuel: string;
		model: string;
		sort: string;
	};

	let {
		cards,
		copy,
		mobile
	}: {
		cards: AuxeroInventoryVehicleCard[];
		copy: InventoryCopy;
		mobile: InventoryMobileData;
	} = $props();

	const searchDrawerSnapPoints: (number | string)[] = [0.64, 0.92];
	const fullFilterDrawerSnapPoints: (number | string)[] = [1];
	const focusedFilterDrawerSnapPoints: (number | string)[] = [1];
	const filterDrawerIds = {
		all: 'bohemcars-inventory-mobile-filter-drawer',
		brand: 'bohemcars-inventory-mobile-brand-drawer',
		model: 'bohemcars-inventory-mobile-model-drawer',
		sort: 'bohemcars-inventory-mobile-sort-drawer'
	} as const;
	const activeOptionValue = (options: InventoryMobileData['brandOptions']) =>
		options.find((option) => option.active)?.value ?? '';
	const currentFilterDraft = (): FilterDraft => ({
		body: activeOptionValue(mobile.bodyOptions),
		brand: activeOptionValue(mobile.brandOptions),
		fuel: activeOptionValue(mobile.fuelOptions),
		model: activeOptionValue(mobile.modelOptions) || mobile.searchValue,
		sort: activeOptionValue(mobile.sortOptions) || 'best-match'
	});

	let searchDrawerOpen = $state(false);
	let filterDrawerOpen = $state(false);
	let filterDrawerMode = $state<FilterDrawerMode>('all');
	let searchDrawerSnapPoint = $state<number | string | null>(searchDrawerSnapPoints[0]);
	let filterDrawerSnapPoint = $state<number | string | null>(fullFilterDrawerSnapPoints[0]);
	let filterDraft = $state<FilterDraft>(currentFilterDraft());

	const brandSelected = $derived(
		mobile.brandOptions.some((option) => option.active && option.value)
	);
	const modelSelected = $derived(Boolean(mobile.searchValue));
	const bodySelected = $derived(mobile.bodyOptions.some((option) => option.active && option.value));
	const fuelSelected = $derived(mobile.fuelOptions.some((option) => option.active && option.value));
	const drawerFilterSelected = $derived(bodySelected || fuelSelected);
	const sortSelected = $derived(
		mobile.sortOptions.some((option) => option.active && option.value !== 'best-match')
	);
	const hasActiveFilters = $derived(mobile.activeFilters.length > 0);
	const filterDrawerSnapPoints = $derived(
		filterDrawerMode === 'all' ? fullFilterDrawerSnapPoints : focusedFilterDrawerSnapPoints
	);
	const filterDrawerId = $derived(filterDrawerIds[filterDrawerMode]);
	const filterDrawerKicker = $derived(
		filterDrawerMode === 'sort' ? mobile.sortLabel : mobile.filterLabel
	);
	const filterDrawerTitle = $derived.by(() => {
		if (filterDrawerMode === 'brand') return mobile.brandLabel;
		if (filterDrawerMode === 'model') return mobile.modelLabel;
		if (filterDrawerMode === 'sort') return mobile.sortLabel;

		return mobile.drawerTitle;
	});
	const visibleQuickPills = $derived.by(() => {
		const quickPills = mobile.quickPills.slice(1);
		const activePills = quickPills.filter((pill) => pill.active && pill.kind !== 'brand');
		const inactivePills = quickPills.filter((pill) => !pill.active);

		return hasActiveFilters
			? [mobile.totalPill, ...activePills, ...inactivePills]
			: [mobile.totalPill, ...inactivePills];
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
	const filterDraftChanged = $derived.by(() => {
		const current = currentFilterDraft();

		return (
			filterDraft.brand !== current.brand ||
			filterDraft.model !== current.model ||
			filterDraft.body !== current.body ||
			filterDraft.fuel !== current.fuel ||
			filterDraft.sort !== current.sort
		);
	});

	const resetFilterDraft = () => {
		filterDraft = currentFilterDraft();
	};
	const selectDraftOption = (key: keyof FilterDraft, value: string) => {
		if (key === 'brand') {
			filterDraft.brand = filterDraft.brand === value ? '' : value;
			filterDraft.model = '';
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
		params.delete('FuelType');
		setParam('fuel', filterDraft.fuel);
		setParam('sort', filterDraft.sort, 'best-match');

		const query = params.toString();

		return `/inventory${query ? `?${query}` : ''}`;
	};
	const applyFilterDraft = () => {
		if (!filterDraftChanged) {
			closeFilterDrawer();
			return;
		}

		const href = filterDraftHref();
		const queryStart = href.indexOf('?');
		filterDrawerOpen = false;

		window.location.assign(
			`${resolve('/inventory')}${queryStart === -1 ? '' : href.slice(queryStart)}`
		);
	};

	const openSearchDrawer = () => {
		filterDrawerOpen = false;
		searchDrawerSnapPoint = searchDrawerSnapPoints[0];
		searchDrawerOpen = true;
	};
	const closeSearchDrawer = () => {
		searchDrawerOpen = false;
	};
	const openFilterDrawer = (mode: FilterDrawerMode = 'all') => {
		searchDrawerOpen = false;
		filterDrawerMode = mode;
		resetFilterDraft();
		filterDrawerSnapPoint =
			mode === 'all' ? fullFilterDrawerSnapPoints[0] : focusedFilterDrawerSnapPoints[0];
		filterDrawerOpen = true;
	};
	const closeFilterDrawer = () => {
		filterDrawerOpen = false;
	};
	const useFallbackImage = (event: Event) => {
		const image = event.currentTarget as HTMLImageElement;

		if (!image.src.endsWith('/assets/bohemcars/hero/home-hero-available-inventory-wow.webp')) {
			image.src = '/assets/bohemcars/hero/home-hero-available-inventory-wow.webp';
		}
	};
	const mobileImage = (card: AuxeroInventoryVehicleCard) =>
		card.slug === '21764342419542174'
			? '/assets/bohemcars/hero/home-hero-available-inventory-wow.webp'
			: card.image;
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
				class:active={brandSelected}
				aria-label={`${mobile.brandLabel}: ${mobile.brandValue}`}
				aria-haspopup="dialog"
				aria-controls={filterDrawerIds.brand}
				aria-expanded={filterDrawerOpen && filterDrawerMode === 'brand'}
				onclick={() => openFilterDrawer('brand')}
			>
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
				class:active={drawerFilterSelected}
				aria-haspopup="dialog"
				aria-controls={filterDrawerIds.all}
				aria-expanded={filterDrawerOpen && filterDrawerMode === 'all'}
				onclick={() => openFilterDrawer('all')}
			>
				<SlidersHorizontal size={18} strokeWidth={2.2} aria-hidden="true" />
				{mobile.filterLabel}
			</button>
			<button
				type="button"
				class:active={sortSelected}
				aria-haspopup="dialog"
				aria-controls={filterDrawerIds.sort}
				aria-expanded={filterDrawerOpen && filterDrawerMode === 'sort'}
				onclick={() => openFilterDrawer('sort')}
			>
				<ArrowUpDown size={18} strokeWidth={2.2} aria-hidden="true" />
				{mobile.sortLabel}
			</button>
			{#each visibleQuickPills as pill (`${pill.label}-${pill.href}`)}
				<a
					class:active={pill.active}
					href={resolve(pill.href as '/inventory')}
					aria-current={pill.active ? 'page' : undefined}
				>
					{#if pill === mobile.totalPill}
						<Car size={18} strokeWidth={2.2} aria-hidden="true" />
					{/if}
					{#if pill.image}
						<img src={pill.image} alt="" aria-hidden="true" />
					{/if}
					{pill.label}
				</a>
			{/each}
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

	<Drawer.Root
		bind:activeSnapPoint={searchDrawerSnapPoint}
		bind:open={searchDrawerOpen}
		autoFocus={false}
		direction="bottom"
		snapPoints={searchDrawerSnapPoints}
		snapToSequentialPoint={true}
	>
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
				<div class="bohemcars-inventory-mobile-drawer__search-box">
					<Search size={20} strokeWidth={2.15} aria-hidden="true" />
					<input
						name="q"
						type="search"
						value={mobile.searchValue}
						placeholder={mobile.searchPlaceholder}
						autocomplete="off"
						aria-label={mobile.searchPlaceholder}
					/>
				</div>
				<button type="submit">{mobile.searchLabel}</button>
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

	<Drawer.Root
		bind:activeSnapPoint={filterDrawerSnapPoint}
		bind:open={filterDrawerOpen}
		autoFocus={false}
		direction="bottom"
		snapPoints={filterDrawerSnapPoints}
		snapToSequentialPoint={true}
	>
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
					<p>{mobile.brandLabel}</p>
					<div>
						{#each mobile.brandOptions as option (option.value)}
							<button
								type="button"
								class:active={filterDraft.brand === option.value}
								aria-pressed={filterDraft.brand === option.value}
								onclick={() => selectDraftOption('brand', option.value)}
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
			{#if filterDrawerMode === 'model'}
				<div class="bohemcars-inventory-mobile-drawer__group">
					<p>{mobile.modelLabel}</p>
					<div>
						{#each stagedModelOptions as option (option.value)}
							<button
								type="button"
								class:active={option.active}
								aria-pressed={option.active}
								onclick={() => selectDraftOption('model', option.value)}
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
					<p>{mobile.bodyLabel}</p>
					<div>
						{#each mobile.bodyOptions as option (option.value)}
							<button
								type="button"
								class:active={filterDraft.body === option.value}
								aria-pressed={filterDraft.body === option.value}
								onclick={() => selectDraftOption('body', option.value)}
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
								onclick={() => selectDraftOption('sort', option.value)}
							>
								<span>{option.label}</span>
							</button>
						{/each}
					</div>
				</div>
			{/if}
			{#if filterDrawerMode === 'all'}
				<div class="bohemcars-inventory-mobile-drawer__group">
					<p>{mobile.fuelLabel}</p>
					<div>
						{#each mobile.fuelOptions as option (option.value)}
							<button
								type="button"
								class:active={filterDraft.fuel === option.value}
								aria-pressed={filterDraft.fuel === option.value}
								onclick={() => selectDraftOption('fuel', option.value)}
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
			<div class="bohemcars-inventory-mobile-drawer__actions">
				<a class="bohemcars-inventory-mobile-drawer__clear" href={resolve(mobile.clearHref as '/')}>
					{copy.reset}
				</a>
				<button
					type="button"
					class="bohemcars-inventory-mobile-drawer__done"
					onclick={applyFilterDraft}
				>
					{filterDraftChanged ? mobile.applyLabel : mobile.doneLabel}
				</button>
			</div>
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
		height: 42px !important;
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
		width: 42px;
		height: 42px;
		align-items: center;
		justify-content: center;
		flex: 0 0 42px;
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
		min-height: 42px;
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

	.bohemcars-inventory-mobile__tools a.active,
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

	.bohemcars-inventory-mobile__tools img {
		width: 24px;
		height: 20px;
		object-fit: contain;
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
		z-index: 80;
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
		z-index: 81;
		height: 100dvh;
		max-height: 100dvh;
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

	.bohemcars-inventory-mobile-drawer__search-form button {
		min-height: 46px;
		border: 0;
		border-radius: 10px;
		background: #1c1c1c;
		color: #ffffff;
		font-size: 15px;
		font-weight: 900;
		line-height: 20px;
		cursor: pointer;
	}

	.bohemcars-inventory-mobile-drawer__search-form button:focus-visible,
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

	.bohemcars-inventory-mobile-drawer__actions {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 9px;
		margin-top: 2px;
		border-top: 1px solid #eef1f5;
		background: #ffffff;
		padding-top: 12px;
	}

	.bohemcars-inventory-mobile-drawer__clear {
		justify-content: center;
		background: #1c1c1c;
		color: #ffffff;
	}

	.bohemcars-inventory-mobile-drawer__done {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 9px;
		background: #d9f275;
		appearance: none;
		color: #111111;
		cursor: pointer;
		font-size: 14px;
		font-weight: 900;
		line-height: 18px;
	}

	@media (max-width: 399px) {
		.bohemcars-inventory-mobile-card {
			grid-template-columns: 124px minmax(0, 1fr);
		}
	}
</style>
