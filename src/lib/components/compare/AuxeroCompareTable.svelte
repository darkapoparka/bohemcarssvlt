<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroCompareRow, AuxeroCompareVehicle } from '$lib/auxero/compare';
	import { compareRowsFromVehicles } from '$lib/auxero/compare';
	import type { Locale } from '$lib/i18n/messages';
	import AuxeroCompareVehicleImage from './AuxeroCompareVehicleImage.svelte';

	let { locale, vehicles }: { locale: Locale; vehicles: AuxeroCompareVehicle[] } = $props();

	const rows: AuxeroCompareRow[] = $derived(compareRowsFromVehicles(vehicles, locale));
	const removeLabel = $derived(locale === 'bg' ? 'Премахни' : 'Remove');
</script>

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

	@media (max-width: 767.98px) {
		/* The Auxero card-details wrapper hard-codes min-width: 800px, which clips the
		   compare table on phones. Let it shrink so the table scrolls within the viewport. */
		:global(.auxero-template-compare-html .card-details) {
			min-width: 0;
			overflow: visible;
		}

		.bohemcars-compare-scroll {
			overflow-x: auto;
			overflow-y: hidden;
			padding-bottom: 6px;
			-webkit-overflow-scrolling: touch;
			scrollbar-width: thin;
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
			font-size: 13px;
			line-height: 17px;
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
