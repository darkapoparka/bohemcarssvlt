<script lang="ts">
	import type { AuxeroCompareVehicle } from '$lib/auxero/compare';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
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
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeCompareHtml} afterHtml={afterCompareHtml}>
	<AuxeroCompareTable {vehicles} />
</AuxeroPageShell>
