<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { ArrowLeft, Check, Plus, Search, X } from '@lucide/svelte';
	import type { AuxeroCompareRow, AuxeroCompareVehicle } from '$lib/auxero/compare';
	import { compareRowsFromVehicles } from '$lib/auxero/compare';
	import type { Locale } from '$lib/i18n/messages';
	import { getGarageContext } from '$lib/state/garage.svelte';
	import { onMount } from 'svelte';
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
	const compareStorageKey = 'bohemcars:compare';
	const compareSlotStorageKey = 'bohemcars:compare:mobile-slots';
	const compareLimit = 4;
	type CompareSlotSlugs = [string | null, string | null];
	const rows: AuxeroCompareRow[] = $derived(compareRowsFromVehicles(vehicles, locale));
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

	const removeLabel = $derived(locale === 'bg' ? 'Премахни' : 'Remove');
	const addLabel = $derived(locale === 'bg' ? 'Добави автомобил' : 'Add vehicle');
	const addToSlotLabel = $derived(locale === 'bg' ? 'Избери автомобил' : 'Choose vehicle');
	const allBrandsLabel = $derived(locale === 'bg' ? 'Всички' : 'All');
	const appTitle = $derived(locale === 'bg' ? 'Сравнение' : 'Compare');
	const comparedLabel = $derived(locale === 'bg' ? 'сравнени автомобила' : 'vehicles compared');
	const compareLimitLabel = $derived(locale === 'bg' ? 'до 4 автомобила' : 'up to 4 vehicles');
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
	const groupsForRows = (sourceRows: AuxeroCompareRow[], firstGroupOpen = true) => {
		const pickRows = (indexes: number[]) =>
			indexes
				.map((index) => sourceRows[index])
				.filter((row): row is AuxeroCompareRow => Boolean(row));

		return [
			{
				open: firstGroupOpen,
				rows: pickRows([10, 0, 1, 2]),
				title: locale === 'bg' ? 'Основни' : 'Core'
			},
			{
				open: false,
				rows: pickRows([6, 7, 3, 5]),
				title: locale === 'bg' ? 'Техника' : 'Technical'
			},
			{
				open: false,
				rows: pickRows([4, 8, 9]),
				title: locale === 'bg' ? 'Произход' : 'Source'
			}
		].filter((group) => group.rows.length > 0);
	};
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
	const fullGroups = $derived(groupsForRows(selectedRows, false));
	const mobileMatrixVehicleCount = $derived(Math.max(selectedVehicles.length, 1));
	const slotVehicles = $derived(
		slotSlugs.map((slug) => (slug ? (vehicleBySlug[slug] ?? null) : null))
	);
	const slotCompareVehicles = $derived(
		slotVehicles.filter((vehicle): vehicle is AuxeroCompareVehicle => Boolean(vehicle))
	);
	const slotRows = $derived(compareRowsFromVehicles(slotCompareVehicles, locale));
	const slotGroups = $derived(groupsForRows(slotRows, true));
	const availableBrands = $derived.by(() => {
		const brandCounts: Record<string, number> = {};
		for (const vehicle of allVehicles) {
			brandCounts[vehicle.brand] = (brandCounts[vehicle.brand] ?? 0) + 1;
		}

		return Object.entries(brandCounts)
			.map(([brand, count]) => ({ brand, count }))
			.sort((left, right) => left.brand.localeCompare(right.brand, locale));
	});
	const visibleDrawerVehicles = $derived.by(() => {
		const query = addDrawerQuery.trim().toLocaleLowerCase();

		return allVehicles
			.filter((vehicle) => {
				const matchesBrand = !addDrawerBrand || vehicle.brand === addDrawerBrand;
				const matchesQuery =
					!query ||
					[vehicle.title, vehicle.brand, vehicle.model, vehicle.year, vehicle.priceLabel]
						.join(' ')
						.toLocaleLowerCase()
						.includes(query);

				return matchesBrand && matchesQuery;
			})
			.sort((left, right) => {
				const leftSelected = selectedSlugs.includes(left.slug) ? 0 : 1;
				const rightSelected = selectedSlugs.includes(right.slug) ? 0 : 1;

				return leftSelected - rightSelected || left.title.localeCompare(right.title, locale);
			});
	});

	const normalizeSlugs = (slugs: (string | null | undefined)[]) =>
		Array.from(
			new Set(
				slugs.filter(
					(slug): slug is string => typeof slug === 'string' && Boolean(vehicleBySlug[slug])
				)
			)
		).slice(0, compareLimit);
	const readStoredCompare = () => {
		if (!browser || !useStoredSelection) return [];

		try {
			const value = JSON.parse(localStorage.getItem(compareStorageKey) || '[]');

			return Array.isArray(value) ? value.filter((item) => typeof item === 'string') : [];
		} catch {
			return [];
		}
	};
	const sameSlugList = (left: string[], right: string[]) =>
		left.length === right.length && left.every((slug, index) => slug === right[index]);
	const compactSlotsFromSelection = (slugs: string[]): CompareSlotSlugs => [
		slugs[0] ?? null,
		slugs[1] ?? null
	];
	const normalizeSlots = (
		slots: (string | null | undefined)[],
		cleanSlugs: string[]
	): CompareSlotSlugs => [
		slots[0] && cleanSlugs.includes(slots[0]) ? slots[0] : null,
		slots[1] && cleanSlugs.includes(slots[1]) ? slots[1] : null
	];
	const readStoredCompareSlots = (cleanSlugs: string[]) => {
		if (!browser || !useStoredSelection) return undefined;

		try {
			const value = JSON.parse(localStorage.getItem(compareSlotStorageKey) || 'null');
			const compare = Array.isArray(value?.compare)
				? normalizeSlugs(value.compare.filter((item: unknown) => typeof item === 'string'))
				: [];
			const slots = Array.isArray(value?.slots) ? value.slots : undefined;

			if (!slots || !sameSlugList(compare, cleanSlugs)) return undefined;

			return normalizeSlots(slots, cleanSlugs);
		} catch {
			return undefined;
		}
	};
	const writeStoredCompareSlots = (cleanSlugs: string[], slots: CompareSlotSlugs) => {
		if (!browser || !useStoredSelection) return;

		localStorage.setItem(
			compareSlotStorageKey,
			JSON.stringify({
				compare: cleanSlugs,
				slots
			})
		);
	};
	const setLocalSelection = (
		slugs: (string | null | undefined)[],
		nextSlots?: CompareSlotSlugs
	) => {
		const cleanSlugs = normalizeSlugs(slugs);
		selectedSlugsOverride = cleanSlugs;
		slotSlugsOverride = nextSlots
			? normalizeSlots(nextSlots, cleanSlugs)
			: compactSlotsFromSelection(cleanSlugs);
	};
	const commitSelection = (slugs: (string | null | undefined)[], nextSlots?: CompareSlotSlugs) => {
		const cleanSlugs = normalizeSlugs(slugs);
		const preservedSlots = normalizeSlots(nextSlots ?? slotSlugs, cleanSlugs);
		const slotsForSelection =
			preservedSlots.some((slug) => slug) || !cleanSlugs.length
				? preservedSlots
				: compactSlotsFromSelection(cleanSlugs);

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
			nextSlots = compactSlotsFromSelection(normalizeSlugs(nextSlugs));
		}

		commitSelection(nextSlugs, nextSlots);
		addDrawerOpen = false;
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
	const drawerButtonDisabled = (slug: string) =>
		drawerSlotIndex === null &&
		selectedSlugs.includes(slug) &&
		selectedSlugs.length >= compareLimit;
	const rowValuesForSlots = (row: AuxeroCompareRow) => {
		let valueIndex = 0;

		return slotSlugs.map((slug) => {
			if (!slug) return emptyValue;

			const value = row.values[valueIndex] ?? emptyValue;
			valueIndex += 1;

			return value;
		});
	};

	onMount(() => {
		if (selectionTouched) return;

		const stored = readStoredCompare();
		const cleanSlugs = normalizeSlugs(
			stored.length ? stored : vehicles.map((vehicle) => vehicle.slug)
		);
		setLocalSelection(
			cleanSlugs,
			readStoredCompareSlots(cleanSlugs) ?? compactSlotsFromSelection(cleanSlugs)
		);
	});
</script>

<div
	class="bohemcars-compare-mobile"
	aria-label={locale === 'bg' ? 'Мобилно сравнение' : 'Mobile compare'}
>
	<header class="bohemcars-compare-mobile__appbar">
		<a href={resolve('/inventory')} aria-label={locale === 'bg' ? 'Към коли' : 'Back to cars'}>
			<ArrowLeft size={21} strokeWidth={2.35} aria-hidden="true" />
		</a>
		<div>
			<p>Bohemcars</p>
			<strong>{appTitle}</strong>
			<span>{selectedSlugs.length} {comparedLabel} · {compareLimitLabel}</span>
		</div>
		<button type="button" aria-label={addLabel} onclick={openTopAddDrawer}>
			<Plus size={22} strokeWidth={2.4} aria-hidden="true" />
		</button>
	</header>

	<section class="bohemcars-compare-mobile__pair" aria-label={pairLabel}>
		<header class="bohemcars-compare-mobile__pair-head">
			<div>
				<p>{pairLabel}</p>
				<strong>{slotCompareVehicles.length}/2 · {selectedSlugs.length} {comparedLabel}</strong>
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

	<details class="bohemcars-compare-mobile__all" open={selectedVehicles.length > 2}>
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

	{#if addDrawerOpen}
		<button
			type="button"
			class="bohemcars-compare-mobile-drawer__backdrop"
			aria-label={locale === 'bg' ? 'Затвори' : 'Close'}
			onclick={() => (addDrawerOpen = false)}
		>
			<span>{locale === 'bg' ? 'Затвори' : 'Close'}</span>
		</button>
		<div
			class="bohemcars-compare-mobile-drawer__sheet"
			role="dialog"
			aria-modal="true"
			aria-labelledby="bohemcarsCompareMobileDrawerTitle"
		>
			<span class="bohemcars-compare-mobile-drawer__handle" aria-hidden="true"></span>
			<header>
				<div>
					<p>{drawerKicker}</p>
					<h2 id="bohemcarsCompareMobileDrawerTitle">
						<span>{drawerSlotIndex === null ? addLabel : addToSlotLabel}</span>
					</h2>
				</div>
				<button
					type="button"
					aria-label={locale === 'bg' ? 'Затвори' : 'Close'}
					onclick={() => (addDrawerOpen = false)}
				>
					<X size={21} strokeWidth={2.35} aria-hidden="true" />
				</button>
			</header>
			<p class="bohemcars-compare-mobile-drawer__description">
				{locale === 'bg'
					? 'Избери автомобил от наличните модели на Bohemcars.'
					: 'Choose from available Bohemcars models.'}
			</p>

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
		</div>
	{/if}
</div>

<div class="bohemcars-compare-scroll">
	<table class="card-details--table bohemcars-compare-table" data-bohemcars-compare-table>
		<tbody>
			<tr>
				<td></td>
				{#each vehicles as vehicle (vehicle.slug)}
					<td data-bohemcars-compare-column={vehicle.slug}>
						<div class="top relative">
							<button
								class="compare-item-remove-table"
								type="button"
								data-bohemcars-compare-remove={vehicle.slug}
								aria-label={`${removeLabel} ${vehicle.title}`}
								title={`${removeLabel} ${vehicle.title}`}
								style="position: absolute; top: 0; right: 0; background: transparent; border: none; cursor: pointer; padding: 8px; z-index: 10;"
							>
								<img
									src="/assets/icons/close-modal.svg"
									alt=""
									aria-hidden="true"
									style="width: 24px; height: 24px;"
								/>
							</button>
							<a href={resolve('/inventory/[slug]', { slug: vehicle.slug })}>
								<AuxeroCompareVehicleImage src={vehicle.image} title={vehicle.title} />
							</a>
							<p class="h4 text-center">
								<a href={resolve('/inventory/[slug]', { slug: vehicle.slug })}>{vehicle.title}</a>
							</p>
						</div>
					</td>
				{/each}
			</tr>
			{#each rows as row (row.label)}
				<tr>
					<td>
						<div class="flex items-center gap-8">
							<img src={`/assets/icons/${row.icon}`} alt={row.alt} />
							<span>{row.label}:</span>
						</div>
					</td>
					{#each row.values as value, index (`${row.label}-${vehicles[index]?.slug ?? index}`)}
						<td>{value}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.bohemcars-compare-scroll {
		width: 100%;
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

		:global(.bohemcars-compare-table.card-details--table) {
			width: 100% !important;
			min-width: 0 !important;
			table-layout: fixed !important;
		}

		:global(.bohemcars-compare-table td:first-child) {
			width: 184px;
		}

		:global(.bohemcars-compare-table .top),
		:global(.bohemcars-compare-table .top > a) {
			display: block;
			width: 100%;
		}

		:global(.bohemcars-compare-table .image) {
			width: 100% !important;
			max-width: 320px !important;
			height: auto !important;
			margin-inline: auto;
			aspect-ratio: 3 / 2;
			object-fit: cover;
		}

		:global(.bohemcars-compare-table .top p),
		:global(.bohemcars-compare-table .top p a) {
			white-space: normal;
			overflow-wrap: anywhere;
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
			gap: 10px;
			min-width: 0;
			color: #111111;
		}

		.bohemcars-compare-mobile__appbar {
			display: grid;
			grid-template-columns: 40px minmax(0, 1fr) 40px;
			align-items: center;
			gap: 9px;
			min-height: 58px;
			border: 1px solid #e3eadc;
			border-radius: 16px;
			background: #ffffff;
			box-shadow: 0 1px 3px rgba(23, 31, 18, 0.06);
			color: #111111;
			padding: 7px;
		}

		.bohemcars-compare-mobile__appbar a,
		.bohemcars-compare-mobile__appbar button {
			display: flex;
			width: 40px;
			height: 40px;
			align-items: center;
			justify-content: center;
			border: 0;
			border-radius: 999px;
			background: #f2f6ed;
			color: #111111;
			cursor: pointer;
			padding: 0;
			text-decoration: none;
		}

		.bohemcars-compare-mobile__appbar button {
			background: #d9f275;
		}

		.bohemcars-compare-mobile__appbar a:hover,
		.bohemcars-compare-mobile__appbar a:focus-visible,
		.bohemcars-compare-mobile__appbar button:hover,
		.bohemcars-compare-mobile__appbar button:focus-visible {
			background: #c8e66d;
			color: #111111;
			outline: 0;
		}

		.bohemcars-compare-mobile__appbar a :global(svg),
		.bohemcars-compare-mobile__appbar a :global(svg *),
		.bohemcars-compare-mobile__appbar button :global(svg),
		.bohemcars-compare-mobile__appbar button :global(svg *) {
			color: currentColor !important;
			pointer-events: none;
			stroke: currentColor !important;
		}

		.bohemcars-compare-mobile__appbar div {
			min-width: 0;
		}

		.bohemcars-compare-mobile__appbar p,
		.bohemcars-compare-mobile__appbar strong,
		.bohemcars-compare-mobile__appbar span {
			display: block;
			min-width: 0;
			margin: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.bohemcars-compare-mobile__appbar p {
			color: #8fbd24;
			font-size: 11px;
			font-weight: 850;
			line-height: 14px;
			text-transform: uppercase;
		}

		.bohemcars-compare-mobile__appbar strong {
			color: #111111;
			font-size: 19px;
			font-weight: 800;
			line-height: 23px;
		}

		.bohemcars-compare-mobile__appbar span {
			color: #65705f;
			font-size: 12px;
			font-weight: 650;
			line-height: 16px;
		}

		.bohemcars-compare-mobile__pair {
			display: grid;
			gap: 8px;
			overflow: visible;
			border-radius: 0;
			background: transparent;
			padding: 0;
		}

		.bohemcars-compare-mobile__pair-head {
			display: flex;
			min-height: 40px;
			align-items: center;
			justify-content: space-between;
			gap: 10px;
			color: #111111;
		}

		.bohemcars-compare-mobile__pair-head p {
			margin: 0;
			color: #8fbd24;
			font-size: 12px;
			font-weight: 850;
			line-height: 16px;
			text-transform: uppercase;
		}

		.bohemcars-compare-mobile__pair-head strong {
			display: block;
			margin-top: 1px;
			color: #111111;
			font-size: 16px;
			font-weight: 800;
			line-height: 20px;
		}

		.bohemcars-compare-mobile__pair-head button {
			display: inline-flex;
			min-height: 36px;
			align-items: center;
			gap: 6px;
			border: 0;
			border-radius: 999px;
			background: #d9f275;
			color: #111111;
			cursor: pointer;
			padding: 0 12px;
			font-size: 12px;
			font-weight: 800;
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
			border: 1px solid #e1e8d8;
			border-radius: 8px;
			background: #ffffff;
			padding: 8px;
			text-align: left;
		}

		.bohemcars-compare-mobile__selected-card > span {
			width: fit-content;
			border-radius: 999px;
			background: #d9f275;
			color: #111111;
			font-size: 12px;
			font-weight: 850;
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
			background: #d9f275;
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
			font-weight: 800;
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
			overflow-x: auto;
			padding-bottom: 1px;
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
			border: 1px solid #e1e8d8;
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
			border-color: #d9f275;
			background: #d9f275;
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
			font-weight: 800;
			line-height: 12px;
			text-transform: uppercase;
			opacity: 0.7;
		}

		.bohemcars-compare-mobile__selected-rail strong {
			font-size: 13px;
			font-weight: 800;
			line-height: 16px;
		}

		.bohemcars-compare-mobile__pair-table {
			overflow: hidden;
			border: 1px solid #dfe5d5;
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
			font-weight: 800;
			line-height: 20px;
		}

		.bohemcars-compare-mobile__empty button {
			display: inline-flex;
			min-height: 44px;
			align-items: center;
			gap: 7px;
			border: 0;
			border-radius: 9px;
			background: #d9f275;
			color: #111111;
			cursor: pointer;
			padding: 0 13px;
			font-size: 14px;
			font-weight: 800;
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
			background: #d9f275;
			color: #111111;
			font-size: 12px;
			font-weight: 850;
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
			border: 1px solid #dfe5d5;
			border-radius: 10px;
			background: #ffffff;
		}

		.bohemcars-compare-mobile__all > summary {
			min-height: 44px;
			background: #f6f8f0;
		}

		.bohemcars-compare-mobile__matrix {
			overflow: hidden;
			border: 1px solid #dfe5d5;
			border-radius: 8px;
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

		.bohemcars-compare-mobile__head-row {
			position: sticky;
			top: 0;
			z-index: 3;
			background: #111111;
		}

		.bohemcars-compare-mobile__corner {
			position: sticky;
			left: 0;
			z-index: 5;
			display: flex;
			align-items: end;
			min-height: 118px;
			background: #111111;
			color: #ffffff;
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
			border-left: 1px solid rgba(255, 255, 255, 0.1);
			background: #111111;
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
			color: #ffffff !important;
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
			color: #d9f275;
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
			background: #ffffff;
			cursor: pointer;
			padding: 0;
		}

		.bohemcars-compare-mobile__remove :global(svg) {
			color: #111111;
			stroke: #111111;
		}

		.bohemcars-compare-mobile-drawer__backdrop {
			position: fixed;
			inset: 0;
			z-index: 1200;
			border: 0;
			background: rgba(17, 17, 17, 0.38);
			cursor: pointer;
			padding: 0;
		}

		.bohemcars-compare-mobile-drawer__backdrop span {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
		}

		.bohemcars-compare-mobile-drawer__sheet {
			position: fixed;
			right: 0;
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

		.bohemcars-compare-mobile-drawer__handle {
			position: relative;
			display: block;
			width: 56px;
			height: 22px;
			justify-self: center;
			border-radius: 0;
			background: transparent;
			opacity: 1;
		}

		.bohemcars-compare-mobile-drawer__handle::after {
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

		.bohemcars-compare-mobile-drawer__sheet header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
		}

		.bohemcars-compare-mobile-drawer__sheet header div {
			min-width: 0;
		}

		.bohemcars-compare-mobile-drawer__sheet header p {
			margin: 0 0 2px;
			color: #8fbd24;
			font-size: 11px;
			font-weight: 900;
			line-height: 14px;
			text-transform: uppercase;
		}

		.bohemcars-compare-mobile-drawer__sheet header h2 {
			margin: 0;
		}

		.bohemcars-compare-mobile-drawer__sheet header span {
			display: block;
			color: #111111;
			font-size: 21px;
			font-weight: 900;
			line-height: 26px;
		}

		.bohemcars-compare-mobile-drawer__sheet header button {
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

		.bohemcars-compare-mobile-drawer__description {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
		}

		.bohemcars-compare-mobile-drawer__search {
			display: flex;
			min-height: 50px;
			align-items: center;
			gap: 9px;
			border: 1px solid #e2e8dc;
			border-radius: 999px;
			background: #ffffff;
			padding: 0 13px;
			color: #111111;
		}

		.bohemcars-compare-mobile-drawer__search span {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
		}

		.bohemcars-compare-mobile-drawer__search input {
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

		.bohemcars-compare-mobile-drawer__brands {
			display: flex;
			gap: 8px;
			margin: 0 -14px;
			overflow-x: auto;
			padding: 0 14px 2px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.bohemcars-compare-mobile-drawer__brands::-webkit-scrollbar {
			display: none;
		}

		.bohemcars-compare-mobile-drawer__brands button {
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
			font-weight: 800;
			line-height: 17px;
			white-space: nowrap;
		}

		.bohemcars-compare-mobile-drawer__brands button.active,
		.bohemcars-compare-mobile-drawer__brands button:hover,
		.bohemcars-compare-mobile-drawer__brands button:focus-visible {
			background: #d9f275;
			outline: 0;
		}

		.bohemcars-compare-mobile-drawer__brands small {
			display: inline-flex;
			min-width: 21px;
			height: 21px;
			align-items: center;
			justify-content: center;
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.72);
			font-size: 11px;
			font-weight: 900;
			line-height: 21px;
		}

		.bohemcars-compare-mobile-drawer__list {
			display: grid;
			align-content: start;
			gap: 8px;
			min-height: 0;
			overflow-y: auto;
			padding-bottom: 2px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.bohemcars-compare-mobile-drawer__list::-webkit-scrollbar {
			display: none;
		}

		.bohemcars-compare-mobile-drawer__list > button {
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

		.bohemcars-compare-mobile-drawer__list > button:hover,
		.bohemcars-compare-mobile-drawer__list > button:focus-visible {
			background: #eef3e9;
			outline: 0;
		}

		.bohemcars-compare-mobile-drawer__list > button.active {
			background: #f4f8e9;
		}

		.bohemcars-compare-mobile-drawer__list > button:disabled {
			cursor: default;
			opacity: 0.72;
		}

		.bohemcars-compare-mobile-drawer__list img {
			display: block;
			width: 92px;
			height: 70px;
			border-radius: 7px;
			background: var(--bc-surface);
			object-fit: contain;
		}

		.bohemcars-compare-mobile-drawer__list span {
			display: grid;
			min-width: 0;
			gap: 2px;
		}

		.bohemcars-compare-mobile-drawer__list small,
		.bohemcars-compare-mobile-drawer__list strong,
		.bohemcars-compare-mobile-drawer__list em {
			display: block;
			min-width: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.bohemcars-compare-mobile-drawer__list small {
			color: #6d7680;
			font-size: 11px;
			font-weight: 800;
			line-height: 14px;
			text-transform: uppercase;
		}

		.bohemcars-compare-mobile-drawer__list strong {
			color: #111111;
			font-size: 15px;
			font-weight: 850;
			line-height: 19px;
		}

		.bohemcars-compare-mobile-drawer__list em {
			color: #8fbd24;
			font-size: 13px;
			font-style: normal;
			font-weight: 900;
			line-height: 17px;
		}

		.bohemcars-compare-mobile-drawer__list b {
			display: inline-flex;
			min-height: 34px;
			align-items: center;
			justify-content: center;
			gap: 5px;
			border-radius: 999px;
			background: #d9f275;
			color: #111111;
			padding: 0 10px;
			font-size: 12px;
			font-weight: 850;
			line-height: 15px;
			white-space: nowrap;
		}

		.bohemcars-compare-mobile-drawer__list > button.active b {
			background: #eef8ce;
			color: #111111;
		}

		.bohemcars-compare-mobile-drawer__empty {
			margin: 0;
			border-radius: 8px;
			background: #ffffff;
			color: #6d7680;
			padding: 16px;
			font-size: 14px;
			font-weight: 800;
			line-height: 18px;
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
			background: #111111;
			color: #d9f275;
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
