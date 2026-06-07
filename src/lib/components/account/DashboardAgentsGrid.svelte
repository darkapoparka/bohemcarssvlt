<script lang="ts">
	import { resolve } from '$app/paths';
	import { Mail, MessageSquare, Phone, Star, Users } from '@lucide/svelte';
	import type { AuxeroAgentCard } from '$lib/auxero/agents';

	let { cards, management = false }: { cards: AuxeroAgentCard[]; management?: boolean } = $props();

	const externalHref = (href: string) => ({ href });
</script>

<section class="dash-card" data-bohemcars-agent-management={management ? 'true' : 'false'}>
	<div class="dash-card__head">
		<div>
			<h2 class="dash-card__title">Sales agents</h2>
			<p class="dash-card__subtitle">Team availability, assigned leads, and contact shortcuts.</p>
		</div>
		<span class="dash-role-pill">{cards.length} agents</span>
	</div>

	<div class="dash-card__body">
		<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
			{#each cards as card (card.slug)}
				<article class="overflow-hidden rounded-lg border border-[var(--dash-border)] bg-white">
					<a
						href={resolve('/admin/agents/[slug]', { slug: card.slug })}
						class="block aspect-[4/3] overflow-hidden bg-[#edf0f5]"
					>
						<img class="h-full w-full object-cover" src={card.image} alt={card.name} />
					</a>
					<div class="grid gap-4 p-4">
						<div class="flex items-start justify-between gap-3">
							<div class="min-w-0">
								<h3 class="m-0 text-lg font-black text-[var(--dash-heading)]">
									<a
										href={resolve('/admin/agents/[slug]', { slug: card.slug })}
										class="text-inherit no-underline"
									>
										{card.name}
									</a>
								</h3>
								<p class="m-0 mt-1 text-sm font-bold text-[var(--dash-muted)]">{card.title}</p>
							</div>
							<span class="dash-status-pill">
								<Star size={14} strokeWidth={2.1} aria-hidden="true" />
								{card.active ? 'Featured' : 'Team'}
							</span>
						</div>

						{#if card.management}
							<div class="rounded-lg border border-[var(--dash-border)] bg-[#f8faff] p-3">
								<p
									class="m-0 text-sm font-black text-[var(--dash-heading)]"
									data-bohemcars-agent-status={card.management.status}
								>
									{card.management.statusText}
								</p>
								<p
									class="m-0 mt-2 text-sm leading-6 font-semibold text-[#526484]"
									data-bohemcars-agent-note={card.slug}
								>
									{card.management.note}
								</p>
							</div>
						{/if}

						<div class="flex flex-wrap items-center gap-2">
							<a
								{...externalHref(card.phoneHref)}
								class="dash-secondary-button"
								aria-label={`Call ${card.name}`}
							>
								<Phone size={16} strokeWidth={2.1} aria-hidden="true" />
								Call
							</a>
							<a
								{...externalHref(card.emailHref)}
								class="dash-secondary-button"
								aria-label={`Email ${card.name}`}
							>
								<Mail size={16} strokeWidth={2.1} aria-hidden="true" />
								Email
							</a>
						</div>

						{#if card.management}
							<div class="flex flex-wrap gap-2 border-t border-[var(--dash-border)] pt-4">
								<a href={resolve(card.management.assignedLeadsHref)} class="dash-primary-button">
									<Users size={16} strokeWidth={2.1} aria-hidden="true" />
									{card.management.assignedLeadsLabel}
								</a>
								<a href={resolve(card.management.messagesHref)} class="dash-secondary-button">
									<MessageSquare size={16} strokeWidth={2.1} aria-hidden="true" />
									Messages
								</a>
							</div>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>
