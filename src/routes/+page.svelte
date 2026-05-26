<script lang="ts">
	import HomeFiveTemplatePage from '$lib/components/home/HomeFiveTemplatePage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<HomeFiveTemplatePage
	afterBrandStripHtml={data.afterBrandStripHtml}
	afterBudgetSectionHtml={data.afterBudgetSectionHtml}
	afterCompareSectionHtml={data.afterCompareSectionHtml}
	afterFeaturedVehiclesHtml={data.afterFeaturedVehiclesHtml}
	afterHeroHtml={data.afterHeroHtml}
	afterTypeGalleryHtml={data.afterTypeGalleryHtml}
	brandCards={data.brandCards}
	budgetVehicles={data.budgetVehicles}
	comparePairs={data.comparePairs}
	featuredVehicles={data.featuredVehicles}
	hero={data.hero}
	pageDocument={data.pageDocument}
	typeCards={data.typeCards}
/>
