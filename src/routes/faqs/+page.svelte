<script lang="ts">
	import FaqsTemplatePage from '$lib/components/faqs/FaqsTemplatePage.svelte';

	let { data } = $props();
</script>

<FaqsTemplatePage
	featured={data.featured}
	groups={data.groups}
	pageDocument={data.pageDocument}
	shellCopy={data.shellCopy}
	shellFooter={data.shellFooter}
	shellHeader={data.shellHeader}
	shellModals={data.shellModals}
	shellRuntimeHtml={data.shellRuntimeHtml}
/>
