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

<div class="dash-grid">
	<section class="dash-card" data-bohemcars-users-table>
		<div class="dash-card__head">
			<div>
				<h2 class="dash-card__title">Users and roles</h2>
				<p class="dash-card__subtitle">{users.footerText}</p>
			</div>
			<span class="dash-role-pill">{users.rows.length} users</span>
		</div>

		<div class="dash-table-wrap">
			<table class="dash-table">
				<thead>
					<tr>
						{#each users.headers as header (header)}
							<th>{header}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each users.rows as row (row.id)}
						<tr
							data-bohemcars-user-id={row.id}
							data-bohemcars-user-kind={row.kind}
							data-bohemcars-user-role={row.role.toLowerCase()}
						>
							<td>
								<div class="dash-table__vehicle">
									<div class="dash-table__image">
										<img src={row.image} alt={row.name} />
									</div>
									<div class="min-w-0">
										<p class="dash-table__name">{row.name}</p>
										<p class="dash-table__meta">{row.description}</p>
									</div>
								</div>
							</td>
							<td><span class="dash-table__strong">{row.columns[0]}</span></td>
							<td>{row.columns[1]}</td>
							<td>{row.columns[2]}</td>
							<td>{row.columns[3]}</td>
							<td>
								<div class="dash-actions">
									{#each row.actions as action (action.kind)}
										<a
											href={resolve(action.href)}
											class="dash-action"
											aria-label={action.ariaLabel}
										>
											{#if action.kind === 'message'}
												<MessageSquare size={16} strokeWidth={2.1} aria-hidden="true" />
											{:else}
												<ShieldCheck size={16} strokeWidth={2.1} aria-hidden="true" />
											{/if}
										</a>
									{/each}
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan={users.headers.length}>
								<div class="dash-empty">
									<p class="m-0 text-base font-black text-[var(--dash-heading)]">No users yet</p>
									<p class="m-0 mt-2 text-sm font-semibold text-[var(--dash-muted)]">
										New team and customer users will appear here.
									</p>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	{#if notes.length}
		<section class="dash-card">
			<div class="dash-card__head">
				<div>
					<h2 class="dash-card__title">Role access notes</h2>
					<p class="dash-card__subtitle">Operational guidance for admin roles.</p>
				</div>
			</div>
			<div class="dash-card__body grid gap-3 md:grid-cols-3">
				{#each notes as note (note.title)}
					<div class="rounded-lg border border-[var(--dash-border)] bg-[#f8faff] p-4">
						<p class="m-0 text-sm font-black text-[var(--dash-heading)]">{note.title}</p>
						<p class="m-0 mt-2 text-sm leading-6 font-semibold text-[#526484]">{note.text}</p>
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>
