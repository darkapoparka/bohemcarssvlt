<script lang="ts">
	import type { AuxeroMessageThreadData } from '$lib/auxero/messages';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import MessageThreadContainer from './MessageThreadContainer.svelte';

	let {
		afterMessageHtml,
		beforeMessageHtml,
		pageDocument,
		thread
	}: {
		afterMessageHtml: string;
		beforeMessageHtml: string;
		pageDocument: AuxeroPageDocument;
		thread: AuxeroMessageThreadData;
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
{@html beforeMessageHtml}
<MessageThreadContainer {thread} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterMessageHtml}
