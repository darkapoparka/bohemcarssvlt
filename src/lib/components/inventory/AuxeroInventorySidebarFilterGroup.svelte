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

<fieldset class="bohemcars-inventory-sidebar-group">
	<legend>{filter.label}</legend>
	<div class="bohemcars-inventory-sidebar-options">
		<label class="filter-checkbox bohemcars-inventory-filter-option">
			<input
				type={inputType}
				name={filter.name}
				value=""
				checked={allSelected}
				data-inventory-filter-input
			/>
			<span>{filter.allLabel}</span>
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
</fieldset>
