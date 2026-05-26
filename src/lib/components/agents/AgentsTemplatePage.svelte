<script lang="ts">
	import type { AuxeroAgentCard } from '$lib/auxero/agents';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
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

	let bodyClassScript = $derived(
		`<script>document.body.className = ${JSON.stringify(pageDocument.bodyClass)};</` + 'script>'
	);
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<svelte:head>{@html pageDocument.headHtml}</svelte:head>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html bodyClassScript}
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html beforeAgentsHtml}
<AuxeroAgentsGrid {cards} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterAgentsHtml}
