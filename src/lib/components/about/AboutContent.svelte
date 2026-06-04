<script lang="ts">
	import type { AuxeroAboutContent } from '$lib/auxero/about';
	import PageBanner from '$lib/components/common/PageBanner.svelte';
	import AboutConsultantsSection from './AboutConsultantsSection.svelte';
	import AboutIntroSection from './AboutIntroSection.svelte';
	import AboutReviewsSection from './AboutReviewsSection.svelte';
	import AboutWhyChooseSection from './AboutWhyChooseSection.svelte';

	let { about }: { about: AuxeroAboutContent } = $props();
</script>

<div class="bohemcars-about-page" data-bohemcars-about>
	<PageBanner banner={about.hero} />
	<section class="bohemcars-about-page__intro bg-white">
		<AboutIntroSection {about} />
		<AboutReviewsSection reviews={about.reviews} />
	</section>
	<AboutWhyChooseSection {about} />
	<AboutConsultantsSection consultants={about.consultants} />
</div>

<style>
	.bohemcars-about-page {
		background: var(--bc-bg);
	}

	.bohemcars-about-page__intro {
		overflow: hidden;
		background: #ffffff !important;
		padding-top: 56px;
		padding-bottom: 62px;
	}

	@media (max-width: 767px) {
		.bohemcars-about-page__intro {
			padding-top: 36px;
			padding-bottom: 48px;
		}
	}
</style>
