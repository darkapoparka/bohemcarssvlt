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

<fieldset class="bohemcars-inventory-sidebar-group" data-filter-name={filter.name}>
	<legend>
		<span>{filter.label}</span>
	</legend>
	<div class="bohemcars-inventory-sidebar-options">
		<label
			class={[
				'bohemcars-inventory-filter-option',
				'bohemcars-inventory-sidebar-option',
				filter.mode === 'single' && 'bohemcars-inventory-sidebar-option--single',
				allSelected && 'is-selected'
			]}
		>
			<input
				type={inputType}
				name={filter.name}
				value=""
				checked={allSelected}
				data-inventory-filter-input
			/>
			<span class="bohemcars-inventory-sidebar-option__control" aria-hidden="true"></span>
			<span class="bohemcars-inventory-sidebar-option__label">{filter.allLabel}</span>
		</label>
		{#each filter.options as option (option.value)}
			<label
				class={[
					'bohemcars-inventory-filter-option',
					'bohemcars-inventory-sidebar-option',
					filter.mode === 'single' && 'bohemcars-inventory-sidebar-option--single',
					option.image && 'bohemcars-inventory-sidebar-option--with-media',
					isChecked(option.value) && 'is-selected'
				]}
			>
				<input
					type={inputType}
					name={filter.name}
					value={option.value}
					checked={isChecked(option.value)}
					data-inventory-filter-input
				/>
				<span class="bohemcars-inventory-sidebar-option__control" aria-hidden="true"></span>
				{#if option.image}
					<span class="bohemcars-inventory-sidebar-option__media" aria-hidden="true">
						<img src={option.image} alt="" loading="lazy" decoding="async" />
					</span>
				{/if}
				<span class="bohemcars-inventory-sidebar-option__label">{option.label}</span>
				{#if typeof option.count === 'number'}
					<small class="bohemcars-inventory-sidebar-option__count">{option.count}</small>
				{/if}
			</label>
		{/each}
	</div>
</fieldset>
