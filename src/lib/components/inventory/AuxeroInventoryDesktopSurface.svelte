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
	let focusedModalFilterName = $state<string | null>(null);
	const dashboardClass = $derived(
		`bohemcars-inventory-dashboard bohemcars-inventory-dashboard--${desktop.view}`
	);
	const hasSidebarActions = $derived(Boolean(desktop.activeFilters));
	const modalFocusActive = $derived(
		desktop.filterPresentation === 'modal' &&
			desktop.layout !== 'dashboard' &&
			Boolean(focusedModalFilterName)
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

	const selectedFilterCount = (filter: AuxeroInventoryDesktopData['filters'][number]) =>
		filter.selectedValues.length;

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

	const openModalFilter = (name: string) => {
		focusedModalFilterName = name;
		window.dispatchEvent(
			new CustomEvent('bohemcars-inventory-filter-switch', { detail: { name } })
		);
	};

	const handleModalOpen = (name: string) => {
		focusedModalFilterName = name;
	};

	const handleModalClose = (name: string) => {
		if (focusedModalFilterName === name) focusedModalFilterName = null;
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
					onclickcapture={() => {
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

{#snippet viewControls(showFilterModes = false)}
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

		{#if showFilterModes === true}
			<div class="bohemcars-inventory-view-controls__group">
				<span class="bohemcars-inventory-view-controls__label"
					>{desktop.filterPresentationLabel}</span
				>
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
							<span>{option.label}</span>
						</a>
					{/each}
				</div>
			</div>
		{/if}

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

{#snippet demoControls()}
	<div
		class={[
			'bohemcars-inventory-demo-strip',
			modalFocusActive && 'bohemcars-inventory-demo-strip--modal-focus'
		]}
	>
		{#if modalFocusActive}
			<div class="bohemcars-inventory-modal-focus-controls" aria-label={desktop.filterButtonLabel}>
				<div class="bohemcars-inventory-modal-focus-controls__lead">
					<img src="/assets/icons/filter.svg" alt="" />
					<span>{desktop.filterButtonLabel}</span>
				</div>
				<div class="bohemcars-inventory-modal-focus-controls__tabs" aria-label="Филтри">
					{#each desktop.filters as filter (filter.name)}
						{@const selectedCount = selectedFilterCount(filter)}
						<button
							type="button"
							class={[
								'bohemcars-inventory-modal-focus-controls__tab',
								focusedModalFilterName === filter.name &&
									'bohemcars-inventory-modal-focus-controls__tab--active',
								selectedCount > 0 && 'bohemcars-inventory-modal-focus-controls__tab--selected'
							]}
							aria-current={focusedModalFilterName === filter.name ? 'true' : undefined}
							onclick={() => openModalFilter(filter.name)}
						>
							<span>{filter.label}</span>
							{#if selectedCount > 0}<small>{selectedCount}</small>{/if}
						</button>
					{/each}
				</div>
			</div>
		{:else}
			{@render utilityToolbar(desktop.layout !== 'dashboard')}
			{@render viewControls(true)}
		{/if}
	</div>
{/snippet}

{#snippet filterPanel()}
	<form
		class="bohemcars-filter-form bohemcars-inventory-filter-panel"
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
		<div class="bohemcars-inventory-filter-grid" aria-label={desktop.filterPresentationLabel}>
			{#each desktop.filters as filter (filter.name)}
				<AuxeroInventoryFilterPopover
					{filter}
					allSelectedValue={filter.allLabel}
					onModalClose={handleModalClose}
					onModalOpen={handleModalOpen}
					optionLayout={filter.name === 'model' ? 'grid' : 'auto'}
					presentation={desktop.filterPresentation}
				/>
			{/each}
		</div>
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
		{@render demoControls()}
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
			{#if desktop.layout !== 'dashboard'}
				{@render filterPanel()}
			{/if}
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
		onclickcapture={() => {
			sidebarOpen = false;
		}}
	></button>
	<div class="filter-sidebar__panel right-sidebar">
		<button
			id="filterSidebarClose"
			class="filter-sidebar__close"
			type="button"
			aria-label="Close filters"
			onclickcapture={() => {
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
	.bohemcars-inventory-main {
		background: var(--bc-surface);
	}

	:global(body.bohemcars-inventory-template) .bohemcars-inventory-main {
		background: var(--bc-surface) !important;
	}

	.bohemcars-inventory-dashboard {
		border: 0;
		background: var(--bc-surface);
		box-shadow: none;
	}

	:global(body.bohemcars-inventory-template) .bohemcars-inventory-dashboard {
		border: 0 !important;
		background: var(--bc-surface) !important;
		box-shadow: none !important;
	}

	.bohemcars-inventory-dashboard-results {
		min-width: 0;
		background: var(--bc-surface);
	}

	:global(body.bohemcars-inventory-template) .bohemcars-inventory-dashboard-results {
		background: var(--bc-surface) !important;
	}

	.bohemcars-inventory-demo-strip {
		position: relative;
		z-index: 6;
		display: grid;
		width: min(1220px, calc(100vw - 48px));
		max-width: 100%;
		align-items: center;
		justify-content: space-between;
		grid-template-columns: minmax(520px, 1fr) auto;
		gap: 12px 16px;
		margin: 0 auto 10px;
		border: 1px solid #e8ecdf;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.93);
		padding: 10px 14px;
		box-shadow: 0 8px 24px rgba(23, 31, 18, 0.05);
	}

	.bohemcars-inventory-demo-strip--modal-focus {
		z-index: 10040;
		background: rgba(255, 255, 255, 0.96);
		box-shadow: 0 14px 36px rgba(12, 18, 11, 0.13);
	}

	.bohemcars-inventory-modal-focus-controls {
		display: grid;
		width: 100%;
		align-items: center;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 14px;
	}

	.bohemcars-inventory-modal-focus-controls__lead {
		display: inline-flex;
		min-height: 46px;
		align-items: center;
		gap: 10px;
		border-radius: 7px;
		background: #d9fb5a;
		padding: 0 18px;
		color: #14210f;
		font-size: 15px;
		font-weight: 750;
		line-height: 1;
		white-space: nowrap;
	}

	.bohemcars-inventory-modal-focus-controls__lead img {
		width: 16px;
		height: 16px;
	}

	.bohemcars-inventory-modal-focus-controls__tabs {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 6px;
		overflow-x: auto;
		border: 1px solid #e2e8d8;
		border-radius: 999px;
		background: #f5f8ef;
		padding: 4px;
		scrollbar-width: none;
	}

	.bohemcars-inventory-modal-focus-controls__tabs::-webkit-scrollbar {
		display: none;
	}

	.bohemcars-inventory-modal-focus-controls__tab {
		display: inline-flex;
		min-height: 36px;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		gap: 6px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		padding: 0 14px;
		color: #3f4738;
		font: inherit;
		font-size: 13px;
		font-weight: 750;
		line-height: 1;
		cursor: pointer;
		transition:
			background-color 0.14s ease,
			color 0.14s ease;
		white-space: nowrap;
	}

	.bohemcars-inventory-modal-focus-controls__tab:hover {
		background: #e9f0dc;
		color: #1c1c1c;
	}

	.bohemcars-inventory-modal-focus-controls__tab--active {
		background: #d9fb5a;
		color: #14210f;
	}

	.bohemcars-inventory-modal-focus-controls__tab--selected:not(
		.bohemcars-inventory-modal-focus-controls__tab--active
	) {
		background: #ffffff;
		color: #1c1c1c;
	}

	.bohemcars-inventory-modal-focus-controls__tab small {
		display: inline-grid;
		min-width: 18px;
		height: 18px;
		place-items: center;
		border-radius: 999px;
		background: rgba(20, 33, 15, 0.1);
		color: inherit;
		font-size: 11px;
		font-weight: 800;
		line-height: 1;
	}

	.bohemcars-inventory-filter-panel {
		position: relative;
		z-index: 5;
		display: grid;
		gap: 16px;
		margin: 8px 0 0;
		--bc-popover-surface: #f5f7f0;
		--bc-popover-chip-bg: #f5f8ef;
		--bc-popover-chip-hover: #eef5df;
		--bc-popover-chip-border-hover: #d3e0c3;
		--bc-popover-accent-soft: #eaf7cc;
		--bc-filter-panel-border: #e5eadf;
		--bc-filter-panel-shadow:
			0 18px 42px rgba(16, 22, 14, 0.16), 0 0 0 1px rgba(255, 255, 255, 0.7) inset;
		--bc-filter-modal-border: #edf1e8;
		--bc-filter-modal-shadow: 0 26px 72px rgba(10, 15, 20, 0.34);
		--bc-filter-backdrop: rgba(13, 19, 26, 0.52);
		border: 1px solid #e8ecdf;
		border-radius: 12px;
		background: #ffffff;
		padding: 16px;
		box-shadow: none;
	}

	.bohemcars-inventory-filter-panel:has(:global(.ifp--modal.ifp--open)) {
		z-index: 10020;
	}

	.bohemcars-inventory-toolbar-row {
		display: flex;
		flex: 1 1 540px;
		min-width: 0;
		align-items: center;
		gap: 14px;
		justify-content: space-between;
	}

	.bohemcars-inventory-result-count {
		flex: 0 1 auto;
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
		flex: 0 0 auto;
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

	.bohemcars-inventory-demo-strip .bohemcars-inventory-sort__label {
		display: none;
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
		flex: 0 1 auto;
		align-items: center;
		justify-content: flex-end;
		gap: 10px;
		flex-wrap: wrap;
		justify-self: end;
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
		background: #e9f0dc !important;
		color: #1c1c1c !important;
	}

	.bohemcars-view-toggle :global(.item-menu.active),
	.bohemcars-inventory-layout-toggle.active,
	.bohemcars-inventory-filter-mode-toggle__item.active {
		background: #d9fb5a !important;
		color: #14210f !important;
	}

	.bohemcars-inventory-layout-toggle {
		padding: 0 15px;
	}

	.bohemcars-inventory-filter-mode-toggle__item {
		padding: 0 13px;
	}

	:global(body.auxero-template-listing-grid3-columns-html)
		.bohemcars-inventory-demo-strip
		.bohemcars-inventory-toolbar-row,
	:global(body.auxero-template-listing-grid4-columns-html)
		.bohemcars-inventory-demo-strip
		.bohemcars-inventory-toolbar-row,
	:global(body.auxero-template-listing-gridstyle-halfmap-html)
		.bohemcars-inventory-demo-strip
		.bohemcars-inventory-toolbar-row {
		display: flex !important;
		flex: 1 1 540px !important;
		width: 100% !important;
		align-items: center !important;
		justify-content: space-between !important;
		gap: 14px !important;
		grid-template-columns: none !important;
		margin: 0 !important;
		background: transparent !important;
	}

	:global(body.auxero-template-listing-grid3-columns-html)
		.bohemcars-inventory-demo-strip
		.bohemcars-inventory-result-count,
	:global(body.auxero-template-listing-grid4-columns-html)
		.bohemcars-inventory-demo-strip
		.bohemcars-inventory-result-count,
	:global(body.auxero-template-listing-gridstyle-halfmap-html)
		.bohemcars-inventory-demo-strip
		.bohemcars-inventory-result-count {
		display: flex !important;
		align-items: center !important;
		gap: 14px !important;
	}

	:global(body.auxero-template-listing-grid3-columns-html)
		.bohemcars-inventory-demo-strip
		.bohemcars-inventory-toolbar-row
		.core-dropdown,
	:global(body.auxero-template-listing-grid4-columns-html)
		.bohemcars-inventory-demo-strip
		.bohemcars-inventory-toolbar-row
		.core-dropdown,
	:global(body.auxero-template-listing-gridstyle-halfmap-html)
		.bohemcars-inventory-demo-strip
		.bohemcars-inventory-toolbar-row
		.core-dropdown {
		width: auto !important;
		min-width: 178px !important;
	}

	:global(body.bohemcars-inventory-template)
		.bohemcars-inventory-demo-strip
		.bohemcars-inventory-filter-mode-toggle__item.active,
	:global(body.bohemcars-inventory-template)
		.bohemcars-inventory-demo-strip
		.bohemcars-inventory-layout-toggle.active,
	:global(body.bohemcars-inventory-template)
		.bohemcars-inventory-demo-strip
		.bohemcars-view-toggle
		:global(.item-menu.active) {
		background: #d9fb5a !important;
		color: #14210f !important;
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

	.bohemcars-inventory-filter-grid
		:global(.ifp:nth-child(4n + 3) .ifp__panel:not(.ifp__panel--modal)),
	.bohemcars-inventory-filter-grid :global(.ifp:nth-child(4n) .ifp__panel:not(.ifp__panel--modal)) {
		right: 0;
		left: auto;
	}

	.bohemcars-inventory-filter-panel :global(.ifp__field) {
		border-color: #edf2e6;
		background: #f5f8ef;
	}

	.bohemcars-inventory-filter-panel :global(.ifp__field:hover) {
		border-color: #d3dfc5;
		background: #eef5df;
	}

	.bohemcars-inventory-filter-panel :global(.ifp--open .ifp__field) {
		border-color: #98bc2a;
		background: #eef7d7;
		box-shadow: 0 0 0 2px rgba(156, 196, 39, 0.14);
	}

	.bohemcars-inventory-filter-panel :global(.ifp__label) {
		color: #687064;
	}

	.bohemcars-inventory-filter-panel :global(.ifp__chev) {
		color: #1c1c1c;
	}

	.bohemcars-inventory-filter-panel :global(.ifp__panel) {
		border-color: #e3e9dc;
		border-radius: 12px;
		background: #ffffff;
		padding: 13px;
		box-shadow:
			0 18px 42px rgba(16, 22, 14, 0.14),
			0 0 0 1px rgba(255, 255, 255, 0.82) inset;
	}

	.bohemcars-inventory-filter-panel :global(.ifp__panel--modal) {
		right: 0;
		left: 0;
		background: #ffffff;
		padding: 16px;
	}

	.bohemcars-inventory-filter-panel :global(.ifp__chip),
	.bohemcars-inventory-filter-panel :global(.ifp__row) {
		border-width: 1px;
		border-color: #edf2e6;
		background: #f5f8ef;
	}

	.bohemcars-inventory-filter-panel :global(.ifp__chip:hover),
	.bohemcars-inventory-filter-panel :global(.ifp__row:hover) {
		border-color: #d3dfc5;
		background: #eef5df;
	}

	.bohemcars-inventory-filter-panel
		:global(.ifp__chip:not(.ifp__chip--all):has(.ifp__input:checked)),
	.bohemcars-inventory-filter-panel :global(.ifp__row:has(.ifp__input:checked)) {
		border-color: #98bc2a;
		background: #eaf7cc;
	}

	.bohemcars-inventory-filter-panel :global(.ifp__chip--all:has(.ifp__input:checked)) {
		border-color: #98bc2a;
		background: #eaf7cc;
	}

	.bohemcars-inventory-dashboard-sidebar {
		z-index: 15;
		background: #ffffff;
	}

	:global(body.bohemcars-inventory-template) .bohemcars-inventory-dashboard-sidebar {
		border: 1px solid var(--bc-border) !important;
		background: #ffffff !important;
		box-shadow: none !important;
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
		border: 1px solid #edf2e6;
		border-radius: 8px;
		background: #f5f8ef;
		padding: 10px 42px 10px 15px;
		box-shadow: none;
	}

	.bohemcars-inventory-sidebar-fields :global(.ifp__field:hover) {
		border-color: #d3dfc5;
		background: #eef5df;
	}

	.bohemcars-inventory-sidebar-fields :global(.ifp--open .ifp__field) {
		border-color: #98bc2a;
		background: #eef7d7;
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
		border-color: #e3e9dc;
		border-radius: 10px;
		background: #ffffff;
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
		border-color: #edf2e6;
		background: #f5f8ef;
	}

	.bohemcars-inventory-sidebar-fields :global(.ifp__chip) {
		min-height: 68px;
		border-color: #edf2e6;
		background: #f5f8ef;
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

	.bohemcars-inventory-banner__buybox .bohemcars-inventory-filter-panel {
		margin-top: 0;
	}

	@media (max-width: 1199px) {
		.bohemcars-inventory-demo-strip {
			grid-template-columns: 1fr;
			width: min(100%, calc(100vw - 32px));
		}

		.bohemcars-inventory-toolbar-row,
		.bohemcars-inventory-view-controls {
			flex: 1 1 100%;
			justify-content: flex-start;
			flex-wrap: wrap;
			justify-self: start;
		}

		.bohemcars-inventory-filter-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.bohemcars-inventory-modal-focus-controls {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 767.98px) {
		.bohemcars-inventory-demo-strip,
		.bohemcars-inventory-filter-panel {
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
