<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroInventoryVehicleCard } from '$lib/auxero/inventory';
	import { bohemcarsAssets, bohemcarsContact } from '$lib/data/bohemcars';
	import { getMessages, type VehicleCardCopy } from '$lib/i18n/messages';

	let {
		card,
		copy = getMessages('bg').inventory.vehicleCard,
		variant = 'grid'
	}: {
		card: AuxeroInventoryVehicleCard;
		copy?: VehicleCardCopy;
		variant?: 'grid' | 'list';
	} = $props();

	const handleCardImageError = (event: Event) => {
		const image = event.currentTarget;

		if (!(image instanceof HTMLImageElement) || image.src.endsWith(bohemcarsAssets.hero)) {
			return;
		}

		image.src = bohemcarsAssets.hero;
	};
</script>

{#if variant === 'list'}
	<div class="card-box card-box-style-9 bohemcars-no-image-zoom" data-bohemcars-slug={card.slug}>
		<div class="top">
			<p class={`${card.highlightClass} highlight text-white`}>{card.tag}</p>
			<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
			<p
				class="heart bohemcars-favorite"
				role="button"
				tabindex="0"
				aria-label={`${copy.savePrefix} ${card.title}`}
			>
				{@render heartIcon()}
			</p>
		</div>
		<div class="bottom">
			<p class="category text-white uppercase">
				<a
					href={resolve('/inventory/[slug]', { slug: card.slug })}
					class="text-xs text-white uppercase">{card.brand}</a
				>
			</p>
			<div class="flex items-center gap-8">
				<p class="category text-white uppercase">
					<img src="/assets/icons/picture.svg" alt={copy.photosAlt} />
					{card.imagesCount}
				</p>
				<p class="category text-white uppercase">
					<img src="/assets/icons/play.svg" alt={copy.videoAlt} />
					{card.videoCount}
				</p>
			</div>
		</div>
		<div class="image">
			<a href={resolve('/inventory/[slug]', { slug: card.slug })}>
				<img class="card--img" src={card.image} alt={card.title} onerror={handleCardImageError} />
			</a>
		</div>
		<div class="content">
			<p class="h6 card-box__title mb-4">
				<a href={resolve('/inventory/[slug]', { slug: card.slug })}>{card.title}</a>
			</p>
			<p class="text-secondary clamp-1 clamp mb-8">
				{card.description || bohemcarsContact.appointmentNote}
			</p>
			{@render cardMeta(card, 'tag style3 mb-14')}
			<p class="h6 card-box__price mb-10 flex items-center justify-between gap-8">
				{card.priceLabel}
			</p>
			<div class="flex gap-32">
				<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
				<p
					class="compare-details btn btn-small open-modal"
					data-modal-id="#CompareModal"
					data-bohemcars-compare={card.slug}
					role="button"
					tabindex="0"
				>
					{@render compareIcon()}
					{copy.compare}
				</p>
				<a href={resolve('/inventory/[slug]', { slug: card.slug })} class="view-details">
					{copy.viewDetails}
					<img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt={copy.viewDetails} />
				</a>
			</div>
		</div>
	</div>
{:else}
	<div
		class="card-box card-box-style-1 bohemcars-no-image-zoom wow fadeIn"
		data-wow-delay={card.delay}
		data-bohemcars-slug={card.slug}
	>
		<div class="top">
			<p class={`${card.highlightClass} highlight text-white`}>{card.mileageLabel}</p>
			<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
			<p
				class="heart bohemcars-favorite"
				role="button"
				tabindex="0"
				aria-label={`${copy.savePrefix} ${card.title}`}
			>
				{@render heartIcon()}
			</p>
		</div>
		<div class="image">
			<a href={resolve('/inventory/[slug]', { slug: card.slug })}>
				<img class="card--img" src={card.image} alt={card.title} onerror={handleCardImageError} />
			</a>
		</div>
		<div class="content border-light border-top-none">
			<div class="bottom">
				<p class="category text-white uppercase">
					<a
						href={resolve('/inventory/[slug]', { slug: card.slug })}
						class="text-xs text-white uppercase">{card.brand}</a
					>
				</p>
				<div class="flex items-center gap-8">
					<p class="category text-white uppercase">
						<img src="/assets/icons/picture.svg" alt={copy.photosAlt} />
						{card.imagesCount}
					</p>
					<p class="category text-white uppercase">
						<img src="/assets/icons/play.svg" alt={copy.videoAlt} />
						{card.videoCount}
					</p>
				</div>
			</div>
			<p class="h6 card-box__title mb-8">
				<a href={resolve('/inventory/[slug]', { slug: card.slug })}>{card.title}</a>
			</p>
			{@render compactCardMeta(card, 'tag style2 mb-10 bohemcars-card-specs')}
			<p class="card-box__price bohemcars-card-price h6 mb-15">
				<span class="bohemcars-card-price__amount">{card.priceLabel}</span>
				<span class="bohemcars-card-price__finance">
					<span class="bohemcars-card-price__monthly text-sm">{card.monthlyLabel}</span>
					<a
						href={resolve('/financing')}
						class="bohemcars-card-price__finance-link text-underline text-muted text-xs"
					>
						{copy.finance}
					</a>
				</span>
			</p>
			<div class="divider mb-15"></div>
			<div class="bohemcars-card-actions flex justify-between">
				<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
				<p
					class="compare-details btn btn-small open-modal"
					data-modal-id="#CompareModal"
					data-bohemcars-compare={card.slug}
					role="button"
					tabindex="0"
				>
					{@render compareIcon()}
					{copy.compare}
				</p>
				<a href={resolve('/inventory/[slug]', { slug: card.slug })} class="view-details">
					{copy.viewDetails}
					<img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt={copy.viewDetails} />
				</a>
			</div>
		</div>
	</div>
{/if}

{#snippet cardMeta(card: AuxeroInventoryVehicleCard, tagClass: string)}
	<ul class={tagClass}>
		<li>
			<img src="/assets/icons/icon-gauge.svg" alt={copy.mileageAlt} /><span
				>{card.mileageLabel}</span
			>
		</li>
		<li>
			<img src="/assets/icons/calendar.svg" alt={copy.yearAlt} /><span>{card.year}</span>
		</li>
		<li>
			<img src="/assets/icons/gaspump.svg" alt={copy.fuelAlt} /><span>{card.fuel}</span>
		</li>
		<li>
			<img src="/assets/icons/transmission.svg" alt={copy.transmissionAlt} /><span
				>{card.transmission}</span
			>
		</li>
	</ul>
{/snippet}

{#snippet compactCardMeta(card: AuxeroInventoryVehicleCard, tagClass: string)}
	<ul class={tagClass}>
		<li>
			<img src="/assets/icons/calendar.svg" alt={copy.yearAlt} /><span>{card.year}</span>
		</li>
		<li>
			<img src="/assets/icons/gaspump.svg" alt={copy.fuelAlt} /><span>{card.fuel}</span>
		</li>
		<li>
			<img src="/assets/icons/transmission.svg" alt={copy.transmissionAlt} /><span
				>{card.transmission}</span
			>
		</li>
	</ul>
{/snippet}

{#snippet heartIcon()}
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g clip-path="url(#clip0_13399_19510)">
			<path
				d="M8 14C8 14 1.5 10.5 1.5 6.375C1.5 5.47989 1.85558 4.62145 2.48851 3.98851C3.12145 3.35558 3.97989 3 4.875 3C6.28688 3 7.49625 3.76937 8 5C8.50375 3.76937 9.71312 3 11.125 3C12.0201 3 12.8785 3.35558 13.5115 3.98851C14.1444 4.62145 14.5 5.47989 14.5 6.375C14.5 10.5 8 14 8 14Z"
				stroke="white"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</g>
	</svg>
{/snippet}

{#snippet compareIcon()}
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g clip-path="url(#clip0_13399_19575)">
			<path
				d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
				stroke="#1C1C1C"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M6.875 10H13.125"
				stroke="#1C1C1C"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M10 6.875V13.125"
				stroke="#1C1C1C"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</g>
	</svg>
{/snippet}

<style>
	.card-box-style-1 {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.card-box-style-1 .content {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.card-box-style-1 .card-box__title {
		display: -webkit-box;
		min-height: 52px;
		overflow: hidden;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.card-box-style-1 .image {
		aspect-ratio: 4 / 3;
		overflow: hidden;
	}

	.card-box-style-1 .image a,
	.card-box-style-1 .image img {
		display: block;
		width: 100%;
		height: 100%;
	}

	.card-box-style-1 .image img {
		object-fit: cover;
	}

	.bohemcars-card-specs {
		flex-wrap: wrap !important;
		gap: 5px;
		overflow: visible;
	}

	.bohemcars-card-specs li {
		flex: 0 0 auto;
		justify-content: flex-start;
		min-width: max-content;
		padding: 5px 8px;
		white-space: nowrap;
	}

	.bohemcars-card-specs li img {
		flex: 0 0 14px;
		height: 14px;
		object-fit: contain;
		width: 14px;
	}

	.bohemcars-card-specs li span {
		overflow: visible;
		text-overflow: clip;
	}

	.bohemcars-card-price {
		align-items: center;
		display: flex;
		gap: 12px;
		justify-content: space-between;
	}

	.bohemcars-card-price__amount {
		font-size: 22px;
		font-weight: 600;
		line-height: 28px;
		white-space: nowrap;
	}

	.bohemcars-card-price__finance {
		align-items: flex-end;
		display: flex;
		flex-direction: column;
		gap: 2px;
		text-align: right;
	}

	.bohemcars-card-price__monthly {
		display: block;
		line-height: 20px;
		white-space: nowrap;
	}

	.bohemcars-card-price__finance-link {
		line-height: 16px;
		margin-left: 0;
		white-space: nowrap;
	}

	.bohemcars-card-actions {
		align-items: center;
		margin-top: auto;
	}
</style>
