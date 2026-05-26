<script lang="ts">
	import type { AuxeroCompareVehicle } from '$lib/auxero/compare';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroCompareTable from './AuxeroCompareTable.svelte';

	let {
		afterCompareHtml,
		beforeCompareHtml,
		pageDocument,
		vehicles
	}: {
		afterCompareHtml: string;
		beforeCompareHtml: string;
		pageDocument: AuxeroPageDocument;
		vehicles: AuxeroCompareVehicle[];
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
{@html beforeCompareHtml}
<AuxeroCompareTable {vehicles} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterCompareHtml}
