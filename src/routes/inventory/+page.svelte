<script lang="ts">
	import InventoryTemplatePage from '$lib/components/inventory/InventoryTemplatePage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<InventoryTemplatePage
	cards={data.cards}
	copy={data.copy}
	desktopHtml={data.desktopHtml}
	header={data.header}
	mobile={data.mobile}
	pageDocument={data.pageDocument}
	seoTitle={data.seoTitle}
/>
