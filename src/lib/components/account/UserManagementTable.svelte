<script lang="ts">
	import { resolve } from '$app/paths';
	import { MessageSquare, ShieldCheck } from '@lucide/svelte';
	import type {
		AuxeroUserManagementData,
		AuxeroUserManagementNote
	} from '$lib/auxero/user-management';

	let {
		notes = [],
		users
	}: { notes?: AuxeroUserManagementNote[]; users: AuxeroUserManagementData } = $props();
</script>

<div class="bohemcars-users-panel">
	<section class="dashboard-box style-3 mb-30 bg-white" data-bohemcars-users-table>
		<div class="mb-20 flex items-center justify-between gap-20">
			<div>
				<p class="h4 mb-4">Users and roles</p>
				<p class="text-secondary mb-0">{users.footerText}</p>
			</div>
			<p class="text-primary font-weight-700 mb-0">{users.rows.length} users</p>
		</div>

		<div class="cart-header lg-grid-cols-6 md-grid-cols-3 sm-grid-cols-2 grid grid-cols-6 gap-20">
			{#each users.headers as header (header)}
				<div>
					<p class="h7 font-weight-600 mb-0">{header}</p>
				</div>
			{/each}
		</div>

		<div class="cart-list">
			{#each users.rows as row (row.id)}
				<div
					class="cart-item lg-grid-cols-6 md-grid-cols-3 sm-grid-cols-1 grid grid-cols-6 gap-20"
					data-bohemcars-user-id={row.id}
					data-bohemcars-user-kind={row.kind}
					data-bohemcars-user-role={row.role.toLowerCase()}
				>
					<div class="cart-item__product flex items-center gap-12">
						<div class="cart-item__img">
							<img src={row.image} alt={row.name} />
						</div>
						<div>
							<p class="cart-item__title clamp-1 clamp mb-4">{row.name}</p>
							<p class="text-secondary clamp-1 clamp mb-0">{row.description}</p>
						</div>
					</div>
					<div class="cart-item__price">
						<p class="price clamp-1 clamp mb-0">{row.columns[0]}</p>
					</div>
					<div>
						<p class="clamp-1 clamp mb-0">{row.columns[1]}</p>
					</div>
					<div>
						<p class="clamp-1 clamp mb-0">{row.columns[2]}</p>
					</div>
					<div class="cart-item__total">
						<p class="clamp-1 clamp mb-0">{row.columns[3]}</p>
					</div>
					<div class="cart-item__action flex items-center gap-8">
						{#each row.actions as action (action.kind)}
							<a href={resolve(action.href)} class="action" aria-label={action.ariaLabel}>
								{#if action.kind === 'message'}
									<MessageSquare size={16} strokeWidth={2.1} aria-hidden="true" />
								{:else}
									<ShieldCheck size={16} strokeWidth={2.1} aria-hidden="true" />
								{/if}
							</a>
						{/each}
					</div>
				</div>
			{:else}
				<div class="cart-item">
					<p class="h6 mb-4">No users yet</p>
					<p class="text-secondary mb-0">New team and customer users will appear here.</p>
				</div>
			{/each}
		</div>
	</section>

	{#if notes.length}
		<section class="dashboard-box style-3 bg-white">
			<div class="mb-20">
				<p class="h4 mb-4">Role access notes</p>
				<p class="text-secondary mb-0">Operational guidance for admin roles.</p>
			</div>
			<div class="md-grid-cols-1 grid grid-cols-3 gap-20">
				{#each notes as note (note.title)}
					<div class="bohemcars-user-note">
						<p class="h6 mb-8">{note.title}</p>
						<p class="text-secondary mb-0">{note.text}</p>
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>

<style>
	.bohemcars-user-note {
		padding: 20px;
		border: 1px solid var(--bc-border, #e4e4e4);
		border-radius: 8px;
		background: var(--bc-surface, #ffffff);
	}
</style>
