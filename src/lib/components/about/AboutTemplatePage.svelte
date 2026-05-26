<script lang="ts">
	import type { AuxeroAboutContent } from '$lib/auxero/about';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AboutContent from './AboutContent.svelte';

	let {
		about,
		afterAboutHtml,
		beforeAboutHtml,
		pageDocument
	}: {
		about: AuxeroAboutContent;
		afterAboutHtml: string;
		beforeAboutHtml: string;
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
{@html beforeAboutHtml}
<AboutContent {about} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterAboutHtml}
