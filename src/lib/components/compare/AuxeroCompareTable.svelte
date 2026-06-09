<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroCompareRow, AuxeroCompareVehicle } from '$lib/auxero/compare';
	import { compareRowsFromVehicles } from '$lib/auxero/compare';
	import type { Locale } from '$lib/i18n/messages';
	import AuxeroCompareVehicleImage from './AuxeroCompareVehicleImage.svelte';

	let { locale, vehicles }: { locale: Locale; vehicles: AuxeroCompareVehicle[] } = $props();

	const rows: AuxeroCompareRow[] = $derived(compareRowsFromVehicles(vehicles, locale));
	const removeLabel = $derived(locale === 'bg' ? 'Премахни' : 'Remove');
	const comparedLabel = $derived(locale === 'bg' ? 'сравнени автомобила' : 'vehicles compared');
	const parameterLabel = $derived(locale === 'bg' ? 'Параметър' : 'Spec');
	const matrixLabel = $derived(locale === 'bg' ? 'Всички автомобили' : 'All vehicles');
	const pairLabel = $derived(locale === 'bg' ? 'Двойка за сравнение' : 'Comparison pair');
	const pairChoiceLabel = $derived(locale === 'bg' ? 'Избери двойка' : 'Choose pair');
	const pairInputName = $derived(
		`bohemcars-compare-pair-${vehicles.map((vehicle) => vehicle.slug).join('-') || 'empty'}`
	);
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
	const fullGroups = $derived(groupsForRows(rows, false));
	const pairOptions = $derived.by(() => {
		const options: {
			groups: ReturnType<typeof groupsForRows>;
			id: string;
			vehicles: AuxeroCompareVehicle[];
		}[] = [];

		for (let leftIndex = 0; leftIndex < vehicles.length; leftIndex += 1) {
			for (let rightIndex = leftIndex + 1; rightIndex < vehicles.length; rightIndex += 1) {
				const optionVehicles = [vehicles[leftIndex], vehicles[rightIndex]].filter(
					(vehicle): vehicle is AuxeroCompareVehicle => Boolean(vehicle)
				);
				const optionRows = compareRowsFromVehicles(optionVehicles, locale);

				options.push({
					groups: groupsForRows(optionRows, true),
					id: optionVehicles.map((vehicle) => vehicle.slug).join('-'),
					vehicles: optionVehicles
				});
			}
		}

		if (options.length === 0 && vehicles[0]) {
			const optionVehicles = [vehicles[0]];
			const optionRows = compareRowsFromVehicles(optionVehicles, locale);

			options.push({
				groups: groupsForRows(optionRows, true),
				id: vehicles[0].slug,
				vehicles: optionVehicles
			});
		}

		return options;
	});
</script>

<div
	class="bohemcars-compare-mobile"
	aria-label={locale === 'bg' ? 'Мобилно сравнение' : 'Mobile compare'}
>
	<section class="bohemcars-compare-mobile__pair" aria-label={pairLabel}>
		<header class="bohemcars-compare-mobile__pair-head">
			<div>
				<p>{pairLabel}</p>
				<strong>{vehicles.length} {comparedLabel}</strong>
			</div>
		</header>

		<div class="bohemcars-compare-mobile__pair-switcher">
			{#each pairOptions as option, index (option.id)}
				<input
					class="bohemcars-compare-mobile__pair-radio"
					type="radio"
					name={pairInputName}
					id={`${pairInputName}-${index}`}
					checked={index === 0}
				/>
			{/each}

			<div class="bohemcars-compare-mobile__picker">
				<p>{pairChoiceLabel}</p>
				<div class="bohemcars-compare-mobile__picker-rail">
					{#each pairOptions as option, index (option.id)}
						<label class="bohemcars-compare-mobile__picker-card" for={`${pairInputName}-${index}`}>
							{#each option.vehicles as vehicle (vehicle.slug)}
								<span>{vehicle.title}</span>
							{/each}
						</label>
					{/each}
				</div>
			</div>

			<div class="bohemcars-compare-mobile__pair-panels">
				{#each pairOptions as option (option.id)}
					<article class="bohemcars-compare-mobile__pair-panel">
						<div class="bohemcars-compare-mobile__selected-cars">
							{#each option.vehicles as vehicle, index (vehicle.slug)}
								<div
									class="bohemcars-compare-mobile__selected-card"
									data-bohemcars-compare-column={vehicle.slug}
								>
									<span>{index === 0 ? 'A' : 'B'}</span>
									<button
										class="bohemcars-compare-mobile__remove"
										type="button"
										data-bohemcars-compare-remove={vehicle.slug}
										aria-label={`${removeLabel} ${vehicle.title}`}
										title={`${removeLabel} ${vehicle.title}`}
									>
										<img src="/assets/icons/close-modal.svg" alt="" aria-hidden="true" />
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
							{/each}
						</div>

						<div class="bohemcars-compare-mobile__pair-table">
							{#each option.groups as group (group.title)}
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
											{#each row.values as value, valueIndex (`mobile-pair-${row.label}-${option.vehicles[valueIndex]?.slug ?? valueIndex}`)}
												<div class="bohemcars-compare-mobile__pair-value">{value}</div>
											{/each}
										</div>
									{/each}
								</details>
							{/each}
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<details class="bohemcars-compare-mobile__all">
		<summary>
			<span>{matrixLabel}</span>
			<b>{vehicles.length}</b>
		</summary>
		<div
			class="bohemcars-compare-mobile__matrix"
			aria-label={matrixLabel}
			style:--vehicle-count={vehicles.length}
		>
			<div class="bohemcars-compare-mobile__scroller">
				<div class="bohemcars-compare-mobile__head-row">
					<div class="bohemcars-compare-mobile__corner">{parameterLabel}</div>
					{#each vehicles as vehicle (vehicle.slug)}
						<article
							class="bohemcars-compare-mobile__mini-car"
							data-bohemcars-compare-column={vehicle.slug}
						>
							<button
								class="bohemcars-compare-mobile__remove"
								type="button"
								data-bohemcars-compare-remove={vehicle.slug}
								aria-label={`${removeLabel} ${vehicle.title}`}
								title={`${removeLabel} ${vehicle.title}`}
							>
								<img src="/assets/icons/close-modal.svg" alt="" aria-hidden="true" />
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
								{#each row.values as value, index (`mobile-row-${row.label}-${vehicles[index]?.slug ?? index}`)}
									<div class="bohemcars-compare-mobile__value">{value}</div>
								{/each}
							</div>
						{/each}
					</details>
				{/each}
			</div>
		</div>
	</details>
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
			gap: 8px;
			min-width: 0;
			color: #111111;
		}

		.bohemcars-compare-mobile__pair {
			display: grid;
			gap: 8px;
			overflow: hidden;
			border-radius: 10px;
			background: #111111;
			padding: 8px;
		}

		.bohemcars-compare-mobile__pair-head {
			display: flex;
			min-height: 38px;
			align-items: center;
			justify-content: space-between;
			gap: 10px;
			color: #ffffff;
		}

		.bohemcars-compare-mobile__pair-head p {
			margin: 0;
			color: rgb(255 255 255 / 0.72);
			font-size: 12px;
			font-weight: 600;
			line-height: 16px;
			letter-spacing: 0.04em;
			text-transform: uppercase;
		}

		.bohemcars-compare-mobile__pair-head strong {
			display: block;
			margin-top: 1px;
			color: #ffffff;
			font-size: 16px;
			font-weight: 700;
			line-height: 20px;
		}

		.bohemcars-compare-mobile__pair-switcher {
			position: relative;
			display: grid;
			gap: 8px;
		}

		.bohemcars-compare-mobile__pair-radio {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			clip-path: inset(50%);
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
			border-radius: 8px;
			background: #f6f8f0;
			padding: 8px;
		}

		.bohemcars-compare-mobile__selected-card > span {
			width: fit-content;
			border-radius: 999px;
			background: #111111;
			color: #d9f275;
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

		.bohemcars-compare-mobile__picker {
			display: grid;
			gap: 6px;
		}

		.bohemcars-compare-mobile__picker > p {
			margin: 0;
			color: rgb(255 255 255 / 0.74);
			font-size: 12px;
			font-weight: 600;
			line-height: 16px;
			letter-spacing: 0.04em;
			text-transform: uppercase;
		}

		.bohemcars-compare-mobile__picker-rail {
			display: flex;
			gap: 7px;
			overflow-x: auto;
			padding-bottom: 1px;
			scrollbar-width: none;
			-webkit-overflow-scrolling: touch;
		}

		.bohemcars-compare-mobile__picker-rail::-webkit-scrollbar {
			display: none;
		}

		.bohemcars-compare-mobile__picker-card {
			position: relative;
			display: grid;
			width: 112px;
			min-width: 112px;
			min-height: 48px;
			align-content: center;
			gap: 1px;
			border: 1px solid rgb(255 255 255 / 0.14);
			border-radius: 999px;
			background: rgb(255 255 255 / 0.08);
			color: #ffffff;
			cursor: pointer;
			padding: 6px 10px;
			text-align: left;
		}

		.bohemcars-compare-mobile__pair-radio:nth-of-type(1):checked
			~ .bohemcars-compare-mobile__picker
			.bohemcars-compare-mobile__picker-card:nth-child(1),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(2):checked
			~ .bohemcars-compare-mobile__picker
			.bohemcars-compare-mobile__picker-card:nth-child(2),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(3):checked
			~ .bohemcars-compare-mobile__picker
			.bohemcars-compare-mobile__picker-card:nth-child(3),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(4):checked
			~ .bohemcars-compare-mobile__picker
			.bohemcars-compare-mobile__picker-card:nth-child(4),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(5):checked
			~ .bohemcars-compare-mobile__picker
			.bohemcars-compare-mobile__picker-card:nth-child(5),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(6):checked
			~ .bohemcars-compare-mobile__picker
			.bohemcars-compare-mobile__picker-card:nth-child(6),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(7):checked
			~ .bohemcars-compare-mobile__picker
			.bohemcars-compare-mobile__picker-card:nth-child(7),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(8):checked
			~ .bohemcars-compare-mobile__picker
			.bohemcars-compare-mobile__picker-card:nth-child(8),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(9):checked
			~ .bohemcars-compare-mobile__picker
			.bohemcars-compare-mobile__picker-card:nth-child(9),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(10):checked
			~ .bohemcars-compare-mobile__picker
			.bohemcars-compare-mobile__picker-card:nth-child(10),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(11):checked
			~ .bohemcars-compare-mobile__picker
			.bohemcars-compare-mobile__picker-card:nth-child(11),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(12):checked
			~ .bohemcars-compare-mobile__picker
			.bohemcars-compare-mobile__picker-card:nth-child(12) {
			border-color: #d9f275;
			background: #d9f275;
			color: #111111;
		}

		.bohemcars-compare-mobile__picker-card span {
			display: block;
			min-width: 0;
			overflow: hidden;
			color: inherit;
			font-size: 12px;
			font-weight: 600;
			line-height: 15px;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.bohemcars-compare-mobile__picker-card span + span::before {
			content: 'vs';
			margin-right: 4px;
			color: inherit;
			font-size: 12px;
			font-weight: 600;
			opacity: 0.6;
			text-transform: uppercase;
		}

		.bohemcars-compare-mobile__pair-panels {
			min-width: 0;
		}

		.bohemcars-compare-mobile__pair-panel {
			display: none;
			gap: 8px;
		}

		.bohemcars-compare-mobile__pair-radio:nth-of-type(1):checked
			~ .bohemcars-compare-mobile__pair-panels
			.bohemcars-compare-mobile__pair-panel:nth-child(1),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(2):checked
			~ .bohemcars-compare-mobile__pair-panels
			.bohemcars-compare-mobile__pair-panel:nth-child(2),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(3):checked
			~ .bohemcars-compare-mobile__pair-panels
			.bohemcars-compare-mobile__pair-panel:nth-child(3),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(4):checked
			~ .bohemcars-compare-mobile__pair-panels
			.bohemcars-compare-mobile__pair-panel:nth-child(4),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(5):checked
			~ .bohemcars-compare-mobile__pair-panels
			.bohemcars-compare-mobile__pair-panel:nth-child(5),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(6):checked
			~ .bohemcars-compare-mobile__pair-panels
			.bohemcars-compare-mobile__pair-panel:nth-child(6),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(7):checked
			~ .bohemcars-compare-mobile__pair-panels
			.bohemcars-compare-mobile__pair-panel:nth-child(7),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(8):checked
			~ .bohemcars-compare-mobile__pair-panels
			.bohemcars-compare-mobile__pair-panel:nth-child(8),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(9):checked
			~ .bohemcars-compare-mobile__pair-panels
			.bohemcars-compare-mobile__pair-panel:nth-child(9),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(10):checked
			~ .bohemcars-compare-mobile__pair-panels
			.bohemcars-compare-mobile__pair-panel:nth-child(10),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(11):checked
			~ .bohemcars-compare-mobile__pair-panels
			.bohemcars-compare-mobile__pair-panel:nth-child(11),
		.bohemcars-compare-mobile__pair-radio:nth-of-type(12):checked
			~ .bohemcars-compare-mobile__pair-panels
			.bohemcars-compare-mobile__pair-panel:nth-child(12) {
			display: grid;
		}

		.bohemcars-compare-mobile__pair-table {
			overflow: hidden;
			border-radius: 8px;
			background: #ffffff;
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
			background: #111111;
			color: #d9f275;
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

		.bohemcars-compare-mobile__remove img {
			width: 14px;
			height: 14px;
			object-fit: contain;
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
