<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		ArrowUpDown,
		Car,
		ChevronDown,
		Fuel,
		Gauge,
		Search,
		SlidersHorizontal
	} from '@lucide/svelte';
	import type { AuxeroInventoryVehicleCard } from '$lib/auxero/inventory';
	import type { InventoryMobileData } from '$lib/auxero/inventory-mobile';
	import type { InventoryCopy } from '$lib/i18n/messages';

	let {
		cards,
		copy,
		mobile
	}: {
		cards: AuxeroInventoryVehicleCard[];
		copy: InventoryCopy;
		mobile: InventoryMobileData;
	} = $props();

	const searchDrawerId = 'bohemcars-inventory-mobile-search-toggle';
	const filterDrawerId = 'bohemcars-inventory-mobile-filter-toggle';
	const useFallbackImage = (event: Event) => {
		const image = event.currentTarget as HTMLImageElement;

		if (!image.src.endsWith('/assets/bohemcars/hero/home-hero-available-inventory-wow.webp')) {
			image.src = '/assets/bohemcars/hero/home-hero-available-inventory-wow.webp';
		}
	};
	const mobileImage = (card: AuxeroInventoryVehicleCard) =>
		card.slug === '21764342419542174'
			? '/assets/bohemcars/hero/home-hero-available-inventory-wow.webp'
			: card.image;
</script>

<div class="bohemcars-inventory-mobile">
	<input
		id={searchDrawerId}
		class="bohemcars-inventory-mobile__drawer-toggle"
		type="checkbox"
		aria-label={mobile.searchDrawerTitle}
	/>
	<input
		id={filterDrawerId}
		class="bohemcars-inventory-mobile__drawer-toggle"
		type="checkbox"
		aria-label={mobile.drawerTitle}
	/>
	<main class="bohemcars-inventory-mobile__main">
		<div class="bohemcars-inventory-mobile__search">
			<div class="bohemcars-inventory-mobile__search-field">
				<label
					class="bohemcars-inventory-mobile__search-label"
					for={searchDrawerId}
					aria-haspopup="dialog"
					aria-controls="bohemcars-inventory-mobile-search-drawer"
				>
					<Search size={21} strokeWidth={2.15} aria-hidden="true" />
					<span class:active={Boolean(mobile.searchValue)}>
						{mobile.searchValue || mobile.searchPlaceholder}
					</span>
				</label>
				<label
					class="bohemcars-inventory-mobile__search-action"
					for={searchDrawerId}
					aria-label={mobile.searchLabel}
					aria-controls="bohemcars-inventory-mobile-search-drawer"
				>
					<Search size={21} strokeWidth={2.25} aria-hidden="true" />
				</label>
			</div>
		</div>

		<div class="bohemcars-inventory-mobile__selects" aria-label={mobile.filterLabel}>
			<label
				for={filterDrawerId}
				aria-haspopup="dialog"
				aria-controls="bohemcars-inventory-mobile-filter-drawer"
			>
				<span>{mobile.brandLabel}</span>
				<strong>{mobile.brandValue}</strong>
				<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
			</label>
			<label
				for={filterDrawerId}
				aria-haspopup="dialog"
				aria-controls="bohemcars-inventory-mobile-filter-drawer"
			>
				<span>{mobile.modelLabel}</span>
				<strong>{mobile.modelValue}</strong>
				<ChevronDown size={17} strokeWidth={2.1} aria-hidden="true" />
			</label>
		</div>

		<nav class="bohemcars-inventory-mobile__tools" aria-label={mobile.filterLabel}>
			<label
				for={filterDrawerId}
				aria-haspopup="dialog"
				aria-controls="bohemcars-inventory-mobile-filter-drawer"
			>
				<SlidersHorizontal size={18} strokeWidth={2.2} aria-hidden="true" />
				{mobile.filterLabel}
			</label>
			<label
				for={filterDrawerId}
				aria-haspopup="dialog"
				aria-controls="bohemcars-inventory-mobile-filter-drawer"
			>
				<ArrowUpDown size={18} strokeWidth={2.2} aria-hidden="true" />
				{mobile.sortLabel}
			</label>
			<a
				class:active={mobile.totalPill.active}
				href={resolve(mobile.totalPill.href as '/inventory')}
			>
				<Car size={18} strokeWidth={2.2} aria-hidden="true" />
				{mobile.totalPill.label}
			</a>
			{#each mobile.quickPills.slice(1) as pill (pill.href)}
				<a class:active={pill.active} href={resolve(pill.href as '/inventory')}>
					{#if pill.image}
						<img src={pill.image} alt="" aria-hidden="true" />
					{/if}
					{pill.label}
				</a>
			{/each}
		</nav>

		{#if mobile.activeFilters.length}
			<nav class="bohemcars-inventory-mobile__active" aria-label={copy.reset}>
				{#each mobile.activeFilters as filter (filter.href)}
					<a href={resolve(filter.href as '/inventory')}>{filter.label}</a>
				{/each}
				<a href={resolve(mobile.clearHref as '/inventory')}>{copy.reset}</a>
			</nav>
		{/if}

		<section class="bohemcars-inventory-mobile__cards" aria-label={mobile.countLabel}>
			{#each cards as card (card.slug)}
				<article class="bohemcars-inventory-mobile-card">
					<a
						class="bohemcars-inventory-mobile-card__image"
						href={resolve('/inventory/[slug]', { slug: card.slug })}
					>
						<img src={mobileImage(card)} alt={card.title} onerror={useFallbackImage} />
						<span>{card.tag}</span>
					</a>
					<div class="bohemcars-inventory-mobile-card__body">
						<p>{card.brand}</p>
						<h2>
							<a href={resolve('/inventory/[slug]', { slug: card.slug })}>{card.title}</a>
						</h2>
						<strong>{card.priceLabel}</strong>
						<small>{card.monthlyLabel}</small>
						<ul>
							<li><Gauge size={14} strokeWidth={2} aria-hidden="true" />{card.mileageLabel}</li>
							<li>{card.year}</li>
							<li><Fuel size={14} strokeWidth={2} aria-hidden="true" />{card.fuel}</li>
							<li>{card.transmission}</li>
						</ul>
					</div>
				</article>
			{:else}
				<div class="bohemcars-inventory-mobile__empty">
					<h2>{copy.emptyTitle}</h2>
					<p>{copy.emptyBody}</p>
					<a href={resolve('/inventory')}>{copy.reset}</a>
				</div>
			{/each}
		</section>
	</main>

	<div
		id="bohemcars-inventory-mobile-search-drawer"
		class="bohemcars-inventory-mobile-drawer bohemcars-inventory-mobile-drawer--search"
		role="dialog"
		aria-modal="true"
		aria-labelledby="bohemcars-inventory-mobile-search-title"
	>
		<label class="bohemcars-inventory-mobile-drawer__backdrop" for={searchDrawerId}>
			<span>{mobile.closeLabel}</span>
		</label>
		<section class="bohemcars-inventory-mobile-drawer__sheet">
			<header>
				<div>
					<p>{mobile.searchLabel}</p>
					<h2 id="bohemcars-inventory-mobile-search-title">{mobile.searchDrawerTitle}</h2>
				</div>
				<label for={searchDrawerId} aria-label={mobile.closeLabel}>×</label>
			</header>
			<form
				class="bohemcars-inventory-mobile-drawer__search-form"
				action={resolve('/inventory')}
				method="get"
			>
				{#each mobile.hiddenInputs as input (`${input.name}-${input.value}`)}
					<input type="hidden" name={input.name} value={input.value} />
				{/each}
				<div class="bohemcars-inventory-mobile-drawer__search-box">
					<Search size={20} strokeWidth={2.15} aria-hidden="true" />
					<input
						name="q"
						type="search"
						value={mobile.searchValue}
						placeholder={mobile.searchPlaceholder}
						autocomplete="off"
						aria-label={mobile.searchPlaceholder}
					/>
				</div>
				<button type="submit">{mobile.searchLabel}</button>
			</form>
			<div class="bohemcars-inventory-mobile-drawer__group">
				<p>{mobile.brandLabel}</p>
				<div>
					{#each mobile.brandOptions.slice(1, 7) as option (option.value)}
						<a class:active={option.active} href={resolve(option.href as '/inventory')}>
							{option.label}
						</a>
					{/each}
				</div>
			</div>
			<div class="bohemcars-inventory-mobile-drawer__group">
				<p>{mobile.bodyLabel}</p>
				<div>
					{#each mobile.bodyOptions.slice(1, 7) as option (option.value)}
						<a class:active={option.active} href={resolve(option.href as '/inventory')}>
							{option.label}
						</a>
					{/each}
				</div>
			</div>
			<a class="bohemcars-inventory-mobile-drawer__clear" href={resolve('/inventory')}>
				{mobile.countLabel}
			</a>
		</section>
	</div>

	<div
		id="bohemcars-inventory-mobile-filter-drawer"
		class="bohemcars-inventory-mobile-drawer bohemcars-inventory-mobile-drawer--filters"
		role="dialog"
		aria-modal="true"
		aria-labelledby="bohemcars-inventory-mobile-filter-title"
	>
		<label class="bohemcars-inventory-mobile-drawer__backdrop" for={filterDrawerId}>
			<span>{mobile.closeLabel}</span>
		</label>
		<section class="bohemcars-inventory-mobile-drawer__sheet">
			<header>
				<div>
					<p>{mobile.filterLabel}</p>
					<h2 id="bohemcars-inventory-mobile-filter-title">{mobile.drawerTitle}</h2>
				</div>
				<label for={filterDrawerId} aria-label={mobile.closeLabel}>×</label>
			</header>
			<div class="bohemcars-inventory-mobile-drawer__group">
				<p>{mobile.brandLabel}</p>
				<div>
					{#each mobile.brandOptions as option (option.value)}
						<a class:active={option.active} href={resolve(option.href as '/inventory')}>
							<span>{option.label}</span>
							{#if option.countLabel}
								<small>{option.countLabel}</small>
							{/if}
						</a>
					{/each}
				</div>
			</div>
			<div class="bohemcars-inventory-mobile-drawer__group">
				<p>{mobile.modelLabel}</p>
				<div>
					{#each mobile.modelOptions as option (option.value)}
						<a class:active={option.active} href={resolve(option.href as '/inventory')}>
							<span>{option.label}</span>
							{#if option.countLabel}
								<small>{option.countLabel}</small>
							{/if}
						</a>
					{/each}
				</div>
			</div>
			<div class="bohemcars-inventory-mobile-drawer__group">
				<p>{mobile.bodyLabel}</p>
				<div>
					{#each mobile.bodyOptions as option (option.value)}
						<a class:active={option.active} href={resolve(option.href as '/inventory')}>
							<span>{option.label}</span>
							{#if option.countLabel}
								<small>{option.countLabel}</small>
							{/if}
						</a>
					{/each}
				</div>
			</div>
			<div class="bohemcars-inventory-mobile-drawer__group">
				<p>{mobile.sortLabel}</p>
				<div>
					{#each mobile.sortOptions as option (option.value)}
						<a class:active={option.active} href={resolve(option.href as '/inventory')}>
							<span>{option.label}</span>
						</a>
					{/each}
				</div>
			</div>
			<div class="bohemcars-inventory-mobile-drawer__group">
				<p>{mobile.fuelLabel}</p>
				<div>
					{#each mobile.fuelOptions as option (option.value)}
						<a class:active={option.active} href={resolve(option.href as '/inventory')}>
							<span>{option.label}</span>
							{#if option.countLabel}
								<small>{option.countLabel}</small>
							{/if}
						</a>
					{/each}
				</div>
			</div>
			<div class="bohemcars-inventory-mobile-drawer__actions">
				<a class="bohemcars-inventory-mobile-drawer__clear" href={resolve(mobile.clearHref as '/')}>
					{copy.reset}
				</a>
				<label class="bohemcars-inventory-mobile-drawer__done" for={filterDrawerId}>
					{mobile.doneLabel}
				</label>
			</div>
		</section>
	</div>
</div>

<style>
	.bohemcars-inventory-mobile {
		min-height: 100vh;
		background: #ffffff;
		color: #111111;
	}

	.bohemcars-inventory-mobile__drawer-toggle {
		position: fixed;
		width: 1px;
		height: 1px;
		opacity: 0;
		pointer-events: none;
	}

	.bohemcars-inventory-mobile__main {
		display: grid;
		gap: 10px;
		padding: 14px 14px 92px;
	}

	.bohemcars-inventory-mobile__search {
		display: block;
	}

	.bohemcars-inventory-mobile__search-field {
		display: flex;
		min-height: 52px;
		min-width: 0;
		align-items: center;
		gap: 12px;
		border: 1px solid #dce3dc;
		border-radius: 999px;
		background: #eef1f5;
		padding: 5px 5px 5px 15px;
		color: #1c1c1c;
	}

	.bohemcars-inventory-mobile__search-label {
		display: flex;
		min-width: 0;
		height: 42px !important;
		flex: 1 1 auto;
		align-items: center;
		gap: 12px;
		color: #1c1c1c;
		cursor: pointer;
	}

	.bohemcars-inventory-mobile__search-label span {
		display: block;
		min-width: 0;
		overflow: hidden;
		color: #9ba0a5;
		font-size: 16px;
		font-weight: 700;
		line-height: 22px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.bohemcars-inventory-mobile__search-label span.active {
		color: #1c1c1c;
	}

	.bohemcars-inventory-mobile__search-label :global(svg) {
		flex: 0 0 21px;
	}

	.bohemcars-inventory-mobile__search-action {
		display: flex;
		width: 42px;
		height: 42px;
		align-items: center;
		justify-content: center;
		flex: 0 0 42px;
		border: 0 !important;
		border-radius: 999px;
		background: #1c1c1c;
		box-shadow: none !important;
		color: #ffffff;
		cursor: pointer;
		padding: 0;
	}

	.bohemcars-inventory-mobile__search-action :global(svg),
	.bohemcars-inventory-mobile__search-action :global(path) {
		stroke: #ffffff;
	}

	.bohemcars-inventory-mobile__selects {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 9px;
	}

	.bohemcars-inventory-mobile__selects label {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 2px 8px;
		min-height: 50px;
		align-items: center;
		border: 1px solid #dce3dc;
		border-radius: 12px;
		background: #eef1f5;
		padding: 7px 12px;
		cursor: pointer;
		text-align: left;
	}

	.bohemcars-inventory-mobile__selects span {
		color: #728093;
		font-size: 11px;
		font-weight: 900;
		line-height: 13px;
		text-transform: uppercase;
	}

	.bohemcars-inventory-mobile__selects strong {
		overflow: hidden;
		color: #111111;
		font-size: 15px;
		font-weight: 900;
		line-height: 18px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.bohemcars-inventory-mobile__selects :global(svg) {
		grid-row: 1 / span 2;
		grid-column: 2;
		color: #111111;
	}

	.bohemcars-inventory-mobile__tools,
	.bohemcars-inventory-mobile__active {
		display: flex;
		gap: 8px;
		margin: 8px -14px 0;
		overflow-x: auto;
		padding: 0 14px 2px;
		scrollbar-width: none;
	}

	.bohemcars-inventory-mobile__tools::-webkit-scrollbar,
	.bohemcars-inventory-mobile__active::-webkit-scrollbar {
		display: none;
	}

	.bohemcars-inventory-mobile__tools a,
	.bohemcars-inventory-mobile__tools label,
	.bohemcars-inventory-mobile__active a {
		display: inline-flex;
		flex: 0 0 auto;
		min-height: 42px;
		align-items: center;
		gap: 8px;
		border: 0;
		border-radius: 11px;
		background: #eef1f5;
		padding: 0 13px;
		color: #1c1c1c;
		cursor: pointer;
		font-size: 15px;
		font-weight: 800;
		line-height: 18px;
	}

	.bohemcars-inventory-mobile__tools a.active,
	.bohemcars-inventory-mobile__tools label:focus-visible,
	.bohemcars-inventory-mobile__tools a:focus-visible,
	.bohemcars-inventory-mobile__active a:focus-visible {
		background: #d9f275;
		color: #1c1c1c;
	}

	.bohemcars-inventory-mobile__tools img {
		width: 24px;
		height: 20px;
		object-fit: contain;
	}

	.bohemcars-inventory-mobile__active a {
		min-height: 34px;
		border: 1px solid #d7ded7;
		border-radius: 999px;
		background: #ffffff;
		font-size: 13px;
	}

	.bohemcars-inventory-mobile__cards {
		display: grid;
		gap: 10px;
		margin-top: 8px;
	}

	.bohemcars-inventory-mobile-card {
		display: grid;
		grid-template-columns: 132px minmax(0, 1fr);
		min-height: 154px;
		overflow: hidden;
		border: 1px solid #d8e0dc;
		border-radius: 8px;
		background: #eef1f5;
	}

	.bohemcars-inventory-mobile-card__image {
		position: relative;
		display: block;
		min-height: 154px;
		overflow: hidden;
	}

	.bohemcars-inventory-mobile-card__image img {
		display: block;
		width: 100%;
		height: 100%;
		min-height: 154px;
		object-fit: cover;
	}

	.bohemcars-inventory-mobile-card__image span {
		position: absolute;
		top: 8px;
		left: 8px;
		min-height: 24px;
		border-radius: 999px;
		background: #8fbd24;
		padding: 0 8px;
		color: #ffffff;
		font-size: 10px;
		font-weight: 900;
		line-height: 24px;
		text-transform: uppercase;
	}

	.bohemcars-inventory-mobile-card__body {
		display: grid;
		align-content: start;
		padding: 9px 10px;
	}

	.bohemcars-inventory-mobile-card__body p {
		margin: 0 0 1px;
		color: #728093;
		font-size: 11px;
		font-weight: 900;
		line-height: 13px;
		text-transform: uppercase;
	}

	.bohemcars-inventory-mobile-card__body h2 {
		display: -webkit-box;
		min-height: 40px;
		margin: 0 0 5px;
		overflow: hidden;
		color: #101010;
		font-size: 16px;
		font-weight: 900;
		line-height: 20px;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.bohemcars-inventory-mobile-card__body h2 a {
		color: inherit;
	}

	.bohemcars-inventory-mobile-card__body strong {
		color: #8fbd24;
		font-size: 18px;
		font-weight: 900;
		line-height: 21px;
	}

	.bohemcars-inventory-mobile-card__body small {
		margin-bottom: 7px;
		color: #67717d;
		font-size: 11px;
		font-weight: 800;
		line-height: 14px;
	}

	.bohemcars-inventory-mobile-card__body ul {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.bohemcars-inventory-mobile-card__body li {
		display: flex;
		min-width: 0;
		min-height: 25px;
		align-items: center;
		justify-content: center;
		gap: 4px;
		overflow: hidden;
		border-radius: 7px;
		background: #ffffff;
		padding: 0 5px;
		color: #4b5563;
		font-size: 11px;
		font-weight: 800;
		line-height: 13px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.bohemcars-inventory-mobile__empty {
		border-radius: 8px;
		background: #eef1f5;
		padding: 18px;
	}

	.bohemcars-inventory-mobile__empty h2 {
		margin: 0 0 6px;
		font-size: 18px;
		line-height: 24px;
	}

	.bohemcars-inventory-mobile__empty p {
		margin: 0 0 12px;
		color: #67717d;
	}

	.bohemcars-inventory-mobile__empty a {
		color: #8fbd24;
		font-weight: 900;
	}

	.bohemcars-inventory-mobile-drawer {
		position: fixed;
		inset: 0;
		z-index: 80;
		visibility: hidden;
		pointer-events: none;
	}

	#bohemcars-inventory-mobile-search-toggle:checked ~ .bohemcars-inventory-mobile-drawer--search,
	#bohemcars-inventory-mobile-filter-toggle:checked ~ .bohemcars-inventory-mobile-drawer--filters {
		visibility: visible;
		pointer-events: auto;
	}

	.bohemcars-inventory-mobile-drawer__backdrop {
		position: absolute;
		inset: 0;
		display: block;
		border: 0;
		background: rgba(17, 17, 17, 0.34);
		cursor: pointer;
		opacity: 0;
		transition: opacity 0.18s ease;
	}

	.bohemcars-inventory-mobile-drawer__backdrop span {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	.bohemcars-inventory-mobile-drawer__sheet {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		display: grid;
		max-height: 86vh;
		gap: 16px;
		overflow-y: auto;
		border-radius: 18px 18px 0 0;
		background: #ffffff;
		padding: 18px 16px 22px;
		transform: translateY(100%);
		transition: transform 0.22s ease;
		-webkit-overflow-scrolling: touch;
	}

	#bohemcars-inventory-mobile-search-toggle:checked
		~ .bohemcars-inventory-mobile-drawer--search
		.bohemcars-inventory-mobile-drawer__backdrop,
	#bohemcars-inventory-mobile-filter-toggle:checked
		~ .bohemcars-inventory-mobile-drawer--filters
		.bohemcars-inventory-mobile-drawer__backdrop {
		opacity: 1;
	}

	#bohemcars-inventory-mobile-search-toggle:checked
		~ .bohemcars-inventory-mobile-drawer--search
		.bohemcars-inventory-mobile-drawer__sheet,
	#bohemcars-inventory-mobile-filter-toggle:checked
		~ .bohemcars-inventory-mobile-drawer--filters
		.bohemcars-inventory-mobile-drawer__sheet {
		transform: translateY(0);
	}

	.bohemcars-inventory-mobile-drawer__sheet header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.bohemcars-inventory-mobile-drawer__sheet header div {
		min-width: 0;
	}

	.bohemcars-inventory-mobile-drawer__sheet header p {
		margin: 0 0 2px;
		color: #8fbd24;
		font-size: 11px;
		font-weight: 900;
		line-height: 14px;
		text-transform: uppercase;
	}

	.bohemcars-inventory-mobile-drawer__sheet h2 {
		margin: 0;
		font-size: 22px;
		font-weight: 900;
		line-height: 28px;
	}

	.bohemcars-inventory-mobile-drawer__sheet header label {
		display: flex;
		width: 38px;
		height: 38px;
		align-items: center;
		justify-content: center;
		flex: 0 0 38px;
		border: 0;
		border-radius: 50%;
		background: #eef1f5;
		color: #111111;
		cursor: pointer;
		font-size: 28px;
		line-height: 34px;
	}

	.bohemcars-inventory-mobile-drawer__search-form {
		display: grid;
		gap: 10px;
	}

	.bohemcars-inventory-mobile-drawer__search-box {
		display: flex;
		min-height: 50px;
		align-items: center;
		gap: 10px;
		border-radius: 999px;
		background: #eef1f5;
		padding: 0 13px;
		color: #111111;
	}

	.bohemcars-inventory-mobile-drawer__search-box input {
		min-width: 0;
		width: 100%;
		height: 48px;
		flex: 1 1 auto;
		border: 0 !important;
		border-radius: 0 !important;
		background: transparent !important;
		box-shadow: none !important;
		color: #111111;
		font-size: 16px;
		font-weight: 700;
		line-height: 22px;
		outline: 0;
		padding: 0 !important;
		appearance: none;
	}

	.bohemcars-inventory-mobile-drawer__search-form button {
		min-height: 46px;
		border: 0;
		border-radius: 10px;
		background: #1c1c1c;
		color: #ffffff;
		font-size: 15px;
		font-weight: 900;
		line-height: 20px;
	}

	.bohemcars-inventory-mobile-drawer__group {
		display: grid;
		gap: 9px;
	}

	.bohemcars-inventory-mobile-drawer__group p {
		margin: 0;
		color: #728093;
		font-size: 12px;
		font-weight: 900;
		line-height: 16px;
		text-transform: uppercase;
	}

	.bohemcars-inventory-mobile-drawer__group div {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.bohemcars-inventory-mobile-drawer__group a,
	.bohemcars-inventory-mobile-drawer__clear {
		display: inline-flex;
		min-height: 38px;
		align-items: center;
		gap: 7px;
		border-radius: 9px;
		background: #eef1f5;
		padding: 0 12px;
		color: #111111;
		font-size: 14px;
		font-weight: 800;
		line-height: 18px;
	}

	.bohemcars-inventory-mobile-drawer__group a.active {
		background: #d9f275;
	}

	.bohemcars-inventory-mobile-drawer__group a span {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.bohemcars-inventory-mobile-drawer__group a small {
		display: inline-flex;
		min-width: 21px;
		height: 21px;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: #ffffff;
		color: #67717d;
		font-size: 11px;
		font-weight: 900;
		line-height: 21px;
	}

	.bohemcars-inventory-mobile-drawer__actions {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 9px;
	}

	.bohemcars-inventory-mobile-drawer__clear {
		justify-content: center;
		background: #1c1c1c;
		color: #ffffff;
	}

	.bohemcars-inventory-mobile-drawer__done {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		justify-content: center;
		border-radius: 9px;
		background: #d9f275;
		color: #111111;
		cursor: pointer;
		font-size: 14px;
		font-weight: 900;
		line-height: 18px;
	}

	@media (max-width: 399px) {
		.bohemcars-inventory-mobile-card {
			grid-template-columns: 124px minmax(0, 1fr);
		}
	}
</style>
