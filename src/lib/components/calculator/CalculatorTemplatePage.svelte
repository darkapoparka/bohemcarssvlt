<script lang="ts">
	import type { AuxeroCalculatorData } from '$lib/auxero/calculator';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
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
</script>

<AuxeroPageShell {pageDocument} beforeHtml={beforeCalculatorHtml} afterHtml={afterCalculatorHtml}>
	<CalculatorEstimator {calculator} />
</AuxeroPageShell>
