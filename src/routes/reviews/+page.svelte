<script lang="ts">
	import ReviewsTemplatePage from '$lib/components/reviews/ReviewsTemplatePage.svelte';

	let { data } = $props();
</script>

<ReviewsTemplatePage
	afterReviewsHtml={data.afterReviewsHtml}
	beforeReviewsHtml={data.beforeReviewsHtml}
	cards={data.cards}
	pageDocument={data.pageDocument}
	reviewsPage={data.reviewsPage}
/>
