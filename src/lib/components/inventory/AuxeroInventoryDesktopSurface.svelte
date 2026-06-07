<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import type { AuxeroInventoryDesktopData } from '$lib/auxero/inventory-desktop';
	import type {
		AuxeroInventoryVehicleCard as AuxeroInventoryVehicleCardData,
		AuxeroInventoryView
	} from '$lib/auxero/inventory';
	import type { InventoryCopy } from '$lib/i18n/messages';
	import AuxeroInventoryActiveFilters from './AuxeroInventoryActiveFilters.svelte';
	import AuxeroInventoryContent from './AuxeroInventoryContent.svelte';
	import AuxeroInventoryFilterPopover from './AuxeroInventoryFilterPopover.svelte';
	import AuxeroInventoryMapFallback from './AuxeroInventoryMapFallback.svelte';
	import AuxeroInventorySidebarFilterGroup from './AuxeroInventorySidebarFilterGroup.svelte';

	let {
		cards,
		copy,
		desktop
	}: {
		cards: AuxeroInventoryVehicleCardData[];
		copy: InventoryCopy;
		desktop: AuxeroInventoryDesktopData;
	} = $props();

	let sidebarOpen = $state(false);
	const dashboardClass = $derived(
		`bohemcars-inventory-dashboard bohemcars-inventory-dashboard--${desktop.view}`
	);

	const inventoryAction = resolve('/inventory');
	const multiValueKeys = new Set([
		'bodyType',
		'bodystyle',
		'brand',
		'feature',
		'features',
		'FuelType',
		'fuel',
		'gearbox',
		'model',
		'Transmission',
		'transmission'
	]);
	const linkHref = (href: string) => ({ href });

	const isAllFilterValue = (value: string) => {
		const normalized = value.trim().toLowerCase();

		return !normalized || normalized === 'all';
	};
	const uniqueFilterValues = (values: string[]) =>
		Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));

	const inventorySuffixFromForm = (form: HTMLFormElement) => {
		const params = new SvelteURLSearchParams();
		const groupedValues: Record<string, string[]> = {};
		const searchValue = form.querySelector<HTMLInputElement>('input[name="q"]')?.value.trim() ?? '';

		for (const [key, value] of new FormData(form).entries()) {
			if (typeof value !== 'string') continue;

			const trimmed = value.trim();
			const normalized = trimmed.toLowerCase();

			if (
				!trimmed ||
				normalized === 'all' ||
				(key === 'view' && normalized === '4') ||
				(key === 'sort' && normalized === 'best-match')
			) {
				continue;
			}

			if (key === 'model' && searchValue) continue;

			if (multiValueKeys.has(key)) {
				groupedValues[key] = [...(groupedValues[key] ?? []), trimmed];
				continue;
			}

			params.set(key, trimmed);
		}

		for (const [key, values] of Object.entries(groupedValues)) {
			params.set(key, uniqueFilterValues(values).join(','));
		}

		const query = params.toString();

		return query ? `?${query}` : '';
	};

	const navigateForm = async (form: HTMLFormElement) => {
		const suffix = inventorySuffixFromForm(form);

		sidebarOpen = false;
		await goto(resolve(`/inventory${suffix}` as `/inventory${string}`), {
			invalidateAll: true,
			noScroll: true
		});
	};

	const handleSearchSubmit = (event: SubmitEvent) => {
		if (!(event.currentTarget instanceof HTMLFormElement)) return;

		event.preventDefault();
		void navigateForm(event.currentTarget);
	};

	const handleFilterChange = (event: Event) => {
		if (!(event.target instanceof HTMLInputElement)) return;
		if (event.target.dataset.inventoryFilterInput === undefined) return;

		const input = event.target;
		const form = input.form;
		const isModalPicker = Boolean(input.closest('[data-filter-presentation="modal"]'));

		if (!form) return;

		const filterInputs = Array.from(form.elements).filter(
			(element): element is HTMLInputElement =>
				element instanceof HTMLInputElement &&
				element.dataset.inventoryFilterInput !== undefined &&
				element.name === input.name
		);

		if (input.type === 'checkbox') {
			if (isAllFilterValue(input.value) && input.checked) {
				for (const filterInput of filterInputs) {
					if (filterInput !== input) filterInput.checked = false;
				}
			}

			if (!isAllFilterValue(input.value) && input.checked) {
				for (const filterInput of filterInputs) {
					if (isAllFilterValue(filterInput.value)) filterInput.checked = false;
				}
			}

			if (
				!filterInputs.some(
					(filterInput) => filterInput.checked && !isAllFilterValue(filterInput.value)
				)
			) {
				for (const filterInput of filterInputs) {
					if (isAllFilterValue(filterInput.value)) filterInput.checked = true;
				}
			}
		}

		if (input.name === 'brand') {
			for (const modelInput of Array.from(form.elements).filter(
				(element): element is HTMLInputElement =>
					element instanceof HTMLInputElement &&
					element.dataset.inventoryFilterInput !== undefined &&
					element.name === 'model'
			)) {
				modelInput.checked = isAllFilterValue(modelInput.value);
			}
		}

		if (input.name === 'model' && input.checked) {
			const searchInput = form.querySelector<HTMLInputElement>('input[name="q"]');

			if (searchInput) searchInput.value = '';
		}

		if (isModalPicker) return;

		void navigateForm(form);
	};
</script>

{#snippet utilityToolbar()}
	<div class="bohemcars-inventory-toolbar-row bohemcars-inventory-searchbar__utility">
		<div class="bohemcars-inventory-result-count">
			<button
				class="btn-filter bohemcars-inventory-searchbar__filter"
				id="filterSidebarToggle"
				type="button"
				aria-label={desktop.filterButtonLabel}
				aria-controls="filterSidebar"
				aria-expanded={sidebarOpen}
				onclick={() => {
					sidebarOpen = true;
				}}
			>
				<img src="/assets/icons/filter.svg" alt="" />
				<span>{desktop.filterButtonLabel}</span>
			</button>
			<p class="md-hidden">{desktop.showingText}</p>
		</div>
		<div class="bohemcars-inventory-sort">
			<span class="bohemcars-inventory-sort__label">{desktop.sortLabel}</span>
			<div class="core-dropdown">
				<button type="button" class="core-dropdown__button">
					<span class="core-dropdown__selected">{desktop.selectedSort}</span>
					<img src="/assets/icons/chevron-down-black.svg" alt="" />
				</button>
				<div class="core-dropdown__menu">
					<ul class="core-dropdown__list">
						{#each desktop.sortOptions as option (option.value)}
							<li class="core-dropdown__item">
								<a
									{...linkHref(option.href)}
									class={['core-dropdown__option', option.active && 'active']}
									data-sort={option.value}
									data-value={option.value}
								>
									{option.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>
{/snippet}

{#snippet sidebarFilterForm()}
	<form
		class="bohemcars-filter-form bohemcars-inventory-sidebar-form"
		action={inventoryAction}
		method="get"
		onsubmit={handleSearchSubmit}
		onchange={handleFilterChange}
	>
		{#each desktop.hiddenInputs as input (`sidebar:${input.name}:${input.value}`)}
			<input type="hidden" name={input.name} value={input.value} />
		{/each}
		{#if desktop.searchValue}
			<input type="hidden" name="q" value={desktop.searchValue} />
		{/if}
		<div class="bohemcars-inventory-sidebar-heading">
			<p class="h5 mb-4">{desktop.sidebar.title}</p>
			<p class="text-secondary">{desktop.sidebar.countLabel}</p>
		</div>
		{#each desktop.sidebar.filters as filter (filter.name)}
			<AuxeroInventorySidebarFilterGroup {filter} />
		{/each}
		<div class="bohemcars-inventory-sidebar-actions">
			<a
				{...linkHref(desktop.sidebar.actions.clearHref)}
				class="bohemcars-active-filter bohemcars-active-filter--clear"
				>{desktop.sidebar.actions.clearLabel}</a
			>
			<button class="btn btn-small btn-primary-3 font-weight-600" type="submit">
				{desktop.sidebar.actions.showLabel}
			</button>
		</div>
	</form>
{/snippet}

<section class="bohemcars-inventory-banner" aria-label={desktop.ariaLabel}>
	<div class="container">
		<div class="bohemcars-inventory-banner__copy">
			<h1 id="bohemcars-inventory-title" class="bohemcars-sr-only">Bohemcars Inventory</h1>
		</div>
		<div class="bohemcars-inventory-banner__cars" aria-hidden="true">
			<img
				class="bohemcars-inventory-banner__car bohemcars-inventory-banner__car--x5"
				src="/assets/bohemcars/megamenu/inventory-bmw-x5-cutout.webp"
				alt=""
				loading="eager"
				decoding="async"
			/>
			<img
				class="bohemcars-inventory-banner__car bohemcars-inventory-banner__car--sq5"
				src="/assets/bohemcars/megamenu/inventory-audi-sq5-cutout.webp"
				alt=""
				loading="eager"
				decoding="async"
			/>
		</div>
		<div class="bohemcars-inventory-banner__buybox">
			<form
				class="bohemcars-inventory-searchbar"
				action={inventoryAction}
				method="get"
				role="search"
				aria-label={desktop.searchLabel}
				data-bohemcars-search-form="inventory"
				onsubmit={handleSearchSubmit}
				onchange={handleFilterChange}
			>
				{#each desktop.hiddenInputs as input (`${input.name}:${input.value}`)}
					<input type="hidden" name={input.name} value={input.value} />
				{/each}
				<div class="bohemcars-inventory-searchbar__row">
					<div class="bohemcars-inventory-searchbar__primary">
						<label class="bohemcars-inventory-searchbar__search">
							<img src="/assets/icons/search-icon.svg" alt="" />
							<input
								type="text"
								name="q"
								value={desktop.searchValue}
								placeholder={desktop.searchPlaceholder}
								autocomplete="off"
							/>
						</label>
						<button class="bohemcars-inventory-searchbar__submit" type="submit">
							{desktop.searchSubmit}
						</button>
					</div>
				</div>

				<div class="bohemcars-inventory-hero-switches" aria-label={desktop.controlsLabel}>
					<div class="listing-tabs menu-tab bohemcars-view-toggle" aria-label={desktop.viewLabel}>
						{#each desktop.viewOptions as option (option.view)}
							<a
								class={['item-menu', option.active && 'active']}
								{...linkHref(option.href)}
								data-bohemcars-view-toggle
								aria-label={option.ariaLabel}
								title={option.title}
							>
								{@render viewIcon(option.view)}
							</a>
						{/each}
						<a
							class={['bohemcars-inventory-layout-toggle', desktop.layoutToggle.active && 'active']}
							{...linkHref(desktop.layoutToggle.href)}
							data-bohemcars-layout-toggle
							aria-label={desktop.layoutToggle.ariaLabel}
							title={desktop.layoutToggle.title}
						>
							<span>{desktop.layoutToggle.label}</span>
						</a>
					</div>
					<div
						class="bohemcars-inventory-filter-mode-toggle"
						role="group"
						aria-label={desktop.filterPresentationLabel}
					>
						{#each desktop.filterPresentationOptions as option (option.presentation)}
							<a
								class={['bohemcars-inventory-filter-mode-toggle__item', option.active && 'active']}
								{...linkHref(option.href)}
								aria-label={option.ariaLabel}
								title={option.title}
								aria-current={option.active ? 'true' : undefined}
							>
								{option.label}
							</a>
						{/each}
					</div>
				</div>

				<div class="bohemcars-inventory-filter-grid">
					{#each desktop.filters as filter (filter.name)}
						<AuxeroInventoryFilterPopover {filter} presentation={desktop.filterPresentation} />
					{/each}
				</div>

				{#if desktop.layout !== 'dashboard'}
					{@render utilityToolbar()}
				{/if}
			</form>
		</div>
	</div>
</section>

<section class="bohemcars-inventory-main pb-100" aria-label="Bohemcars inventory results">
	<div class="container">
		{#if desktop.layout === 'dashboard'}
			<div class={dashboardClass}>
				<aside class="bohemcars-inventory-dashboard-sidebar" aria-label="Inventory filters">
					{@render sidebarFilterForm()}
				</aside>
				<div class="bohemcars-inventory-dashboard-results">
					{@render utilityToolbar()}
					{#if desktop.activeFilters}
						<AuxeroInventoryActiveFilters
							activeFilters={desktop.activeFilters}
							modifierClass="bohemcars-inventory-active-filters--results"
						/>
					{/if}
					<AuxeroInventoryContent {cards} {copy} view={desktop.view} />
				</div>
				{#if desktop.map}
					<div class="bohemcars-inventory-dashboard-map">
						<AuxeroInventoryMapFallback map={desktop.map} />
					</div>
				{/if}
			</div>
		{:else}
			{#if desktop.activeFilters}
				<AuxeroInventoryActiveFilters
					activeFilters={desktop.activeFilters}
					modifierClass="bohemcars-inventory-active-filters--results"
				/>
			{/if}

			<AuxeroInventoryContent {cards} {copy} view={desktop.view} />

			{#if desktop.map}
				<AuxeroInventoryMapFallback map={desktop.map} />
			{/if}
		{/if}
	</div>
</section>

<aside
	id="filterSidebar"
	class={['filter-sidebar', sidebarOpen && 'active']}
	aria-hidden={!sidebarOpen}
>
	<button
		class="filter-sidebar__overlay"
		type="button"
		aria-label="Close filters"
		onclick={() => {
			sidebarOpen = false;
		}}
	></button>
	<div class="filter-sidebar__panel right-sidebar">
		<button
			id="filterSidebarClose"
			class="filter-sidebar__close"
			type="button"
			aria-label="Close filters"
			onclick={() => {
				sidebarOpen = false;
			}}
		>
			x
		</button>
		{@render sidebarFilterForm()}
	</div>
</aside>

{#snippet viewIcon(view: AuxeroInventoryView)}
	{#if view === '4'}
		<svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="3" cy="6" r="2.5" fill="white" stroke="#9FA1A4" />
			<circle cx="11" cy="6" r="2.5" fill="white" stroke="#9FA1A4" />
			<circle cx="19" cy="6" r="2.5" fill="white" stroke="#9FA1A4" />
			<circle cx="27" cy="6" r="2.5" fill="white" stroke="#9FA1A4" />
			<circle cx="3" cy="14" r="2.5" fill="white" stroke="#9FA1A4" />
			<circle cx="11" cy="14" r="2.5" fill="white" stroke="#9FA1A4" />
			<circle cx="19" cy="14" r="2.5" fill="white" stroke="#9FA1A4" />
			<circle cx="27" cy="14" r="2.5" fill="white" stroke="#9FA1A4" />
		</svg>
	{:else if view === 'map'}
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="5" cy="6" r="2.5" fill="white" stroke="#9FA1A4" />
			<rect x="9" y="3.5" width="10" height="5" rx="2.5" fill="white" stroke="#9FA1A4" />
			<circle cx="5" cy="14" r="2.5" fill="white" stroke="#9FA1A4" />
			<rect x="9" y="11.5" width="10" height="5" rx="2.5" fill="white" stroke="#9FA1A4" />
		</svg>
	{:else}
		<svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="3" cy="6" r="2.5" stroke="#9FA1A4" />
			<circle cx="11" cy="6" r="2.5" stroke="#9FA1A4" />
			<circle cx="19" cy="6" r="2.5" stroke="#9FA1A4" />
			<circle cx="3" cy="14" r="2.5" stroke="#9FA1A4" />
			<circle cx="11" cy="14" r="2.5" stroke="#9FA1A4" />
			<circle cx="19" cy="14" r="2.5" stroke="#9FA1A4" />
		</svg>
	{/if}
{/snippet}

<style>
	:global(.bohemcars-inventory-desktop-route #filterSidebar[aria-hidden='false']) {
		opacity: 1 !important;
		pointer-events: auto !important;
		visibility: visible !important;
	}

	:global(.bohemcars-inventory-desktop-route #filterSidebar[aria-hidden='true']) {
		opacity: 0 !important;
		pointer-events: none !important;
		visibility: hidden !important;
	}

	:global(
		.bohemcars-inventory-desktop-route #filterSidebar[aria-hidden='false'] .filter-sidebar__panel
	) {
		left: auto !important;
		right: 0 !important;
		transform: none !important;
	}

	:global(
		.bohemcars-inventory-desktop-route #filterSidebar[aria-hidden='true'] .filter-sidebar__panel
	) {
		right: -400px !important;
		transform: none !important;
	}

	:global(.bohemcars-inventory-desktop-route .filter-sidebar__overlay) {
		position: fixed;
		inset: 0;
		border: 0;
		background: rgba(0, 0, 0, 0.35);
	}

	:global(.bohemcars-inventory-desktop-route .filter-sidebar__panel) {
		position: fixed;
		top: 0;
		bottom: 0;
		z-index: 1001;
		width: min(400px, 100vw);
		overflow-y: auto;
		background: #ffffff;
		padding: 28px;
		transition: right 0.2s ease;
	}

	:global(.bohemcars-inventory-desktop-route .filter-sidebar__close) {
		position: absolute;
		top: 12px;
		right: 12px;
		display: inline-flex;
		width: 36px;
		height: 36px;
		align-items: center;
		justify-content: center;
		border: 1px solid #dde5d8;
		border-radius: 8px;
		background: #f1f3ee;
		color: #1c1c1c;
		font-weight: 800;
	}
</style>
