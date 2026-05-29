<script lang="ts">
	import type { AuxeroAgentCard } from '$lib/auxero/agents';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import AuxeroAgentsGrid from './AuxeroAgentsGrid.svelte';

	let {
		afterAgentsHtml,
		beforeAgentsHtml,
		cards,
		dashboardShell = false,
		management = false,
		pageDocument
	}: {
		afterAgentsHtml: string;
		beforeAgentsHtml: string;
		cards: AuxeroAgentCard[];
		dashboardShell?: boolean;
		management?: boolean;
		pageDocument: AuxeroPageDocument;
	} = $props();
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeAgentsHtml} afterHtml={afterAgentsHtml}>
	{#if dashboardShell}
		<div class="dashboard-content--inner">
			<p class="h3 mb-30">Agents</p>
			<div class="dashboard-box bohemcars-dashboard-agents bg-white">
				<AuxeroAgentsGrid {cards} {management} />
			</div>
		</div>
	{:else}
		<AuxeroAgentsGrid {cards} {management} />
	{/if}
</AuxeroPageShell>

<style>
	:global(.bohemcars-dashboard-agents .bohemcars-agent-grid) {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	@media (max-width: 1399px) {
		:global(.bohemcars-dashboard-agents .bohemcars-agent-grid) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 767px) {
		:global(.bohemcars-dashboard-agents .bohemcars-agent-grid) {
			grid-template-columns: 1fr;
		}
	}
</style>
