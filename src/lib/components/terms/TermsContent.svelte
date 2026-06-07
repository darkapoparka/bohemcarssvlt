<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroTermsSection } from '$lib/auxero/terms';

	let { sections, title }: { sections: AuxeroTermsSection[]; title: string } = $props();
</script>

<section class="bg-white pb-100" data-bohemcars-terms-page>
	<div class="container">
		<h1 class="h2 capitalize">{title}</h1>
		<div class="tf-spacing-style3"></div>
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
	</div>
</section>

<style>
	@media (max-width: 767.98px) {
		.term-page--nav a {
			display: flex;
			min-height: 44px;
			align-items: center;
		}
	}
</style>
