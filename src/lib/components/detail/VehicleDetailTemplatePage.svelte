<script lang="ts">
	import type { AuxeroVehicleDetailData } from '$lib/auxero/detail';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroVehicleDetail from './AuxeroVehicleDetail.svelte';

	let {
		afterDetailHtml,
		beforeDetailHtml,
		detail,
		pageDocument
	}: {
		afterDetailHtml: string;
		beforeDetailHtml: string;
		detail: AuxeroVehicleDetailData;
		pageDocument: AuxeroPageDocument;
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
{@html beforeDetailHtml}
<AuxeroVehicleDetail {detail} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterDetailHtml}
