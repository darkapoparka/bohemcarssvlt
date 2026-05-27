<script lang="ts">
	import type { AuxeroMessageThreadData } from '$lib/auxero/messages';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
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
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeMessageHtml} afterHtml={afterMessageHtml}>
	<MessageThreadContainer {thread} />
</AuxeroPageShell>
