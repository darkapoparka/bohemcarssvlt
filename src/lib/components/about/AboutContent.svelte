<script lang="ts">
	import type { AuxeroAboutContent } from '$lib/auxero/about';
	import AboutConsultantsSection from './AboutConsultantsSection.svelte';
	import AboutIntroSection from './AboutIntroSection.svelte';
	import AboutReviewsSection from './AboutReviewsSection.svelte';
	import AboutWhyChooseSection from './AboutWhyChooseSection.svelte';

	let { about }: { about: AuxeroAboutContent } = $props();
</script>

<div data-bohemcars-about>
	<section class="pb-100">
		<AboutIntroSection {about} />
		<div class="tf-spacing-style5"></div>
		<AboutReviewsSection reviews={about.reviews} />
	</section>
	<AboutWhyChooseSection {about} />
	<div class="tf-spacing"></div>
	<AboutConsultantsSection consultants={about.consultants} />
</div>
