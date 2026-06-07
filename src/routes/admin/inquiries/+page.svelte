<script lang="ts">
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import Inbox from '@lucide/svelte/icons/inbox';
	import UserCheck from '@lucide/svelte/icons/user-check';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import {
		formatDate,
		formatNumber,
		formatStatus,
		statusVariant
	} from '$lib/components/admin/format';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	let { data } = $props();
	const statuses = ['new', 'assigned', 'contacted', 'closed'];
	const openInquiries = $derived(
		data.cms.inquiries.filter((inquiry) => inquiry.status !== 'closed').length
	);
	const assignedInquiries = $derived(
		data.cms.inquiries.filter((inquiry) => inquiry.status === 'assigned').length
	);
	const contactedInquiries = $derived(
		data.cms.inquiries.filter((inquiry) => inquiry.status === 'contacted').length
	);
</script>

<svelte:head>
	<title>Bohemcars Admin - Inquiries</title>
</svelte:head>

<AdminShell title="Inquiries" activePath="/admin/inquiries">
	<section class="grid grid-cols-1 gap-4 px-4 sm:grid-cols-3 lg:px-6" aria-label="Inquiry summary">
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Open leads</Card.Description>
				<Card.Action>
					<Inbox class="text-muted-foreground" aria-hidden="true" />
				</Card.Action>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(openInquiries)}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Assigned</Card.Description>
				<Card.Action>
					<UserCheck class="text-muted-foreground" aria-hidden="true" />
				</Card.Action>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(assignedInquiries)}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Contacted</Card.Description>
				<Card.Action>
					<CheckCircle2 class="text-muted-foreground" aria-hidden="true" />
				</Card.Action>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(contactedInquiries)}
				</Card.Title>
			</Card.Header>
		</Card.Root>
	</section>

	<section class="px-4 lg:px-6">
		<Card.Root class="overflow-hidden">
			<Card.Header class="border-b">
				<div>
					<Card.Title>Lead inbox</Card.Title>
					<Card.Description>
						Buyer, sell-your-car, and import inquiries requiring staff follow-up.
					</Card.Description>
				</div>
			</Card.Header>
			<Card.Content class="grid gap-3 p-3">
				{#each data.cms.inquiries as inquiry (inquiry.id)}
					<article
						class="bg-card grid gap-4 rounded-lg border p-4 lg:grid-cols-[minmax(0,1fr)_24rem]"
					>
						<div class="grid min-w-0 gap-4">
							<div class="flex min-w-0 items-start gap-3">
								<Avatar.Root class="size-10">
									<Avatar.Fallback>{inquiry.contactName.slice(0, 1)}</Avatar.Fallback>
								</Avatar.Root>
								<div class="min-w-0 flex-1">
									<div class="flex flex-wrap items-center gap-2">
										<h2 class="m-0 truncate text-sm font-semibold">{inquiry.contactName}</h2>
										<Badge variant={statusVariant(inquiry.status)} class="capitalize">
											{formatStatus(inquiry.status)}
										</Badge>
									</div>
									<p class="text-muted-foreground m-0 truncate text-sm">{inquiry.contactEmail}</p>
									<p class="text-muted-foreground m-0 text-xs">{inquiry.contactPhone}</p>
								</div>
							</div>

							<div class="grid gap-1">
								<p class="text-muted-foreground m-0 text-xs">Context</p>
								<p class="m-0 font-medium">{inquiry.vehicleTitle ?? inquiry.source}</p>
								<p class="text-muted-foreground m-0 line-clamp-2 text-sm">{inquiry.message}</p>
								<p class="text-muted-foreground m-0 text-xs">{formatDate(inquiry.createdAt)}</p>
							</div>
						</div>

						<form method="POST" class="grid content-start gap-3">
							<input type="hidden" name="id" value={inquiry.id} />
							<div class="grid gap-3 sm:grid-cols-2">
								<select
									name="status"
									class="border-input bg-background focus-visible:ring-ring h-10 rounded-lg border px-3 text-sm capitalize outline-none focus-visible:ring-3"
								>
									{#each statuses as statusName (statusName)}
										<option value={statusName} selected={inquiry.status === statusName}>
											{formatStatus(statusName)}
										</option>
									{/each}
								</select>
								<select
									name="assignedAgentSlug"
									class="border-input bg-background focus-visible:ring-ring h-10 rounded-lg border px-3 text-sm outline-none focus-visible:ring-3"
								>
									{#each data.cms.agents as agent (agent.slug)}
										<option value={agent.slug} selected={inquiry.assignedAgentSlug === agent.slug}>
											{agent.name}
										</option>
									{/each}
								</select>
							</div>
							<Input name="message" value={inquiry.message} />
							<Button type="submit" size="sm" variant="outline" class="justify-self-start">
								Save triage
							</Button>
						</form>
					</article>
				{:else}
					<div class="text-muted-foreground p-6 text-center text-sm">No active inquiries yet.</div>
				{/each}
			</Card.Content>
		</Card.Root>
	</section>
</AdminShell>
