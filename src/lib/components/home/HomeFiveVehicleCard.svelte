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

	/* Spec row as soft chips: more scannable/visible without heavier type. */
	.bohemcars-card-specs {
		flex-wrap: wrap !important;
		justify-content: flex-start;
		gap: 6px;
		overflow: visible;
		margin-bottom: 14px;
	}

	.bohemcars-card-specs li {
		flex: 0 0 auto;
		min-width: 0;
		white-space: nowrap;
		padding: 5px 10px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-soft);
	}

	.bohemcars-card-specs li img {
		width: 14px;
		height: 14px;
		opacity: 0.8;
	}

	.bohemcars-card-specs li span {
		color: #303a2b;
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

	@media (min-width: 768px) {
		.bohemcars-card-price__amount {
			border-radius: 8px;
			background: rgba(152, 188, 42, 0.13);
			color: #14210f;
			padding: 1px 8px;
			transition:
				background-color 0.2s ease,
				color 0.2s ease;
		}

		.bohemcars-card-soft-hover {
			background-color: #f7faef;
			border-color: #e3e9dd;
			transition:
				background-color 0.25s ease,
				border-color 0.25s ease,
				box-shadow 0.25s ease;
		}

		.bohemcars-card-soft-hover .content {
			background-color: #f7faef;
			transition:
				background-color 0.25s ease,
				border-color 0.25s ease;
		}

		.card-box-style-1 .bottom .category {
			background-color: rgba(20, 33, 15, 0.74);
			border-color: rgba(255, 255, 255, 0.2);
			backdrop-filter: none;
			-webkit-backdrop-filter: none;
			transition:
				background-color 0.2s ease,
				border-color 0.2s ease;
		}

		.bohemcars-card-soft-hover .card-box__title a,
		.bohemcars-card-soft-hover .bottom .category a,
		.bohemcars-card-soft-hover .view-details {
			text-decoration: none !important;
		}

		.bohemcars-card-soft-hover .card-box__price {
			color: #14210f !important;
		}

		.bohemcars-card-soft-hover:hover,
		.bohemcars-card-soft-hover:focus-within {
			background-color: #ffffff;
			border-color: #cfdcc8 !important;
			box-shadow: inset 0 0 0 1px rgba(152, 188, 42, 0.2) !important;
			transform: none;
		}

		.bohemcars-card-soft-hover:hover .content,
		.bohemcars-card-soft-hover:focus-within .content {
			background-color: #ffffff;
		}

		.bohemcars-card-soft-hover:hover .card-box__price,
		.bohemcars-card-soft-hover:focus-within .card-box__price,
		.bohemcars-card-soft-hover:hover .card-box__title a,
		.bohemcars-card-soft-hover:focus-within .card-box__title a,
		.bohemcars-card-soft-hover:hover .bottom .category a,
		.bohemcars-card-soft-hover:focus-within .bottom .category a {
			color: #14210f !important;
			text-decoration: none !important;
		}

		.bohemcars-card-soft-hover:hover .bottom .category,
		.bohemcars-card-soft-hover:focus-within .bottom .category {
			background-color: rgba(217, 242, 117, 0.94);
			border-color: rgba(152, 188, 42, 0.56);
		}

		.bohemcars-card-soft-hover:hover .bohemcars-card-price__amount,
		.bohemcars-card-soft-hover:focus-within .bohemcars-card-price__amount {
			background-color: rgba(152, 188, 42, 0.2);
			color: #14210f;
		}

		.bohemcars-card-soft-hover:hover .compare-details:not(:hover):not(:focus-visible),
		.bohemcars-card-soft-hover:focus-within .compare-details:not(:hover):not(:focus-visible) {
			background-color: transparent !important;
			border-color: #1c1c1c !important;
			color: #1c1c1c !important;
		}

		.bohemcars-card-soft-hover:hover .compare-details:not(:hover):not(:focus-visible) svg path,
		.bohemcars-card-soft-hover:focus-within
			.compare-details:not(:hover):not(:focus-visible)
			svg
			path {
			stroke: #1c1c1c !important;
		}
	}

	@media (min-width: 992px) {
		.card-box-style-1 .image {
			background: var(--bc-card-media, #f4f5f2);
		}

		.card-box-style-1 .top .highlight {
			border: 1px solid rgba(28, 28, 28, 0.1);
			background: #ffffff !important;
			box-shadow: 0 4px 12px rgba(28, 28, 28, 0.14);
			color: var(--bc-card-ink, #171a15) !important;
		}

		.bohemcars-card-price__amount {
			background: transparent;
			color: var(--bc-card-ink, #171a15);
			padding: 0;
		}

		.bohemcars-card-soft-hover {
			background-color: var(--bc-card-bg, #eef1ed);
			border-color: transparent;
			box-shadow: none !important;
		}

		.bohemcars-card-soft-hover .content {
			background-color: var(--bc-card-bg, #eef1ed);
		}

		.card-box-style-1 .bottom .category {
			background-color: var(--bc-card-pill, rgba(28, 28, 28, 0.78));
			border-color: rgba(255, 255, 255, 0.18);
		}

		.bohemcars-card-soft-hover .card-box__price {
			color: var(--bc-card-ink, #171a15) !important;
		}

		.bohemcars-card-soft-hover:hover,
		.bohemcars-card-soft-hover:focus-within {
			background-color: var(--bc-card-hover, #e4eadf);
			border-color: transparent !important;
			box-shadow: none !important;
			transform: none;
		}

		.bohemcars-card-soft-hover:hover .content,
		.bohemcars-card-soft-hover:focus-within .content {
			background-color: var(--bc-card-hover, #e4eadf);
		}

		.bohemcars-card-soft-hover:hover .card-box__price,
		.bohemcars-card-soft-hover:focus-within .card-box__price,
		.bohemcars-card-soft-hover:hover .card-box__title a,
		.bohemcars-card-soft-hover:focus-within .card-box__title a {
			color: var(--bc-card-ink, #171a15) !important;
			text-decoration: none !important;
		}

		.bohemcars-card-soft-hover:hover .bottom .category a,
		.bohemcars-card-soft-hover:focus-within .bottom .category a {
			color: #ffffff !important;
			text-decoration: none !important;
		}

		.bohemcars-card-soft-hover:hover .bottom .category,
		.bohemcars-card-soft-hover:focus-within .bottom .category {
			background-color: var(--bc-card-pill-hover, rgba(28, 28, 28, 0.88));
			border-color: rgba(255, 255, 255, 0.24);
		}

		.bohemcars-card-soft-hover:hover .bohemcars-card-price__amount,
		.bohemcars-card-soft-hover:focus-within .bohemcars-card-price__amount {
			background-color: transparent;
			color: var(--bc-card-ink, #171a15);
		}
	}

	@media (max-width: 767px) {
		.card-box-style-1 {
			overflow: hidden;
			border: 0;
			border-radius: 10px;
			background: var(--bc-surface);
			box-shadow: none !important;
		}

		.bohemcars-card-soft-hover .content,
		.bohemcars-card-soft-hover:hover .content {
			background: var(--bc-surface);
		}

		.card-box-style-1 .image {
			aspect-ratio: 1.68;
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
			width: 44px;
			height: 44px;
		}

		.card-box-style-1 .content {
			padding: 11px 12px 12px;
		}

		.card-box-style-1 .bottom {
			display: none;
		}

		.card-box-style-1 .card-box__title {
			min-height: 0;
			margin-bottom: 8px;
			font-size: 17px;
			font-weight: 500;
			line-height: 22px;
		}

		.card-box-style-1 .card-box__title a {
			display: inline-flex;
			min-height: 44px;
			align-items: center;
			margin-block: -9px;
			padding-block: 9px;
		}

		/* Mobile: title → spec chips → price anchored at the bottom (price as the bold conclusion). */
		.bohemcars-card-specs {
			order: 1;
			flex-wrap: wrap !important;
			gap: 5px 6px !important;
			margin-top: 0;
			margin-bottom: 12px !important;
		}

		.bohemcars-card-specs li {
			padding: 5px 9px;
			font-size: 12px;
			line-height: 16px;
			/* Inner chips stay white so they remain visible against the standard soft card surface. */
			background: #ffffff;
			border-color: var(--bc-border);
		}

		.bohemcars-card-specs img {
			width: 13px;
			height: 13px;
		}

		.bohemcars-card-price {
			order: 2;
			margin-top: auto;
			align-items: center;
			flex-direction: row;
			gap: 8px;
			margin-bottom: 0 !important;
		}

		.bohemcars-card-price__amount {
			font-size: 18px;
			font-weight: 800;
			line-height: 22px;
		}

		.bohemcars-card-price__finance {
			align-items: flex-end;
			min-width: 0;
			text-align: right;
		}

		.bohemcars-card-price__monthly,
		.bohemcars-card-price__finance-link {
			font-size: 11px;
			line-height: 15px;
		}

		.bohemcars-card-price__finance-link {
			display: inline-flex;
			min-height: 44px;
			align-items: center;
			margin-block: -14px;
		}

		/* Mobile: the whole card taps to the detail page, so drop the footer
		   (divider + Сравни + Виж детайли). Compare still lives on the PDP + header. */
		.card-box-style-1 .divider,
		.bohemcars-card-actions {
			display: none;
		}
	}
</style>
