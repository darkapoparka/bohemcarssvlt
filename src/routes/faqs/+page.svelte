<script lang="ts">
	import FaqsTemplatePage from '$lib/components/faqs/FaqsTemplatePage.svelte';

	let { data } = $props();
</script>

<FaqsTemplatePage
	afterFaqsHtml={data.afterFaqsHtml}
	beforeFaqsHtml={data.beforeFaqsHtml}
	featured={data.featured}
	groups={data.groups}
	pageDocument={data.pageDocument}
/>
