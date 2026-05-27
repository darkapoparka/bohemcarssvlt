<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';

	type Props = {
		afterHtml: string;
		beforeHtml: string;
		children: Snippet;
		pageDocument: AuxeroPageDocument;
	};

	let { afterHtml, beforeHtml, children, pageDocument }: Props = $props();

	let bodyClassScript = $derived(
		`<script>document.body.className = ${JSON.stringify(pageDocument.bodyClass)};</` + 'script>'
	);
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<svelte:head>{@html pageDocument.headHtml}</svelte:head>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html bodyClassScript}
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html beforeHtml}
{@render children()}
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterHtml}
