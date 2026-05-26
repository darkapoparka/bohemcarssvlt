<script lang="ts">
	import type { AuxeroDashboardRecentData } from '$lib/auxero/dashboard';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import DashboardRecentBox from './DashboardRecentBox.svelte';

	let {
		afterRecentHtml,
		beforeRecentHtml,
		pageDocument,
		recent
	}: {
		afterRecentHtml: string;
		beforeRecentHtml: string;
		pageDocument: AuxeroPageDocument;
		recent: AuxeroDashboardRecentData;
	} = $props();

	let bodyClassScript = $derived(
		`<script>document.body.className = ${JSON.stringify(pageDocument.bodyClass)};</` + 'script>'
	);
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<svelte:head>{@html pageDocument.headHtml}</svelte:head>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html bodyClassScript}
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html beforeRecentHtml}
<DashboardRecentBox {recent} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterRecentHtml}
