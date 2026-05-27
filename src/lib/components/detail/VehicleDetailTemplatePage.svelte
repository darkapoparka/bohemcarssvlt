<script lang="ts">
	import type { AuxeroVehicleDetailData } from '$lib/auxero/detail';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
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
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeDetailHtml} afterHtml={afterDetailHtml}>
	<AuxeroVehicleDetail {detail} />
</AuxeroPageShell>
