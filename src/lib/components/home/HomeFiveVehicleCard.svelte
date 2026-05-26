<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveVehicleCardData } from '$lib/auxero/home-five';

	let { style2 = false, vehicle }: { style2?: boolean; vehicle: HomeFiveVehicleCardData } =
		$props();
</script>

<div class="card-box card-box-style-1" data-bohemcars-slug={vehicle.slug}>
	<div class="top">
		<p class={`${vehicle.highlightClass} highlight text-white`}>{vehicle.highlightText}</p>
		<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
		<p
			class="heart bohemcars-favorite"
			role="button"
			tabindex="0"
			aria-label={`Save ${vehicle.title}`}
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M8 14C8 14 1.5 10.5 1.5 6.375C1.5 5.47989 1.85558 4.62145 2.48851 3.98851C3.12145 3.35558 3.97989 3 4.875 3C6.28688 3 7.49625 3.76937 8 5C8.50375 3.76937 9.71312 3 11.125 3C12.0201 3 12.8785 3.35558 13.5115 3.98851C14.1444 4.62145 14.5 5.47989 14.5 6.375C14.5 10.5 8 14 8 14Z"
					stroke="white"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</p>
	</div>
	<div class="image">
		<a href={resolve(`/inventory/${encodeURIComponent(vehicle.slug)}`)}>
			<img class="card--img" src={vehicle.image} alt={vehicle.title} />
		</a>
	</div>
	<div class="content border-light border-top-none">
		<div class="bottom">
			<p class="category text-white uppercase">
				<a
					href={resolve(`/inventory?brand=${encodeURIComponent(vehicle.brand)}`)}
					class="text-xs text-white uppercase"
				>
					{vehicle.brand}
				</a>
			</p>
			<div class="flex items-center gap-8">
				<p class="category text-white uppercase">
					<img src="/assets/icons/picture.svg" alt="photos" />
					{vehicle.photoCount}
				</p>
				<p class="category text-white uppercase">
					<img src="/assets/icons/play.svg" alt="video" />
					0
				</p>
			</div>
		</div>
		<p class="card-box__title h6 mb-8">
			<a href={resolve(`/inventory/${encodeURIComponent(vehicle.slug)}`)}>{vehicle.title}</a>
		</p>
		<ul class={style2 ? 'tag style2 mb-10' : 'tag mb-10'}>
			<li>
				<img src="/assets/icons/icon-gauge.svg" alt="mileage" />
				<span>{vehicle.mileageLabel}</span>
			</li>
			<li>
				<img src="/assets/icons/calendar.svg" alt="year" />
				<span>{vehicle.year}</span>
			</li>
			<li>
				<img src="/assets/icons/gaspump.svg" alt="fuel" />
				<span>{vehicle.fuel}</span>
			</li>
			<li>
				<img src={resolve(`/assets/icons/${vehicle.transmissionIcon}`)} alt="transmission" />
				<span>{vehicle.transmission}</span>
			</li>
		</ul>
		<p class="card-box__price h6 mb-15 flex items-center justify-between gap-8">
			{vehicle.priceLabel}
			<span class="text-sm">
				{vehicle.monthlyLabel}
				<a href={resolve('/financing')} class="text-muted text-underline ml-2 text-xs"
					>See Finance</a
				>
			</span>
		</p>
		<div class="divider mb-15"></div>
		<div class="flex justify-between">
			<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
			<p
				class="compare-details btn btn-small open-modal"
				data-modal-id="#CompareModal"
				data-bohemcars-compare={vehicle.slug}
				role="button"
				tabindex="0"
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g clip-path="url(#clip0_bohemcars_home_compare)">
						<path
							d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M6.875 10H13.125"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M10 6.875V13.125"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</g>
				</svg>
				Compare
			</p>
			<a href={resolve(`/inventory/${encodeURIComponent(vehicle.slug)}`)} class="view-details">
				View details
				<img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt="view details" />
			</a>
		</div>
	</div>
</div>
