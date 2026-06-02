<script lang="ts">
	import VehicleDetailTemplatePage from '$lib/components/detail/VehicleDetailTemplatePage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<VehicleDetailTemplatePage
	afterDetailHtml={data.afterDetailHtml}
	beforeDetailHtml={data.beforeDetailHtml}
	detail={data.detail}
	detailHtml={data.detailHtml}
	pageDocument={data.pageDocument}
/>
