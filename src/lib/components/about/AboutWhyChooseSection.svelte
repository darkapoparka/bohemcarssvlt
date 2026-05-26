<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroAboutContent } from '$lib/auxero/about';
	import AboutChecklist from './AboutChecklist.svelte';
	import AboutStatsGrid from './AboutStatsGrid.svelte';

	let { about }: { about: AuxeroAboutContent } = $props();
</script>

<section class="background-light py-100">
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
					>Explore Services</a
				>
			</div>
		</div>
		<AboutStatsGrid stats={about.stats} />
	</div>
</section>
