<script lang="ts">
	import type { AuxeroAgentDetailContent } from '$lib/auxero/agent-detail';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
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

	let bodyClassScript = $derived(
		`<script>document.body.className = ${JSON.stringify(pageDocument.bodyClass)};</` + 'script>'
	);
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<svelte:head>{@html pageDocument.headHtml}</svelte:head>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html bodyClassScript}
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html beforeDetailHtml}
<AgentDetailMainContent {detail} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterDetailHtml}
