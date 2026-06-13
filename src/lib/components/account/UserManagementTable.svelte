<script lang="ts">
	import { resolve } from '$app/paths';
	import { MessageSquare, Search, ShieldCheck } from '@lucide/svelte';
	import type {
		AuxeroUserManagementData,
		AuxeroUserManagementNote
	} from '$lib/auxero/user-management';

	let {
		notes = [],
		searchQuery = '',
		selectedUserRole = 'all',
		users
	}: {
		notes?: AuxeroUserManagementNote[];
		searchQuery?: string;
		selectedUserRole?: string;
		users: AuxeroUserManagementData;
	} = $props();

	let totalUsers = $derived(users.rows.length);
	let adminUsers = $derived(users.rows.filter((row) => row.role.toLowerCase() === 'admin').length);
	let leadUsers = $derived(users.rows.filter((row) => row.role.toLowerCase() === 'lead').length);
	let activeUsers = $derived(
		users.rows.filter((row) => (row.columns[3] ?? '').toLowerCase().includes('active')).length
	);

	let summary = $derived([
		{ label: 'Total users', value: String(totalUsers) },
		{ label: 'Admins', value: String(adminUsers) },
		{ label: 'Leads', value: String(leadUsers) },
		{ label: 'Active', value: String(activeUsers) }
	]);
	const roleFilters = [
		{ id: 'all', label: 'All' },
		{ id: 'admin', label: 'Admin' },
		{ id: 'agent', label: 'Agent' },
		{ id: 'customer', label: 'Customer' },
		{ id: 'lead', label: 'Lead' }
	];

	const roleTone = (role: string) => {
		const normalizedRole = role.toLowerCase();

		if (normalizedRole === 'admin') return 'is-admin';
		if (normalizedRole === 'agent') return 'is-agent';
		if (normalizedRole === 'lead') return 'is-lead';

		return 'is-customer';
	};

	let trimmedSearchQuery = $derived(searchQuery.trim());
</script>

<div class="bohemcars-users-panel">
	<section class="dashboard-box bohemcars-users-card bg-white" data-bohemcars-users-table>
		<div class="bohemcars-users-card__head">
			<div class="bohemcars-users-card__title">
				<p class="h4 mb-6">Users and roles</p>
				<p class="h7 text-secondary mb-0">{users.footerText}</p>
			</div>
			<span class="bohemcars-users-count">{totalUsers} users</span>
		</div>

		<div class="bohemcars-users-summary" aria-label="Users summary">
			{#each summary as item (item.label)}
				<div class="bohemcars-users-summary__item">
					<p>{item.value}</p>
					<span>{item.label}</span>
				</div>
			{/each}
		</div>

		<div class="bohemcars-users-toolbar">
			<form class="bohemcars-users-search" method="GET" action={resolve('/admin/users')}>
				<input type="hidden" name="role" value="admin" />
				{#if selectedUserRole !== 'all'}
					<input type="hidden" name="userRole" value={selectedUserRole} />
				{/if}
				<label class="bohemcars-users-sr" for="admin-users-search">Search users</label>
				<input
					id="admin-users-search"
					type="search"
					name="q"
					value={searchQuery}
					placeholder="Search users"
					autocomplete="off"
				/>
				<button type="submit" aria-label="Search users">
					<Search size={17} strokeWidth={2.1} aria-hidden="true" />
				</button>
			</form>
			<form
				class="bohemcars-users-filters"
				method="GET"
				action={resolve('/admin/users')}
				aria-label="Role filters"
			>
				<input type="hidden" name="role" value="admin" />
				{#if trimmedSearchQuery}
					<input type="hidden" name="q" value={trimmedSearchQuery} />
				{/if}
				{#each roleFilters as filter (filter.id)}
					<button
						type="submit"
						name="userRole"
						value={filter.id}
						class={[selectedUserRole === filter.id && 'state-active']}
						aria-pressed={selectedUserRole === filter.id}
					>
						{filter.label}
					</button>
				{/each}
			</form>
		</div>

		<div class="bohemcars-users-table-wrap">
			<div class="cart-header bohemcars-users-table-grid">
				{#each users.headers as header (header)}
					<div>
						<p class="h7 mb-0">{header}</p>
					</div>
				{/each}
			</div>

			<div class="cart-list bohemcars-users-rows">
				{#each users.rows as row (row.id)}
					<div
						class="cart-item bohemcars-users-table-grid"
						data-bohemcars-user-id={row.id}
						data-bohemcars-user-kind={row.kind}
						data-bohemcars-user-role={row.role.toLowerCase()}
					>
						<div class="cart-item__product bohemcars-users-person">
							<div class="bohemcars-users-avatar">
								<img src={row.image} alt={row.name} />
							</div>
							<div class="bohemcars-users-person__copy">
								<p class="cart-item__title clamp-1 clamp mb-4">{row.name}</p>
								<p class="text-secondary clamp-1 clamp mb-0">{row.description}</p>
							</div>
						</div>
						<div class="cart-item__price bohemcars-users-cell">
							<span class="price clamp-1 clamp" title={row.columns[0] ?? ''}>
								{row.columns[0] ?? ''}
							</span>
						</div>
						<div class="bohemcars-users-cell">
							<span class={['bohemcars-users-role', roleTone(row.columns[1] ?? '')]}>
								{row.columns[1] ?? ''}
							</span>
						</div>
						<div class="bohemcars-users-cell">
							<span class="clamp-1 clamp" title={row.columns[2] ?? ''}>{row.columns[2] ?? ''}</span>
						</div>
						<div class="cart-item__total bohemcars-users-cell">
							<span class="bohemcars-users-status clamp-1 clamp" title={row.columns[3] ?? ''}>
								{row.columns[3] ?? ''}
							</span>
						</div>
						<div class="cart-item__action bohemcars-users-actions">
							{#each row.actions as action (action.kind)}
								<a
									href={resolve(action.href)}
									class="bohemcars-users-action action"
									aria-label={action.ariaLabel}
									title={action.label}
								>
									{#if action.kind === 'message'}
										<MessageSquare size={17} strokeWidth={2.1} aria-hidden="true" />
									{:else}
										<ShieldCheck size={17} strokeWidth={2.1} aria-hidden="true" />
									{/if}
								</a>
							{/each}
						</div>
					</div>
				{:else}
					<div class="cart-item bohemcars-users-empty">
						<p class="h6 mb-4">No users yet</p>
						<p class="text-secondary mb-0">New team and customer users will appear here.</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	{#if notes.length}
		<section class="dashboard-box bohemcars-users-notes bohemcars-users-box bg-white">
			<div class="bohemcars-users-notes__head">
				<p class="h4 mb-6">Бележки за достъп по роли</p>
				<p class="h7 text-secondary mb-0">
					Operational guidance for admin, agent, and customer access.
				</p>
			</div>
			<div class="bohemcars-users-notes__grid">
				{#each notes as note (note.title)}
					<article class="bohemcars-users-note">
						<p class="h6 mb-8">{note.title}</p>
						<p class="h7 text-secondary mb-0">{note.text}</p>
					</article>
				{/each}
			</div>
		</section>
	{/if}
</div>

<style>
	.bohemcars-users-panel {
		display: grid;
		gap: 18px;
	}

	.bohemcars-users-card {
		display: grid;
		gap: 18px;
		border-color: var(--bc-border) !important;
		border-radius: 14px !important;
		background: #ffffff !important;
		box-shadow: none !important;
		padding: 24px !important;
	}

	.bohemcars-users-card__head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 18px;
	}

	.bohemcars-users-card__title {
		min-width: 0;
		max-width: 720px;
	}

	.bohemcars-users-count {
		display: inline-flex;
		min-height: 34px;
		align-items: center;
		border: 1px solid #dfe9d3;
		border-radius: 999px;
		background: #f3f8e9;
		color: #6f9818;
		padding: 0 13px;
		font-size: 13px;
		font-weight: 800;
		line-height: 16px;
		white-space: nowrap;
	}

	.bohemcars-users-summary {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 10px;
	}

	.bohemcars-users-summary__item {
		border: 1px solid var(--bc-border, #e4e4e4);
		border-radius: 8px;
		background: #f8faf4;
		padding: 13px 15px;
	}

	.bohemcars-users-summary__item p,
	.bohemcars-users-summary__item span {
		display: block;
		margin: 0;
	}

	.bohemcars-users-summary__item p {
		color: #1c1c1c;
		font-size: 24px;
		font-weight: 700;
		line-height: 30px;
	}

	.bohemcars-users-summary__item span {
		color: #687064;
		font-size: 12px;
		font-weight: 800;
		line-height: 16px;
		text-transform: uppercase;
	}

	.bohemcars-users-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #f8faf4;
		padding: 10px;
	}

	.bohemcars-users-search {
		display: inline-flex;
		min-width: 220px;
		min-height: 38px;
		align-items: center;
		gap: 9px;
		border: 1px solid #dfe7dc;
		border-radius: 8px;
		background: #ffffff;
		color: #687064;
		padding: 0 12px;
		font-size: 13px;
		font-weight: 700;
		line-height: 17px;
	}

	.bohemcars-users-search input[type='search'] {
		width: 100%;
		min-width: 0;
		border: 0;
		background: transparent;
		color: #1c1c1c;
		outline: 0;
		padding: 0;
		font: inherit;
	}

	.bohemcars-users-search button {
		display: inline-flex;
		width: 28px;
		min-width: 28px;
		height: 28px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 7px;
		background: #f0f7dd;
		color: #6f9818;
		cursor: pointer;
	}

	.bohemcars-users-sr {
		position: absolute;
		overflow: hidden;
		width: 1px;
		height: 1px;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
	}

	.bohemcars-users-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		justify-content: flex-end;
	}

	.bohemcars-users-filters button {
		display: inline-flex;
		min-height: 34px;
		align-items: center;
		border: 1px solid #dfe7dc;
		border-radius: 8px;
		background: #ffffff;
		color: #44513f;
		padding: 0 12px;
		font-size: 12px;
		font-weight: 800;
		font-family: inherit;
		line-height: 16px;
		cursor: pointer;
	}

	.bohemcars-users-filters button:hover,
	.bohemcars-users-filters button:focus-visible,
	.bohemcars-users-filters .state-active {
		border-color: #98bc2a;
		background: #f0f7dd;
		color: #6f9818;
	}

	.bohemcars-users-table-wrap {
		overflow-x: auto;
		border: 1px solid var(--bc-border);
		border-radius: 12px;
		background: #ffffff;
	}

	.bohemcars-users-table-grid {
		display: grid;
		grid-template-columns:
			minmax(300px, 1.6fr) minmax(190px, 1fr) minmax(110px, 0.55fr)
			minmax(190px, 1fr) minmax(120px, 0.6fr) 96px;
		min-width: 1040px;
		align-items: center;
		column-gap: 18px;
	}

	.cart-header.bohemcars-users-table-grid {
		border-bottom: 1px solid var(--bc-border);
		background: #f3f7ed;
		padding: 13px 16px;
	}

	.cart-header.bohemcars-users-table-grid p {
		color: #53613a;
		font-size: 12px;
		font-weight: 800;
		line-height: 15px;
		text-transform: uppercase;
	}

	.bohemcars-users-rows {
		display: grid;
	}

	.cart-item.bohemcars-users-table-grid {
		margin: 0 !important;
		border-bottom: 1px solid var(--bc-border) !important;
		background: #ffffff;
		padding: 14px 16px !important;
	}

	.cart-item.bohemcars-users-table-grid:last-child {
		border-bottom: 0 !important;
	}

	.bohemcars-users-person {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 12px;
	}

	.bohemcars-users-avatar {
		overflow: hidden;
		width: 58px;
		min-width: 58px;
		height: 58px;
		border-radius: 8px;
		background: #eef3e7;
	}

	.bohemcars-users-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.bohemcars-users-person__copy {
		min-width: 0;
	}

	.bohemcars-users-person :global(.cart-item__title),
	.bohemcars-users-person .cart-item__title {
		color: #1c1c1c;
		font-size: 17px;
		font-weight: 800;
		line-height: 22px;
	}

	.bohemcars-users-cell {
		min-width: 0;
		color: #31362d;
		font-size: 14px;
		font-weight: 650;
		line-height: 20px;
	}

	.bohemcars-users-cell .price {
		display: block;
		color: #31362d !important;
		font-size: 14px;
		font-weight: 650;
		line-height: 20px;
	}

	.bohemcars-users-role,
	.bohemcars-users-status {
		display: inline-flex;
		max-width: 100%;
		min-height: 28px;
		align-items: center;
		border-radius: 999px;
		padding: 0 10px;
		font-size: 12px;
		font-weight: 800;
		line-height: 15px;
		white-space: nowrap;
	}

	.bohemcars-users-role {
		background: #eef3e7;
		color: #44513f;
	}

	.bohemcars-users-role.is-admin {
		background: #f0f7dd;
		color: #6f9818;
	}

	.bohemcars-users-role.is-agent {
		background: #eef4ec;
		color: #306247;
	}

	.bohemcars-users-role.is-lead {
		background: #fbf4db;
		color: #8c6404;
	}

	.bohemcars-users-status {
		background: #f3f8e9;
		color: #6f9818;
	}

	.bohemcars-users-actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 8px;
	}

	.bohemcars-users-action {
		display: inline-flex;
		width: 36px;
		height: 36px;
		align-items: center;
		justify-content: center;
		border: 1px solid #dfe7dc;
		border-radius: 8px;
		background: #ffffff;
		color: #8caf24;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.bohemcars-users-action:hover,
	.bohemcars-users-action:focus-visible {
		border-color: #98bc2a;
		background: #f0f7dd;
		color: #6f9818;
	}

	.bohemcars-users-empty {
		padding: 20px !important;
	}

	.bohemcars-users-notes {
		display: grid;
		gap: 18px;
		border-color: var(--bc-border) !important;
		border-radius: 14px !important;
		background: #ffffff !important;
		box-shadow: none !important;
		padding: 24px !important;
	}

	.bohemcars-users-notes__head {
		max-width: 720px;
	}

	.bohemcars-users-notes__grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 10px;
	}

	.bohemcars-users-note {
		min-width: 0;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #f8faf4;
		padding: 16px;
	}

	.bohemcars-users-note p:last-child {
		line-height: 22px;
	}

	@media (max-width: 1199px) {
		.bohemcars-users-summary,
		.bohemcars-users-notes__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 767.98px) {
		.bohemcars-users-card {
			gap: 16px;
			padding: 18px !important;
		}

		.bohemcars-users-card__head,
		.bohemcars-users-toolbar {
			align-items: stretch;
			flex-direction: column;
		}

		.bohemcars-users-search {
			width: 100%;
			min-width: 0;
		}

		.bohemcars-users-filters {
			justify-content: flex-start;
		}

		.bohemcars-users-summary,
		.bohemcars-users-notes__grid {
			grid-template-columns: 1fr;
		}

		.bohemcars-users-summary__item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
		}
	}
</style>
