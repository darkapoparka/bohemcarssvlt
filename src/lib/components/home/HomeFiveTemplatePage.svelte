<script lang="ts">
	import type {
		HomeFiveBrandCard,
		HomeFiveComparePair,
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveHeroData,
		HomeFiveModalsData,
		HomeFiveNewsPost,
		HomeFiveReview,
		HomeFiveTypeCard,
		HomeFiveVehicleCardData,
		HomeFiveVehiclePill
	} from '$lib/auxero/home-five';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import HomeFiveActionBand from './HomeFiveActionBand.svelte';
	import HomeFiveBrowseSection from './HomeFiveBrowseSection.svelte';
	import HomeFiveCompareSection from './HomeFiveCompareSection.svelte';
	import HomeFiveFeaturedVehicles from './HomeFiveFeaturedVehicles.svelte';
	import HomeFiveHero from './HomeFiveHero.svelte';
	import HomeFiveNewsSection from './HomeFiveNewsSection.svelte';
	import HomeFiveReviewsSection from './HomeFiveReviewsSection.svelte';
	import { onMount } from 'svelte';

	let {
		brandCards,
		comparePairs,
		copy,
		featuredVehicles,
		footer,
		header,
		hero,
		modals,
		newsPosts,
		pageDocument,
		reviews,
		runtimeHtml,
		seoTitle,
		typeCards,
		vehiclePills
	}: {
		brandCards: HomeFiveBrandCard[];
		comparePairs: HomeFiveComparePair[];
		copy: HomePageCopy;
		featuredVehicles: HomeFiveVehicleCardData[];
		footer?: HomeFiveFooterData;
		header?: HomeFiveHeaderData;
		hero?: HomeFiveHeroData;
		modals?: HomeFiveModalsData;
		newsPosts: HomeFiveNewsPost[];
		pageDocument: AuxeroPageDocument;
		reviews: HomeFiveReview[];
		runtimeHtml?: string;
		seoTitle?: string;
		typeCards: HomeFiveTypeCard[];
		vehiclePills: HomeFiveVehiclePill[];
	} = $props();

	// Subtle scroll-reveal: below-the-fold home sections fade up as they enter view.
	// Gated by JS + reduced-motion, and only hides sections that start off-screen.
	// A rAF scroll-check (not IntersectionObserver) reveals anything that reaches the
	// viewport — including sections scrolled past via back-nav restoration — so a
	// section can never get stranded invisible.
	onMount(() => {
		if (!window.matchMedia('(max-width: 767px)').matches) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const root = document.getElementById('main-content');
		if (!root) return;
		const trigger = () => window.innerHeight * 0.9;
		const pending: HTMLElement[] = [];
		for (const el of root.children) {
			if (!(el instanceof HTMLElement) || el.offsetParent === null) continue;
			if (el.getBoundingClientRect().top < trigger()) continue;
			el.classList.add('bc-reveal');
			pending.push(el);
		}
		if (!pending.length) return;
		root.classList.add('bc-reveal-on');
		let ticking = false;
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				ticking = false;
				for (let index = pending.length - 1; index >= 0; index -= 1) {
					const el = pending[index];
					if (el.getBoundingClientRect().top < trigger()) {
						el.classList.add('bc-in');
						pending.splice(index, 1);
					}
				}
				if (!pending.length) {
					window.removeEventListener('scroll', onScroll);
					window.removeEventListener('resize', onScroll);
				}
			});
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		onScroll();
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	});
</script>

<AuxeroPublicShell
	{copy}
	{footer}
	{header}
	hideMobileLogo
	mainId="main-content"
	{modals}
	{pageDocument}
	{runtimeHtml}
	title={seoTitle}
>
	<HomeFiveHero {hero} />
	<HomeFiveActionBand {copy} />
	<HomeFiveFeaturedVehicles vehicles={featuredVehicles} pills={vehiclePills} {copy} />
	<HomeFiveBrowseSection {brandCards} {typeCards} {copy} />
	<HomeFiveCompareSection pairs={comparePairs} {copy} />
	<HomeFiveReviewsSection {reviews} {copy} />
	<HomeFiveNewsSection posts={newsPosts} {copy} />
</AuxeroPublicShell>

<style>
	:global(#main-content) {
		background: var(--bc-bg);
	}

	@media (max-width: 767px) {
		:global(#main-content) {
			background: var(--bc-bg);
			display: flex;
			flex-direction: column;
		}

		:global(#main-content > *) {
			order: 90;
		}

		:global(#main-content > .bohemcars-mobile-home) {
			order: 10;
		}

		:global(#main-content > .bohemcars-mobile-home-quick) {
			order: 20;
		}

		:global(#main-content > .bohemcars-featured-vehicles) {
			order: 30;
		}

		:global(#main-content > .bohemcars-browse-section) {
			order: 40;
		}

		:global(#main-content > .bohemcars-action-band) {
			order: 50;
		}

		/* Subtle scroll-reveal for below-the-fold sections (additive; see onMount). */
		:global(#main-content.bc-reveal-on .bc-reveal) {
			opacity: 0;
			transform: translateY(16px);
			transition:
				opacity 0.5s ease,
				transform 0.5s ease;
		}

		:global(#main-content.bc-reveal-on .bc-reveal.bc-in) {
			opacity: 1;
			transform: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(#main-content.bc-reveal-on .bc-reveal) {
			opacity: 1 !important;
			transform: none !important;
			transition: none !important;
		}
	}
</style>
