<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroAboutContent } from '$lib/auxero/about';
	import AboutChecklist from './AboutChecklist.svelte';

	let { about }: { about: AuxeroAboutContent } = $props();
</script>

<section class="bohemcars-about-why background-light">
	<div class="container">
		<div class="why-choose-us style2 style3">
			<div class="wow fadeIn" data-wow-delay="0.1s">
				<img class="move5" src={about.why.image} alt={about.why.imageAlt} />
			</div>
			<div class="wow fadeIn" data-wow-delay="0.2s">
				<h2 class="mb-12">{about.why.heading}</h2>
				<p class="text-muted mb-20">{about.why.description}</p>
				<AboutChecklist items={about.why.checklist} />
				<a href={resolve('/services')} class="btn btn-primary btn-large font-weight-600 max-w-min"
					>Виж услугите</a
				>
			</div>
		</div>
	</div>
</section>

<style>
	.bohemcars-about-why {
		padding: 64px 0;
	}

	.bohemcars-about-why :global(.container) {
		max-width: 1010px;
	}

	.bohemcars-about-why :global(.why-choose-us) {
		border-radius: 8px;
		padding: 34px;
	}

	.bohemcars-about-why :global(.why-choose-us img) {
		border-radius: 8px;
	}

	@media (max-width: 767px) {
		.bohemcars-about-why {
			padding: 44px 0;
		}

		.bohemcars-about-why :global(.why-choose-us) {
			padding: 18px;
		}
	}
</style>
