<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowLeft, Mail, MessageSquare, Phone, Star, Users } from '@lucide/svelte';

	type DashboardAgent = {
		assignedInquiryIds: string[];
		bio: string;
		email: string;
		image: string;
		name: string;
		note: string;
		openInquiries: number;
		phone: string;
		rating: number;
		slug: string;
		status: 'active' | 'paused';
		title: string;
	};

	let { agent }: { agent: DashboardAgent } = $props();
</script>

<section class="dash-grid gap-4" data-bohemcars-dashboard-agent={agent.slug}>
	<div class="flex flex-wrap items-center justify-between gap-3">
		<a href={resolve('/admin/agents')} class="dash-secondary-button">
			<ArrowLeft size={16} strokeWidth={2.1} aria-hidden="true" />
			Back to Agents
		</a>
		<div class="flex flex-wrap gap-2">
			<a href={resolve('/admin/inquiries?role=admin')} class="dash-primary-button">
				<Users size={16} strokeWidth={2.1} aria-hidden="true" />
				Assigned Leads
			</a>
			<a href={resolve('/admin/messages?role=admin')} class="dash-secondary-button">
				<MessageSquare size={16} strokeWidth={2.1} aria-hidden="true" />
				Messages
			</a>
		</div>
	</div>

	<div class="dash-card overflow-hidden">
		<div class="grid gap-0 xl:grid-cols-[360px_minmax(0,1fr)]">
			<div class="aspect-[4/3] bg-[#edf0f5] xl:aspect-auto">
				<img src={agent.image} alt={agent.name} class="h-full w-full object-cover" />
			</div>
			<div class="grid gap-5 p-6">
				<div>
					<p class="dash-kicker">Bohemcars team</p>
					<h2 class="m-0 text-2xl leading-tight font-black text-[var(--dash-heading)]">
						{agent.name}
					</h2>
					<p class="m-0 mt-2 text-base font-bold text-[var(--dash-muted)]">{agent.title}</p>
					<p class="m-0 mt-4 text-sm leading-6 font-semibold text-[#526484]">{agent.bio}</p>
				</div>
				<div class="grid gap-3 md:grid-cols-3">
					<div class="rounded-lg border border-[var(--dash-border)] bg-[#f8faff] p-4">
						<p class="m-0 text-xs font-black text-[var(--dash-muted)] uppercase">Status</p>
						<p class="m-0 mt-1 text-lg font-black text-[var(--dash-heading)]">
							{agent.status === 'active' ? 'Active' : 'Paused'}
						</p>
					</div>
					<div class="rounded-lg border border-[var(--dash-border)] bg-[#f8faff] p-4">
						<p class="m-0 text-xs font-black text-[var(--dash-muted)] uppercase">Open leads</p>
						<p class="m-0 mt-1 text-lg font-black text-[var(--dash-heading)]">
							{agent.openInquiries}
						</p>
					</div>
					<div class="rounded-lg border border-[var(--dash-border)] bg-[#f8faff] p-4">
						<p class="m-0 text-xs font-black text-[var(--dash-muted)] uppercase">Rating</p>
						<p
							class="m-0 mt-1 inline-flex items-center gap-1 text-lg font-black text-[var(--dash-heading)]"
						>
							<Star size={17} strokeWidth={2.1} aria-hidden="true" />
							{agent.rating}
						</p>
					</div>
				</div>
				<div class="flex flex-wrap gap-2">
					<a href={`tel:${agent.phone.replace(/[^+\d]/g, '')}`} class="dash-secondary-button">
						<Phone size={16} strokeWidth={2.1} aria-hidden="true" />
						Call
					</a>
					<a href={`mailto:${agent.email}`} class="dash-secondary-button">
						<Mail size={16} strokeWidth={2.1} aria-hidden="true" />
						Email
					</a>
				</div>
			</div>
		</div>
	</div>

	<section class="dash-card">
		<div class="dash-card__head">
			<div>
				<h2 class="dash-card__title">Management note</h2>
				<p class="dash-card__subtitle">Internal dashboard context for agent assignment.</p>
			</div>
			<span class="dash-status-pill">{agent.assignedInquiryIds.length} active assignments</span>
		</div>
		<div class="dash-card__body">
			<p class="m-0 text-sm leading-6 font-semibold text-[#526484]">{agent.note}</p>
		</div>
	</section>
</section>
