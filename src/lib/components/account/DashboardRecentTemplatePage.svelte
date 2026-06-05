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

	const chartMarker = '<div class="dashboard-box car-views-chart';

	let overviewPlacement = $derived.by(() => {
		const chartIndex = beforeRecentHtml.indexOf(chartMarker);

		if (chartIndex < 0) {
			return {
				afterOverviewHtml: '',
				beforeOverviewHtml: beforeRecentHtml
			};
		}

		return {
			afterOverviewHtml: beforeRecentHtml.slice(chartIndex),
			beforeOverviewHtml: beforeRecentHtml.slice(0, chartIndex)
		};
	});
</script>

<AuxeroPageShell
	{pageDocument}
	beforeHtml={overviewPlacement.beforeOverviewHtml}
	afterHtml={`${overviewPlacement.afterOverviewHtml}${afterRecentHtml}`}
>
	<DashboardRecentBox {recent} />
</AuxeroPageShell>
