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
