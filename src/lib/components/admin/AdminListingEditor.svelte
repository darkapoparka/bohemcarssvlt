<script lang="ts">
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Info from '@lucide/svelte/icons/info';
	import Save from '@lucide/svelte/icons/save';
	import { formatDate, formatStatus, statusVariant } from '$lib/components/admin/format';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as ScrollArea from '$lib/components/ui/scroll-area/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import type { AdminInventoryRow } from '$lib/server/admin-cms';

	type ListingFormValues = {
		mileage: string;
		priceLabel: string;
		routePath: string;
		status: string;
		title: string;
		vin: string;
	};

	type ListingFormState = {
		error?: string;
		title?: string;
		values?: Partial<ListingFormValues>;
	};

	type Props = {
		cancelHref?: string;
		form?: ListingFormState | null;
		listing?: AdminInventoryRow | null;
		mode?: 'create' | 'edit';
		notice?: string;
		submitLabel?: string;
	};

	let {
		cancelHref = '/admin/inventory',
		form = null,
		listing = null,
		mode = 'edit',
		notice = '',
		submitLabel = mode === 'create' ? 'Create listing' : 'Save changes'
	}: Props = $props();

	let activeTab = $state('details');

	const statusOptions = [
		{ label: 'Draft', value: 'draft' },
		{ label: 'Published', value: 'published' },
		{ label: 'Archived', value: 'archived' }
	];

	const formValues = $derived(
		form?.values ??
			(form?.title ? ({ title: form.title } satisfies Partial<ListingFormValues>) : {})
	);
	const values = $derived({
		mileage: formValues.mileage ?? listing?.mileage ?? '',
		priceLabel: formValues.priceLabel ?? listing?.priceLabel ?? '',
		routePath: formValues.routePath ?? listing?.routePath ?? '',
		status: formValues.status ?? listing?.status ?? 'draft',
		title: formValues.title ?? listing?.title ?? '',
		vin: formValues.vin ?? listing?.vin ?? ''
	});
	const sourceLabel = $derived(listing?.source?.replace('-', ' ') ?? 'admin listing');
	const sourceValue = $derived(listing?.source ?? 'admin-listing');
	const previewHref = $derived(listing?.routePath?.startsWith('/') ? listing.routePath : '');
</script>

<section class="grid gap-4 px-4 lg:px-6">
	<Card.Root>
		<Card.Header>
			<div class="min-w-0">
				<Card.Title class="text-base leading-snug">
					{mode === 'create' ? 'Create inventory draft' : listing?.title}
				</Card.Title>
				<Card.Description>
					{mode === 'create'
						? 'Add a Bohemcars listing record. It appears in the CMS inventory immediately.'
						: 'Edit the CMS-facing inventory record with a wider workspace for dense content.'}
				</Card.Description>
			</div>
			<Card.Action>
				<div class="flex flex-wrap justify-end gap-2">
					<Badge variant={statusVariant(values.status)} class="capitalize">
						{formatStatus(values.status)}
					</Badge>
					{#if previewHref}
						<Button href={previewHref} variant="outline" size="sm">
							<ExternalLink data-icon="inline-start" aria-hidden="true" />
							Preview
						</Button>
					{/if}
				</div>
			</Card.Action>
		</Card.Header>
	</Card.Root>

	<form
		method="POST"
		class="grid items-start gap-4 min-[1180px]:grid-cols-[minmax(0,1fr)_20rem] 2xl:grid-cols-[minmax(0,1fr)_24rem]"
		data-bohemcars-admin-listing-editor
		data-bohemcars-admin-listing-mode={mode}
	>
		<input type="hidden" name="source" value={sourceValue} />

		<Card.Root class="min-w-0">
			<Card.Header class="border-b">
				<div>
					<Card.Title>Listing workspace</Card.Title>
					<Card.Description
						>Use the tabs to move through publishing, pricing, and source details.</Card.Description
					>
				</div>
			</Card.Header>
			<Card.Content class="grid gap-4 p-4">
				{#if form?.error}
					<Alert variant="destructive">
						<Info aria-hidden="true" />
						<AlertTitle>Listing was not saved</AlertTitle>
						<AlertDescription>{form.error}</AlertDescription>
					</Alert>
				{/if}

				{#if notice}
					<Alert>
						<Info aria-hidden="true" />
						<AlertTitle>{notice}</AlertTitle>
						<AlertDescription>The latest CMS state is shown below.</AlertDescription>
					</Alert>
				{/if}

				<Tabs.Root bind:value={activeTab} class="gap-4">
					<Tabs.List class="w-full justify-start overflow-x-auto">
						<Tabs.Trigger value="details">Details</Tabs.Trigger>
						<Tabs.Trigger value="pricing">Pricing</Tabs.Trigger>
						<Tabs.Trigger value="source">Source</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="details" class="grid gap-4">
						<div class="grid gap-2">
							<Label for="title">Vehicle title</Label>
							<Textarea id="title" name="title" value={values.title} class="min-h-24" required />
						</div>

						<div class="grid gap-4 md:grid-cols-2">
							<div class="grid gap-2">
								<Label for="vin">VIN or source ID</Label>
								<Input id="vin" name="vin" value={values.vin} />
							</div>
							<div class="grid gap-2">
								<Label for="status">Status</Label>
								<select
									id="status"
									name="status"
									class="border-input bg-background ring-offset-background focus-visible:ring-ring h-10 rounded-lg border px-3 text-sm outline-none focus-visible:ring-3"
								>
									{#each statusOptions as option (option.value)}
										<option value={option.value} selected={values.status === option.value}>
											{option.label}
										</option>
									{/each}
								</select>
							</div>
						</div>
					</Tabs.Content>

					<Tabs.Content value="pricing" class="grid gap-4 md:grid-cols-2">
						<div class="grid gap-2">
							<Label for="priceLabel">Price label</Label>
							<Input id="priceLabel" name="priceLabel" value={values.priceLabel} />
						</div>
						<div class="grid gap-2">
							<Label for="mileage">Mileage label</Label>
							<Input id="mileage" name="mileage" value={values.mileage} />
						</div>
					</Tabs.Content>

					<Tabs.Content value="source" class="grid gap-4">
						<div class="grid gap-2">
							<Label for="routePath">Public route</Label>
							<Input
								id="routePath"
								name="routePath"
								value={values.routePath}
								placeholder="/inventory/example-listing"
							/>
						</div>
						<div class="grid gap-2">
							<Label for="sourceLabel">Source</Label>
							<Input id="sourceLabel" value={sourceLabel} disabled />
						</div>
					</Tabs.Content>
				</Tabs.Root>
			</Card.Content>
			<Card.Footer class="flex flex-col-reverse gap-2 border-t sm:flex-row sm:justify-end">
				<Button href={cancelHref} variant="outline">Cancel</Button>
				<Button type="submit">
					<Save data-icon="inline-start" aria-hidden="true" />
					{submitLabel}
				</Button>
			</Card.Footer>
		</Card.Root>

		<aside class="grid content-start gap-4">
			<Card.Root class="overflow-hidden">
				{#if listing?.image}
					<img src={listing.image} alt="" class="aspect-video w-full object-cover" />
				{/if}
				<Card.Header>
					<Card.Title class="text-base">Record summary</Card.Title>
					<Card.Description>
						{listing ? `${listing.brand} / ${listing.year} / ${listing.fuel}` : 'Draft setup'}
					</Card.Description>
				</Card.Header>
				<Card.Content class="p-0">
					<ScrollArea.Root class="h-80 px-4 pb-4">
						<div class="grid gap-3 text-sm">
							<div class="flex items-center justify-between gap-4">
								<span class="text-muted-foreground">Status</span>
								<Badge variant={statusVariant(values.status)} class="capitalize">
									{formatStatus(values.status)}
								</Badge>
							</div>
							<Separator />
							<div class="flex items-center justify-between gap-4">
								<span class="text-muted-foreground">Source</span>
								<Badge variant="outline" class="capitalize">{sourceLabel}</Badge>
							</div>
							<div class="grid gap-1">
								<span class="text-muted-foreground">Public route</span>
								<span class="font-medium break-all">{values.routePath || 'Set after save'}</span>
							</div>
							<div class="grid gap-1">
								<span class="text-muted-foreground">Price</span>
								<span class="font-medium">{values.priceLabel || 'On request'}</span>
							</div>
							<div class="grid gap-1">
								<span class="text-muted-foreground">Mileage</span>
								<span class="font-medium">{values.mileage || 'On request'}</span>
							</div>
							{#if listing?.updatedAt}
								<div class="grid gap-1">
									<span class="text-muted-foreground">Last updated</span>
									<span class="font-medium">{formatDate(listing.updatedAt)}</span>
								</div>
							{/if}
						</div>
					</ScrollArea.Root>
				</Card.Content>
			</Card.Root>
		</aside>
	</form>
</section>
