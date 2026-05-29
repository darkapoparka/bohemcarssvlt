<script lang="ts">
	import ServicesTemplatePage from '$lib/components/services/ServicesTemplatePage.svelte';

	let { data } = $props();
</script>

<ServicesTemplatePage
	afterServicesHtml={data.afterServicesHtml}
	beforeServicesHtml={data.beforeServicesHtml}
	form={data.form}
	pageDocument={data.pageDocument}
	services={data.services}
/>
