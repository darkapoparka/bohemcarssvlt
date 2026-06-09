<script lang="ts">
	import TermsTemplatePage from '$lib/components/terms/TermsTemplatePage.svelte';

	let { data } = $props();
</script>

<TermsTemplatePage
	pageDocument={data.pageDocument}
	sections={data.sections}
	title={data.title}
	shellCopy={data.shellCopy}
	shellFooter={data.shellFooter}
	shellHeader={data.shellHeader}
	shellModals={data.shellModals}
	shellRuntimeHtml={data.shellRuntimeHtml}
/>
