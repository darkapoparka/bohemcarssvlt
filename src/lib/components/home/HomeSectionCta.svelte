<script lang="ts">
	import { resolve } from '$app/paths';

	type SectionCtaHref = '/blog' | '/compare' | '/inventory' | '/reviews';

	let { href, label }: { href: SectionCtaHref; label: string } = $props();
</script>

<a href={resolve(href)} class="btn btn-primary-3 btn-large bohemcars-section-cta">
	<span>{label}</span>
	<span class="bohemcars-section-cta__arrow" aria-hidden="true">→</span>
</a>

<style>
	.bohemcars-section-cta {
		border-color: #98bc2a !important;
		background-color: #98bc2a !important;
		gap: 8px;
		color: #14210f !important;
		font-weight: 500;
	}

	.bohemcars-section-cta:hover,
	.bohemcars-section-cta:focus-visible {
		border-color: #a6c93a !important;
		background-color: #a6c93a !important;
		color: #14210f !important;
		transform: none !important;
	}

	.bohemcars-section-cta::before,
	.bohemcars-section-cta::after {
		display: none !important;
	}

	.bohemcars-section-cta__arrow {
		display: inline-block;
		flex: 0 0 auto;
		font-size: 22px;
		font-weight: 700;
		line-height: 1;
	}
</style>
