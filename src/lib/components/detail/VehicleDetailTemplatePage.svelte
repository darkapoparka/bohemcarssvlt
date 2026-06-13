<script lang="ts">
	import { resolve } from '$app/paths';
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { AuxeroVehicleDetailData } from '$lib/auxero/detail';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import AuxeroVehicleDetail from './AuxeroVehicleDetail.svelte';
	import AuxeroVehicleMobileIsland from './AuxeroVehicleMobileIsland.svelte';

	let {
		detail,
		pageDocument,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml
	}: {
		detail: AuxeroVehicleDetailData;
		pageDocument: AuxeroPageDocument;
		shellCopy: HomePageCopy;
		shellFooter: HomeFiveFooterData;
		shellHeader: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
		shellRuntimeHtml: string;
	} = $props();
</script>

<AuxeroPublicShell
	copy={shellCopy}
	footer={shellFooter}
	header={shellHeader}
	modals={shellModals}
	{pageDocument}
	runtimeHtml={shellRuntimeHtml}
	title={`${detail.title} — Bohemcars`}
>
	<section class="bohemcars-pdp-desktop-breadcrumb background-light mb-22">
		<div class="container">
			<div class="flex items-center justify-between">
				<ul class="breadcrumb">
					<li><a href={resolve('/')}>Начало</a></li>
					<li><img src="/assets/icons/right.svg" alt="chevron-right" /></li>
					<li><span>{detail.title}</span></li>
				</ul>

				<div class="swiper-listing-details-navigation">
					<p class="swiper-listing-details-prev cursor-pointer">Предишна</p>
					<p class="swiper-listing-details-next cursor-pointer">Следваща</p>
				</div>
			</div>
		</div>
	</section>

	<section class="bohemcars-pdp-desktop pb-100">
		<div class="tf-spacing-style4"></div>
		<div class="container">
			{#key detail.slug}
				<AuxeroVehicleDetail {detail} />
			{/key}
		</div>
	</section>

	<AuxeroVehicleMobileIsland {detail} />
</AuxeroPublicShell>

<style>
	:global(.bohemcars-pdp-desktop) {
		background: #fbfcfa;
	}

	:global(.bohemcars-pdp-desktop .tf-spacing-style4) {
		height: 32px;
	}

	:global(.bohemcars-pdp-desktop-breadcrumb) {
		background: #f2f4ef;
		border-bottom: 1px solid #e8ebe3;
		margin-bottom: 0;
	}

	:global(.bohemcars-pdp-desktop-breadcrumb .container) {
		padding-bottom: 12px;
		padding-top: 12px;
	}

	:global(.bohemcars-pdp-desktop-breadcrumb .swiper-listing-details-navigation p) {
		color: #4b4b4b;
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
	}

	@media (min-width: 768px) {
		:global(.bohemcars-pdp-desktop .listing-details) {
			align-items: start;
			display: grid;
			gap: 60px;
			grid-template-columns: minmax(0, 1fr) 400px;
		}

		:global(.bohemcars-pdp-desktop .listing-details--content),
		:global(.bohemcars-pdp-desktop .listing-details--sidebar) {
			min-width: 0;
			width: auto;
		}

		:global(.bohemcars-pdp-desktop .listing-details--sidebar) {
			position: sticky;
			top: 104px;
		}
	}

	:global(.bohemcars-pdp-desktop .title-section) {
		align-items: center;
		background:
			linear-gradient(135deg, rgba(217, 242, 117, 0.22), rgba(255, 255, 255, 0.94) 52%), #f8faf5;
		border: 1px solid #dfe8d4;
		border-radius: 8px;
		margin-bottom: 24px;
		padding: 30px 32px;
	}

	:global(.bohemcars-pdp-desktop .title-section h1) {
		color: #14210f;
		margin-bottom: 0;
		max-width: 650px;
		min-width: 0;
	}

	:global(.bohemcars-pdp-desktop .title-section > div) {
		flex: 0 0 auto;
	}

	:global(.bohemcars-pdp-desktop .title-section .btn-icon-circle) {
		background: #eef1ed;
		border: 1px solid #dce4d4;
		box-sizing: border-box;
		color: #1c1c1c;
		flex: 0 0 48px;
		width: 48px;
		height: 48px;
		line-height: 1;
		padding: 0;
	}

	:global(.bohemcars-pdp-desktop .title-section .bohemcars-pdp-compare) {
		background: #d9f275;
		border-color: #cde85c;
	}

	:global(.bohemcars-pdp-desktop .title-section .btn-icon-circle:hover) {
		background: var(--bc-hover-accent);
		border-color: var(--bc-hover-accent);
		color: var(--bc-hover-accent-ink);
	}

	:global(.bohemcars-pdp-desktop .title-section .bohemcars-pdp-compare:hover) {
		background: var(--bc-hover-accent);
		border-color: var(--bc-hover-accent);
		color: var(--bc-hover-accent-ink);
	}

	:global(.bohemcars-pdp-desktop .title-section .bohemcars-pdp-compare svg path) {
		fill: none !important;
		stroke: #1c1c1c !important;
	}

	:global(.bohemcars-pdp-desktop .title-section .bohemcars-pdp-compare:hover svg path) {
		stroke: var(--bc-hover-accent-ink) !important;
	}

	:global(.bohemcars-pdp-desktop .title-section .bohemcars-favorite svg path) {
		fill: none !important;
		stroke: #1c1c1c !important;
	}

	:global(.bohemcars-pdp-desktop .title-section .bohemcars-favorite:hover svg path) {
		stroke: var(--bc-hover-accent-ink) !important;
	}

	:global(
		.bohemcars-pdp-desktop
			.title-section
			.btn-icon-circle:not(.bohemcars-favorite):not(.bohemcars-pdp-compare)
			svg
			path
	) {
		fill: #1c1c1c !important;
	}

	:global(
		.bohemcars-pdp-desktop
			.title-section
			.btn-icon-circle:not(.bohemcars-favorite):not(.bohemcars-pdp-compare):hover
			svg
			path
	) {
		fill: var(--bc-hover-accent-ink) !important;
	}

	:global(.bohemcars-pdp-desktop .bohemcars-pdp-gallery-main) {
		background: #eef1ed;
		border-radius: 8px;
		height: clamp(520px, 44vw, 600px);
		margin-bottom: 14px;
	}

	:global(.bohemcars-pdp-desktop .listing-details-item) {
		background: #eef1ed;
		border-radius: 8px;
	}

	:global(.bohemcars-pdp-desktop .listing-details-item .img-main) {
		height: 100%;
		width: 100%;
	}

	:global(.bohemcars-pdp-desktop .listing-details-thumb) {
		background: #eef1ed;
		border-radius: 8px;
	}

	:global(.bohemcars-pdp-desktop .listing-details-thumb img) {
		border-radius: 8px;
	}

	:global(.bohemcars-pdp-desktop .swiper-listing-details-thumbs) {
		padding-bottom: 46px;
	}

	:global(.bohemcars-pdp-desktop .listing-details-item--button) {
		backdrop-filter: blur(8px);
		background: rgba(19, 36, 20, 0.62);
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 8px;
	}

	:global(.bohemcars-pdp-desktop .listing-details-item--button:hover) {
		background: #d9f275;
		color: #1c1c1c;
	}

	:global(.bohemcars-pdp-desktop .listing-details--content > .h4),
	:global(.bohemcars-pdp-desktop .listing-details--content > p.h4),
	:global(.bohemcars-pdp-desktop .listing-details--content > div + .h4) {
		color: #1c1c1c;
	}

	:global(.bohemcars-pdp-desktop .listing-details--content > .divider) {
		display: none;
	}

	:global(.bohemcars-pdp-desktop .bohemcars-pdp-info-panel) {
		background: #ffffff;
		border: 1px solid #e1e5dc;
		border-radius: 8px;
		margin-bottom: 40px;
		padding: 24px;
	}

	:global(.bohemcars-pdp-desktop .bohemcars-pdp-info-panel > .h4) {
		margin-bottom: 16px;
	}

	:global(.bohemcars-pdp-desktop .bohemcars-pdp-info-panel .flat-tabs) {
		margin-bottom: 0;
	}

	:global(.bohemcars-pdp-desktop .bohemcars-pdp-info-panel .content-tab) {
		min-width: 0;
	}

	:global(.bohemcars-pdp-desktop .listing-details--sidebar-box),
	:global(.bohemcars-pdp-desktop .financing-calculator),
	:global(.bohemcars-pdp-desktop .rating-box),
	:global(.bohemcars-pdp-desktop .comment-box) {
		background: #eef1ed;
		border: 1px solid #e1e5dc;
		border-radius: 8px;
		box-shadow: none;
	}

	:global(.bohemcars-pdp-desktop .listing-details--sidebar-box) {
		margin-bottom: 28px;
		padding: 24px;
	}

	:global(.bohemcars-pdp-desktop .listing-details--sidebar-box:first-child) {
		background:
			linear-gradient(180deg, rgba(217, 242, 117, 0.18), rgba(217, 242, 117, 0) 92px), #eef1ed;
	}

	:global(.bohemcars-pdp-desktop .listing-details--sidebar-box .menu-tab-style5) {
		background: rgba(255, 255, 255, 0.72);
		border: 1px solid #e1e5dc;
		border-radius: 999px;
		padding: 4px;
	}

	:global(.bohemcars-pdp-desktop .listing-details--sidebar-box .menu-tab-style5 li) {
		border-radius: 999px;
	}

	:global(.bohemcars-pdp-desktop .listing-details--sidebar-box .menu-tab-style5 li.active) {
		background: #1c1c1c;
		color: #ffffff;
	}

	:global(.bohemcars-pdp-desktop .car-overview-list-style2 li) {
		border-color: #dde3d6;
	}

	:global(.bohemcars-pdp-desktop .listing-details--contact .verify) {
		background: #edf5cf;
		border-radius: 999px;
		padding: 4px 10px;
		width: max-content;
	}

	:global(.bohemcars-pdp-desktop .listing-details--contact .btn-primary-3) {
		background: #98bc2a;
		border-color: #98bc2a;
	}

	:global(.bohemcars-pdp-desktop .listing-details--contact .btn-primary-3:hover) {
		background: #1c1c1c;
		border-color: #1c1c1c;
	}

	:global(.bohemcars-pdp-desktop .flat-tabs .menu-tab-style4) {
		align-items: stretch;
		background: #eef1ed;
		border: 1px solid #e1e5dc;
		border-radius: 8px;
		border-bottom: 1px solid #e1e5dc;
		display: flex;
		gap: 6px;
		padding: 6px;
		width: 100%;
	}

	:global(.bohemcars-pdp-desktop .flat-tabs .menu-tab-style4 li) {
		border-radius: 8px;
		flex: 1 1 0;
		padding: 9px 10px;
		text-align: center;
		transition:
			background-color 160ms ease,
			box-shadow 160ms ease;
	}

	:global(.bohemcars-pdp-desktop .flat-tabs .menu-tab-style4 li:not(:last-child)) {
		margin-right: 0;
	}

	:global(.bohemcars-pdp-desktop .flat-tabs .menu-tab-style4 li::before) {
		display: none;
	}

	:global(.bohemcars-pdp-desktop .flat-tabs .menu-tab-style4 li.active) {
		background: #d9f275 !important;
	}

	:global(.bohemcars-pdp-desktop .flat-tabs .menu-tab-style4 li.active span) {
		color: #1c1c1c !important;
	}

	@media (hover: hover) and (pointer: fine) {
		:global(.bohemcars-pdp-desktop .flat-tabs .menu-tab-style4 li:not(.active):hover),
		:global(.bohemcars-pdp-desktop .flat-tabs .menu-tab-style4 li:not(.active):focus-within) {
			background: rgba(217, 242, 117, 0.52) !important;
			box-shadow: inset 0 0 0 1px rgba(152, 188, 42, 0.34) !important;
		}

		:global(.bohemcars-pdp-desktop .flat-tabs .menu-tab-style4 li:not(.active):hover span),
		:global(.bohemcars-pdp-desktop .flat-tabs .menu-tab-style4 li:not(.active):focus-within span) {
			color: #14210f !important;
		}

		:global(.bohemcars-pdp-desktop .flat-tabs .menu-tab-style4 li.active:hover),
		:global(.bohemcars-pdp-desktop .flat-tabs .menu-tab-style4 li.active:focus-within) {
			background: #cfee50 !important;
			box-shadow: inset 0 0 0 1px rgba(152, 188, 42, 0.22) !important;
		}
	}

	:global(.bohemcars-pdp-desktop .bohemcars-pdp-tab-description) {
		line-height: 1.8;
		margin: 0;
		max-width: 920px;
	}

	:global(.bohemcars-pdp-desktop .flat-tabs + .h4),
	:global(.bohemcars-pdp-desktop .flat-tabs + .divider + .h4) {
		margin-top: 34px;
	}

	:global(.bohemcars-pdp-desktop .financing-calculator) {
		padding: 26px;
	}

	:global(.bohemcars-pdp-desktop .financing-calculator input),
	:global(.bohemcars-pdp-desktop .financing-calculator select),
	:global(.bohemcars-pdp-desktop .send-inquiry input),
	:global(.bohemcars-pdp-desktop .send-inquiry select),
	:global(.bohemcars-pdp-desktop .send-inquiry textarea) {
		background: rgba(255, 255, 255, 0.86);
		border-color: #dce2d5;
		border-radius: 8px;
	}

	:global(.bohemcars-pdp-desktop .widget-gg-map) {
		border-radius: 8px;
		height: 420px;
	}

	:global(.bohemcars-pdp-desktop .widget-gg-map iframe) {
		height: 420px;
	}

	:global(.bohemcars-pdp-desktop .rating-box) {
		padding: 26px;
	}

	:global(.bohemcars-pdp-desktop .comment-box) {
		padding: 24px;
	}

	@media (max-width: 1199.98px) {
		:global(.bohemcars-pdp-desktop .listing-details) {
			gap: 34px;
			grid-template-columns: minmax(0, 1fr) 360px;
		}

		:global(.bohemcars-pdp-desktop .title-section) {
			align-items: flex-start;
			flex-direction: column;
			gap: 18px;
		}
	}

	@media (max-width: 767.98px) {
		:global(.bohemcars-pdp-desktop-breadcrumb),
		:global(.bohemcars-pdp-desktop) {
			display: none;
		}
	}
</style>
