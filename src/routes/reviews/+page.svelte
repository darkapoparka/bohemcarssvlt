<script lang="ts">
	import ReviewsTemplatePage from '$lib/components/reviews/ReviewsTemplatePage.svelte';

	let { data } = $props();
</script>

<ReviewsTemplatePage
	cards={data.cards}
	pageDocument={data.pageDocument}
	reviewsPage={data.reviewsPage}
	shellCopy={data.shellCopy}
	shellFooter={data.shellFooter}
	shellHeader={data.shellHeader}
	shellModals={data.shellModals}
	shellRuntimeHtml={data.shellRuntimeHtml}
/>
