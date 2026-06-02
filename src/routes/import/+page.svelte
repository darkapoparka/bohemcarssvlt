<script lang="ts">
	import ImportRequestTemplatePage from '$lib/components/services/ImportRequestTemplatePage.svelte';

	let { data } = $props();
</script>

<ImportRequestTemplatePage
	afterImportHtml={data.afterImportHtml}
	beforeImportHtml={data.beforeImportHtml}
	form={data.form}
	pageDocument={data.pageDocument}
/>
