<script lang="ts">
	import type { AuxeroDashboardRecentData } from '$lib/auxero/dashboard';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
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
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeRecentHtml} afterHtml={afterRecentHtml}>
	<DashboardRecentBox {recent} />
</AuxeroPageShell>
