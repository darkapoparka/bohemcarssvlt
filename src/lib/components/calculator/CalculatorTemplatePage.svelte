<script lang="ts">
	import type { AuxeroCalculatorData } from '$lib/auxero/calculator';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import CalculatorEstimator from './CalculatorEstimator.svelte';

	let {
		afterCalculatorHtml,
		beforeCalculatorHtml,
		calculator,
		pageDocument
	}: {
		afterCalculatorHtml: string;
		beforeCalculatorHtml: string;
		calculator: AuxeroCalculatorData;
		pageDocument: AuxeroPageDocument;
	} = $props();

	let bodyClassScript = $derived(
		`<script>document.body.className = ${JSON.stringify(pageDocument.bodyClass)};</` + 'script>'
	);
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<svelte:head>{@html pageDocument.headHtml}</svelte:head>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html bodyClassScript}
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html beforeCalculatorHtml}
<CalculatorEstimator {calculator} />
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html afterCalculatorHtml}
