<script lang="ts">
	import type { AuxeroAgentDetailContent } from '$lib/auxero/agent-detail';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import AgentDetailMainContent from './AgentDetailMainContent.svelte';
	import AgentDetailSidebar from './AgentDetailSidebar.svelte';

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
	<div class="innerpage-container container">
		<AgentDetailMainContent {detail} />
		<AgentDetailSidebar sidebar={detail.sidebar} />
	</div>
</AuxeroPageShell>
