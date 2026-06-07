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
	import { X } from '@lucide/svelte';

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
	const hasSidebarActions = $derived(Boolean(desktop.activeFilters));

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

{#snippet utilityToolbar(showFilterButton = true)}
	<div class="bohemcars-inventory-toolbar-row">
		<div class="bohemcars-inventory-result-count">
			{#if showFilterButton}
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
			{/if}
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

{#snippet viewControls()}
	<div class="bohemcars-inventory-view-controls" aria-label={desktop.controlsLabel}>
		<div class="bohemcars-inventory-view-controls__group">
			<span class="bohemcars-inventory-view-controls__label">{desktop.viewLabel}</span>
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
			</div>
		</div>

		<div class="bohemcars-inventory-view-controls__group">
			<span class="bohemcars-inventory-view-controls__label">{desktop.layoutLabel}</span>
			<div class="bohemcars-inventory-layout-switch" role="group" aria-label={desktop.layoutLabel}>
				{#each desktop.layoutOptions as option (option.layout)}
					<a
						class={['bohemcars-inventory-layout-toggle', option.active && 'active']}
						{...linkHref(option.href)}
						data-bohemcars-layout-toggle
						aria-label={option.ariaLabel}
						title={option.title}
						aria-current={option.active ? 'true' : undefined}
					>
						<span>{option.label}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
{/snippet}

{#snippet resultsControls(showFilterGrid = false)}
	<form
		class={[
			'bohemcars-filter-form bohemcars-inventory-results-controls',
			showFilterGrid && 'bohemcars-inventory-results-controls--grid'
		]}
		action={inventoryAction}
		method="get"
		onsubmit={handleSearchSubmit}
		onchange={handleFilterChange}
	>
		{#each desktop.hiddenInputs as input (`results:${input.name}:${input.value}`)}
			<input type="hidden" name={input.name} value={input.value} />
		{/each}
		{#if desktop.searchValue}
			<input type="hidden" name="q" value={desktop.searchValue} />
		{/if}
		<div class="bohemcars-inventory-results-controls__top">
			{@render utilityToolbar(false)}
			{@render viewControls()}
		</div>
		{#if showFilterGrid}
			<div class="bohemcars-inventory-filter-grid" aria-label={desktop.filterPresentationLabel}>
				{#each desktop.filters as filter (filter.name)}
					<AuxeroInventoryFilterPopover
						{filter}
						allSelectedValue={filter.allLabel}
						optionLayout={filter.name === 'model' ? 'grid' : 'auto'}
						presentation={desktop.filterPresentation}
					/>
				{/each}
			</div>
		{/if}
	</form>
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
		<div class="bohemcars-inventory-sidebar-fields">
			{#each desktop.sidebar.filters as filter (filter.name)}
				<AuxeroInventoryFilterPopover
					{filter}
					allSelectedValue={filter.allLabel}
					optionLayout="list"
					presentation="popover"
				/>
			{/each}
		</div>
		{#if hasSidebarActions}
			<div class="bohemcars-inventory-sidebar-actions">
				<a
					{...linkHref(desktop.sidebar.actions.clearHref)}
					class="bohemcars-inventory-sidebar-clear">{desktop.sidebar.actions.clearLabel}</a
				>
				<button class="bohemcars-inventory-sidebar-apply" type="submit">
					{desktop.sidebar.actions.showLabel}
				</button>
			</div>
		{/if}
	</form>
{/snippet}

<section
	class={[
		'bohemcars-inventory-banner',
		desktop.layout === 'dashboard' && 'bohemcars-inventory-banner--compact'
	]}
	aria-label={desktop.ariaLabel}
>
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
			</form>
			{@render resultsControls(desktop.layout !== 'dashboard')}
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
			<X size={18} strokeWidth={2.4} aria-hidden="true" />
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
	.bohemcars-inventory-results-controls {
		position: relative;
		z-index: 5;
		display: grid;
		gap: 16px;
		margin: 0 0 22px;
		border: 1px solid #e8ecdf;
		border-radius: 12px;
		background: #ffffff;
		padding: 16px;
		box-shadow: 0 10px 30px rgba(23, 31, 18, 0.06);
	}

	.bohemcars-inventory-results-controls--grid {
		margin-top: 0;
	}

	.bohemcars-inventory-results-controls__top {
		display: grid;
		grid-template-columns: minmax(310px, 1fr) auto;
		gap: 16px;
		align-items: center;
	}

	.bohemcars-inventory-toolbar-row {
		display: grid;
		min-width: 0;
		align-items: center;
		gap: 14px;
		grid-template-columns: minmax(0, 1fr) auto;
	}

	.bohemcars-inventory-result-count {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 14px;
	}

	.bohemcars-inventory-result-count p {
		margin: 0;
		color: #1c1c1c;
		font-size: 15px;
		font-weight: 600;
		line-height: 22px;
		white-space: nowrap;
	}

	.bohemcars-inventory-sort {
		display: flex;
		align-items: center;
		gap: 10px;
		justify-self: end;
	}

	.bohemcars-inventory-sort__label {
		color: #5f6659;
		font-size: 14px;
		font-weight: 600;
		white-space: nowrap;
	}

	.bohemcars-inventory-sort :global(.core-dropdown) {
		min-width: 178px;
	}

	.bohemcars-inventory-sort :global(.core-dropdown__button) {
		min-height: 46px;
		border-color: #e4e9da;
		border-radius: 9px;
		background: #f8faf3;
	}

	.bohemcars-inventory-view-controls {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 10px;
	}

	.bohemcars-inventory-view-controls__group {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.bohemcars-inventory-view-controls__label {
		color: #5e6758;
		font-size: 12px;
		font-weight: 600;
		line-height: 16px;
		white-space: nowrap;
	}

	.bohemcars-view-toggle,
	.bohemcars-inventory-layout-switch,
	.bohemcars-inventory-filter-mode-toggle {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		border: 1px solid #e2e8d8;
		border-radius: 999px;
		background: #f5f8ef;
		padding: 4px;
	}

	.bohemcars-view-toggle :global(.item-menu),
	.bohemcars-inventory-layout-toggle,
	.bohemcars-inventory-filter-mode-toggle__item {
		display: inline-flex;
		min-width: 38px;
		min-height: 34px;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		color: #1c1c1c;
		font-size: 13px;
		font-weight: 700;
		line-height: 1;
		text-decoration: none;
		transition:
			background-color 0.16s ease,
			color 0.16s ease;
	}

	.bohemcars-view-toggle :global(.item-menu:hover),
	.bohemcars-inventory-layout-toggle:hover,
	.bohemcars-inventory-filter-mode-toggle__item:hover {
		background: #e9f0dc;
		color: #1c1c1c;
	}

	.bohemcars-view-toggle :global(.item-menu.active),
	.bohemcars-inventory-layout-toggle.active,
	.bohemcars-inventory-filter-mode-toggle__item.active {
		background: #d9fb5a;
		color: #14210f;
	}

	.bohemcars-inventory-layout-toggle {
		padding: 0 15px;
	}

	.bohemcars-inventory-filter-mode-toggle__item {
		padding: 0 13px;
	}

	.bohemcars-view-toggle :global(.item-menu.active svg circle),
	.bohemcars-view-toggle :global(.item-menu.active svg rect) {
		stroke: #14210f;
	}

	.bohemcars-inventory-filter-grid {
		display: grid;
		gap: 10px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.bohemcars-inventory-filter-grid :global(.ifp:nth-child(4n + 3) .ifp__panel),
	.bohemcars-inventory-filter-grid :global(.ifp:nth-child(4n) .ifp__panel) {
		right: 0;
		left: auto;
	}

	.bohemcars-inventory-dashboard-sidebar {
		z-index: 15;
	}

	.bohemcars-inventory-sidebar-heading {
		display: grid;
		gap: 3px;
		margin-bottom: 15px;
		padding: 0 2px;
	}

	.bohemcars-inventory-sidebar-heading :global(.h5) {
		margin: 0 !important;
		color: #101010;
		font-size: 17px;
		font-weight: 700;
		line-height: 24px;
	}

	.bohemcars-inventory-sidebar-heading :global(.text-secondary) {
		margin: 0;
		color: #656d5f !important;
		font-size: 13px;
		font-weight: 500;
		line-height: 19px;
	}

	.bohemcars-inventory-sidebar-fields {
		display: grid;
		gap: 10px;
		min-width: 0;
	}

	.bohemcars-inventory-sidebar-fields :global(.ifp) {
		position: relative;
		min-width: 0;
	}

	.bohemcars-inventory-sidebar-fields :global(.ifp--open) {
		z-index: auto;
	}

	.bohemcars-inventory-sidebar-fields :global(.ifp__field) {
		box-sizing: border-box;
		min-height: 64px;
		border: 1px solid #dfe6d4;
		border-radius: 8px;
		background: #ffffff;
		padding: 10px 42px 10px 15px;
		box-shadow: none;
	}

	.bohemcars-inventory-sidebar-fields :global(.ifp__field:hover) {
		border-color: #c9d3bd;
		background: #fbfcf8;
	}

	.bohemcars-inventory-sidebar-fields :global(.ifp--open .ifp__field) {
		border-color: #98bc2a;
		background: #ffffff;
		box-shadow: none;
	}

	.bohemcars-inventory-sidebar-fields :global(.ifp__label) {
		color: #6b7463;
		font-size: 12.5px;
		font-weight: 600;
		letter-spacing: 0;
		text-transform: none;
	}

	.bohemcars-inventory-sidebar-fields :global(.ifp__value) {
		color: #101010;
		font-size: 15.5px;
		font-weight: 700;
		line-height: 20px;
	}

	.bohemcars-inventory-sidebar-fields :global(.ifp__value--placeholder) {
		color: #101010;
		font-weight: 650;
	}

	.bohemcars-inventory-sidebar-fields :global(.ifp__chev) {
		right: 15px;
		color: #1c1c1c;
	}

	.bohemcars-inventory-sidebar-fields :global(.ifp__panel) {
		position: static;
		box-sizing: border-box;
		width: 100%;
		max-width: 100%;
		margin-top: 8px;
		border-color: #dfe6d4;
		border-radius: 10px;
		padding: 9px;
		box-shadow: none;
	}

	.bohemcars-inventory-sidebar-fields :global(.ifp__grid) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.bohemcars-inventory-sidebar-fields :global(.ifp__list),
	.bohemcars-inventory-sidebar-fields :global(.ifp__grid) {
		max-height: min(60vh, 384px);
		min-width: 0;
	}

	.bohemcars-inventory-sidebar-fields :global(.ifp__row) {
		box-sizing: border-box;
		min-height: 42px;
		background: #f7f9f3;
	}

	.bohemcars-inventory-sidebar-fields :global(.ifp__chip) {
		min-height: 68px;
	}

	.bohemcars-inventory-dashboard-sidebar .bohemcars-inventory-sidebar-fields :global(.ifp--open) {
		z-index: 90;
	}

	.bohemcars-inventory-dashboard-sidebar .bohemcars-inventory-sidebar-fields :global(.ifp__panel) {
		position: absolute;
		top: calc(100% + 6px);
		left: 0;
		z-index: 30;
		width: 100%;
		margin-top: 0;
		box-shadow: 0 16px 34px rgba(18, 24, 14, 0.13);
	}

	.bohemcars-inventory-sidebar-actions {
		display: grid;
		align-items: center;
		gap: 10px;
		grid-template-columns: minmax(0, 1fr) auto;
		margin-top: 14px;
	}

	.bohemcars-inventory-sidebar-clear,
	.bohemcars-inventory-sidebar-apply {
		display: inline-flex;
		min-height: 40px;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		padding: 0 15px;
		font-size: 14px;
		font-weight: 700;
		line-height: 1;
		text-decoration: none;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease;
	}

	.bohemcars-inventory-sidebar-clear {
		border: 1px solid #cfd8c5;
		background: #ffffff;
		color: #151515;
	}

	.bohemcars-inventory-sidebar-clear:hover {
		border-color: #bfcbb3;
		background: #f8faf3;
		color: #151515;
	}

	.bohemcars-inventory-sidebar-apply {
		border: 1px solid #9cc427;
		background: #9cc427;
		color: #ffffff;
		cursor: pointer;
		font: inherit;
		font-weight: 800;
	}

	.bohemcars-inventory-sidebar-apply:hover {
		border-color: #88ae1f;
		background: #88ae1f;
	}

	.bohemcars-inventory-banner__buybox .bohemcars-inventory-searchbar {
		padding-bottom: 14px;
	}

	.bohemcars-inventory-banner__buybox .bohemcars-inventory-results-controls {
		margin-bottom: 0;
		box-shadow: none;
	}

	.bohemcars-inventory-banner__buybox
		.bohemcars-inventory-results-controls:not(.bohemcars-inventory-results-controls--grid) {
		gap: 0;
	}

	@media (max-width: 1199px) {
		.bohemcars-inventory-results-controls__top {
			grid-template-columns: 1fr;
		}

		.bohemcars-inventory-view-controls {
			justify-content: flex-start;
			flex-wrap: wrap;
		}

		.bohemcars-inventory-filter-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 767.98px) {
		.bohemcars-inventory-results-controls {
			display: none;
		}
	}

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
