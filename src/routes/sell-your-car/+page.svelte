<script lang="ts">
	import SellYourCarTemplatePage from '$lib/components/sell-your-car/SellYourCarTemplatePage.svelte';

	let { data } = $props();
</script>

<SellYourCarTemplatePage
	afterSellFormHtml={data.afterSellFormHtml}
	beforeSellFormHtml={data.beforeSellFormHtml}
	form={data.form}
	pageDocument={data.pageDocument}
/>
