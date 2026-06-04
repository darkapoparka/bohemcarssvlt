<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroAccountListingsData } from '$lib/auxero/account-listings';

	let { listings }: { listings: AuxeroAccountListingsData } = $props();
</script>

<div
	class="cart-wrapper bohemcars-account-listings"
	data-bohemcars-account-listings
	data-bohemcars-submissions-table={listings.isSubmissions ? true : undefined}
>
	<div class="cart-header">
		{#each listings.headers as header (header)}
			<div class="font-weight-600">{header}</div>
		{/each}
	</div>
	<div class="cart-items">
		{#each listings.rows as row (row.id)}
			<div
				class="cart-item"
				data-bohemcars-slug={row.kind === 'inventory' ? row.id : undefined}
				data-bohemcars-submission-id={row.kind === 'submission' ? row.id : undefined}
			>
				{#if row.kind === 'inventory'}
					<a href={resolve('/inventory/[slug]', { slug: row.id })} class="cart-item__product">
						<div class="cart-item__image">
							<img src={row.image} alt={row.title} />
						</div>
						<div class="cart-item__name">
							<p class="h4 clamp-1 clamp mb-8">{row.title}</p>
							<p class="clamp-1 clamp text-secondary mb-12">{row.description}</p>
							{#if row.priceLabel}
								<p class="h5">{row.priceLabel}</p>
							{/if}
						</div>
					</a>
				{:else}
					<div class="cart-item__product">
						<div class="cart-item__image">
							<img src={row.image} alt={row.title} />
						</div>
						<div class="cart-item__name">
							<p class="h4 clamp-1 clamp mb-8">{row.title}</p>
							<p class="clamp-1 clamp text-secondary mb-12">{row.description}</p>
							{#if row.titleMeta}
								<p class="h5">{row.titleMeta}</p>
							{/if}
						</div>
					</div>
				{/if}

				<div class="cart-item__price"><span class="price">{row.columns[0]}</span></div>
				<div class="cart-item__year"><span>{row.columns[1]}</span></div>
				<div class="cart-item__total"><span>{row.columns[2]}</span></div>
				<div><span>{row.columns[3]}</span></div>
				<div class="cart-item__action">
					{#each row.actions as action (action.kind)}
						{#if action.kind === 'remove'}
							<div
								class="hover-fill-white cart-item__remove action"
								role="button"
								tabindex="0"
								aria-label={action.ariaLabel}
							>
								<img src={action.icon} alt={action.kind} />
								<p class="tooltip">{action.label}</p>
							</div>
						{:else if action.kind === 'edit-inventory'}
							<a
								href={resolve('/[...templatePath]', {
									templatePath: `admin/inventory/edit/${row.id}`
								})}
								class="hover-fill-white cart-item__edit action"
								aria-label={action.ariaLabel}
							>
								<img src={action.icon} alt={action.kind} />
								<p class="tooltip">{action.label}</p>
							</a>
						{:else if action.kind === 'edit-submission'}
							<a
								href={resolve('/sell-your-car')}
								class="hover-fill-white cart-item__edit action"
								aria-label={action.ariaLabel}
							>
								<img src={action.icon} alt={action.kind} />
								<p class="tooltip">{action.label}</p>
							</a>
						{:else if action.kind === 'message'}
							<a
								href={resolve('/account/messages')}
								class="hover-fill-white cart-item__edit action"
								aria-label={action.ariaLabel}
							>
								<img src={action.icon} alt={action.kind} />
								<p class="tooltip">{action.label}</p>
							</a>
						{/if}
					{/each}
				</div>
			</div>
		{/each}
	</div>
	<div class="divider mb-20 w-full"></div>
	{#if listings.pagination}
		<div
			class="pagination-bottom flex flex-wrap items-center justify-between gap-12"
			id="pagination-bottom"
		>
			<ul class="pagination">
				{#each listings.pagination as item, index (item)}
					<li>
						<a
							href={resolve('/admin/inventory')}
							class={['pagination__link', index === 0 && 'active']}>{item}</a
						>
					</li>
				{/each}
			</ul>
			<p class="text-secondary">{listings.footerText}</p>
		</div>
	{:else}
		<p class="text-secondary">{listings.footerText}</p>
	{/if}
</div>

<style>
	@media (max-width: 767.98px) {
		.bohemcars-account-listings {
			width: 100%;
			overflow: visible;
		}

		.bohemcars-account-listings :global(.cart-header) {
			display: none !important;
		}

		.bohemcars-account-listings :global(.cart-items) {
			display: grid;
			gap: 10px;
		}

		.bohemcars-account-listings :global(.cart-item) {
			display: grid !important;
			width: 100% !important;
			min-width: 0 !important;
			min-height: 0 !important;
			grid-template-columns: 88px minmax(0, 1fr) !important;
			gap: 8px 12px !important;
			align-items: start;
			border: 1px solid var(--bc-border);
			border-radius: 8px;
			background: var(--bc-surface-soft);
			padding: 10px;
		}

		.bohemcars-account-listings :global(.cart-item__product) {
			display: contents !important;
		}

		.bohemcars-account-listings :global(.cart-item__image) {
			width: 88px !important;
			min-width: 88px !important;
			max-width: 88px !important;
			height: 88px !important;
			overflow: hidden;
			border-radius: 8px;
			background: #ffffff;
		}

		.bohemcars-account-listings :global(.cart-item__image img) {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		.bohemcars-account-listings :global(.cart-item__name) {
			width: 100% !important;
			min-width: 0;
			max-width: 100%;
			overflow: hidden;
		}

		.bohemcars-account-listings :global(.cart-item__name .h4) {
			margin-bottom: 4px !important;
			font-size: 20px !important;
			font-weight: 850 !important;
			line-height: 24px !important;
		}

		.bohemcars-account-listings :global(.cart-item__name .h5) {
			font-size: 15px !important;
			line-height: 20px !important;
		}

		.bohemcars-account-listings :global(.cart-item__price),
		.bohemcars-account-listings :global(.cart-item__year),
		.bohemcars-account-listings :global(.cart-item__total),
		.bohemcars-account-listings :global(.cart-item > div:nth-last-child(2)) {
			display: inline-flex !important;
			width: auto !important;
			min-width: 0 !important;
			max-width: 100% !important;
			min-height: 30px;
			align-items: center;
			justify-content: center;
			border-radius: 8px;
			background: #ffffff;
			padding: 0 8px;
			color: #4b5563;
			font-size: 12px;
			font-weight: 800;
			line-height: 15px;
		}

		.bohemcars-account-listings :global(.cart-item__price) {
			grid-column: 1 / 2 !important;
		}

		.bohemcars-account-listings :global(.cart-item__year) {
			grid-column: 2 / 3 !important;
		}

		.bohemcars-account-listings :global(.cart-item__total),
		.bohemcars-account-listings :global(.cart-item > div:nth-last-child(2)) {
			grid-column: 1 / -1 !important;
		}

		.bohemcars-account-listings :global(.cart-item__action) {
			display: flex !important;
			width: auto !important;
			min-width: 0 !important;
			max-width: 100% !important;
			grid-column: 1 / -1 !important;
			justify-content: flex-end;
			gap: 8px;
		}

		.bohemcars-account-listings :global(.cart-item__action .action) {
			width: 44px;
			height: 44px;
			border-radius: 999px;
			background: #ffffff;
		}

		.bohemcars-account-listings[data-bohemcars-submissions-table] :global(.cart-item__price),
		.bohemcars-account-listings[data-bohemcars-submissions-table] :global(.cart-item__year) {
			grid-column: 1 / -1 !important;
		}

		.bohemcars-account-listings :global(.divider) {
			display: none;
		}

		.bohemcars-account-listings > :global(.text-secondary) {
			margin-top: 10px;
			font-size: 12px;
			line-height: 17px;
		}
	}
</style>
