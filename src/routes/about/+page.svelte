<script lang="ts">
	import AboutTemplatePage from '$lib/components/about/AboutTemplatePage.svelte';

	let { data } = $props();
</script>

<AboutTemplatePage
	about={data.about}
	afterAboutHtml={data.afterAboutHtml}
	beforeAboutHtml={data.beforeAboutHtml}
	pageDocument={data.pageDocument}
/>
