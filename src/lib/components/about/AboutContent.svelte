<script lang="ts">
	import type { AuxeroAboutContent } from '$lib/auxero/about';
	import PageBanner from '$lib/components/common/PageBanner.svelte';
	import AboutBrandsSection from './AboutBrandsSection.svelte';
	import AboutConsultantsSection from './AboutConsultantsSection.svelte';
	import AboutIntroSection from './AboutIntroSection.svelte';
	import AboutLocationSection from './AboutLocationSection.svelte';
	import AboutMobileSurface from './AboutMobileSurface.svelte';

	let { about }: { about: AuxeroAboutContent } = $props();
</script>

<div class="bohemcars-about-page" data-bohemcars-about>
	<AboutMobileSurface {about} />
	<PageBanner banner={about.hero} />
	<div id="about-team" class="bohemcars-about-page__anchor">
		<AboutConsultantsSection consultants={about.consultants} />
	</div>
	<div id="about-brands" class="bohemcars-about-page__anchor">
		<AboutBrandsSection brands={about.brands} />
	</div>
	<section id="about-services" class="bohemcars-about-page__intro bohemcars-about-page__anchor">
		<AboutIntroSection {about} />
	</section>
	<div id="about-location" class="bohemcars-about-page__anchor">
		<AboutLocationSection office={about.office} />
	</div>
</div>

<style>
	.bohemcars-about-page {
		background: var(--bc-bg);
	}

	.bohemcars-about-page__intro {
		overflow: hidden;
		background: var(--bc-bg);
		padding-top: 38px;
		padding-bottom: 42px;
	}

	.bohemcars-about-page__anchor {
		scroll-margin-top: 132px;
	}

	@media (max-width: 767px) {
		.bohemcars-about-page__intro {
			padding-top: 32px;
			padding-bottom: 40px;
		}

		.bohemcars-about-page__anchor {
			scroll-margin-top: 164px;
		}
	}
</style>
