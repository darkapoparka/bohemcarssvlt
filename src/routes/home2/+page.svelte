<script lang="ts">
	import HomeTwoTemplatePage from '$lib/components/home2/HomeTwoTemplatePage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<HomeTwoTemplatePage
	afterFooterHtml={data.afterFooterHtml}
	afterHeaderHtml={data.afterHeaderHtml}
	afterModalsHtml={data.afterModalsHtml}
	brandCards={data.brandCards}
	copy={data.copy}
	footer={data.footer}
	header={data.header}
	hero={data.hero}
	modals={data.modals}
	pageDocument={data.pageDocument}
	typeCards={data.typeCards}
	vehiclePills={data.vehiclePills}
/>
