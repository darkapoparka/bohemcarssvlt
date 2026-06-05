<script lang="ts">
	import HomeFiveTemplatePage from '$lib/components/home/HomeFiveTemplatePage.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.copy.seo.title}</title>
	<meta name="description" content={data.copy.seo.description} />
	<link
		rel="preload"
		as="image"
		fetchpriority="high"
		href="/assets/bohemcars/megamenu/inventory-bmw-x5-cutout.webp"
		type="image/webp"
	/>
	<link
		rel="preload"
		as="image"
		fetchpriority="high"
		href="/assets/bohemcars/megamenu/inventory-audi-sq5-cutout.webp"
		type="image/webp"
	/>
</svelte:head>

<HomeFiveTemplatePage
	afterBrandStripHtml={data.afterBrandStripHtml}
	afterBudgetSectionHtml={data.afterBudgetSectionHtml}
	afterCompareSectionHtml={data.afterCompareSectionHtml}
	afterFeaturedVehiclesHtml={data.afterFeaturedVehiclesHtml}
	afterHeaderHtml={data.afterHeaderHtml}
	afterHeroHtml={data.afterHeroHtml}
	afterModalsHtml={data.afterModalsHtml}
	afterNewsSectionHtml={data.afterNewsSectionHtml}
	afterReviewsSectionHtml={data.afterReviewsSectionHtml}
	afterTypeGalleryHtml={data.afterTypeGalleryHtml}
	brandCards={data.brandCards}
	copy={data.copy}
	featuredVehicles={data.featuredVehicles}
	footer={data.footer}
	header={data.header}
	hero={data.hero}
	modals={data.modals}
	newsPosts={data.newsPosts}
	pageDocument={data.pageDocument}
	reviews={data.reviews}
	typeCards={data.typeCards}
	vehiclePills={data.vehiclePills}
/>
