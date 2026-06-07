<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import AuxeroHead from '$lib/components/layout/AuxeroHead.svelte';
	import HomeFiveFooter from '$lib/components/home/HomeFiveFooter.svelte';
	import HomeFiveHeader from '$lib/components/home/HomeFiveHeader.svelte';
	import HomeFiveModals from '$lib/components/home/HomeFiveModals.svelte';

	type Props = {
		children: Snippet;
		copy: HomePageCopy;
		footer?: HomeFiveFooterData;
		header?: HomeFiveHeaderData;
		hideMobileLogo?: boolean;
		mainClass?: string;
		mainId?: string;
		modals?: HomeFiveModalsData;
		pageDocument: AuxeroPageDocument;
		runtimeHtml?: string;
		title?: string;
	};

	let {
		children,
		copy,
		footer,
		header,
		hideMobileLogo = false,
		mainClass = '',
		mainId,
		modals,
		pageDocument,
		runtimeHtml = '',
		title
	}: Props = $props();

	const resolvedTitle = $derived(
		title ?? pageDocument.headHtml.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim()
	);
	const bodyClassScript = $derived(
		`document.body.className = ${JSON.stringify(pageDocument.bodyClass)};`
	);

	$effect(() => {
		document.body.className = pageDocument.bodyClass;
		if (resolvedTitle) {
			document.title = resolvedTitle;
		}
	});

	onMount(() => {
		window.dispatchEvent(new Event('bohemcars:svelte-mounted'));
	});
</script>

<AuxeroHead assets={pageDocument.headAssets} title={resolvedTitle} />
<svelte:element this={'script'}>
	{bodyClassScript}
</svelte:element>

<div id="wrapper" class="bohemcars-public-shell">
	<HomeFiveHeader {header} {hideMobileLogo} />
	<main id={mainId} class={mainClass}>
		{@render children()}
	</main>
	<HomeFiveFooter {footer} />
</div>

<HomeFiveModals {modals} {copy} {header} />

{#if runtimeHtml}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html runtimeHtml}
{/if}
