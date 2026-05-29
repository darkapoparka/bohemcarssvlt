<script lang="ts">
	import CompareTemplatePage from '$lib/components/compare/CompareTemplatePage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<CompareTemplatePage
	afterCompareHtml={data.afterCompareHtml}
	beforeCompareHtml={data.beforeCompareHtml}
	locale={data.locale}
	pageDocument={data.pageDocument}
	vehicles={data.vehicles}
/>
