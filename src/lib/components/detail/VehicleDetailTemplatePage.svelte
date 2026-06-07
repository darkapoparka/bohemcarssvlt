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
					<p class="swiper-listing-details-prev cursor-pointer">Prev</p>
					<p class="swiper-listing-details-next cursor-pointer">Next</p>
				</div>
			</div>
		</div>
	</section>

	<section class="bohemcars-pdp-desktop pb-100">
		<div class="tf-spacing-style4"></div>
		<div class="container">
			<AuxeroVehicleDetail {detail} />
		</div>
	</section>

	<AuxeroVehicleMobileIsland {detail} />
</AuxeroPublicShell>

<style>
	@media (max-width: 767.98px) {
		:global(.bohemcars-pdp-desktop-breadcrumb),
		:global(.bohemcars-pdp-desktop) {
			display: none;
		}
	}
</style>
