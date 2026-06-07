<script lang="ts">
	import CalculatorTemplatePage from '$lib/components/calculator/CalculatorTemplatePage.svelte';

	let { data } = $props();
</script>

<CalculatorTemplatePage
	afterCalculatorHtml={data.afterCalculatorHtml}
	beforeCalculatorHtml={data.beforeCalculatorHtml}
	budgetLinks={data.budgetLinks}
	calculator={data.calculator}
	faqs={data.faqs}
	pageDocument={data.pageDocument}
/>
