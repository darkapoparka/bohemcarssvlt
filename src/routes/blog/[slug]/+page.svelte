<script lang="ts">
	import BlogDetailTemplatePage from '$lib/components/blog/BlogDetailTemplatePage.svelte';

	let { data } = $props();
</script>

<BlogDetailTemplatePage
	afterDetailHtml={data.afterDetailHtml}
	beforeDetailHtml={data.beforeDetailHtml}
	content={data.content}
	pageDocument={data.pageDocument}
/>
