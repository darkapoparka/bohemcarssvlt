<script lang="ts">
	import HomeFiveTemplatePage from '$lib/components/home/HomeFiveTemplatePage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<HomeFiveTemplatePage
	afterBrandStripHtml={data.afterBrandStripHtml}
	afterTypeGalleryHtml={data.afterTypeGalleryHtml}
	brandCards={data.brandCards}
	pageDocument={data.pageDocument}
	typeCards={data.typeCards}
/>
