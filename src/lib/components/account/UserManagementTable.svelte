<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroUserManagementData } from '$lib/auxero/user-management';

	let { users }: { users: AuxeroUserManagementData } = $props();
</script>

<div class="cart-wrapper bohemcars-users-table" data-bohemcars-users-table>
	<div class="cart-header">
		{#each users.headers as header (header)}
			<div class="font-weight-600">{header}</div>
		{/each}
	</div>
	<div class="cart-items">
		{#each users.rows as row (row.id)}
			<div
				class="cart-item"
				data-bohemcars-user-id={row.id}
				data-bohemcars-user-kind={row.kind}
				data-bohemcars-user-role={row.role.toLowerCase()}
			>
				<div class="cart-item__product">
					<div class="cart-item__image"><img src={row.image} alt={row.name} /></div>
					<div class="cart-item__name">
						<p class="h4 clamp-1 clamp mb-8">{row.name}</p>
						<p class="clamp-1 clamp text-secondary mb-12">{row.description}</p>
					</div>
				</div>
				<div class="cart-item__price">
					<span class="clamp-1 clamp price" title={row.columns[0]}>{row.columns[0]}</span>
				</div>
				<div class="cart-item__year">
					<span class="clamp-1 clamp" title={row.columns[1]}>{row.columns[1]}</span>
				</div>
				<div class="cart-item__total">
					<span class="clamp-1 clamp" title={row.columns[2]}>{row.columns[2]}</span>
				</div>
				<div><span class="clamp-1 clamp" title={row.columns[3]}>{row.columns[3]}</span></div>
				<div class="cart-item__action">
					{#each row.actions as action (action.kind)}
						<a
							href={resolve(action.href)}
							class="hover-fill-white cart-item__edit action"
							aria-label={action.ariaLabel}
						>
							<img src={action.icon} alt={action.kind} />
							<p class="tooltip">{action.label}</p>
						</a>
					{/each}
				</div>
			</div>
		{/each}
	</div>
	<div class="divider mb-20 w-full"></div>
	<p class="text-secondary">{users.footerText}</p>
</div>
