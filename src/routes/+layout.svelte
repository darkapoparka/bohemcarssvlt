<script lang="ts">
	import './auxero-guards.css';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import MobileBottomNav from '$lib/components/layout/MobileBottomNav.svelte';
	import ScrollTop from '$lib/components/layout/ScrollTop.svelte';
	import { GarageState, setGarageContext } from '$lib/state/garage.svelte';

	type AuxeroTemplatePageData = {
		pageDocument?: {
			headAssets?: unknown;
		};
	};

	let { children } = $props();
	const garage = new GarageState();
	setGarageContext(garage);
	const auxeroStableStylesheetHrefs = [
		'/assets/scss/swiper/swiper-bundle.min.css',
		'/assets/app.css'
	];
	const auxeroFontStylesheetHref =
		'https://fonts.googleapis.com/css2?family=Albert+Sans:ital,wght@0,100..900;1,100..900&family=Manrope:wght@200..800&display=swap';
	let isAuxeroFullPage = $derived(Boolean(page.data.auxeroFullPage));
	let isAuxeroTemplatePage = $derived(
		Boolean((page.data as AuxeroTemplatePageData).pageDocument?.headAssets)
	);
	let isInventoryDetailPage = $derived(/^\/inventory\/[^/]+\/?$/.test(page.url.pathname));
	let isDashboardArea = $derived(/^\/(?:account|admin)(?:\/|$)/.test(page.url.pathname));

	const resetAuxeroTransientUi = () => {
		for (const element of document.querySelectorAll<HTMLElement>(
			'.modal.active, .search-modal.active, .core-dropdown.active'
		)) {
			element.classList.remove('active');
		}

		document.body.classList.remove('modal-open', 'overflow-hidden');
		document.body.style.removeProperty('overflow');
	};

	afterNavigate(() => {
		document.documentElement.classList.remove('bohemcars-route-nav-click');
		resetAuxeroTransientUi();
		requestAnimationFrame(resetAuxeroTransientUi);
	});

	$effect(() => {
		if (!isAuxeroFullPage) {
			document.body.className = '';
		}
	});
</script>

<svelte:head>
	<link rel="icon" href="/assets/images/favicon.png" />
	{#if isAuxeroTemplatePage}
		<link rel="preconnect" href="https://fonts.googleapis.com" data-bohemcars-auxero-fonts />
		<link
			rel="preconnect"
			href="https://fonts.gstatic.com"
			crossorigin="anonymous"
			data-bohemcars-auxero-fonts
		/>
		<link rel="stylesheet" href={auxeroFontStylesheetHref} data-bohemcars-auxero-fonts />
		{#each auxeroStableStylesheetHrefs as href (href)}
			<link rel="stylesheet" {href} data-bohemcars-auxero-stable />
		{/each}
	{/if}
</svelte:head>
{#if isAuxeroFullPage}
	{@render children()}
{:else}
	<SiteHeader variant={page.url.pathname === '/' ? 'home' : 'light'} pathname={page.url.pathname} />
	{@render children()}
	<SiteFooter />
	<ScrollTop />
{/if}
{#if !isInventoryDetailPage && !isDashboardArea}
	<MobileBottomNav pathname={page.url.pathname} />
{/if}
