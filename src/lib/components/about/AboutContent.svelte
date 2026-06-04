<script lang="ts">
	import type { AuxeroAboutContent } from '$lib/auxero/about';
	import PageBanner from '$lib/components/common/PageBanner.svelte';
	import AboutBrandsSection from './AboutBrandsSection.svelte';
	import AboutConsultantsSection from './AboutConsultantsSection.svelte';
	import AboutIntroSection from './AboutIntroSection.svelte';
	import AboutLocationSection from './AboutLocationSection.svelte';

	let { about }: { about: AuxeroAboutContent } = $props();
</script>

<div class="bohemcars-about-page" data-bohemcars-about>
	<PageBanner banner={about.hero} />
	<section class="bohemcars-about-page__intro bg-white">
		<AboutIntroSection {about} />
	</section>
	<AboutConsultantsSection consultants={about.consultants} />
	<AboutBrandsSection brands={about.brands} />
	<AboutLocationSection office={about.office} />
</div>

<style>
	.bohemcars-about-page {
		background: var(--bc-bg);
	}

	.bohemcars-about-page__intro {
		overflow: hidden;
		background: var(--bc-bg) !important;
		padding-top: 50px;
		padding-bottom: 54px;
	}

	@media (max-width: 767px) {
		.bohemcars-about-page__intro {
			padding-top: 36px;
			padding-bottom: 48px;
		}
	}
</style>
