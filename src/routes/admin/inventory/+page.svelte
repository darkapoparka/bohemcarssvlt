<script lang="ts">
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import {
		formatDate,
		formatNumber,
		formatStatus,
		formatVehicleMeta,
		statusVariant
	} from '$lib/components/admin/format';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';

	let { data } = $props();
	const statuses = ['all', 'published', 'draft', 'archived'];
</script>

<svelte:head>
	<title>Bohemcars Admin - Inventory</title>
</svelte:head>

<AdminShell
	title="Inventory"
	activePath="/admin/inventory"
	primaryAction={{ label: 'Add listing', href: '/admin/inventory/new' }}
>
	<section
		class="grid grid-cols-1 gap-4 px-4 sm:grid-cols-3 lg:px-6"
		aria-label="Inventory summary"
	>
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Live listings</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(data.cms.kpis.liveListings)}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Draft listings</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(data.cms.kpis.draftListings)}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Filtered records</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(data.inventory.length)}
				</Card.Title>
			</Card.Header>
		</Card.Root>
	</section>

	<section class="px-4 lg:px-6">
		<Card.Root>
			<Card.Header class="border-b">
				<div>
					<Card.Title>Listings</Card.Title>
					<Card.Description>Inventory records available to the Bohemcars CMS.</Card.Description>
				</div>
			</Card.Header>
			<Card.Content class="grid gap-4 p-4">
				<form class="flex flex-col gap-3 md:flex-row" method="GET">
					<Input name="q" value={data.query} placeholder="Search make, model, VIN, fuel, price" />
					<input type="hidden" name="status" value={data.status} />
					<Button type="submit" variant="outline">Search</Button>
				</form>
				<div class="flex flex-wrap gap-2">
					{#each statuses as statusName (statusName)}
						<Button
							href={`/admin/inventory?status=${statusName}${data.query ? `&q=${encodeURIComponent(data.query)}` : ''}`}
							variant={data.status === statusName ? 'default' : 'outline'}
							size="sm"
							class="capitalize"
						>
							{statusName}
						</Button>
					{/each}
				</div>
			</Card.Content>
			<Card.Content class="p-0">
				<div class="overflow-x-auto">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Vehicle</Table.Head>
								<Table.Head>Status</Table.Head>
								<Table.Head>Source</Table.Head>
								<Table.Head class="hidden text-right md:table-cell">Price</Table.Head>
								<Table.Head class="hidden text-right lg:table-cell">Updated</Table.Head>
								<Table.Head class="text-right">Action</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each data.inventory as vehicle (vehicle.id)}
								<Table.Row>
									<Table.Cell>
										<div class="flex min-w-72 items-center gap-3">
											<img
												class="ring-border size-12 rounded-md object-cover ring-1"
												src={vehicle.image}
												alt=""
											/>
											<span class="min-w-0">
												<span class="block truncate font-medium">{vehicle.title}</span>
												<span class="text-muted-foreground block truncate text-xs">
													{formatVehicleMeta(vehicle)}
												</span>
											</span>
										</div>
									</Table.Cell>
									<Table.Cell>
										<Badge variant={statusVariant(vehicle.status)} class="capitalize">
											{formatStatus(vehicle.status)}
										</Badge>
									</Table.Cell>
									<Table.Cell>
										<Badge variant="outline" class="capitalize">
											{vehicle.source.replace('-', ' ')}
										</Badge>
									</Table.Cell>
									<Table.Cell class="hidden text-right font-medium md:table-cell">
										{vehicle.priceLabel}
									</Table.Cell>
									<Table.Cell class="text-muted-foreground hidden text-right text-xs lg:table-cell">
										{formatDate(vehicle.updatedAt)}
									</Table.Cell>
									<Table.Cell class="text-right">
										<Button
											href={`/admin/listings/${encodeURIComponent(vehicle.id)}`}
											variant="outline"
											size="sm"
										>
											Edit
										</Button>
									</Table.Cell>
								</Table.Row>
							{:else}
								<Table.Row>
									<Table.Cell colspan={6} class="p-6 text-center text-sm text-muted-foreground">
										No inventory records match this filter.
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
			</Card.Content>
		</Card.Root>
	</section>
</AdminShell>
