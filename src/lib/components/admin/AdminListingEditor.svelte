<script lang="ts">
	import { resolve } from '$app/paths';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import FileText from '@lucide/svelte/icons/file-text';
	import ImagePlus from '@lucide/svelte/icons/image-plus';
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
	import type { InventoryListingInput } from '$lib/server/inventory';

	type ListingFormValues = Partial<InventoryListingInput> & {
		featureText?: string;
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
	const bodyTypeOptions = ['SUV', 'Sedan', 'Coupe', 'Wagon', 'Hatchback', 'Pickup', 'Crossover'];
	const fuelOptions = ['Petrol', 'Diesel', 'Hybrid', 'Plug-in hybrid', 'EV', 'On request'];
	const transmissionOptions = ['Automatic', 'Manual', 'On request'];
	const commonFeatures = [
		'Navigation',
		'Backup Camera',
		'Blind spot monitoring',
		'Heated seats',
		'Service history',
		'Parking sensors',
		'Keyless start',
		'Leather seats',
		'Adaptive cruise control',
		'Panoramic roof',
		'Canada import review',
		'Registration readiness'
	];

	const formValues = $derived(
		form?.values ??
			(form?.title ? ({ title: form.title } satisfies Partial<ListingFormValues>) : {})
	);
	const inputValue = (value: number | string | undefined) =>
		value === undefined ? '' : String(value);
	const featuresValue = (
		featureText: string | undefined,
		features: InventoryListingInput['features'],
		fallback: string[] | undefined
	) => {
		if (featureText) return featureText;
		if (Array.isArray(features)) return features.join('\n');
		if (features) return features;

		return fallback?.join('\n') ?? '';
	};
	const values = $derived({
		bodyType: inputValue(formValues.bodyType ?? listing?.bodyType),
		brand: inputValue(formValues.brand ?? listing?.brand),
		color: inputValue(formValues.color ?? listing?.color),
		description: inputValue(formValues.description ?? listing?.description),
		doors: inputValue(formValues.doors ?? (listing?.doors || undefined)),
		engine: inputValue(formValues.engine ?? listing?.engine),
		featureText: featuresValue(formValues.featureText, formValues.features, listing?.features),
		fuel: inputValue(formValues.fuel ?? listing?.fuel),
		location: inputValue(formValues.location ?? listing?.location),
		mileage: inputValue(formValues.mileage ?? (listing?.mileageValue || undefined)),
		model: inputValue(formValues.model ?? listing?.model),
		previewImage: inputValue(formValues.previewImage ?? listing?.previewImage),
		price: inputValue(formValues.price ?? (listing?.price || undefined)),
		priceLabel: inputValue(formValues.priceLabel ?? listing?.priceLabel),
		seats: inputValue(formValues.seats ?? (listing?.seats || undefined)),
		slug: inputValue(formValues.slug ?? listing?.slug),
		sourceUrl: inputValue(formValues.sourceUrl ?? listing?.sourceUrl),
		status: formValues.status ?? listing?.status ?? 'draft',
		stockNumber: inputValue(formValues.stockNumber ?? listing?.stockNumber),
		title: inputValue(formValues.title ?? listing?.title),
		transmission: inputValue(formValues.transmission ?? listing?.transmission),
		vin: inputValue(formValues.vin ?? listing?.vin),
		year: inputValue(
			formValues.year ?? (listing?.year && listing.year !== 'Draft' ? listing.year : undefined)
		)
	});
	const sourceLabel = $derived(listing?.source?.replace('-', ' ') ?? 'admin listing');
	const sourceValue = $derived(listing?.source ?? 'admin-listing');
	const previewHref = $derived(
		values.status === 'published' && values.slug ? `/inventory/${values.slug}` : ''
	);
	const checkedFeatures = $derived(
		new Set(values.featureText.split(/\r?\n|,/).map((item) => item.trim()))
	);

	const selectOptions = (options: string[], current: string) =>
		current && !options.includes(current) ? [current, ...options] : options;
</script>

<section class="grid gap-4 px-4 lg:px-6">
	<Card.Root>
		<Card.Header>
			<div class="min-w-0">
				<Card.Title class="text-base leading-snug">
					{mode === 'create' ? 'Create vehicle listing' : listing?.title}
				</Card.Title>
				<Card.Description>
					Manage specs, pricing, media, files, and publishing state for Bohemcars inventory.
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
		enctype="multipart/form-data"
		class="grid items-start gap-4 min-[1180px]:grid-cols-[minmax(0,1fr)_20rem] 2xl:grid-cols-[minmax(0,1fr)_24rem]"
		data-bohemcars-admin-listing-editor
		data-bohemcars-admin-listing-mode={mode}
	>
		<input type="hidden" name="source" value={sourceValue} />

		<Card.Root class="min-w-0">
			<Card.Header class="border-b">
				<div>
					<Card.Title>Listing editor</Card.Title>
					<Card.Description>Complete every tab before publishing a public vehicle.</Card.Description
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
						<AlertDescription>The durable CMS record is shown below.</AlertDescription>
					</Alert>
				{/if}

				<Tabs.Root bind:value={activeTab} class="gap-4">
					<Tabs.List class="w-full justify-start overflow-x-auto">
						<Tabs.Trigger value="details">Details</Tabs.Trigger>
						<Tabs.Trigger value="specs">Specs</Tabs.Trigger>
						<Tabs.Trigger value="pricing">Pricing</Tabs.Trigger>
						<Tabs.Trigger value="media">Media</Tabs.Trigger>
						<Tabs.Trigger value="features">Features</Tabs.Trigger>
						<Tabs.Trigger value="publishing">Publishing</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="details" class="grid gap-4">
						<div class="grid gap-2">
							<Label for="title">Vehicle title</Label>
							<Input id="title" name="title" value={values.title} required />
						</div>
						<div class="grid gap-4 md:grid-cols-3">
							<div class="grid gap-2">
								<Label for="brand">Brand</Label>
								<Input id="brand" name="brand" value={values.brand} required />
							</div>
							<div class="grid gap-2">
								<Label for="model">Model</Label>
								<Input id="model" name="model" value={values.model} required />
							</div>
							<div class="grid gap-2">
								<Label for="year">Year</Label>
								<Input
									id="year"
									name="year"
									type="number"
									min="1900"
									max="2100"
									value={values.year}
								/>
							</div>
						</div>
						<div class="grid gap-2">
							<Label for="description">Description</Label>
							<Textarea
								id="description"
								name="description"
								value={values.description}
								class="min-h-40"
								placeholder="Vehicle story, condition notes, inspection context, and import/document details."
							/>
						</div>
					</Tabs.Content>

					<Tabs.Content value="specs" class="grid gap-4">
						<div class="grid gap-4 md:grid-cols-3">
							<div class="grid gap-2">
								<Label for="bodyType">Body type</Label>
								<select
									id="bodyType"
									name="bodyType"
									class="border-input bg-background h-10 rounded-lg border px-3 text-sm outline-none focus-visible:ring-3"
								>
									<option value="">Select</option>
									{#each selectOptions(bodyTypeOptions, values.bodyType) as option (option)}
										<option value={option} selected={values.bodyType === option}>{option}</option>
									{/each}
								</select>
							</div>
							<div class="grid gap-2">
								<Label for="fuel">Fuel</Label>
								<select
									id="fuel"
									name="fuel"
									class="border-input bg-background h-10 rounded-lg border px-3 text-sm outline-none focus-visible:ring-3"
								>
									<option value="">Select</option>
									{#each selectOptions(fuelOptions, values.fuel) as option (option)}
										<option value={option} selected={values.fuel === option}>{option}</option>
									{/each}
								</select>
							</div>
							<div class="grid gap-2">
								<Label for="transmission">Transmission</Label>
								<select
									id="transmission"
									name="transmission"
									class="border-input bg-background h-10 rounded-lg border px-3 text-sm outline-none focus-visible:ring-3"
								>
									<option value="">Select</option>
									{#each selectOptions(transmissionOptions, values.transmission) as option (option)}
										<option value={option} selected={values.transmission === option}
											>{option}</option
										>
									{/each}
								</select>
							</div>
						</div>
						<div class="grid gap-4 md:grid-cols-3">
							<div class="grid gap-2">
								<Label for="engine">Engine</Label>
								<Input id="engine" name="engine" value={values.engine} />
							</div>
							<div class="grid gap-2">
								<Label for="color">Color</Label>
								<Input id="color" name="color" value={values.color} />
							</div>
							<div class="grid gap-2">
								<Label for="mileage">Mileage</Label>
								<Input id="mileage" name="mileage" type="number" min="0" value={values.mileage} />
							</div>
						</div>
						<div class="grid gap-4 md:grid-cols-2">
							<div class="grid gap-2">
								<Label for="doors">Doors</Label>
								<Input id="doors" name="doors" type="number" min="0" value={values.doors} />
							</div>
							<div class="grid gap-2">
								<Label for="seats">Seats</Label>
								<Input id="seats" name="seats" type="number" min="0" value={values.seats} />
							</div>
						</div>
					</Tabs.Content>

					<Tabs.Content value="pricing" class="grid gap-4">
						<div class="grid gap-4 md:grid-cols-2">
							<div class="grid gap-2">
								<Label for="price">Numeric price EUR</Label>
								<Input id="price" name="price" type="number" min="0" value={values.price} />
							</div>
							<div class="grid gap-2">
								<Label for="priceLabel">Price label</Label>
								<Input id="priceLabel" name="priceLabel" value={values.priceLabel} />
							</div>
						</div>
						<div class="grid gap-2">
							<Label for="location">Location</Label>
							<Input id="location" name="location" value={values.location} />
						</div>
						<div class="grid gap-2">
							<Label for="sourceUrl">Source URL</Label>
							<Input id="sourceUrl" name="sourceUrl" type="url" value={values.sourceUrl} />
						</div>
					</Tabs.Content>

					<Tabs.Content value="media" class="grid gap-4">
						<div class="grid gap-4 md:grid-cols-[16rem_minmax(0,1fr)]">
							<div class="overflow-hidden rounded-lg border">
								<img
									src={values.previewImage || listing?.image || '/assets/images/card/card-1.jpg'}
									alt=""
									class="aspect-video w-full object-cover"
								/>
							</div>
							<div class="grid gap-3">
								<div class="grid gap-2">
									<Label for="previewImage">Preview image</Label>
									<Input
										id="previewImage"
										name="previewImage"
										type="file"
										accept="image/jpeg,image/png,image/webp"
									/>
								</div>
								<div class="grid gap-2">
									<Label for="galleryImages">Gallery images</Label>
									<Input
										id="galleryImages"
										name="galleryImages"
										type="file"
										accept="image/jpeg,image/png,image/webp"
										multiple
									/>
								</div>
								<p class="text-muted-foreground text-sm">
									JPG, PNG, or WebP. New gallery files append to existing media.
								</p>
							</div>
						</div>
						{#if listing?.galleryImages?.length}
							<div class="grid grid-cols-2 gap-3 md:grid-cols-4">
								{#each listing.galleryImages as image (image)}
									<img src={image} alt="" class="aspect-video rounded-md border object-cover" />
								{/each}
							</div>
						{/if}
						<div class="grid gap-2">
							<Label for="documents">Documents</Label>
							<Input
								id="documents"
								name="documents"
								type="file"
								accept=".pdf,.doc,.docx"
								multiple
							/>
						</div>
					</Tabs.Content>

					<Tabs.Content value="features" class="grid gap-4">
						<div class="grid gap-2">
							<Label for="featureText">Feature list</Label>
							<Textarea
								id="featureText"
								name="featureText"
								value={values.featureText}
								class="min-h-44"
							/>
						</div>
						<div class="grid gap-3 md:grid-cols-3">
							{#each commonFeatures as feature (feature)}
								<label
									class="border-input flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
								>
									<input
										type="checkbox"
										name="features"
										value={feature}
										checked={checkedFeatures.has(feature)}
									/>
									<span>{feature}</span>
								</label>
							{/each}
						</div>
					</Tabs.Content>

					<Tabs.Content value="publishing" class="grid gap-4">
						<div class="grid gap-4 md:grid-cols-3">
							<div class="grid gap-2">
								<Label for="status">Status</Label>
								<select
									id="status"
									name="status"
									class="border-input bg-background h-10 rounded-lg border px-3 text-sm outline-none focus-visible:ring-3"
								>
									{#each statusOptions as option (option.value)}
										<option value={option.value} selected={values.status === option.value}
											>{option.label}</option
										>
									{/each}
								</select>
							</div>
							<div class="grid gap-2">
								<Label for="slug">Public slug</Label>
								<Input id="slug" name="slug" value={values.slug} placeholder="bmw-x5-m-sport" />
							</div>
							<div class="grid gap-2">
								<Label for="stockNumber">Stock number</Label>
								<Input id="stockNumber" name="stockNumber" value={values.stockNumber} />
							</div>
						</div>
						<div class="grid gap-2">
							<Label for="vin">VIN or source ID</Label>
							<Input id="vin" name="vin" value={values.vin} />
						</div>
						<Alert>
							<Info aria-hidden="true" />
							<AlertTitle>Publishing bridge</AlertTitle>
							<AlertDescription>
								Only published admin listings appear in public inventory and detail pages.
							</AlertDescription>
						</Alert>
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
						{values.brand || 'Brand'} / {values.year || 'Year'} / {values.fuel || 'Fuel'}
					</Card.Description>
				</Card.Header>
				<Card.Content class="p-0">
					<ScrollArea.Root class="h-96 px-4 pb-4">
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
								<span class="font-medium break-all">
									{values.status === 'published' && values.slug
										? `/inventory/${values.slug}`
										: 'Hidden until published'}
								</span>
							</div>
							<div class="grid gap-1">
								<span class="text-muted-foreground">Price</span>
								<span class="font-medium">{values.priceLabel || 'On request'}</span>
							</div>
							<div class="grid gap-1">
								<span class="text-muted-foreground">Media</span>
								<span class="font-medium">
									{listing?.galleryImages?.length ?? 0} gallery,
									{listing?.documents?.length ?? 0} documents
								</span>
							</div>
							{#if listing?.updatedAt}
								<div class="grid gap-1">
									<span class="text-muted-foreground">Last updated</span>
									<span class="font-medium">{formatDate(listing.updatedAt)}</span>
								</div>
							{/if}
							{#if listing?.documents?.length}
								<Separator />
								<div class="grid gap-2">
									<span class="text-muted-foreground">Documents</span>
									{#each listing.documents as document (document.id)}
										<a
											class="flex items-center gap-2 text-xs underline-offset-4 hover:underline"
											href={resolve(document.url as '/')}
										>
											<FileText aria-hidden="true" />
											<span class="truncate">{document.originalName}</span>
										</a>
									{/each}
								</div>
							{/if}
						</div>
					</ScrollArea.Root>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Description>Media policy</Card.Description>
					<Card.Title class="flex items-center gap-2 text-base">
						<ImagePlus aria-hidden="true" />
						Local uploads
					</Card.Title>
				</Card.Header>
				<Card.Content class="text-muted-foreground text-sm">
					Files are stored under <code>static/uploads/cms</code> with safe generated filenames.
				</Card.Content>
			</Card.Root>
		</aside>
	</form>
</section>
