<script lang="ts">
	import type { AuxeroInventoryFilter } from '$lib/auxero/inventory-desktop';
	import { Check } from '@lucide/svelte';

	let { filter }: { filter: AuxeroInventoryFilter } = $props();

	const inputType = $derived(filter.mode === 'single' ? 'radio' : 'checkbox');
	const allSelected = $derived(filter.selectedValues.length === 0);

	const isChecked = (value: string) =>
		value
			? filter.selectedValues.some((selected) => selected.toLowerCase() === value.toLowerCase())
			: allSelected;
</script>

<div
	class={['sfg', filter.mode === 'single' && 'sfg--single']}
	role="group"
	aria-label={filter.label}
	data-filter-name={filter.name}
>
	<p class="sfg__legend">{filter.label}</p>
	<div class="sfg__options">
		<label class={['sfg__option', allSelected && 'is-selected']}>
			<input
				class="sfg__input"
				type={inputType}
				name={filter.name}
				value=""
				checked={allSelected}
				data-inventory-filter-input
			/>
			<span class="sfg__control" aria-hidden="true">
				<Check size={13} strokeWidth={3} />
			</span>
			<span class="sfg__label">{filter.allLabel}</span>
		</label>
		{#each filter.options as option (option.value)}
			<label class={['sfg__option', isChecked(option.value) && 'is-selected']}>
				<input
					class="sfg__input"
					type={inputType}
					name={filter.name}
					value={option.value}
					checked={isChecked(option.value)}
					data-inventory-filter-input
				/>
				<span class="sfg__control" aria-hidden="true">
					<Check size={13} strokeWidth={3} />
				</span>
				{#if option.image}
					<span class="sfg__media" aria-hidden="true">
						<img src={option.image} alt="" loading="lazy" decoding="async" />
					</span>
				{/if}
				<span class="sfg__label">{option.label}</span>
				{#if typeof option.count === 'number'}
					<small class="sfg__count">{option.count}</small>
				{/if}
			</label>
		{/each}
	</div>
</div>

<style>
	.sfg {
		min-width: 0;
		border: 1px solid #e2e6dc;
		border-radius: 12px;
		background: #ffffff;
		padding: 13px 13px 9px;
		box-shadow: 0 1px 2px rgba(23, 31, 18, 0.03);
	}

	.sfg__legend {
		margin: 0 4px 7px;
		color: #6b7463;
		font-size: 12px;
		font-weight: 600;
		line-height: 1.1;
	}

	.sfg__options {
		display: grid;
		gap: 2px;
	}

	.sfg__option {
		position: relative;
		display: flex;
		align-items: center;
		gap: 11px;
		min-height: 40px;
		padding: 5px 9px;
		border-radius: 9px;
		cursor: pointer;
		transition:
			background-color 0.14s ease,
			color 0.14s ease;
	}

	.sfg__option:hover {
		background: #f2f6ea;
	}

	.sfg__option.is-selected {
		background: #eaf6cf;
	}

	.sfg__input {
		position: absolute;
		width: 1px;
		height: 1px;
		opacity: 0;
		pointer-events: none;
	}

	.sfg__control {
		display: inline-grid;
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		place-items: center;
		border: 1.5px solid #ccd5be;
		border-radius: 6px;
		background: #ffffff;
		color: #ffffff;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease;
	}

	.sfg--single .sfg__control {
		border-radius: 999px;
	}

	.sfg__control :global(svg) {
		opacity: 0;
		transition: opacity 0.14s ease;
	}

	.sfg__option.is-selected .sfg__control {
		border-color: #6f9d18;
		background: #6f9d18;
	}

	.sfg__option.is-selected .sfg__control :global(svg) {
		opacity: 1;
	}

	.sfg__input:focus-visible + .sfg__control {
		outline: 2px solid #4f7012;
		outline-offset: 2px;
	}

	.sfg__media {
		display: inline-grid;
		width: 28px;
		height: 20px;
		flex-shrink: 0;
		place-items: center;
	}

	.sfg__media img {
		max-width: 28px;
		max-height: 19px;
		object-fit: contain;
	}

	.sfg__label {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		color: #26331a;
		font-size: 14px;
		font-weight: 600;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.sfg__count {
		flex-shrink: 0;
		color: #8a9180;
		font-size: 12px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	.sfg__option.is-selected .sfg__count {
		color: #3f5a14;
	}
</style>
