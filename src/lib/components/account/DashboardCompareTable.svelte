<script lang="ts">
	import { resolve } from '$app/paths';
	import { X } from '@lucide/svelte';
	import type { AuxeroCompareRow, AuxeroCompareVehicle } from '$lib/auxero/compare';
	import { compareRowsFromVehicles } from '$lib/auxero/compare';
	import type { Locale } from '$lib/i18n/messages';

	let { locale, vehicles }: { locale: Locale; vehicles: AuxeroCompareVehicle[] } = $props();

	const rows: AuxeroCompareRow[] = $derived(compareRowsFromVehicles(vehicles, locale));
	const removeLabel = $derived(locale === 'bg' ? 'Премахни' : 'Remove');
</script>

<section class="dash-card">
	<div class="dash-card__head">
		<div>
			<h2 class="dash-card__title">Vehicle comparison</h2>
			<p class="dash-card__subtitle">Saved comparison set from your current inventory shortlist.</p>
		</div>
		<span class="dash-role-pill">{vehicles.length} vehicles</span>
	</div>

	<div class="dash-table-wrap">
		<table class="dash-table" data-bohemcars-compare-table>
			<tbody>
				<tr>
					<th>Vehicle</th>
					{#each vehicles as vehicle (vehicle.slug)}
						<td data-bohemcars-compare-column={vehicle.slug}>
							<div class="relative grid min-w-52 gap-3">
								<button
									class="dash-action dash-action--danger absolute top-0 right-0"
									type="button"
									data-bohemcars-compare-remove={vehicle.slug}
									aria-label={`${removeLabel} ${vehicle.title}`}
									title={`${removeLabel} ${vehicle.title}`}
								>
									<X size={16} strokeWidth={2.1} aria-hidden="true" />
								</button>
								<a
									href={resolve('/account/vehicles/[slug]', { slug: vehicle.slug })}
									class="block overflow-hidden rounded-lg bg-[#edf0f5] pr-10"
								>
									<img src={vehicle.image} alt={vehicle.title} class="h-36 w-full object-cover" />
								</a>
								<p class="m-0 text-base leading-6 font-black text-[var(--dash-heading)]">
									<a
										href={resolve('/account/vehicles/[slug]', { slug: vehicle.slug })}
										class="text-inherit no-underline"
									>
										{vehicle.title}
									</a>
								</p>
								<p class="m-0 text-sm font-black text-[var(--dash-primary)]">
									{vehicle.priceLabel}
								</p>
							</div>
						</td>
					{/each}
				</tr>
				{#each rows as row (row.label)}
					<tr>
						<th>
							<div class="flex items-center gap-2">
								<img
									class="h-4 w-4 object-contain"
									src={`/assets/icons/${row.icon}`}
									alt={row.alt}
								/>
								<span>{row.label}</span>
							</div>
						</th>
						{#each row.values as value, index (`${row.label}-${vehicles[index]?.slug ?? index}`)}
							<td>{value}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
