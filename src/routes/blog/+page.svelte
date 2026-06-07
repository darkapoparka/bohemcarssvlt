<script lang="ts">
	import BlogTemplatePage from '$lib/components/blog/BlogTemplatePage.svelte';

	let { data } = $props();
</script>

<BlogTemplatePage
	afterBlogHtml={data.afterBlogHtml}
	beforeBlogHtml={data.beforeBlogHtml}
	blogPage={data.blogPage}
	pageDocument={data.pageDocument}
	posts={data.posts}
/>
