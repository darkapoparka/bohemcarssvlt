<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { Check, Plus, Repeat2, Search, X } from '@lucide/svelte';
	import type { AuxeroCompareRow, AuxeroCompareVehicle } from '$lib/auxero/compare';
	import {
		compareBrandOptions,
		compareRowGroups,
		compareRowsFromVehicles,
		compareRowValuesForSlots,
		filterCompareDrawerVehicles
	} from '$lib/auxero/compare';
	import type { Locale } from '$lib/i18n/messages';
	import { bohemcarsAssets } from '$lib/data/bohemcars';
	import { getGarageContext } from '$lib/state/garage.svelte';
	import {
		compactCompareSlotsFromSelection,
		compareLimit,
		type CompareSlotSlugs,
		normalizeCompareSlots,
		normalizeGarageSlugs,
		readGarageCompare,
		readGarageCompareSlots,
		writeGarageCompareSlots
	} from '$lib/state/garage-storage';
	import { onMount } from 'svelte';
	import { Drawer } from 'vaul-svelte';
	import AuxeroCompareVehicleImage from './AuxeroCompareVehicleImage.svelte';

	let {
		allVehicles,
		locale,
		useStoredSelection = true,
		vehicles
	}: {
		allVehicles: AuxeroCompareVehicle[];
		locale: Locale;
		useStoredSelection?: boolean;
		vehicles: AuxeroCompareVehicle[];
	} = $props();

	const garage = getGarageContext();
	let selectedSlugsOverride = $state<string[] | undefined>();
	let slotSlugsOverride = $state<CompareSlotSlugs | undefined>();
	const selectedSlugs = $derived(
		selectedSlugsOverride ?? vehicles.map((vehicle) => vehicle.slug).slice(0, compareLimit)
	);
	const slotSlugs = $derived(
		slotSlugsOverride ?? [vehicles[0]?.slug ?? null, vehicles[1]?.slug ?? null]
	);
	let addDrawerOpen = $state(false);
	let drawerSlotIndex = $state<0 | 1 | null>(null);
	let addDrawerQuery = $state('');
	let addDrawerBrand = $state('');
	let selectionTouched = $state(false);
	let compareReady = $state(false);
	let desktopPickerOpen = $state(false);
	let desktopReplaceSlug = $state<string | null>(null);

	const removeLabel = $derived(locale === 'bg' ? 'Премахни' : 'Remove');
	const addLabel = $derived(locale === 'bg' ? 'Добави автомобил' : 'Add vehicle');
	const changeLabel = $derived(locale === 'bg' ? 'Смени' : 'Change');
	const clearLabel = $derived(locale === 'bg' ? 'Изчисти' : 'Clear');
	const addToSlotLabel = $derived(locale === 'bg' ? 'Избери автомобил' : 'Choose vehicle');
	const allBrandsLabel = $derived(locale === 'bg' ? 'Всички' : 'All');
	const drawerKicker = $derived(locale === 'bg' ? 'Модели и марки' : 'Makes and models');
	const drawerSearchLabel = $derived(locale === 'bg' ? 'Търси автомобил' : 'Search vehicle');
	const drawerSearchPlaceholder = $derived(
		locale === 'bg' ? 'Марка, модел, година...' : 'Make, model, year...'
	);
	const emptySlotLabel = $derived(locale === 'bg' ? 'Свободно място' : 'Empty slot');
	const emptyValue = $derived(locale === 'bg' ? 'Избери автомобил' : 'Choose vehicle');
	const noResultsLabel = $derived(
		locale === 'bg' ? 'Няма намерени автомобили' : 'No vehicles found'
	);
	const parameterLabel = $derived(locale === 'bg' ? 'Параметър' : 'Spec');
	const selectedLabel = $derived(locale === 'bg' ? 'Избрана' : 'Selected');
	const matrixLabel = $derived(locale === 'bg' ? 'Всички избрани' : 'All selected');
	const pairLabel = $derived(locale === 'bg' ? 'Двойка за сравнение' : 'Comparison pair');
	const desktopManagerLabel = $derived(
		locale === 'bg' ? 'Управление на сравнението' : 'Compare manager'
	);
	const desktopManagerHint = $derived(
		locale === 'bg'
			? 'Добавяй, сменяй и премахвай автомобили без да напускаш таблицата.'
			: 'Add, swap, and remove vehicles without leaving the table.'
	);
	const desktopPickerTitle = $derived(
		desktopReplaceSlug ? (locale === 'bg' ? 'Смени автомобил' : 'Change vehicle') : addLabel
	);
	const desktopPickerDescription = $derived(
		locale === 'bg'
			? `Избери до ${compareLimit} автомобила за сравнение от наличните модели.`
			: `Choose up to ${compareLimit} vehicles from available inventory.`
	);
	const desktopLimitLabel = $derived(
		locale === 'bg' ? `до ${compareLimit} автомобила` : `up to ${compareLimit} vehicles`
	);
	const vehicleBySlug = $derived(
		Object.fromEntries(allVehicles.map((vehicle) => [vehicle.slug, vehicle])) as Record<
			string,
			AuxeroCompareVehicle | undefined
		>
	);
	const selectedVehicles = $derived(
		selectedSlugs
			.map((slug) => vehicleBySlug[slug])
			.filter((vehicle): vehicle is AuxeroCompareVehicle => Boolean(vehicle))
	);
	const selectedRows = $derived(compareRowsFromVehicles(selectedVehicles, locale));
	const detailsLabel = $derived(locale === 'bg' ? 'Виж детайли' : 'View details');
	const priceRowLabel = $derived(locale === 'bg' ? 'Цена' : 'Price');
	const desktopSpecRows = $derived(
		selectedRows.filter(
			(row) => row.icon !== 'Payment.png' && row.icon !== 'VIN.svg' && row.icon !== 'QrCode.svg'
		)
	);
	const priceRow = $derived(selectedRows.find((row) => row.icon === 'Payment.png'));
	const priceBestIndexes = $derived(priceRow?.bestIndexes ?? []);
	const bestPriceBadge = $derived(priceRow?.badge ?? '');
	const emptyTitle = $derived(
		locale === 'bg' ? 'Все още няма избрани автомобили' : 'No vehicles selected yet'
	);
	const emptyHint = $derived(
		locale === 'bg'
			? `Добави до ${compareLimit} автомобила, за да ги сравниш един до друг.`
			: `Add up to ${compareLimit} vehicles to compare side by side.`
	);
	const compareCountLabel = $derived(
		locale === 'bg'
			? `${selectedVehicles.length} ${selectedVehicles.length === 1 ? 'автомобил' : 'автомобила'}`
			: `${selectedVehicles.length} ${selectedVehicles.length === 1 ? 'vehicle' : 'vehicles'}`
	);
	const uniformLegendLabel = $derived(
		locale === 'bg' ? 'Еднаквите параметри са в сиво.' : 'Matching specs are dimmed.'
	);
	const fullGroups = $derived(compareRowGroups(selectedRows, locale, false));
	const desktopVehicleColumnWidth = $derived(`${82 / Math.max(selectedVehicles.length, 1)}%`);
	const mobileMatrixVehicleCount = $derived(Math.max(selectedVehicles.length, 1));
	const slotVehicles = $derived(
		slotSlugs.map((slug) => (slug ? (vehicleBySlug[slug] ?? null) : null))
	);
	const slotCompareVehicles = $derived(
		slotVehicles.filter((vehicle): vehicle is AuxeroCompareVehicle => Boolean(vehicle))
	);
	const pairMetaLabel = $derived(
		locale === 'bg'
			? `${slotCompareVehicles.length}/2 · ${selectedSlugs.length} избрани`
			: `${slotCompareVehicles.length}/2 · ${selectedSlugs.length} selected`
	);
	const slotRows = $derived(compareRowsFromVehicles(slotCompareVehicles, locale));
	const slotGroups = $derived(compareRowGroups(slotRows, locale, true));
	const availableBrands = $derived(compareBrandOptions(allVehicles, locale));
	const visibleDrawerVehicles = $derived(
		filterCompareDrawerVehicles({
			brand: addDrawerBrand,
			locale,
			query: addDrawerQuery,
			selectedSlugs,
			vehicles: allVehicles
		})
	);

	const normalizeSlugs = (slugs: (string | null | undefined)[]) =>
		normalizeGarageSlugs(slugs, (slug) => Boolean(vehicleBySlug[slug]));
	const readStoredCompare = () => {
		if (!browser || !useStoredSelection) return [];

		return readGarageCompare(localStorage);
	};
	const readStoredCompareSlots = (cleanSlugs: string[]) => {
		if (!browser || !useStoredSelection) return undefined;

		return readGarageCompareSlots(localStorage, cleanSlugs);
	};
	const writeStoredCompareSlots = (cleanSlugs: string[], slots: CompareSlotSlugs) => {
		if (!browser || !useStoredSelection) return;

		writeGarageCompareSlots(localStorage, cleanSlugs, slots);
	};
	const setLocalSelection = (
		slugs: (string | null | undefined)[],
		nextSlots?: CompareSlotSlugs
	) => {
		const cleanSlugs = normalizeSlugs(slugs);
		selectedSlugsOverride = cleanSlugs;
		slotSlugsOverride = nextSlots
			? normalizeCompareSlots(nextSlots, cleanSlugs)
			: compactCompareSlotsFromSelection(cleanSlugs);
	};
	const commitSelection = (slugs: (string | null | undefined)[], nextSlots?: CompareSlotSlugs) => {
		const cleanSlugs = normalizeSlugs(slugs);
		const preservedSlots = normalizeCompareSlots(nextSlots ?? slotSlugs, cleanSlugs);
		const slotsForSelection =
			preservedSlots.some((slug) => slug) || !cleanSlugs.length
				? preservedSlots
				: compactCompareSlotsFromSelection(cleanSlugs);

		selectionTouched = true;
		setLocalSelection(cleanSlugs, slotsForSelection);
		garage.setCompare(cleanSlugs);
		writeStoredCompareSlots(cleanSlugs, slotsForSelection);

		if (browser) {
			window.dispatchEvent(
				new CustomEvent('bohemcars:compare-updated', {
					detail: { compare: cleanSlugs, slots: slotsForSelection }
				})
			);
		}
	};
	const openAddDrawer = (slotIndex: 0 | 1 | null = null) => {
		drawerSlotIndex = slotIndex;
		addDrawerQuery = '';
		addDrawerOpen = true;
	};
	const openDesktopPicker = (replaceSlug: string | null = null) => {
		desktopReplaceSlug = replaceSlug;
		drawerSlotIndex = null;
		addDrawerQuery = '';
		addDrawerBrand = '';
		desktopPickerOpen = true;
	};
	const closeDesktopPicker = () => {
		desktopPickerOpen = false;
		desktopReplaceSlug = null;
	};
	const openTopAddDrawer = () => {
		if (!slotSlugs[0]) {
			openAddDrawer(0);
			return;
		}

		if (!slotSlugs[1]) {
			openAddDrawer(1);
			return;
		}

		openAddDrawer(null);
	};
	const chooseVehicle = (slug: string) => {
		const currentWithoutChosen = selectedSlugs.filter((item) => item !== slug);
		let nextSlots: CompareSlotSlugs = [slotSlugs[0], slotSlugs[1]];
		let nextSlugs: (string | null | undefined)[];

		if (drawerSlotIndex !== null) {
			nextSlots[drawerSlotIndex] = slug;
			nextSlugs = [
				nextSlots[0],
				nextSlots[1],
				...currentWithoutChosen.filter((item) => item !== nextSlots[0] && item !== nextSlots[1])
			];
		} else if (!slotSlugs[0] || !slotSlugs[1]) {
			const emptyIndex = !slotSlugs[0] ? 0 : 1;
			nextSlots[emptyIndex] = slug;
			nextSlugs = [
				nextSlots[0],
				nextSlots[1],
				...currentWithoutChosen.filter((item) => item !== nextSlots[0] && item !== nextSlots[1])
			];
		} else {
			nextSlugs = [slug, ...currentWithoutChosen];
			nextSlots = compactCompareSlotsFromSelection(normalizeSlugs(nextSlugs));
		}

		commitSelection(nextSlugs, nextSlots);
		addDrawerOpen = false;
	};
	const chooseDesktopVehicle = (slug: string) => {
		if (desktopReplaceSlug) {
			const nextSlugs = selectedSlugs.map((item) => (item === desktopReplaceSlug ? slug : item));
			const nextSlots: CompareSlotSlugs = [
				slotSlugs[0] === desktopReplaceSlug ? slug : slotSlugs[0],
				slotSlugs[1] === desktopReplaceSlug ? slug : slotSlugs[1]
			];
			commitSelection(nextSlugs, nextSlots);
			closeDesktopPicker();
			return;
		}

		chooseVehicle(slug);
		closeDesktopPicker();
	};
	const removeSlotVehicle = (index: 0 | 1) => {
		const slug = slotSlugs[index];
		if (!slug) return;

		const nextSlots: CompareSlotSlugs = [slotSlugs[0], slotSlugs[1]];
		nextSlots[index] = null;
		commitSelection(
			selectedSlugs.filter((item) => item !== slug),
			nextSlots
		);
	};
	const removeDesktopVehicle = (event: MouseEvent, slug: string) => {
		event.preventDefault();
		event.stopPropagation();
		commitSelection(selectedSlugs.filter((item) => item !== slug));
	};
	const clearDesktopSelection = () => {
		commitSelection([]);
	};
	const openDesktopPickerFromEvent = () => {
		openDesktopPicker();
	};
	const handleDesktopKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && desktopPickerOpen) {
			closeDesktopPicker();
		}
	};
	const drawerButtonDisabled = (slug: string) =>
		drawerSlotIndex === null &&
		selectedSlugs.includes(slug) &&
		selectedSlugs.length >= compareLimit;
	const desktopPickerActionLabel = (slug: string) => {
		if (desktopReplaceSlug) return changeLabel;

		return selectedSlugs.includes(slug) ? selectedLabel : addLabel;
	};
	const rowValuesForSlots = (row: AuxeroCompareRow) =>
		compareRowValuesForSlots(row, slotSlugs, emptyValue);

	onMount(() => {
		if (browser) {
			window.addEventListener('bohemcars:compare-open-picker', openDesktopPickerFromEvent);
		}

		if (!selectionTouched) {
			const stored = readStoredCompare();
			const cleanSlugs = normalizeSlugs(
				stored.length ? stored : vehicles.map((vehicle) => vehicle.slug)
			);
			setLocalSelection(
				cleanSlugs,
				readStoredCompareSlots(cleanSlugs) ?? compactCompareSlotsFromSelection(cleanSlugs)
			);
		}

		compareReady = true;

		return () => {
			if (browser) {
				window.removeEventListener('bohemcars:compare-open-picker', openDesktopPickerFromEvent);
			}
		};
	});
</script>

<svelte:window onkeydown={handleDesktopKeydown} />

<div
	class="bohemcars-compare-mobile"
	aria-label={locale === 'bg' ? 'Мобилно сравнение' : 'Mobile compare'}
>
	<header class="bohemcars-compare-mobile__appbar">
		<a class="bohemcars-compare-mobile__brand" href={resolve('/')} aria-label="Bohemcars начало">
			<img src={bohemcarsAssets.logoLight} alt="Bohemcars" width="1285" height="235" />
		</a>
		<button
			class="bohemcars-compare-mobile__appbar-add"
			type="button"
			aria-label={addLabel}
			onclick={openTopAddDrawer}
		>
			<Plus size={20} strokeWidth={2.4} aria-hidden="true" />
		</button>
	</header>

	<section class="bohemcars-compare-mobile__pair" aria-label={pairLabel}>
		<header class="bohemcars-compare-mobile__pair-head">
			<div>
				<p>{pairLabel}</p>
				<strong>{pairMetaLabel}</strong>
			</div>
			<button type="button" onclick={openTopAddDrawer}>
				<Plus size={17} strokeWidth={2.4} aria-hidden="true" />
				{addLabel}
			</button>
		</header>

		<div class="bohemcars-compare-mobile__selected-cars">
			{#each [0, 1] as slotIndex (`slot-${slotIndex}`)}
				{@const vehicle = slotVehicles[slotIndex]}
				{#if vehicle}
					<div class="bohemcars-compare-mobile__selected-card">
						<span>{slotIndex === 0 ? 'A' : 'B'}</span>
						<button
							class="bohemcars-compare-mobile__remove"
							type="button"
							aria-label={`${removeLabel} ${vehicle.title}`}
							title={`${removeLabel} ${vehicle.title}`}
							onclick={() => removeSlotVehicle(slotIndex === 0 ? 0 : 1)}
						>
							<X size={16} strokeWidth={2.35} aria-hidden="true" />
						</button>
						<a
							class="bohemcars-compare-mobile__image"
							href={resolve('/inventory/[slug]', { slug: vehicle.slug })}
						>
							<AuxeroCompareVehicleImage src={vehicle.image} title={vehicle.title} />
						</a>
						<p class="bohemcars-compare-mobile__mini-title">
							<a href={resolve('/inventory/[slug]', { slug: vehicle.slug })}>
								{vehicle.title}
							</a>
						</p>
						<strong>{vehicle.priceLabel}</strong>
					</div>
				{:else}
					<button
						type="button"
						class="bohemcars-compare-mobile__selected-card bohemcars-compare-mobile__add-card"
						aria-label={`${addToSlotLabel} ${slotIndex === 0 ? 'A' : 'B'}`}
						onclick={() => openAddDrawer(slotIndex === 0 ? 0 : 1)}
					>
						<span>{slotIndex === 0 ? 'A' : 'B'}</span>
						<strong aria-hidden="true">
							<Plus size={31} strokeWidth={2.1} />
						</strong>
						<em>{emptySlotLabel}</em>
						<small>{addLabel}</small>
					</button>
				{/if}
			{/each}
		</div>

		{#if selectedVehicles.length > 2}
			<div class="bohemcars-compare-mobile__selected-rail" aria-label={matrixLabel}>
				{#each selectedVehicles as vehicle (vehicle.slug)}
					<button
						type="button"
						class:active={slotSlugs.includes(vehicle.slug)}
						aria-pressed={slotSlugs.includes(vehicle.slug)}
						onclick={() => chooseVehicle(vehicle.slug)}
					>
						<span>{vehicle.brand}</span>
						<strong>{vehicle.model}</strong>
					</button>
				{/each}
			</div>
		{/if}

		<div class="bohemcars-compare-mobile__pair-table">
			{#if slotGroups.length}
				{#each slotGroups as group (group.title)}
					<details class="bohemcars-compare-mobile__pair-group" open={group.open}>
						<summary>
							<span>{group.title}</span>
							<b>{group.rows.length}</b>
						</summary>
						{#each group.rows as row (row.label)}
							<div class="bohemcars-compare-mobile__pair-row">
								<div class="bohemcars-compare-mobile__pair-label">
									{#if row.icon !== 'Payment.png'}
										<img src={`/assets/icons/${row.icon}`} alt={row.alt} />
									{/if}
									<span>{row.label}</span>
								</div>
								{#each rowValuesForSlots(row) as value, valueIndex (`mobile-pair-${row.label}-${valueIndex}`)}
									<div class="bohemcars-compare-mobile__pair-value">{value}</div>
								{/each}
							</div>
						{/each}
					</details>
				{/each}
			{:else}
				<div class="bohemcars-compare-mobile__empty">
					<strong>{locale === 'bg' ? 'Избери два автомобила' : 'Choose two vehicles'}</strong>
					<button type="button" onclick={() => openAddDrawer(0)}>
						<Plus size={18} strokeWidth={2.4} aria-hidden="true" />
						{addLabel}
					</button>
				</div>
			{/if}
		</div>
	</section>

	<!-- Collapsed by default: the pair table above already answers the page;
	     auto-opening this read as a duplicated comparison. -->
	<details class="bohemcars-compare-mobile__all">
		<summary>
			<span>{matrixLabel}</span>
			<b>{selectedVehicles.length}</b>
		</summary>
		<div
			class="bohemcars-compare-mobile__matrix"
			aria-label={matrixLabel}
			style:--vehicle-count={mobileMatrixVehicleCount}
		>
			<div class="bohemcars-compare-mobile__scroller">
				<div class="bohemcars-compare-mobile__head-row">
					<div class="bohemcars-compare-mobile__corner">{parameterLabel}</div>
					{#each selectedVehicles as vehicle (vehicle.slug)}
						<article class="bohemcars-compare-mobile__mini-car">
							<button
								class="bohemcars-compare-mobile__remove"
								type="button"
								aria-label={`${removeLabel} ${vehicle.title}`}
								title={`${removeLabel} ${vehicle.title}`}
								onclick={() =>
									commitSelection(selectedSlugs.filter((item) => item !== vehicle.slug))}
							>
								<X size={14} strokeWidth={2.35} aria-hidden="true" />
							</button>
							<a
								class="bohemcars-compare-mobile__image"
								href={resolve('/inventory/[slug]', { slug: vehicle.slug })}
							>
								<AuxeroCompareVehicleImage src={vehicle.image} title={vehicle.title} />
							</a>
							<p class="bohemcars-compare-mobile__mini-title">
								<a href={resolve('/inventory/[slug]', { slug: vehicle.slug })}>{vehicle.title}</a>
							</p>
							<strong>{vehicle.priceLabel}</strong>
						</article>
					{/each}
				</div>

				{#each fullGroups as group (group.title)}
					<details class="bohemcars-compare-mobile__group" open={group.open}>
						<summary>
							<span>{group.title}</span>
							<b>{group.rows.length}</b>
						</summary>
						{#each group.rows as row (row.label)}
							<div class="bohemcars-compare-mobile__row">
								<div class="bohemcars-compare-mobile__label">
									{#if row.icon !== 'Payment.png'}
										<img src={`/assets/icons/${row.icon}`} alt={row.alt} />
									{/if}
									<span>{row.label}</span>
								</div>
								{#each row.values as value, index (`mobile-row-${row.label}-${selectedVehicles[index]?.slug ?? index}`)}
									<div class="bohemcars-compare-mobile__value">{value}</div>
								{/each}
							</div>
						{/each}
					</details>
				{/each}
			</div>
		</div>
	</details>

	<Drawer.Root bind:open={addDrawerOpen} direction="bottom" fixed={true}>
		<Drawer.Overlay class="bohemcars-compare-mobile-drawer__backdrop">
			<span>{locale === 'bg' ? 'Затвори' : 'Close'}</span>
		</Drawer.Overlay>
		<Drawer.Content class="bohemcars-compare-mobile-drawer__sheet">
			<Drawer.Handle class="bohemcars-compare-mobile-drawer__handle" />
			<header>
				<div>
					<p>{drawerKicker}</p>
					<Drawer.Title>
						<span>{drawerSlotIndex === null ? addLabel : addToSlotLabel}</span>
					</Drawer.Title>
				</div>
				<button
					type="button"
					aria-label={locale === 'bg' ? 'Затвори' : 'Close'}
					onclick={() => (addDrawerOpen = false)}
				>
					<X size={21} strokeWidth={2.35} aria-hidden="true" />
				</button>
			</header>
			<Drawer.Description class="bohemcars-compare-mobile-drawer__description">
				{locale === 'bg'
					? 'Избери автомобил от наличните модели на Bohemcars.'
					: 'Choose from available Bohemcars models.'}
			</Drawer.Description>

			<label class="bohemcars-compare-mobile-drawer__search" data-vaul-no-drag>
				<Search size={18} strokeWidth={2.25} aria-hidden="true" />
				<span>{drawerSearchLabel}</span>
				<input bind:value={addDrawerQuery} type="search" placeholder={drawerSearchPlaceholder} />
			</label>

			<div
				class="bohemcars-compare-mobile-drawer__brands"
				aria-label={drawerKicker}
				data-vaul-no-drag
			>
				<button
					type="button"
					class:active={!addDrawerBrand}
					aria-pressed={!addDrawerBrand}
					onclick={() => (addDrawerBrand = '')}
				>
					{allBrandsLabel}
				</button>
				{#each availableBrands as option (option.brand)}
					<button
						type="button"
						class:active={addDrawerBrand === option.brand}
						aria-pressed={addDrawerBrand === option.brand}
						onclick={() => (addDrawerBrand = option.brand)}
					>
						{option.brand}
						<small>{option.count}</small>
					</button>
				{/each}
			</div>

			<div class="bohemcars-compare-mobile-drawer__list" data-vaul-no-drag>
				{#if visibleDrawerVehicles.length}
					{#each visibleDrawerVehicles as vehicle (vehicle.slug)}
						<button
							type="button"
							class:active={selectedSlugs.includes(vehicle.slug)}
							aria-pressed={selectedSlugs.includes(vehicle.slug)}
							disabled={drawerButtonDisabled(vehicle.slug)}
							onclick={() => chooseVehicle(vehicle.slug)}
						>
							<img src={vehicle.image} alt="" loading="lazy" />
							<span>
								<small>{vehicle.brand} · {vehicle.year}</small>
								<strong>{vehicle.title}</strong>
								<em>{vehicle.priceLabel}</em>
							</span>
							{#if selectedSlugs.includes(vehicle.slug)}
								<b>
									<Check size={16} strokeWidth={2.6} aria-hidden="true" />
									{selectedLabel}
								</b>
							{:else}
								<b>{addLabel}</b>
							{/if}
						</button>
					{/each}
				{:else}
					<p class="bohemcars-compare-mobile-drawer__empty">{noResultsLabel}</p>
				{/if}
			</div>
		</Drawer.Content>
	</Drawer.Root>
</div>

<section class="bohemcars-compare-manager" aria-label={desktopManagerLabel}>
	<div class="bohemcars-compare-manager__copy">
		<p>{desktopManagerLabel}</p>
		<strong>{compareCountLabel}</strong>
		<span>{desktopManagerHint}</span>
	</div>
	<div class="bohemcars-compare-manager__actions">
		<span>{desktopLimitLabel}</span>
		<button
			type="button"
			class="bohemcars-compare-manager__secondary"
			disabled={selectedVehicles.length === 0}
				onclick={clearDesktopSelection}
		>
			{clearLabel}
		</button>
		<button
			type="button"
			class="bohemcars-compare-manager__primary"
			onclick={() => openDesktopPicker()}
		>
			<Plus size={17} strokeWidth={2.4} aria-hidden="true" />
			{addLabel}
		</button>
	</div>
</section>

<div
	class="bohemcars-compare-scroll"
	data-bohemcars-compare-ready={compareReady ? 'true' : undefined}
>
	{#if selectedVehicles.length === 0}
		<div class="bohemcars-compare-empty">
			<span class="bohemcars-compare-empty__icon" aria-hidden="true">
				<Plus size={26} strokeWidth={2.2} />
			</span>
			<strong>{emptyTitle}</strong>
			<span class="bohemcars-compare-empty__hint">{emptyHint}</span>
			<button type="button" class="bohemcars-compare-empty__cta" onclick={() => openDesktopPicker()}>
				<Plus size={17} strokeWidth={2.4} aria-hidden="true" />
				{addLabel}
			</button>
		</div>
	{:else}
	<table
		class="card-details--table bohemcars-compare-table"
		data-bohemcars-compare-table
		data-bohemcars-svelte-compare-table
	>
		<colgroup>
			<col class="bohemcars-compare-table__spec-col" style="width: 18%" />
			{#each selectedVehicles as vehicle (vehicle.slug)}
				<col class="bohemcars-compare-table__vehicle-col" style:width={desktopVehicleColumnWidth} />
			{/each}
		</colgroup>
		<tbody>
			<tr class="bohemcars-compare-headrow">
				<td>
					<div class="bohemcars-compare-corner">
						<strong>{compareCountLabel}</strong>
						<span>{uniformLegendLabel}</span>
					</div>
				</td>
				{#each selectedVehicles as vehicle (vehicle.slug)}
					<td data-bohemcars-compare-column={vehicle.slug}>
						<div class="top bohemcars-compare-car relative">
							<button
								class="compare-item-remove-table bohemcars-compare-car__remove"
								type="button"
								data-bohemcars-compare-remove={vehicle.slug}
								data-bohemcars-svelte-compare-remove
								aria-label={`${removeLabel} ${vehicle.title}`}
								title={`${removeLabel} ${vehicle.title}`}
								onclick={(event) => removeDesktopVehicle(event, vehicle.slug)}
							>
								<img src="/assets/icons/close-modal.svg" alt="" aria-hidden="true" />
							</button>
							<button
								class={[
									'bohemcars-compare-car__media',
									vehicle.image.includes('cutout') && 'bohemcars-compare-car__media--cutout'
								]}
								type="button"
								aria-label={`${changeLabel} ${vehicle.title}`}
								title={`${changeLabel} ${vehicle.title}`}
								onclick={() => openDesktopPicker(vehicle.slug)}
							>
								<AuxeroCompareVehicleImage src={vehicle.image} title={vehicle.title} />
								<span class="bohemcars-compare-car__swap-overlay" aria-hidden="true">
									<span class="bohemcars-compare-car__swap-icon">
										<Repeat2 size={22} strokeWidth={2.4} />
									</span>
									<span class="bohemcars-compare-car__swap-text">{changeLabel}</span>
								</span>
							</button>
							<p class="bohemcars-compare-car__brand text-center">{vehicle.brand}</p>
							<p class="h4 bohemcars-compare-car__title text-center">
								<a href={resolve('/inventory/[slug]', { slug: vehicle.slug })}>{vehicle.title}</a>
							</p>
							<button
								class="bohemcars-compare-car__swap"
								type="button"
								aria-label={`${changeLabel} ${vehicle.title}`}
								onclick={() => openDesktopPicker(vehicle.slug)}
							>
								<Repeat2 size={14} strokeWidth={2.5} aria-hidden="true" />
								<span>{changeLabel}</span>
							</button>
						</div>
					</td>
				{/each}
			</tr>
			{#each desktopSpecRows as row (row.label)}
				{@const allSame = selectedVehicles.length > 1 && new Set(row.values).size === 1}
				<tr class:bohemcars-compare-row--uniform={allSame}>
					<td>
						<div class="bohemcars-compare-rowlabel flex items-center gap-8">
							<img src={`/assets/icons/${row.icon}`} alt={row.alt} />
							<span>{row.label}</span>
						</div>
					</td>
					{#each row.values as value, index (`${row.label}-${selectedVehicles[index]?.slug ?? index}`)}
						{@const isBest = (row.bestIndexes ?? []).includes(index)}
						<td class:bohemcars-compare-cell--best={isBest}>
							<div class="bohemcars-compare-cell">
								<span class="bohemcars-compare-cell__value">{value}</span>
								{#if isBest && row.badge}
									<span class="bohemcars-compare-cell__badge">{row.badge}</span>
								{/if}
							</div>
						</td>
					{/each}
				</tr>
			{/each}
			<tr class="bohemcars-compare-row--price">
				<td>
					<div class="bohemcars-compare-rowlabel flex items-center gap-8">
						<span>{priceRowLabel}</span>
					</div>
				</td>
				{#each selectedVehicles as vehicle, index (`price-${vehicle.slug}`)}
					{@const isBestPrice = priceBestIndexes.includes(index)}
					<td class:bohemcars-compare-cell--best={isBestPrice}>
						<div class="bohemcars-compare-verdict">
							{#if isBestPrice && bestPriceBadge}
								<span class="bohemcars-compare-verdict__chip">{bestPriceBadge}</span>
							{/if}
							<strong>{vehicle.priceLabel}</strong>
							<a
								class="bohemcars-compare-verdict__btn"
								href={resolve('/inventory/[slug]', { slug: vehicle.slug })}
							>
								<span>{detailsLabel}</span>
								<span class="bohemcars-compare-verdict__arrow" aria-hidden="true">→</span>
							</a>
						</div>
					</td>
				{/each}
			</tr>
		</tbody>
	</table>
	{/if}
</div>

{#if desktopPickerOpen}
	<div
		class="bohemcars-compare-desktop-picker"
		role="dialog"
		aria-modal="true"
		aria-labelledby="bohemcars-compare-desktop-picker-title"
	>
		<button
			class="bohemcars-compare-desktop-picker__backdrop"
			type="button"
			aria-label={locale === 'bg' ? 'Затвори' : 'Close'}
			onclick={closeDesktopPicker}
		></button>
		<section class="bohemcars-compare-desktop-picker__panel">
			<header class="bohemcars-compare-desktop-picker__head">
				<div>
					<p>{drawerKicker}</p>
					<h2 id="bohemcars-compare-desktop-picker-title">{desktopPickerTitle}</h2>
					<span>{desktopPickerDescription}</span>
				</div>
				<button
					type="button"
					class="bohemcars-compare-desktop-picker__close"
					aria-label={locale === 'bg' ? 'Затвори' : 'Close'}
					onclick={closeDesktopPicker}
				>
					<X size={20} strokeWidth={2.35} aria-hidden="true" />
				</button>
			</header>

			<div class="bohemcars-compare-desktop-picker__tools">
				<label class="bohemcars-compare-desktop-picker__search">
					<Search size={18} strokeWidth={2.25} aria-hidden="true" />
					<span>{drawerSearchLabel}</span>
					<input bind:value={addDrawerQuery} type="search" placeholder={drawerSearchPlaceholder} />
				</label>

				<div class="bohemcars-compare-desktop-picker__brands" aria-label={drawerKicker}>
					<button
						type="button"
						class:active={!addDrawerBrand}
						aria-pressed={!addDrawerBrand}
						onclick={() => (addDrawerBrand = '')}
					>
						{allBrandsLabel}
					</button>
					{#each availableBrands as option (option.brand)}
						<button
							type="button"
							class:active={addDrawerBrand === option.brand}
							aria-pressed={addDrawerBrand === option.brand}
							onclick={() => (addDrawerBrand = option.brand)}
						>
							{option.brand}
							<small>{option.count}</small>
						</button>
					{/each}
				</div>
			</div>

			<div class="bohemcars-compare-desktop-picker__list">
				{#if visibleDrawerVehicles.length}
					{#each visibleDrawerVehicles as vehicle (vehicle.slug)}
						<button
							type="button"
							class:active={selectedSlugs.includes(vehicle.slug)}
							aria-pressed={selectedSlugs.includes(vehicle.slug)}
							onclick={() => chooseDesktopVehicle(vehicle.slug)}
						>
							<img src={vehicle.image} alt="" loading="lazy" />
							<span>
								<small>{vehicle.brand} · {vehicle.year}</small>
								<strong>{vehicle.title}</strong>
								<em>{vehicle.priceLabel}</em>
							</span>
							<b>
								{#if selectedSlugs.includes(vehicle.slug)}
									<Check size={16} strokeWidth={2.6} aria-hidden="true" />
								{/if}
								{desktopPickerActionLabel(vehicle.slug)}
							</b>
						</button>
					{/each}
				{:else}
					<p class="bohemcars-compare-desktop-picker__empty">{noResultsLabel}</p>
				{/if}
			</div>
		</section>
	</div>
{/if}

<style>
	.bohemcars-compare-scroll {
		width: 100%;
	}

	.bohemcars-compare-manager {
		display: none;
	}

	.bohemcars-compare-mobile {
		display: none;
	}

	/* Desktop: the Auxero template hard-codes the column image to a fixed 350px,
	   so 3–4 cars push the table past the viewport and the outer cars — plus the
	   row-label column — get clipped at the edges. Share the available width across
	   the columns and let each car image scale down with its column, so every car
	   and the labels stay on screen together. */
	@media (min-width: 768px) {
		/* The Auxero card-details wrapper forces min-width: 1000px and the table
		   itself min-width: max-content, so 3–4 cars overflow the content column
		   and clip. Let both shrink to the container. */
		:global(.auxero-template-compare-html .card-details) {
			min-width: 0;
			overflow: visible;
		}

		.bohemcars-compare-manager {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 20px;
			margin-bottom: 14px;
			border: 1px solid #dfe6d8;
			border-radius: 8px;
			background: #ffffff;
			padding: 14px 16px;
		}

		.bohemcars-compare-manager__copy {
			display: grid;
			min-width: 0;
			gap: 2px;
		}

		.bohemcars-compare-manager__copy p,
		.bohemcars-compare-manager__copy strong,
		.bohemcars-compare-manager__copy span {
			margin: 0;
		}

		.bohemcars-compare-manager__copy p {
			color: #6d7680;
			font-size: 12px;
			font-weight: 800;
			line-height: 16px;
			text-transform: uppercase;
		}

		.bohemcars-compare-manager__copy strong {
			color: #14210f;
			font-size: 18px;
			font-weight: 700;
			line-height: 24px;
		}

		.bohemcars-compare-manager__copy span {
			color: #79836f;
			font-size: 13px;
			font-weight: 500;
			line-height: 18px;
		}

		.bohemcars-compare-manager__actions {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			gap: 10px;
			flex: 0 0 auto;
		}

		.bohemcars-compare-manager__actions > span {
			color: #79836f;
			font-size: 13px;
			font-weight: 700;
			line-height: 18px;
			white-space: nowrap;
		}

		.bohemcars-compare-manager__primary,
		.bohemcars-compare-manager__secondary {
			display: inline-flex;
			min-height: 40px;
			align-items: center;
			justify-content: center;
			gap: 7px;
			border-radius: 6px;
			cursor: pointer;
			padding: 0 14px;
			font-size: 13px;
			font-weight: 700;
			line-height: 18px;
			transition:
				background-color 0.18s ease,
				border-color 0.18s ease,
				color 0.18s ease;
		}

		.bohemcars-compare-manager__primary {
			border: 1px solid #98bc2a;
			background: #98bc2a;
			color: #14210f;
		}

		.bohemcars-compare-manager__primary :global(svg),
		.bohemcars-compare-manager__primary :global(svg *) {
			color: inherit;
			stroke: currentcolor;
		}

		.bohemcars-compare-manager__primary:hover,
		.bohemcars-compare-manager__primary:focus-visible {
			border-color: #14210f !important;
			background: #14210f !important;
			color: #ffffff !important;
			outline: 0;
		}

		.bohemcars-compare-manager__secondary:disabled {
			cursor: default;
			opacity: 0.45;
		}

		.bohemcars-compare-manager__secondary {
			border: 1px solid #dfe6d8;
			background: #ffffff;
			color: #303a2b;
		}

		.bohemcars-compare-manager__secondary:hover,
		.bohemcars-compare-manager__secondary:focus-visible {
			border-color: #eef3e9;
			background: #eef3e9;
			color: #14210f;
			outline: 0;
		}

		.bohemcars-compare-desktop-picker {
			position: fixed;
			inset: 0;
			z-index: 1300;
			display: grid;
			place-items: center;
			padding: 32px;
		}

		.bohemcars-compare-desktop-picker__backdrop {
			position: absolute;
			inset: 0;
			border: 0;
			background: rgb(17 17 17 / 0.42);
			cursor: pointer;
			padding: 0;
		}

		.bohemcars-compare-desktop-picker__panel {
			position: relative;
			z-index: 1;
			display: grid;
			grid-template-rows: max-content max-content minmax(0, 1fr);
			width: min(980px, 100%);
			max-height: min(760px, calc(100vh - 64px));
			overflow: hidden;
			border: 1px solid #dfe6d8;
			border-radius: 8px;
			background: #f7f8f4;
			box-shadow: 0 24px 70px rgb(17 24 18 / 0.22);
		}

		.bohemcars-compare-desktop-picker__head {
			display: flex;
			align-items: start;
			justify-content: space-between;
			gap: 20px;
			border-bottom: 1px solid #dfe6d8;
			background: #ffffff;
			padding: 20px 20px 18px;
		}

		.bohemcars-compare-desktop-picker__head div {
			min-width: 0;
		}

		.bohemcars-compare-desktop-picker__head p,
		.bohemcars-compare-desktop-picker__head h2,
		.bohemcars-compare-desktop-picker__head span {
			margin: 0;
		}

		.bohemcars-compare-desktop-picker__head p {
			color: #6d7680;
			font-size: 12px;
			font-weight: 800;
			line-height: 16px;
			text-transform: uppercase;
		}

		.bohemcars-compare-desktop-picker__head h2 {
			color: #14210f;
			font-size: 24px;
			font-weight: 700;
			line-height: 30px;
		}

		.bohemcars-compare-desktop-picker__head span {
			display: block;
			margin-top: 4px;
			color: #79836f;
			font-size: 14px;
			font-weight: 500;
			line-height: 20px;
		}

		.bohemcars-compare-desktop-picker__close {
			display: inline-flex;
			width: 40px;
			height: 40px;
			align-items: center;
			justify-content: center;
			flex: 0 0 40px;
			border: 1px solid #dfe6d8;
			border-radius: 50%;
			background: #ffffff;
			color: #14210f;
			cursor: pointer;
			padding: 0;
		}

		.bohemcars-compare-desktop-picker__close:hover,
		.bohemcars-compare-desktop-picker__close:focus-visible {
			background: #eef3e9;
			outline: 0;
		}

		.bohemcars-compare-desktop-picker__tools {
			display: grid;
			gap: 12px;
			border-bottom: 1px solid #dfe6d8;
			background: #f7f8f4;
			padding: 14px 20px;
		}

		.bohemcars-compare-desktop-picker__search {
			display: flex;
			min-height: 46px;
			align-items: center;
			gap: 10px;
			border: 1px solid #dfe6d8;
			border-radius: 999px;
			background: #ffffff;
			color: #14210f;
			padding: 0 14px;
		}

		.bohemcars-compare-desktop-picker__search span {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
		}

		.bohemcars-compare-desktop-picker__search input {
			width: 100%;
			min-width: 0;
			height: 44px;
			border: 0 !important;
			background: transparent !important;
			color: #14210f;
			font-size: 15px;
			font-weight: 700;
			line-height: 20px;
			outline: 0;
			padding: 0 !important;
		}

		.bohemcars-compare-desktop-picker__brands {
			display: flex;
			gap: 8px;
			overflow-x: auto;
			padding-bottom: 1px;
			scrollbar-width: thin;
		}

		.bohemcars-compare-desktop-picker__brands button {
			display: inline-flex;
			min-height: 36px;
			align-items: center;
			gap: 7px;
			flex: 0 0 auto;
			border: 0;
			border-radius: 999px;
			background: #ffffff;
			color: #14210f;
			cursor: pointer;
			padding: 0 12px;
			font-size: 13px;
			font-weight: 700;
			line-height: 17px;
			white-space: nowrap;
		}

		.bohemcars-compare-desktop-picker__brands button.active,
		.bohemcars-compare-desktop-picker__brands button:hover,
		.bohemcars-compare-desktop-picker__brands button:focus-visible {
			background: #eef3e9;
			outline: 0;
		}

		.bohemcars-compare-desktop-picker__brands small {
			display: inline-flex;
			min-width: 20px;
			height: 20px;
			align-items: center;
			justify-content: center;
			border-radius: 999px;
			background: rgb(20 33 15 / 0.08);
			font-size: 11px;
			font-weight: 800;
			line-height: 20px;
		}

		.bohemcars-compare-desktop-picker__list {
			display: grid;
			align-content: start;
			gap: 8px;
			min-height: 0;
			overflow-y: auto;
			padding: 14px 20px 20px;
		}

		.bohemcars-compare-desktop-picker__list > button {
			display: grid;
			grid-template-columns: 124px minmax(0, 1fr) auto;
			align-items: center;
			gap: 14px;
			min-height: 98px;
			border: 1px solid transparent;
			border-radius: 8px;
			background: #ffffff;
			color: #14210f;
			cursor: pointer;
			padding: 10px;
			text-align: left;
		}

		.bohemcars-compare-desktop-picker__list > button:hover,
		.bohemcars-compare-desktop-picker__list > button:focus-visible {
			border-color: #dfe6d8;
			background: #eef3e9;
			outline: 0;
		}

		.bohemcars-compare-desktop-picker__list > button.active {
			border-color: #dfe6d8;
			background: #f4f8e9;
		}

		.bohemcars-compare-desktop-picker__list > button:disabled {
			cursor: default;
			opacity: 0.68;
		}

		.bohemcars-compare-desktop-picker__list img {
			display: block;
			width: 124px;
			height: 76px;
			border-radius: 8px;
			background: #f4f5f2;
			object-fit: contain;
		}

		.bohemcars-compare-desktop-picker__list span {
			display: grid;
			min-width: 0;
			gap: 2px;
		}

		.bohemcars-compare-desktop-picker__list small,
		.bohemcars-compare-desktop-picker__list strong,
		.bohemcars-compare-desktop-picker__list em {
			display: block;
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.bohemcars-compare-desktop-picker__list small {
			color: #6d7680;
			font-size: 12px;
			font-weight: 800;
			line-height: 16px;
			text-transform: uppercase;
		}

		.bohemcars-compare-desktop-picker__list strong {
			color: #14210f;
			font-size: 16px;
			font-weight: 700;
			line-height: 22px;
		}

		.bohemcars-compare-desktop-picker__list em {
			color: #3a540e;
			font-size: 14px;
			font-style: normal;
			font-weight: 700;
			line-height: 18px;
		}

		.bohemcars-compare-desktop-picker__list b {
			display: inline-flex;
			min-height: 34px;
			align-items: center;
			justify-content: center;
			gap: 6px;
			border-radius: 999px;
			background: #eef3e9;
			color: #14210f;
			padding: 0 12px;
			font-size: 12px;
			font-weight: 800;
			line-height: 16px;
			white-space: nowrap;
		}

		.bohemcars-compare-desktop-picker__empty {
			margin: 0;
			border-radius: 8px;
			background: #ffffff;
			color: #79836f;
			padding: 18px;
			font-size: 14px;
			font-weight: 700;
			line-height: 20px;
		}

		:global(.bohemcars-compare-table.card-details--table) {
			width: 100% !important;
			min-width: 0 !important;
			table-layout: fixed !important;
		}

		.bohemcars-compare-table__spec-col {
			width: 18%;
		}

		.bohemcars-compare-table__vehicle-col {
			width: auto;
		}

		:global(.bohemcars-compare-table td:first-child) {
			width: 18% !important;
			min-width: 210px !important;
			max-width: 270px !important;
		}

		:global(.bohemcars-compare-table td:not(:first-child)) {
			min-width: 0 !important;
		}

		:global(.bohemcars-compare-table .top) {
			display: block;
			width: 100%;
		}

		:global(.bohemcars-compare-table .top p),
		:global(.bohemcars-compare-table .top p a) {
			white-space: normal;
			overflow-wrap: anywhere;
		}

		.bohemcars-compare-scroll {
			border: 1px solid #dfe6d8;
			border-radius: 8px;
			background: #ffffff;
			box-shadow: 0 1px 2px rgba(17, 24, 18, 0.03);
			overflow: hidden;
		}

		.bohemcars-compare-table td {
			border: 0 !important;
			border-bottom: 1px solid #e7ece3 !important;
			vertical-align: middle !important;
			padding: 13px 16px !important;
		}

		.bohemcars-compare-table td + td {
			border-left: 1px solid #eef2ea !important;
			text-align: center;
		}

		.bohemcars-compare-table tr:last-child td {
			border-bottom: 0 !important;
		}

		.bohemcars-compare-table tr:not(.bohemcars-compare-headrow) td:first-child {
			background: #ffffff !important;
		}

		.bohemcars-compare-rowlabel span {
			color: #303a2b;
			font-size: 14px;
			font-weight: 600;
			line-height: 20px;
		}

		.bohemcars-compare-rowlabel img {
			width: 18px;
			height: 18px;
			flex: 0 0 auto;
			opacity: 0.72;
		}

		.bohemcars-compare-table tr:not(.bohemcars-compare-headrow):hover td {
			background: #ffffff;
		}

		/* Rows where every car reads the same carry no comparison signal —
		   keep them legible but quiet so the differing rows pop. */
		.bohemcars-compare-row--uniform td + td {
			color: #79836f;
		}

		.bohemcars-compare-row--price td {
			background: #ffffff !important;
			border-top: 0 !important;
			padding: 14px 16px !important;
		}

		.bohemcars-compare-row--price td:first-child {
			background: #ffffff !important;
		}

		.bohemcars-compare-row--price .bohemcars-compare-rowlabel span {
			color: #17201a;
			font-size: 15px;
			font-weight: 700;
		}

		.bohemcars-compare-verdict {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 9px;
			min-height: 44px;
		}

		.bohemcars-compare-verdict strong {
			color: #111111;
			font-size: 20px;
			font-weight: 700;
			line-height: 26px;
			white-space: nowrap;
		}

		.bohemcars-compare-verdict__btn {
			display: inline-flex;
			min-height: 40px;
			align-items: center;
			justify-content: center;
			gap: 6px;
			border: 1px solid #98bc2a !important;
			border-radius: 8px;
			background: #98bc2a !important;
			color: #14210f !important;
			font-size: 14px;
			font-weight: 700;
			line-height: 18px;
			padding: 0 18px;
			text-decoration: none !important;
			white-space: nowrap;
			transition:
				background-color 0.2s ease,
				border-color 0.2s ease,
				color 0.2s ease;
		}

		/* The global `* { color: #1c1c1c }` paints the spans, and a theme rule pins
		   the link bg — force both states with !important so the label never goes
		   invisible (white-on-green) on hover. */
		.bohemcars-compare-verdict__btn span {
			color: #14210f !important;
		}

		.bohemcars-compare-verdict__btn:hover,
		.bohemcars-compare-verdict__btn:focus-visible {
			border-color: #14210f !important;
			background: #14210f !important;
			color: #ffffff !important;
		}

		.bohemcars-compare-verdict__btn:hover span,
		.bohemcars-compare-verdict__btn:focus-visible span {
			color: #ffffff !important;
		}

		.bohemcars-compare-verdict__arrow {
			font-size: 17px;
			font-weight: 700;
			line-height: 1;
		}

		/* Winner highlighting: the cell holding the best value for a comparable
		   row (lowest price/km, newest year) gets a soft green tint + pill so the
		   table answers "which is the better buy?" at a glance. */
		.bohemcars-compare-cell {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 3px;
		}

		.bohemcars-compare-cell__value {
			display: block;
		}

		.bohemcars-compare-cell__badge,
		.bohemcars-compare-verdict__chip {
			display: inline-block;
			border-radius: 999px;
			background: #98bc2a;
			color: #14210f;
			font-size: 10px;
			font-weight: 800;
			letter-spacing: 0.04em;
			line-height: 14px;
			padding: 2px 9px;
			text-transform: uppercase;
		}

		.bohemcars-compare-table td.bohemcars-compare-cell--best,
		.bohemcars-compare-row--price td.bohemcars-compare-cell--best {
			background: #f4f8e9 !important;
		}

		.bohemcars-compare-empty {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 10px;
			min-height: 280px;
			padding: 48px 24px;
			text-align: center;
		}

		.bohemcars-compare-empty__icon {
			display: inline-flex;
			width: 56px;
			height: 56px;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			background: #f4f8e9;
			color: #3a540e;
		}

		.bohemcars-compare-empty__icon :global(svg),
		.bohemcars-compare-empty__icon :global(svg *) {
			color: inherit;
			stroke: currentcolor;
		}

		.bohemcars-compare-empty strong {
			color: #14210f;
			font-size: 19px;
			font-weight: 700;
			line-height: 26px;
		}

		.bohemcars-compare-empty__hint {
			max-width: 360px;
			color: #79836f;
			font-size: 14px;
			font-weight: 500;
			line-height: 20px;
		}

		.bohemcars-compare-empty__cta {
			display: inline-flex;
			min-height: 44px;
			align-items: center;
			justify-content: center;
			gap: 8px;
			margin-top: 6px;
			border: 1px solid #98bc2a;
			border-radius: 8px;
			background: #98bc2a;
			color: #14210f;
			cursor: pointer;
			padding: 0 18px;
			font-size: 14px;
			font-weight: 700;
			line-height: 18px;
			transition:
				background-color 0.18s ease,
				border-color 0.18s ease,
				color 0.18s ease;
		}

		.bohemcars-compare-empty__cta :global(svg),
		.bohemcars-compare-empty__cta :global(svg *) {
			color: inherit;
			stroke: currentcolor;
		}

		.bohemcars-compare-empty__cta:hover,
		.bohemcars-compare-empty__cta:focus-visible {
			border-color: #14210f;
			background: #14210f;
			color: #ffffff;
			outline: 0;
		}

		/* Car header cells: framed media boxes so cutouts and photos present
		   identically, aligned titles, price as the headline figure. */
		.bohemcars-compare-headrow td {
			border-bottom: 1px solid var(--bc-border) !important;
			vertical-align: bottom !important;
			padding: 20px 16px 16px !important;
		}

		.bohemcars-compare-car__media {
			position: relative;
			display: flex;
			width: 100%;
			align-items: center;
			justify-content: center;
			aspect-ratio: 16 / 9;
			border: 1px solid var(--bc-border);
			border-radius: 8px;
			background: var(--bc-card-media, #f4f5f2);
			cursor: pointer;
			overflow: hidden;
			padding: 0;
			transition:
				background-color 0.2s ease,
				border-color 0.18s ease;
		}

		.bohemcars-compare-car__media:hover,
		.bohemcars-compare-car__media:focus-visible {
			border-color: #98bc2a;
			outline: 0;
		}

		/* Hover/focus the image to swap the car for another from the picker. */
		.bohemcars-compare-car__swap-overlay {
			position: absolute;
			inset: 0;
			z-index: 2;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 8px;
			background: rgb(20 33 15 / 0.58);
			opacity: 0;
			pointer-events: none;
			transition: opacity 0.18s ease;
		}

		.bohemcars-compare-car__media:hover .bohemcars-compare-car__swap-overlay,
		.bohemcars-compare-car__media:focus-visible .bohemcars-compare-car__swap-overlay {
			opacity: 1;
		}

		.bohemcars-compare-car__swap-icon {
			display: inline-flex;
			width: 46px;
			height: 46px;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			background: #98bc2a;
			color: #14210f;
		}

		.bohemcars-compare-car__swap-icon :global(svg),
		.bohemcars-compare-car__swap-icon :global(svg *) {
			color: inherit;
			stroke: currentcolor;
		}

		.bohemcars-compare-car__swap-text {
			color: #ffffff !important;
			font-size: 12px;
			font-weight: 800;
			letter-spacing: 0.06em;
			line-height: 16px;
			text-transform: uppercase;
		}

		/* Listing photos fill the frame edge-to-edge; curated cutouts float on
		   the soft surface with breathing room. Same box either way. */
		.bohemcars-compare-car__media :global(.image) {
			width: 100% !important;
			max-width: none !important;
			height: 100% !important;
			margin: 0 !important;
			object-fit: cover;
		}

		.bohemcars-compare-car__media--cutout {
			padding: 10px 14px;
		}

		.bohemcars-compare-car__media--cutout :global(.image) {
			object-fit: contain;
		}

		.bohemcars-compare-car:hover .bohemcars-compare-car__media--cutout {
			background: #ffffff;
		}

		.bohemcars-compare-corner {
			display: flex;
			flex-direction: column;
			gap: 6px;
		}

		.bohemcars-compare-corner strong {
			color: #14210f;
			font-size: 15px;
			font-weight: 700;
			line-height: 20px;
		}

		.bohemcars-compare-corner span {
			color: #79836f;
			font-size: 13px;
			line-height: 18px;
		}

		.bohemcars-compare-car__brand {
			display: block;
			width: fit-content;
			margin: 14px auto 0;
			border-radius: 999px;
			background: #f4f8e9;
			color: #3a540e;
			font-size: 11px;
			font-weight: 800;
			letter-spacing: 0.07em;
			line-height: 16px;
			padding: 3px 11px;
			text-transform: uppercase;
		}

		.bohemcars-compare-car__title {
			display: -webkit-box;
			min-height: 48px;
			margin: 2px 0 0;
			overflow: hidden;
			font-size: 17px;
			font-weight: 600;
			line-height: 24px;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
		}

		.bohemcars-compare-car__title a {
			color: #14210f;
		}

		.bohemcars-compare-car__title a:hover,
		.bohemcars-compare-car__title a:focus-visible {
			color: #3a540e;
		}

		.bohemcars-compare-car__swap {
			display: flex;
			width: fit-content;
			align-items: center;
			justify-content: center;
			gap: 6px;
			margin: 12px auto 0;
			border: 1px solid #dfe6d8;
			border-radius: 999px;
			background: #ffffff;
			color: #303a2b;
			cursor: pointer;
			padding: 6px 14px;
			font-size: 12px;
			font-weight: 700;
			line-height: 16px;
			transition:
				background-color 0.18s ease,
				border-color 0.18s ease,
				color 0.18s ease;
		}

		.bohemcars-compare-car__swap span {
			color: inherit;
		}

		.bohemcars-compare-car__swap :global(svg),
		.bohemcars-compare-car__swap :global(svg *) {
			color: inherit;
			stroke: currentcolor;
		}

		.bohemcars-compare-car__swap:hover,
		.bohemcars-compare-car__swap:focus-visible {
			border-color: #98bc2a;
			background: #eef3e9;
			color: #14210f;
			outline: 0;
		}

		.bohemcars-compare-car__remove {
			position: absolute;
			top: 8px;
			right: 8px;
			z-index: 10;
			display: inline-flex;
			width: 30px;
			height: 30px;
			align-items: center;
			justify-content: center;
			border: 1px solid var(--bc-border);
			border-radius: 50%;
			background: #ffffff;
			cursor: pointer;
			padding: 0;
			transition:
				background-color 0.2s ease,
				border-color 0.2s ease;
		}

		/* The template's cell-image rule (meant for the car photo) also hits this
		   icon and stretches it to 230px tall — pin it down. */
		.bohemcars-compare-car__remove img {
			width: 14px !important;
			height: 14px !important;
			max-width: none !important;
			margin: 0 !important;
			aspect-ratio: auto !important;
			object-fit: contain !important;
		}

		.bohemcars-compare-car__remove:hover,
		.bohemcars-compare-car__remove:focus-visible {
			border-color: #1c1c1c;
			background: #1c1c1c;
		}

		.bohemcars-compare-car__remove:hover img,
		.bohemcars-compare-car__remove:focus-visible img {
			filter: brightness(0) invert(1);
		}
	}

	@media (max-width: 767.98px) {
		/* The Auxero card-details wrapper hard-codes min-width: 800px, which clips the
		   compare table on phones. Let it shrink so the table scrolls within the viewport. */
		:global(.auxero-template-compare-html .card-details) {
			min-width: 0;
			overflow: visible;
		}

		.bohemcars-compare-scroll {
			display: none;
		}

		.bohemcars-compare-mobile {
			display: grid;
			gap: 12px;
			min-width: 0;
			min-height: calc(100dvh - 70px - env(safe-area-inset-bottom));
			color: #111111;
			padding: 0 14px calc(18px + env(safe-area-inset-bottom));
		}

		/* Green chrome: same full-bleed brand-green appbar as the other flow
		   pages (white discs, dark ink) instead of a floating white card. */
		.bohemcars-compare-mobile__appbar {
			position: sticky;
			top: 0;
			z-index: 20;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			height: calc(56px + env(safe-area-inset-top));
			margin: 0 -14px;
			border: 0;
			border-radius: 0;
			background: #8fca1a;
			box-shadow: none;
			color: #14210f;
			padding: env(safe-area-inset-top) 12px 0 16px;
		}

		.bohemcars-compare-mobile__brand {
			display: flex;
			min-width: 0;
			align-items: center;
			text-decoration: none !important;
		}

		.bohemcars-compare-mobile__brand img {
			display: block;
			width: 196px;
			max-width: min(196px, calc(100vw - 32px));
			height: auto;
			object-fit: contain;
			filter: brightness(0);
		}

		.bohemcars-compare-mobile__appbar-add {
			display: flex;
			width: 40px;
			height: 40px;
			flex: 0 0 40px;
			margin-left: auto;
			align-items: center;
			justify-content: center;
			border: 0;
			border-radius: 999px;
			background: #ffffff;
			color: #14210f;
			cursor: pointer;
			padding: 0;
		}

		.bohemcars-compare-mobile__appbar-add:hover,
		.bohemcars-compare-mobile__appbar-add:focus-visible {
			background: #f0f6e2;
			outline: 0;
		}

		.bohemcars-compare-mobile__appbar-add :global(svg),
		.bohemcars-compare-mobile__appbar-add :global(svg *) {
			color: currentColor;
			stroke: currentColor;
		}

		.bohemcars-compare-mobile__pair {
			display: grid;
			gap: 10px;
			overflow: visible;
			border-radius: 0;
			background: transparent;
			padding: 0;
		}

		.bohemcars-compare-mobile__pair-head {
			display: flex;
			min-height: 38px;
			align-items: center;
			justify-content: space-between;
			gap: 10px;
			color: #111111;
		}

		.bohemcars-compare-mobile__pair-head p {
			margin: 0;
			color: var(--bc-accent);
			font-size: 11px;
			font-weight: 700;
			line-height: 14px;
			text-transform: uppercase;
		}

		.bohemcars-compare-mobile__pair-head strong {
			display: block;
			margin-top: 1px;
			color: #111111;
			font-size: 15px;
			font-weight: 700;
			line-height: 19px;
		}

		.bohemcars-compare-mobile__pair-head button {
			display: inline-flex;
			min-height: 38px;
			align-items: center;
			gap: 6px;
			border: 0;
			border-radius: 999px;
			background: var(--bc-accent-bright-soft);
			color: #111111;
			cursor: pointer;
			padding: 0 12px;
			font-size: 12px;
			font-weight: 700;
			line-height: 15px;
			white-space: nowrap;
		}

		.bohemcars-compare-mobile__selected-cars {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 8px;
		}

		.bohemcars-compare-mobile__selected-card {
			position: relative;
			display: grid;
			grid-template-rows: 18px 76px 38px 18px;
			min-width: 0;
			overflow: hidden;
			border: 1px solid var(--bc-border);
			border-radius: 8px;
			background: #ffffff;
			padding: 8px;
			text-align: left;
		}

		.bohemcars-compare-mobile__selected-card > span {
			width: fit-content;
			border-radius: 999px;
			background: var(--bc-accent-bright-soft);
			color: #111111;
			font-size: 12px;
			font-weight: 700;
			line-height: 16px;
			padding: 0 8px;
			text-transform: uppercase;
		}

		.bohemcars-compare-mobile__selected-card .bohemcars-compare-mobile__image,
		.bohemcars-compare-mobile__selected-card .bohemcars-compare-mobile__image :global(.image) {
			display: block;
			width: 100% !important;
			height: 76px !important;
			margin: 0 !important;
			object-fit: contain;
		}

		.bohemcars-compare-mobile__selected-card .bohemcars-compare-mobile__mini-title {
			color: #111111 !important;
			font-size: 14px !important;
			font-weight: 700 !important;
			line-height: 18px !important;
		}

		.bohemcars-compare-mobile__selected-card strong {
			color: var(--primary);
			font-size: 14px;
			font-weight: 700;
			line-height: 18px;
		}

		.bohemcars-compare-mobile__add-card {
			grid-template-rows: 18px minmax(44px, 1fr) auto auto;
			align-items: center;
			justify-items: start;
			border: 1px dashed #c5d7ad;
			background: #f5f9ee;
			color: #111111;
			cursor: pointer;
		}

		.bohemcars-compare-mobile__add-card:hover,
		.bohemcars-compare-mobile__add-card:focus-visible {
			background: var(--bc-accent-bright-soft);
			outline: 0;
		}

		.bohemcars-compare-mobile__add-card strong {
			display: flex;
			width: 56px;
			height: 56px;
			align-items: center;
			justify-content: center;
			justify-self: center;
			border-radius: 999px;
			background: #ffffff;
			color: #111111;
		}

		.bohemcars-compare-mobile__add-card em,
		.bohemcars-compare-mobile__add-card small {
			display: block;
			min-width: 0;
			max-width: 100%;
			overflow: hidden;
			color: inherit;
			font-style: normal;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.bohemcars-compare-mobile__add-card em {
			font-size: 14px;
			font-weight: 700;
			line-height: 18px;
		}

		.bohemcars-compare-mobile__add-card small {
			color: #5c653f;
			font-size: 12px;
			font-weight: 700;
			line-height: 16px;
		}

		.bohemcars-compare-mobile__pair-head button :global(svg),
		.bohemcars-compare-mobile__pair-head button :global(svg *),
		.bohemcars-compare-mobile__add-card :global(svg),
		.bohemcars-compare-mobile__add-card :global(svg *) {
			pointer-events: none;
		}

		.bohemcars-compare-mobile__selected-rail {
			display: flex;
			gap: 7px;
			margin: 0 -14px;
			overflow-x: auto;
			padding: 0 14px 1px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.bohemcars-compare-mobile__selected-rail::-webkit-scrollbar {
			display: none;
		}

		.bohemcars-compare-mobile__selected-rail button {
			display: grid;
			min-width: 108px;
			min-height: 46px;
			align-content: center;
			gap: 1px;
			border: 1px solid var(--bc-border);
			border-radius: 999px;
			background: #ffffff;
			color: #111111;
			cursor: pointer;
			padding: 6px 11px;
			text-align: left;
		}

		.bohemcars-compare-mobile__selected-rail button.active,
		.bohemcars-compare-mobile__selected-rail button:hover,
		.bohemcars-compare-mobile__selected-rail button:focus-visible {
			border-color: var(--bc-accent-bright-soft);
			background: var(--bc-accent-bright-soft);
			color: #111111;
			outline: 0;
		}

		.bohemcars-compare-mobile__selected-rail span,
		.bohemcars-compare-mobile__selected-rail strong {
			overflow: hidden;
			color: inherit;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.bohemcars-compare-mobile__selected-rail span {
			font-size: 10px;
			font-weight: 700;
			line-height: 12px;
			text-transform: uppercase;
			opacity: 0.7;
		}

		.bohemcars-compare-mobile__selected-rail strong {
			font-size: 13px;
			font-weight: 700;
			line-height: 16px;
		}

		.bohemcars-compare-mobile__pair-table {
			overflow: hidden;
			border: 1px solid #dfe6d6;
			border-radius: 8px;
			background: #ffffff;
		}

		.bohemcars-compare-mobile__empty {
			display: grid;
			justify-items: start;
			gap: 10px;
			background: #ffffff;
			padding: 16px;
		}

		.bohemcars-compare-mobile__empty strong {
			color: #111111;
			font-size: 16px;
			font-weight: 700;
			line-height: 20px;
		}

		.bohemcars-compare-mobile__empty button {
			display: inline-flex;
			min-height: 44px;
			align-items: center;
			gap: 7px;
			border: 0;
			border-radius: 8px;
			background: var(--bc-accent-bright-soft);
			color: #111111;
			cursor: pointer;
			padding: 0 13px;
			font-size: 14px;
			font-weight: 700;
			line-height: 18px;
		}

		.bohemcars-compare-mobile__pair-group {
			border-top: 1px solid #edf0e8;
		}

		.bohemcars-compare-mobile__pair-group:first-child {
			border-top: 0;
		}

		.bohemcars-compare-mobile__pair-group summary,
		.bohemcars-compare-mobile__all > summary {
			display: flex;
			min-height: 44px;
			align-items: center;
			gap: 8px;
			list-style: none;
			background: #eef3e9;
			color: #111111;
			cursor: pointer;
			padding: 0 10px;
		}

		.bohemcars-compare-mobile__pair-group summary::-webkit-details-marker,
		.bohemcars-compare-mobile__all > summary::-webkit-details-marker {
			display: none;
		}

		.bohemcars-compare-mobile__pair-group summary::after,
		.bohemcars-compare-mobile__all > summary::after {
			content: '+';
			margin-left: auto;
			color: #111111;
			font-size: 18px;
			font-weight: 500;
			line-height: 1;
		}

		.bohemcars-compare-mobile__pair-group[open] summary::after,
		.bohemcars-compare-mobile__all[open] > summary::after {
			content: '-';
		}

		.bohemcars-compare-mobile__pair-group summary span,
		.bohemcars-compare-mobile__all > summary span {
			font-size: 14px;
			font-weight: 700;
			line-height: 16px;
		}

		.bohemcars-compare-mobile__pair-group summary b,
		.bohemcars-compare-mobile__all > summary b {
			display: inline-flex;
			width: 22px;
			height: 22px;
			align-items: center;
			justify-content: center;
			border-radius: 999px;
			background: var(--bc-accent-bright-soft);
			color: #111111;
			font-size: 12px;
			font-weight: 700;
			line-height: 1;
		}

		.bohemcars-compare-mobile__pair-row {
			display: grid;
			grid-template-columns: 92px repeat(2, minmax(0, 1fr));
			min-height: 44px;
			border-top: 1px solid #edf0e8;
		}

		.bohemcars-compare-mobile__pair-label,
		.bohemcars-compare-mobile__pair-value {
			display: flex;
			align-items: center;
			min-width: 0;
			padding: 8px;
		}

		.bohemcars-compare-mobile__pair-label {
			gap: 6px;
			background: #f6f8f0;
			color: #111111;
		}

		.bohemcars-compare-mobile__pair-label img {
			width: 17px;
			height: 17px;
			object-fit: contain;
		}

		.bohemcars-compare-mobile__pair-label span {
			color: #3a3f36;
			font-size: 12px;
			font-weight: 600;
			line-height: 16px;
		}

		.bohemcars-compare-mobile__pair-value {
			border-left: 1px solid #edf0e8;
			background: #ffffff;
			color: #111111;
			font-size: 14px;
			font-weight: 600;
			line-height: 18px;
			overflow-wrap: anywhere;
		}

		.bohemcars-compare-mobile__all {
			overflow: hidden;
			border: 1px solid #dfe6d6;
			border-radius: 8px;
			background: #ffffff;
		}

		.bohemcars-compare-mobile__all > summary {
			min-height: 44px;
			background: #f6f8f0;
		}

		.bohemcars-compare-mobile__matrix {
			overflow: hidden;
			border: 0;
			border-radius: 0;
			background: #ffffff;
		}

		.bohemcars-compare-mobile__scroller {
			overflow-x: auto;
			scrollbar-width: thin;
			-webkit-overflow-scrolling: touch;
		}

		.bohemcars-compare-mobile__head-row,
		.bohemcars-compare-mobile__row {
			display: grid;
			grid-template-columns: 104px repeat(var(--vehicle-count), 132px);
			width: max-content;
			min-width: calc(104px + (var(--vehicle-count) * 132px));
		}

		/* Light header — dark vehicle cutouts disappear on a black strip. */
		.bohemcars-compare-mobile__head-row {
			position: sticky;
			top: 0;
			z-index: 3;
			border-bottom: 1px solid #e5eadb;
			background: #ffffff;
		}

		.bohemcars-compare-mobile__corner {
			position: sticky;
			left: 0;
			z-index: 5;
			display: flex;
			align-items: end;
			min-height: 118px;
			background: #f6f8f0;
			color: #3a3f36;
			font-size: 12px;
			font-weight: 600;
			line-height: 16px;
			letter-spacing: 0.04em;
			text-transform: uppercase;
			padding: 10px;
		}

		.bohemcars-compare-mobile__mini-car {
			position: relative;
			display: grid;
			grid-template-rows: 48px 32px 16px;
			gap: 5px;
			min-height: 118px;
			align-content: start;
			border-left: 1px solid #edf0e8;
			background: #ffffff;
			padding: 8px;
		}

		.bohemcars-compare-mobile__image,
		.bohemcars-compare-mobile__image :global(.image) {
			display: block;
			width: 84px !important;
			height: 48px !important;
			object-fit: contain;
		}

		.bohemcars-compare-mobile__mini-title {
			display: -webkit-box !important;
			margin: 0 !important;
			overflow: hidden !important;
			color: #111111 !important;
			font-size: 12px !important;
			font-weight: 700 !important;
			line-height: 16px !important;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			line-clamp: 2;
		}

		.bohemcars-compare-mobile__mini-title a {
			color: inherit !important;
			font: inherit !important;
		}

		.bohemcars-compare-mobile__mini-car strong {
			color: #3a540e;
			font-size: 12px;
			font-weight: 700;
			line-height: 16px;
		}

		.bohemcars-compare-mobile__remove {
			position: absolute;
			top: 6px;
			right: 6px;
			z-index: 2;
			display: flex;
			width: 36px;
			height: 36px;
			align-items: center;
			justify-content: center;
			border: 0;
			border-radius: 999px;
			background: var(--bc-surface-soft);
			cursor: pointer;
			padding: 0;
		}

		.bohemcars-compare-mobile__remove :global(svg) {
			color: #111111;
			stroke: #111111;
		}

		:global(.bohemcars-compare-mobile-drawer__backdrop) {
			position: fixed;
			inset: 0;
			z-index: 1200;
			border: 0;
			background: rgba(17, 17, 17, 0.38);
			cursor: pointer;
			padding: 0;
		}

		:global(.bohemcars-compare-mobile-drawer__backdrop span) {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
		}

		:global(.bohemcars-compare-mobile-drawer__sheet) {
			position: fixed;
			right: 0;
			/* vaul repositions the sheet itself when the mobile keyboard opens. */
			bottom: 0;
			left: 0;
			z-index: 1201;
			display: grid;
			grid-template-rows: max-content max-content max-content max-content minmax(0, 1fr);
			gap: 12px;
			height: min(88dvh, 740px);
			overflow: hidden;
			border-radius: 20px 20px 0 0;
			background: var(--bc-bg);
			outline: 0;
			padding: 10px 14px max(16px, env(safe-area-inset-bottom));
		}

		:global(.bohemcars-compare-mobile-drawer__handle) {
			position: relative;
			display: block;
			width: 56px;
			height: 22px;
			justify-self: center;
			border-radius: 0;
			background: transparent;
			opacity: 1;
		}

		:global(.bohemcars-compare-mobile-drawer__handle)::after {
			position: absolute;
			top: 50%;
			left: 50%;
			width: 42px;
			height: 4px;
			transform: translate(-50%, -50%);
			border-radius: 999px;
			background: var(--bc-border);
			content: '';
		}

		:global(.bohemcars-compare-mobile-drawer__sheet header) {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
		}

		:global(.bohemcars-compare-mobile-drawer__sheet header div) {
			min-width: 0;
		}

		:global(.bohemcars-compare-mobile-drawer__sheet header p) {
			margin: 0 0 2px;
			color: var(--bc-accent);
			font-size: 11px;
			font-weight: 700;
			line-height: 14px;
			text-transform: uppercase;
		}

		:global(.bohemcars-compare-mobile-drawer__sheet header span) {
			display: block;
			color: #111111;
			font-size: 21px;
			font-weight: 700;
			line-height: 26px;
		}

		:global(.bohemcars-compare-mobile-drawer__sheet header button) {
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

		:global(.bohemcars-compare-mobile-drawer__description) {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
		}

		:global(.bohemcars-compare-mobile-drawer__search) {
			display: flex;
			min-height: 50px;
			align-items: center;
			gap: 9px;
			border: 1px solid var(--bc-border);
			border-radius: 999px;
			background: #ffffff;
			padding: 0 13px;
			color: #111111;
		}

		:global(.bohemcars-compare-mobile-drawer__search span) {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
		}

		:global(.bohemcars-compare-mobile-drawer__search input) {
			width: 100%;
			min-width: 0;
			height: 48px;
			border: 0 !important;
			background: transparent !important;
			color: #111111;
			font-size: 16px;
			font-weight: 700;
			line-height: 22px;
			outline: 0;
			padding: 0 !important;
		}

		:global(.bohemcars-compare-mobile-drawer__brands) {
			display: flex;
			gap: 8px;
			margin: 0 -14px;
			overflow-x: auto;
			padding: 0 14px 2px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		:global(.bohemcars-compare-mobile-drawer__brands)::-webkit-scrollbar {
			display: none;
		}

		:global(.bohemcars-compare-mobile-drawer__brands button) {
			display: inline-flex;
			min-height: 40px;
			align-items: center;
			gap: 7px;
			flex: 0 0 auto;
			border: 0;
			border-radius: 999px;
			background: #ffffff;
			color: #111111;
			cursor: pointer;
			padding: 0 13px;
			font-size: 13px;
			font-weight: 700;
			line-height: 17px;
			white-space: nowrap;
		}

		:global(.bohemcars-compare-mobile-drawer__brands button.active),
		:global(.bohemcars-compare-mobile-drawer__brands button:hover),
		:global(.bohemcars-compare-mobile-drawer__brands button:focus-visible) {
			background: var(--bc-accent-bright-soft);
			outline: 0;
		}

		:global(.bohemcars-compare-mobile-drawer__brands small) {
			display: inline-flex;
			min-width: 21px;
			height: 21px;
			align-items: center;
			justify-content: center;
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.72);
			font-size: 11px;
			font-weight: 700;
			line-height: 21px;
		}

		:global(.bohemcars-compare-mobile-drawer__list) {
			display: grid;
			align-content: start;
			gap: 8px;
			min-height: 0;
			overflow-y: auto;
			padding-bottom: 2px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		:global(.bohemcars-compare-mobile-drawer__list)::-webkit-scrollbar {
			display: none;
		}

		:global(.bohemcars-compare-mobile-drawer__list > button) {
			display: grid;
			grid-template-columns: 92px minmax(0, 1fr) auto;
			align-items: center;
			gap: 10px;
			min-height: 88px;
			border: 0;
			border-radius: 8px;
			background: #ffffff;
			color: #111111;
			cursor: pointer;
			padding: 8px;
			text-align: left;
		}

		:global(.bohemcars-compare-mobile-drawer__list > button:hover),
		:global(.bohemcars-compare-mobile-drawer__list > button:focus-visible) {
			background: #eef3e9;
			outline: 0;
		}

		:global(.bohemcars-compare-mobile-drawer__list > button.active) {
			background: #f4f8e9;
		}

		:global(.bohemcars-compare-mobile-drawer__list > button:disabled) {
			cursor: default;
			opacity: 0.72;
		}

		:global(.bohemcars-compare-mobile-drawer__list img) {
			display: block;
			width: 92px;
			height: 70px;
			border-radius: 8px;
			background: var(--bc-surface);
			object-fit: contain;
		}

		:global(.bohemcars-compare-mobile-drawer__list span) {
			display: grid;
			min-width: 0;
			gap: 2px;
		}

		:global(.bohemcars-compare-mobile-drawer__list small),
		:global(.bohemcars-compare-mobile-drawer__list strong),
		:global(.bohemcars-compare-mobile-drawer__list em) {
			display: block;
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		:global(.bohemcars-compare-mobile-drawer__list small) {
			color: #6d7680;
			font-size: 11px;
			font-weight: 700;
			line-height: 14px;
			text-transform: uppercase;
		}

		:global(.bohemcars-compare-mobile-drawer__list strong) {
			color: #111111;
			font-size: 15px;
			font-weight: 700;
			line-height: 19px;
		}

		:global(.bohemcars-compare-mobile-drawer__list em) {
			color: var(--bc-accent);
			font-size: 13px;
			font-style: normal;
			font-weight: 700;
			line-height: 17px;
		}

		:global(.bohemcars-compare-mobile-drawer__list b) {
			display: inline-flex;
			min-height: 34px;
			align-items: center;
			justify-content: center;
			gap: 5px;
			border-radius: 999px;
			background: var(--bc-accent-bright-soft);
			color: #111111;
			padding: 0 10px;
			font-size: 12px;
			font-weight: 700;
			line-height: 15px;
			white-space: nowrap;
		}

		:global(.bohemcars-compare-mobile-drawer__list > button.active b) {
			background: #eef8ce;
			color: #111111;
		}

		:global(.bohemcars-compare-mobile-drawer__empty) {
			margin: 0;
			border-radius: 8px;
			background: #ffffff;
			color: #6d7680;
			padding: 16px;
			font-size: 14px;
			font-weight: 700;
			line-height: 18px;
		}

		@media (max-width: 374px) {
			.bohemcars-compare-mobile {
				padding-right: 12px;
				padding-left: 12px;
			}

			.bohemcars-compare-mobile__appbar {
				margin-right: -12px;
				margin-left: -12px;
				padding-right: 10px;
				padding-left: 12px;
			}

			.bohemcars-compare-mobile__brand img {
				width: 176px;
			}

			.bohemcars-compare-mobile__pair-head {
				align-items: start;
			}

			.bohemcars-compare-mobile__pair-head button {
				min-width: 40px;
				padding: 0 10px;
			}

			.bohemcars-compare-mobile__pair-head button {
				font-size: 0;
				gap: 0;
			}

			.bohemcars-compare-mobile__pair-head button :global(svg) {
				width: 18px;
				height: 18px;
			}

			.bohemcars-compare-mobile__selected-rail {
				margin-right: -12px;
				margin-left: -12px;
				padding-right: 12px;
				padding-left: 12px;
			}

			.bohemcars-compare-mobile__pair-row {
				grid-template-columns: 86px repeat(2, minmax(0, 1fr));
			}
		}

		.bohemcars-compare-mobile__group {
			width: max-content;
			min-width: calc(104px + (var(--vehicle-count) * 132px));
			border-top: 1px solid #e5eadb;
		}

		.bohemcars-compare-mobile__group summary {
			position: sticky;
			left: 0;
			z-index: 4;
			display: flex;
			width: 337px;
			max-width: calc(100vw - 48px);
			min-height: 44px;
			align-items: center;
			gap: 8px;
			list-style: none;
			background: #eef3e9;
			color: #111111;
			cursor: pointer;
			padding: 0 10px;
		}

		.bohemcars-compare-mobile__group summary::-webkit-details-marker {
			display: none;
		}

		.bohemcars-compare-mobile__group summary::after {
			content: '+';
			margin-left: auto;
			color: #111111;
			font-size: 18px;
			font-weight: 500;
			line-height: 1;
		}

		.bohemcars-compare-mobile__group[open] summary::after {
			content: '-';
		}

		.bohemcars-compare-mobile__group summary span {
			font-size: 14px;
			font-weight: 700;
			line-height: 16px;
		}

		.bohemcars-compare-mobile__group summary b {
			display: inline-flex;
			width: 22px;
			height: 22px;
			align-items: center;
			justify-content: center;
			border-radius: 999px;
			background: var(--bc-accent-bright-soft);
			color: #111111;
			font-size: 12px;
			font-weight: 700;
			line-height: 1;
		}

		.bohemcars-compare-mobile__row {
			min-height: 46px;
			border-top: 1px solid #edf0e8;
		}

		.bohemcars-compare-mobile__label,
		.bohemcars-compare-mobile__value {
			display: flex;
			align-items: center;
			min-width: 0;
			padding: 8px;
		}

		.bohemcars-compare-mobile__label {
			position: sticky;
			left: 0;
			z-index: 2;
			gap: 6px;
			background: #f6f8f0;
			color: #111111;
		}

		.bohemcars-compare-mobile__label img {
			width: 18px;
			height: 18px;
			object-fit: contain;
		}

		.bohemcars-compare-mobile__label span {
			color: #3a3f36;
			font-size: 12px;
			font-weight: 600;
			line-height: 16px;
		}

		.bohemcars-compare-mobile__value {
			border-left: 1px solid #edf0e8;
			background: #ffffff;
			color: #111111;
			font-size: 14px;
			font-weight: 600;
			line-height: 18px;
			overflow-wrap: anywhere;
		}

		.bohemcars-compare-table {
			width: max-content;
			min-width: 100%;
			border-collapse: separate;
			border-spacing: 0;
		}

		:global(.bohemcars-compare-table td) {
			width: 136px;
			max-width: 136px;
			padding: 9px 8px;
			vertical-align: top;
			text-align: left;
			white-space: normal;
			overflow-wrap: anywhere;
			background: #ffffff;
		}

		:global(.bohemcars-compare-table td:first-child) {
			position: sticky;
			left: 0;
			z-index: 2;
			width: 114px;
			min-width: 114px;
			max-width: 114px;
			padding-left: 2px;
			overflow-wrap: normal;
			background: var(--bc-surface-soft);
			box-shadow: 8px 0 14px rgba(28, 28, 28, 0.05);
		}

		:global(.bohemcars-compare-table tr:first-child td:first-child) {
			background: var(--bc-surface);
			box-shadow: none;
		}

		:global(.bohemcars-compare-table td:first-child span) {
			white-space: normal;
			overflow-wrap: normal;
			word-break: normal;
		}

		:global(.bohemcars-compare-table .image) {
			width: 112px !important;
			height: 148px !important;
			margin-bottom: 8px;
			object-fit: cover;
		}

		:global(.bohemcars-compare-table .top) {
			width: 112px;
		}

		:global(.bohemcars-compare-table .compare-item-remove-table) {
			display: flex;
			width: 44px;
			height: 44px;
			min-width: 44px;
			min-height: 44px;
			align-items: center;
			justify-content: center;
		}

		:global(.bohemcars-compare-table .top p),
		:global(.bohemcars-compare-table .top a) {
			white-space: normal;
			font-size: 14px;
			line-height: 18px;
		}

		:global(.bohemcars-compare-table .top p a) {
			display: inline-flex;
			min-height: 44px;
			align-items: center;
			margin-block: -5px;
			padding-block: 5px;
		}
	}
</style>
