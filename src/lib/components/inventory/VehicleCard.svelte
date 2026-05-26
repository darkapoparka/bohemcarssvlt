<script lang="ts">
	import { Calendar, Camera, Fuel, Gauge, GitCompare, Heart, PlayCircle } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { bohemcarsAssets } from '$lib/data/bohemcars';
	import type { Vehicle } from '$lib/data/vehicles';
	import { getGarageContext } from '$lib/state/garage.svelte';
	import { cn } from '$lib/utils/cn';
	import { formatAuxeroPrice, formatMileage } from '$lib/utils/format';

	interface Props {
		vehicle: Vehicle;
	}

	let { vehicle }: Props = $props();
	let fallbackImage = $state(false);
	const garage = getGarageContext();
	const imageSrc = $derived(fallbackImage ? bohemcarsAssets.hero : vehicle.image);
	const isFavorite = $derived(garage.favorites.includes(vehicle.slug));
	const isCompared = $derived(garage.compare.includes(vehicle.slug));
</script>

<article class="vehicle-card card-box" data-bohemcars-slug={vehicle.slug}>
	<div class="vehicle-card__media">
		{#if vehicle.tag}
			<span class={cn('vehicle-card__tag', `vehicle-card__tag--${vehicle.tagTone ?? 'lime'}`)}>
				{vehicle.tag}
			</span>
		{/if}
		<button
			class={cn(
				'vehicle-card__heart bohemcars-favorite heart',
				isFavorite && 'vehicle-card__heart--active'
			)}
			type="button"
			aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
			aria-pressed={isFavorite}
			onclick={() => garage.toggleFavorite(vehicle.slug)}
		>
			<Heart size={17} />
		</button>
		<a
			href={resolve('/inventory/[slug]', { slug: vehicle.slug })}
			aria-label={`View ${vehicle.title}`}
		>
			<img
				src={imageSrc}
				alt={vehicle.title}
				onerror={() => {
					fallbackImage = true;
				}}
			/>
		</a>
		<div class="vehicle-card__media-bottom">
			<span>{vehicle.brand}</span>
			<div class="vehicle-card__media-counts">
				<span><Camera size={15} /> {vehicle.slug === 'kia-ev9-2024' ? 8 : 9}</span>
				<span><PlayCircle size={15} /> 1</span>
			</div>
		</div>
	</div>
	<div class="vehicle-card__body">
		<a
			class="vehicle-card__title card-box__title"
			href={resolve('/inventory/[slug]', { slug: vehicle.slug })}
		>
			{vehicle.title}
		</a>
		<ul class="vehicle-card__specs">
			<li><Gauge size={16} /> {formatMileage(vehicle.mileage)}</li>
			<li><Calendar size={16} /> {vehicle.year}</li>
			<li><Fuel size={16} /> {vehicle.displayFuel ?? vehicle.fuel}</li>
			<li>{vehicle.transmission}</li>
		</ul>
		<p class="vehicle-card__price">{formatAuxeroPrice(vehicle.price)}</p>
		<div class="vehicle-card__divider"></div>
		<div class="vehicle-card__actions">
			<button
				class={cn('mini-action compare-details', isCompared && 'mini-action--active')}
				type="button"
				data-bohemcars-compare={vehicle.slug}
				onclick={() => garage.toggleCompare(vehicle.slug)}
			>
				<GitCompare size={18} />
				{isCompared ? 'Added' : 'Compare'}
			</button>
			<a class="vehicle-card__details" href={resolve('/inventory/[slug]', { slug: vehicle.slug })}>
				View details
			</a>
		</div>
	</div>
</article>
