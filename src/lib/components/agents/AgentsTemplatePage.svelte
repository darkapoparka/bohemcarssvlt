<script lang="ts">
	import type { AuxeroAgentCard } from '$lib/auxero/agents';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import AuxeroAgentsGrid from './AuxeroAgentsGrid.svelte';

	let {
		afterAgentsHtml,
		beforeAgentsHtml,
		cards,
		management = false,
		pageDocument
	}: {
		afterAgentsHtml: string;
		beforeAgentsHtml: string;
		cards: AuxeroAgentCard[];
		management?: boolean;
		pageDocument: AuxeroPageDocument;
	} = $props();
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeAgentsHtml} afterHtml={afterAgentsHtml}>
	<AuxeroAgentsGrid {cards} {management} />
</AuxeroPageShell>
