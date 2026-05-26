<script lang="ts">
	import TermsTemplatePage from '$lib/components/terms/TermsTemplatePage.svelte';

	let { data } = $props();
</script>

<TermsTemplatePage
	afterTermsHtml={data.afterTermsHtml}
	beforeTermsHtml={data.beforeTermsHtml}
	pageDocument={data.pageDocument}
	sections={data.sections}
/>
