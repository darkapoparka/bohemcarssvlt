<script lang="ts">
	// Tailwind v4 (with the bc @theme tokens) — scoped to this route's CSS chunk,
	// the proven per-route pattern (Preflight stays off the Auxero pages until Phase 6).
	import '$lib/styles/bohemcars.tailwind-entry.css';
	import ContactCleanPage from '$lib/components/contact/ContactCleanPage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Контакти — Bohemcars</title>
	<meta
		name="description"
		content="Свържете се с Bohemcars — телефон, имейл и адрес в Пловдив. Огледи, внос от Канада, документи и продажба на автомобил се уточняват с предварителна уговорка."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Manrope:wght@300..800&display=swap"
	/>
</svelte:head>

<ContactCleanPage form={data.form} info={data.info} header={data.header} footer={data.footer} />
