<script lang="ts">
	import ServicesTemplatePage from '$lib/components/services/ServicesTemplatePage.svelte';

	let { data } = $props();
</script>

<ServicesTemplatePage
	afterServiceFormHtml={data.afterServiceFormHtml}
	beforeServiceFormHtml={data.beforeServiceFormHtml}
	form={data.form}
	pageDocument={data.pageDocument}
/>
