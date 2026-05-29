<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroCompareRow, AuxeroCompareVehicle } from '$lib/auxero/compare';
	import { compareRowsFromVehicles } from '$lib/auxero/compare';
	import type { Locale } from '$lib/i18n/messages';

	let { locale, vehicles }: { locale: Locale; vehicles: AuxeroCompareVehicle[] } = $props();

	const rows: AuxeroCompareRow[] = $derived(compareRowsFromVehicles(vehicles, locale));
</script>

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
							style="position: absolute; top: 0; right: 0; background: transparent; border: none; cursor: pointer; padding: 8px; z-index: 10;"
						>
							<img
								src="/assets/icons/close-modal.svg"
								alt="Remove"
								style="width: 24px; height: 24px;"
							/>
						</button>
						<a href={resolve('/inventory/[slug]', { slug: vehicle.slug })}>
							<img class="radius-16 image mb-10" src={vehicle.image} alt={vehicle.title} />
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
