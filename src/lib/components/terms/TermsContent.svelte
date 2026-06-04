<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroTermsSection } from '$lib/auxero/terms';

	let { sections }: { sections: AuxeroTermsSection[] } = $props();
</script>

<div class="term-page" id="scrollContainer" data-bohemcars-terms>
	<div class="term-page--nav-container">
		<ul class="term-page--nav" id="sidebarSticky">
			{#each sections as section (section.id)}
				<li><a href={resolve(`/terms#${section.id}`)}>{section.title}</a></li>
			{/each}
		</ul>
	</div>
	<div class="content">
		{#each sections as section (section.id)}
			<div class="section" id={section.id}>
				<p class="h4 mb-12 capitalize">{section.title}</p>
				{#each section.body as paragraph (paragraph)}
					<p class="text-body-style-2 mb-12">{paragraph}</p>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	@media (max-width: 767.98px) {
		.term-page--nav a {
			display: flex;
			min-height: 44px;
			align-items: center;
		}
	}
</style>
