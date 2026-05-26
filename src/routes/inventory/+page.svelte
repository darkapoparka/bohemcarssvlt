<script lang="ts">
	import InventoryTemplatePage from '$lib/components/inventory/InventoryTemplatePage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<InventoryTemplatePage
	afterInventoryHtml={data.afterInventoryHtml}
	beforeInventoryHtml={data.beforeInventoryHtml}
	cards={data.cards}
	pageDocument={data.pageDocument}
	view={data.view}
/>
