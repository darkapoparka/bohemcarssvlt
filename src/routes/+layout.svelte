<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';
	import ScrollTop from '$lib/components/layout/ScrollTop.svelte';
	import { GarageState, setGarageContext } from '$lib/state/garage.svelte';

	let { children } = $props();
	const garage = new GarageState();
	setGarageContext(garage);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<SiteHeader variant={page.url.pathname === '/' ? 'home' : 'light'} pathname={page.url.pathname} />
{@render children()}
<SiteFooter />
<ScrollTop />
