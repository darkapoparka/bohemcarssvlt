<script lang="ts">
	import type { AuxeroAgentCard } from '$lib/auxero/agents';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import AuxeroAgentsGrid from './AuxeroAgentsGrid.svelte';

	let {
		afterAgentsHtml,
		beforeAgentsHtml,
		cards,
		pageDocument
	}: {
		afterAgentsHtml: string;
		beforeAgentsHtml: string;
		cards: AuxeroAgentCard[];
		pageDocument: AuxeroPageDocument;
	} = $props();
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeAgentsHtml} afterHtml={afterAgentsHtml}>
	<AuxeroAgentsGrid {cards} />
</AuxeroPageShell>
