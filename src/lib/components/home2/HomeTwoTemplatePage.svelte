<script lang="ts">
	import type {
		HomeFiveBrandCard,
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveHeroData,
		HomeFiveModalsData,
		HomeFiveTypeCard,
		HomeFiveVehiclePill
	} from '$lib/auxero/home-five';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import HomeFiveFooter from '../home/HomeFiveFooter.svelte';
	import HomeFiveModals from '../home/HomeFiveModals.svelte';
	import HomeTwoBrowsePaths from './HomeTwoBrowsePaths.svelte';
	import HomeTwoDeals from './HomeTwoDeals.svelte';
	import HomeTwoExploreMore from './HomeTwoExploreMore.svelte';
	import HomeTwoHeader from './HomeTwoHeader.svelte';
	import HomeTwoHero from './HomeTwoHero.svelte';

	let {
		afterFooterHtml,
		afterHeaderHtml,
		afterModalsHtml,
		brandCards,
		copy,
		footer,
		header,
		hero,
		modals,
		pageDocument,
		typeCards,
		vehiclePills
	}: {
		afterFooterHtml: string;
		afterHeaderHtml: string;
		afterModalsHtml: string;
		brandCards: HomeFiveBrandCard[];
		copy: HomePageCopy;
		footer?: HomeFiveFooterData;
		header?: HomeFiveHeaderData;
		hero?: HomeFiveHeroData;
		modals?: HomeFiveModalsData;
		pageDocument: AuxeroPageDocument;
		typeCards: HomeFiveTypeCard[];
		vehiclePills: HomeFiveVehiclePill[];
	} = $props();

	let bodyClassScript = $derived(
		`<script>document.body.className = ${JSON.stringify(pageDocument.bodyClass)};</` + 'script>'
	);

	$effect(() => {
		document.body.className = pageDocument.bodyClass;
	});
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<svelte:head>{@html pageDocument.headHtml}</svelte:head>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html bodyClassScript}
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html pageDocument.bodyHtml}
<HomeTwoHeader {header} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterHeaderHtml}
<HomeTwoHero {hero} />
<HomeTwoBrowsePaths pills={vehiclePills} />
<HomeTwoDeals />
<HomeTwoExploreMore {brandCards} {typeCards} {copy} />
<HomeFiveFooter {footer} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterFooterHtml}
<HomeFiveModals {modals} {copy} {header} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterModalsHtml}

<style>
	:global(.switcher-container) {
		display: none !important;
	}
</style>
