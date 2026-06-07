<script lang="ts">
	import './auxero-guards.css';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import MobileBottomNav from '$lib/components/layout/MobileBottomNav.svelte';
	import ScrollTop from '$lib/components/layout/ScrollTop.svelte';
	import { GarageState, setGarageContext } from '$lib/state/garage.svelte';

	let { children } = $props();
	const garage = new GarageState();
	setGarageContext(garage);
	let isAuxeroFullPage = $derived(Boolean(page.data.auxeroFullPage));
	let isInventoryDetailPage = $derived(/^\/inventory\/[^/]+\/?$/.test(page.url.pathname));
	let isDashboardArea = $derived(/^\/(?:account|admin)(?:\/|$)/.test(page.url.pathname));

	afterNavigate(() => {
		document.documentElement.classList.remove('bohemcars-route-nav-click');
	});

	$effect(() => {
		if (!isAuxeroFullPage) {
			document.body.className = '';
		}
	});
</script>

<svelte:head><link rel="icon" href="/assets/images/favicon.png" /></svelte:head>
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
