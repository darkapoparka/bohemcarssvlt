<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveVehicleCardData } from '$lib/auxero/home-five';
	import type { VehicleCardCopy } from '$lib/i18n/messages';

	let {
		copy,
		style2 = false,
		vehicle
	}: {
		copy: VehicleCardCopy;
		style2?: boolean;
		vehicle: HomeFiveVehicleCardData;
	} = $props();
</script>

<div
	class="card-box card-box-style-1 bohemcars-no-image-zoom bohemcars-card-soft-hover"
	data-bohemcars-slug={vehicle.slug}
>
	<div class="top">
		<p class={`${vehicle.highlightClass} highlight text-white`}>{vehicle.mileageLabel}</p>
		<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
		<p
			class="heart bohemcars-favorite"
			role="button"
			tabindex="0"
			aria-label={`${copy.savePrefix} ${vehicle.title}`}
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
					<img src="/assets/icons/picture.svg" alt={copy.photosAlt} />
					{vehicle.photoCount}
				</p>
				<p class="category text-white uppercase">
					<img src="/assets/icons/play.svg" alt={copy.videoAlt} />
					0
				</p>
			</div>
		</div>
		<p class="card-box__title h6 mb-8">
			<a href={resolve(`/inventory/${encodeURIComponent(vehicle.slug)}`)}>{vehicle.title}</a>
		</p>
		<ul class={style2 ? 'tag style2 bohemcars-card-specs mb-10' : 'tag bohemcars-card-specs mb-10'}>
			<li>
				<img src="/assets/icons/calendar.svg" alt={copy.yearAlt} />
				<span>{vehicle.year}</span>
			</li>
			<li>
				<img src="/assets/icons/gaspump.svg" alt={copy.fuelAlt} />
				<span>{vehicle.fuel}</span>
			</li>
			<li>
				<img
					src={resolve(`/assets/icons/${vehicle.transmissionIcon}`)}
					alt={copy.transmissionAlt}
				/>
				<span>{vehicle.transmission}</span>
			</li>
		</ul>
		<p class="card-box__price bohemcars-card-price h6 mb-15">
			<span class="bohemcars-card-price__amount">{vehicle.priceLabel}</span>
			<span class="bohemcars-card-price__finance">
				<span class="bohemcars-card-price__monthly text-sm">{vehicle.monthlyLabel}</span>
				<a
					href={resolve('/financing')}
					class="bohemcars-card-price__finance-link text-muted text-underline text-xs"
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
				{copy.compare}
			</p>
			<a href={resolve(`/inventory/${encodeURIComponent(vehicle.slug)}`)} class="view-details">
				{copy.viewDetails}
				<img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt={copy.viewDetails} />
			</a>
		</div>
	</div>
</div>

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

	.bohemcars-card-specs {
		flex-wrap: nowrap !important;
		overflow: hidden;
	}

	.bohemcars-card-specs li {
		flex: 0 1 auto;
		min-width: 0;
		white-space: nowrap;
	}

	.bohemcars-card-price {
		align-items: center;
		display: flex;
		gap: 12px;
		justify-content: space-between;
	}

	.bohemcars-card-price__amount {
		color: inherit;
		font-size: 22px;
		font-weight: 600;
		line-height: 30px;
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
		color: #5a6356 !important;
		line-height: 16px;
		margin-left: 0;
		white-space: nowrap;
	}

	.bohemcars-card-actions {
		align-items: center;
		margin-top: auto;
	}

	.bohemcars-card-soft-hover {
		background-color: #fafafa;
		transition:
			background-color 0.25s ease,
			box-shadow 0.25s ease;
	}

	.bohemcars-card-soft-hover .content {
		background-color: #fafafa;
		transition: background-color 0.25s ease;
	}

	.bohemcars-card-soft-hover.active,
	.bohemcars-card-soft-hover:hover {
		background-color: #ffffff;
		box-shadow: 0 8px 20px rgba(28, 28, 28, 0.06) !important;
		transform: none;
	}

	.bohemcars-card-soft-hover:hover .content {
		background-color: #ffffff;
	}

	@media (max-width: 767px) {
		.card-box-style-1 {
			overflow: hidden;
			border: 0;
			border-radius: 10px;
			background: #eef1ed;
			box-shadow: none !important;
		}

		.bohemcars-card-soft-hover .content,
		.bohemcars-card-soft-hover:hover .content {
			background: #eef1ed;
		}

		.card-box-style-1 .image {
			aspect-ratio: 1.55;
			height: auto;
		}

		.card-box-style-1 .image :global(img),
		.card-box-style-1 .image img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		.card-box-style-1 .top .highlight {
			top: 8px;
			left: 8px;
			min-height: 24px;
			padding: 0 9px;
			border-radius: 7px;
			font-size: 10px;
			font-weight: 800;
			line-height: 24px;
		}

		.card-box-style-1 .top .heart {
			top: 8px;
			right: 8px;
			width: 30px;
			height: 30px;
		}

		.card-box-style-1 .content {
			padding: 12px;
		}

		.card-box-style-1 .bottom {
			display: none;
		}

		.card-box-style-1 .card-box__title {
			min-height: 48px;
			margin-bottom: 8px;
			font-size: 18px;
			font-weight: 800;
			line-height: 24px;
		}

		.bohemcars-card-specs {
			flex-wrap: wrap !important;
			gap: 6px 10px !important;
			margin-bottom: 8px !important;
		}

		.bohemcars-card-specs li {
			font-size: 12px;
			line-height: 16px;
		}

		.bohemcars-card-specs img {
			width: 13px;
			height: 13px;
		}

		.bohemcars-card-price {
			align-items: flex-start;
			flex-direction: column;
			gap: 2px;
			margin-bottom: 10px !important;
		}

		.bohemcars-card-price__amount {
			font-size: 18px;
			font-weight: 800;
			line-height: 23px;
		}

		.bohemcars-card-price__finance {
			align-items: flex-start;
			text-align: left;
		}

		.bohemcars-card-price__monthly,
		.bohemcars-card-price__finance-link {
			font-size: 12px;
			line-height: 16px;
		}

		.card-box-style-1 .divider {
			margin-bottom: 10px !important;
		}

		.bohemcars-card-actions {
			gap: 6px;
		}

		.bohemcars-card-actions .compare-details {
			min-width: auto;
			height: 34px;
			padding: 0 12px;
			font-size: 12px;
			line-height: 34px;
		}

		.bohemcars-card-actions .compare-details svg {
			width: 14px;
			height: 14px;
		}

		.bohemcars-card-actions .view-details {
			min-width: 0;
			font-size: 12px;
			font-weight: 800;
			line-height: 16px;
			white-space: nowrap;
		}

		.bohemcars-card-actions .view-details img {
			display: none;
		}
	}
</style>
