<script lang="ts">
	import type { AuxeroInventoryFilter } from '$lib/auxero/inventory-desktop';

	let { filter }: { filter: AuxeroInventoryFilter } = $props();

	const inputType = $derived(filter.mode === 'single' ? 'radio' : 'checkbox');
	const allSelected = $derived(filter.selectedValues.length === 0);

	const isChecked = (value: string) =>
		value
			? filter.selectedValues.some((selected) => selected.toLowerCase() === value.toLowerCase())
			: allSelected;
</script>

<div
	class="bohemcars-inventory-filter-field search-cars__select filter-select-dropdown bg-white"
	data-name={filter.name}
	data-inventory-filter-field
	data-filter-mode={filter.mode}
>
	<label for={filter.id} class="search-cars__label">{filter.label}</label>
	<input
		type="checkbox"
		id={filter.id}
		class="filter-select-dropdown__toggle"
		tabindex="-1"
		aria-hidden="true"
	/>
	<label for={filter.id} class="filter-select-dropdown__text">
		<span>{filter.selectedSummary}</span>
	</label>
	<div class="filter-select-dropdown__menu">
		<div class="filter-select-dropdown__list">
			<label class="filter-checkbox bohemcars-inventory-filter-option">
				<input
					type={inputType}
					name={filter.name}
					value=""
					checked={allSelected}
					data-inventory-filter-input
				/>
				<span>{filter.placeholder}</span>
			</label>
			{#each filter.options as option (option.value)}
				<label class="filter-checkbox bohemcars-inventory-filter-option">
					{#if option.image}
						<img src={option.image} alt="" aria-hidden="true" loading="lazy" decoding="async" />
					{/if}
					<input
						type={inputType}
						name={filter.name}
						value={option.value}
						checked={isChecked(option.value)}
						data-inventory-filter-input
					/>
					<span>{option.label}</span>
					{#if typeof option.count === 'number'}
						<small>{option.count}</small>
					{/if}
				</label>
			{/each}
		</div>
	</div>
</div>
