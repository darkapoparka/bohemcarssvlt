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
	<section class="bohemcars-about-page__intro bg-white py-100">
		<AboutIntroSection {about} />
		<div class="tf-spacing-style5"></div>
		<AboutReviewsSection reviews={about.reviews} />
	</section>
	<AboutWhyChooseSection {about} />
	<div class="tf-spacing"></div>
	<AboutConsultantsSection consultants={about.consultants} />
</div>

<style>
	.bohemcars-about-page {
		background: #fff;
	}

	.bohemcars-about-page__intro {
		overflow: hidden;
		padding-top: 72px;
		padding-bottom: 86px;
	}

	@media (max-width: 767px) {
		.bohemcars-about-page__intro {
			padding-top: 52px;
			padding-bottom: 64px;
		}
	}
</style>
