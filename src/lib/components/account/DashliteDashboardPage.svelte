<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		ArrowUpRight,
		Car,
		CheckCircle2,
		ChevronRight,
		Clock3,
		GitCompare,
		MessageSquare,
		Star,
		Users
	} from '@lucide/svelte';
	import type { AuxeroDashboardPageData } from '$lib/auxero/dashboard';
	import DashliteDashboardShell from './DashliteDashboardShell.svelte';

	let { dashboard }: { dashboard: AuxeroDashboardPageData } = $props();

	const chartBars = [42, 58, 38, 72, 64, 86, 52, 70, 92, 76, 88, 66];
	const statIcon = (id: string) => {
		if (id === 'messages') return MessageSquare;
		if (id === 'favorites' || id === 'agents') return Star;
		if (id === 'compare') return GitCompare;
		if (id === 'inquiries') return Clock3;
		if (id === 'users') return Users;
		return Car;
	};
	const actionIcon = (id: string) => {
		if (id.includes('message')) return MessageSquare;
		if (id.includes('lead')) return Clock3;
		if (id.includes('favorite') || id.includes('team')) return Star;
		if (id.includes('listing')) return Car;
		return CheckCircle2;
	};
	const queueLabel = $derived(dashboard.isAdmin ? 'Operations queue' : 'Account queue');
	const conversionLabel = $derived(dashboard.isAdmin ? 'Lead activity' : 'Garage activity');
</script>

<DashliteDashboardShell {dashboard} active="dashboard">
	<section class="dash-grid dash-grid--stats mb-4" aria-label="Dashboard stats">
		{#each dashboard.stats as stat (stat.id)}
			{@const Icon = statIcon(stat.id)}
			<a
				href={resolve(stat.href)}
				class="dash-stat-card"
				data-bohemcars-dashboard-stat={stat.id}
				data-bohemcars-stat-value={stat.value}
			>
				<div class="relative z-10 flex items-start justify-between gap-4">
					<div class="min-w-0">
						<p class="dash-stat-card__label">{stat.label}</p>
						<p class="dash-stat-card__value">{stat.value}</p>
					</div>
					<div class="dash-stat-card__icon">
						<Icon size={22} strokeWidth={2.2} aria-hidden="true" />
					</div>
				</div>
				<div class="dash-progress relative z-10 mt-5">
					<span style:width={`${45 + Math.min(stat.value.length * 8, 42)}%`}></span>
				</div>
			</a>
		{/each}
	</section>

	<section class="dash-grid dash-grid--dashboard">
		<div class="dash-grid">
			<div class="dash-card">
				<div class="dash-card__head">
					<div>
						<h2 class="dash-card__title">{conversionLabel}</h2>
						<p class="dash-card__subtitle">{dashboard.recent.intro}</p>
					</div>
					<span class="dash-status-pill">
						<ArrowUpRight size={15} strokeWidth={2.2} aria-hidden="true" />
						Active
					</span>
				</div>
				<div class="dash-card__body">
					<div class="dash-chart" aria-hidden="true">
						{#each chartBars as height, index (`bar-${index}`)}
							<span style:height={`${height}%`}></span>
						{/each}
					</div>
				</div>
			</div>

			<div class="dash-card" data-bohemcars-dashboard-recent>
				<div class="dash-card__head">
					<div>
						<h2 class="dash-card__title">{queueLabel}</h2>
						<p class="dash-card__subtitle">{dashboard.recent.heading}</p>
					</div>
					<span class="dash-role-pill">{dashboard.recent.items.length} latest</span>
				</div>

				<div class="divide-y divide-[var(--dash-border)]">
					{#each dashboard.recent.items as item (item.id)}
						<article class="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
							<div class="flex min-w-0 gap-3">
								<img
									src={item.avatar}
									alt={item.name}
									class="h-12 w-12 rounded-lg bg-[#edf0f5] object-cover"
								/>
								<div class="min-w-0">
									<div class="flex flex-wrap items-center gap-2">
										<p class="m-0 truncate text-base font-black text-[var(--dash-heading)]">
											{item.title}
										</p>
										<span class="dash-status-pill">{item.statusLabel}</span>
									</div>
									<p class="m-0 mt-1 text-sm font-bold text-[var(--dash-muted)]">
										{item.name} · {item.dateLabel} · {item.metaLabel}
									</p>
									<p class="m-0 mt-2 line-clamp-2 text-sm leading-6 font-semibold text-[#526484]">
										{item.body}
									</p>
								</div>
							</div>
							<a
								href={resolve(item.href)}
								class="dash-secondary-button justify-self-start lg:justify-self-end"
							>
								{item.actionLabel}
								<ChevronRight size={16} strokeWidth={2.2} aria-hidden="true" />
							</a>
						</article>
					{:else}
						<div class="dash-empty m-5">
							<p class="m-0 text-base font-black text-[var(--dash-heading)]">
								Nothing needs attention right now
							</p>
							<p class="m-0 mt-2 text-sm font-semibold text-[var(--dash-muted)]">
								New leads, messages, and listing updates will appear here as soon as they arrive.
							</p>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<aside class="dash-grid content-start">
			<div class="dash-card">
				<div class="dash-card__head">
					<div>
						<h2 class="dash-card__title">Quick actions</h2>
						<p class="dash-card__subtitle">Jump into active dashboard work.</p>
					</div>
				</div>
				<div class="dash-card__body grid gap-3">
					{#each dashboard.recent.actions as action (action.id)}
						{@const Icon = actionIcon(action.id)}
						<a
							href={resolve(action.href)}
							class="flex items-center gap-3 rounded-lg border border-[var(--dash-border)] bg-[#f8faff] p-3 text-inherit no-underline transition-colors hover:border-[var(--dash-primary)] hover:bg-[var(--dash-primary-soft)]"
							data-bohemcars-dashboard-action={action.id}
						>
							<div class="dash-stat-card__icon h-10 w-10">
								<Icon size={19} strokeWidth={2.2} aria-hidden="true" />
							</div>
							<div class="min-w-0">
								<p class="m-0 truncate text-sm font-black text-[var(--dash-heading)]">
									{action.label}
								</p>
								<p class="m-0 truncate text-xs font-bold text-[var(--dash-muted)]">
									{action.meta}
								</p>
							</div>
						</a>
					{/each}
				</div>
			</div>

			<div class="dash-card">
				<div class="dash-card__head">
					<div>
						<h2 class="dash-card__title">Workspace summary</h2>
						<p class="dash-card__subtitle">{dashboard.roleLabel}</p>
					</div>
				</div>
				<div class="dash-card__body grid gap-3">
					{#each dashboard.recent.summary as item (item.id)}
						<div class="flex items-center justify-between gap-4">
							<div>
								<p class="m-0 text-sm font-black text-[var(--dash-heading)]">{item.label}</p>
							</div>
							<p class="m-0 text-lg font-black text-[var(--dash-primary)]">{item.value}</p>
						</div>
					{/each}
				</div>
			</div>
		</aside>
	</section>
</DashliteDashboardShell>
