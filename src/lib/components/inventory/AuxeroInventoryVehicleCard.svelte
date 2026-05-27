<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroInventoryVehicleCard } from '$lib/auxero/inventory';
	import { bohemcarsContact } from '$lib/data/bohemcars';

	let {
		card,
		variant = 'grid'
	}: {
		card: AuxeroInventoryVehicleCard;
		variant?: 'grid' | 'list';
	} = $props();
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
				aria-label={`Save ${card.title}`}
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
					<img src="/assets/icons/picture.svg" alt="photos" />
					{card.imagesCount}
				</p>
				<p class="category text-white uppercase">
					<img src="/assets/icons/play.svg" alt="video" />
					{card.videoCount}
				</p>
			</div>
		</div>
		<div class="image">
			<a href={resolve('/inventory/[slug]', { slug: card.slug })}>
				<img class="card--img" src={card.image} alt={card.title} />
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
					Compare
				</p>
				<a href={resolve('/inventory/[slug]', { slug: card.slug })} class="view-details">
					View details <img
						class="ml-4"
						src="/assets/icons/CaretCircleRight.svg"
						alt="view details"
					/>
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
			<p class={`${card.highlightClass} highlight text-white`}>{card.tag}</p>
			<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
			<p
				class="heart bohemcars-favorite"
				role="button"
				tabindex="0"
				aria-label={`Save ${card.title}`}
			>
				{@render heartIcon()}
			</p>
		</div>
		<div class="image">
			<a href={resolve('/inventory/[slug]', { slug: card.slug })}>
				<img class="card--img" src={card.image} alt={card.title} />
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
						<img src="/assets/icons/picture.svg" alt="photos" />
						{card.imagesCount}
					</p>
					<p class="category text-white uppercase">
						<img src="/assets/icons/play.svg" alt="video" />
						{card.videoCount}
					</p>
				</div>
			</div>
			<p class="h6 card-box__title mb-8">
				<a href={resolve('/inventory/[slug]', { slug: card.slug })}>{card.title}</a>
			</p>
			{@render cardMeta(card, 'tag style2 mb-10')}
			<p class="h6 card-box__price mb-15 flex items-center justify-between gap-8">
				{card.priceLabel}
				<span class="text-sm">
					{card.monthlyLabel}<a
						href={resolve('/inventory/[slug]', { slug: card.slug })}
						class="text-underline text-muted ml-2 text-xs">See Finance</a
					>
				</span>
			</p>
			<div class="divider mb-15"></div>
			<div class="flex justify-between">
				<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
				<p
					class="compare-details btn btn-small open-modal"
					data-modal-id="#CompareModal"
					data-bohemcars-compare={card.slug}
					role="button"
					tabindex="0"
				>
					{@render compareIcon()}
					Compare
				</p>
				<a href={resolve('/inventory/[slug]', { slug: card.slug })} class="view-details">
					View details <img
						class="ml-4"
						src="/assets/icons/CaretCircleRight.svg"
						alt="view details"
					/>
				</a>
			</div>
		</div>
	</div>
{/if}

{#snippet cardMeta(card: AuxeroInventoryVehicleCard, tagClass: string)}
	<ul class={tagClass}>
		<li>
			<img src="/assets/icons/icon-gauge.svg" alt="mileage" /><span>{card.mileageLabel}</span>
		</li>
		<li>
			<img src="/assets/icons/calendar.svg" alt="year" /><span>{card.year}</span>
		</li>
		<li>
			<img src="/assets/icons/gaspump.svg" alt="fuel" /><span>{card.fuel}</span>
		</li>
		<li>
			<img src="/assets/icons/auto.svg" alt="transmission" /><span>{card.transmission}</span>
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
