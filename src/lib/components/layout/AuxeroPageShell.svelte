<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';

	type Props = {
		afterHtml: string;
		beforeHtml: string;
		children: Snippet;
		pageDocument: AuxeroPageDocument;
		title?: string;
	};

	type WrapperShell = {
		afterChildrenHtml: string;
		afterWrapperHtml: string;
		beforeChildrenHtml: string;
		beforeWrapperHtml: string;
	};

	let { afterHtml, beforeHtml, children, pageDocument, title }: Props = $props();

	const wrapperOpenTag = '<div id="wrapper">';
	const divTagPattern = /<\/?div\b[^>]*>/gi;

	const findWrapperCloseIndex = (html: string) => {
		divTagPattern.lastIndex = 0;

		let depth = 1;
		let match: RegExpExecArray | null;

		while ((match = divTagPattern.exec(html))) {
			depth += match[0].startsWith('</') ? -1 : 1;

			if (depth === 0) return match.index;
		}

		return -1;
	};

	let bodyClassScript = $derived(
		`<script>document.body.className = ${JSON.stringify(pageDocument.bodyClass)};</` + 'script>'
	);
	let wrapperShell: WrapperShell | undefined = $derived.by(() => {
		const wrapperStart = beforeHtml.lastIndexOf(wrapperOpenTag);

		if (wrapperStart < 0) return undefined;

		const closeStart = findWrapperCloseIndex(afterHtml);

		if (closeStart < 0) return undefined;

		return {
			afterChildrenHtml: afterHtml.slice(0, closeStart),
			afterWrapperHtml: afterHtml.slice(closeStart + '</div>'.length),
			beforeChildrenHtml: beforeHtml.slice(wrapperStart + wrapperOpenTag.length),
			beforeWrapperHtml: beforeHtml.slice(0, wrapperStart)
		};
	});
</script>

<svelte:head>
	{#if title}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html pageDocument.headHtml.replace(/<title>[\s\S]*?<\/title>/i, '')}
		<title>{title}</title>
	{:else}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html pageDocument.headHtml}
	{/if}
</svelte:head>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html bodyClassScript}
{#if wrapperShell}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html wrapperShell.beforeWrapperHtml}
	<div id="wrapper">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html wrapperShell.beforeChildrenHtml}
		{@render children()}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html wrapperShell.afterChildrenHtml}
	</div>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html wrapperShell.afterWrapperHtml}
{:else}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html beforeHtml}
	{@render children()}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html afterHtml}
{/if}
