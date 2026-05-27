<script lang="ts">
	import type { AuxeroAboutContent } from '$lib/auxero/about';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
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
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeAboutHtml} afterHtml={afterAboutHtml}>
	<AboutContent {about} />
</AuxeroPageShell>
