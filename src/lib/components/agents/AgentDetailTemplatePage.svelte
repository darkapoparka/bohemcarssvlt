<script lang="ts">
	import type { AuxeroAgentDetailContent } from '$lib/auxero/agent-detail';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import AgentDetailMainContent from './AgentDetailMainContent.svelte';

	let {
		afterDetailHtml,
		beforeDetailHtml,
		detail,
		pageDocument
	}: {
		afterDetailHtml: string;
		beforeDetailHtml: string;
		detail: AuxeroAgentDetailContent;
		pageDocument: AuxeroPageDocument;
	} = $props();
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeDetailHtml} afterHtml={afterDetailHtml}>
	<AgentDetailMainContent {detail} />
</AuxeroPageShell>
