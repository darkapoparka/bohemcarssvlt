<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroFavoriteVehicleCard } from '$lib/auxero/favorites';

	let { card }: { card: AuxeroFavoriteVehicleCard } = $props();
</script>

<div class="card-box card-box-style-1" data-bohemcars-slug={card.slug}>
	<div class="top">
		<p class={`${card.highlightClass} highlight text-white`}>{card.tag}</p>
		<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
		<p
			class="heart bohemcars-favorite is-active"
			role="button"
			tabindex="0"
			aria-label={`Remove ${card.title}`}
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M8 14C8 14 1.5 10.5 1.5 6.375C1.5 5.47989 1.85558 5 4.875 3C6.28688 3 7.49625 3.76937 8 5C8.50375 3.76937 9.71312 3 11.125 3C14.1444 5 14.5 5.47989 14.5 6.375C14.5 10.5 8 14 8 14Z"
					stroke="white"
					fill="#d9f275"
				/>
			</svg>
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
		<ul class="tag mb-10">
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
		<p class="h6 card-box__price mb-15 flex items-center justify-between gap-8">
			{card.priceLabel}
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
