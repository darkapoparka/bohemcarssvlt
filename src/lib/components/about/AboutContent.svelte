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
	<AboutConsultantsSection consultants={about.consultants} />
	<AboutBrandsSection brands={about.brands} />
	<section class="bohemcars-about-page__intro">
		<AboutIntroSection {about} />
	</section>
	<AboutLocationSection office={about.office} />
</div>

<style>
	.bohemcars-about-page {
		background: var(--bc-bg);
	}

	.bohemcars-about-page__intro {
		overflow: hidden;
		border-top: 1px solid var(--bc-border);
		border-bottom: 1px solid var(--bc-border);
		background: var(--bc-surface-soft);
		padding-top: 52px;
		padding-bottom: 56px;
	}

	@media (max-width: 767px) {
		.bohemcars-about-page__intro {
			padding-top: 32px;
			padding-bottom: 40px;
		}
	}
</style>
