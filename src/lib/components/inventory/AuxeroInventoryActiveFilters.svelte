<script lang="ts">
	import type { AuxeroInventoryDesktopData } from '$lib/auxero/inventory-desktop';
	import { X } from '@lucide/svelte';

	let {
		activeFilters,
		modifierClass = ''
	}: {
		activeFilters: NonNullable<AuxeroInventoryDesktopData['activeFilters']>;
		modifierClass?: string;
	} = $props();

	const className = $derived(
		['bohemcars-inventory-active-filters', modifierClass].filter(Boolean).join(' ')
	);
	const linkHref = (href: string) => ({ href });
</script>

<div class={className} aria-label="Active inventory filters">
	<p class="bohemcars-inventory-active-filters__summary">{activeFilters.summary}</p>
	<div class="bohemcars-inventory-active-filters__chips">
		{#each activeFilters.chips as chip (chip.label)}
			<a
				class="bohemcars-active-filter"
				{...linkHref(chip.href)}
				aria-label={`Remove ${chip.label} filter`}
			>
				{chip.label}
				<X size={13} strokeWidth={2.5} aria-hidden="true" />
			</a>
		{/each}
		<a
			class="bohemcars-active-filter bohemcars-active-filter--clear"
			{...linkHref(activeFilters.clearHref)}
		>
			{activeFilters.clearLabel}
			<X size={13} strokeWidth={2.5} aria-hidden="true" />
		</a>
	</div>
</div>
