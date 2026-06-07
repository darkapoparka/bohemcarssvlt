<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroAboutContent } from '$lib/auxero/about';
	import AboutSectionHeader from './AboutSectionHeader.svelte';

	let { about }: { about: AuxeroAboutContent } = $props();
</script>

<div class="container">
	<section class="bohemcars-about-story wow fadeInUp" data-wow-delay="0.1s">
		<AboutSectionHeader heading={about.intro.heading} description={about.intro.description} />

		<div class="bohemcars-about-services__grid" aria-label={about.intro.heading}>
			{#each about.profile.steps as step, index (step.title)}
				<a
					class="bohemcars-about-service wow fadeInUp"
					href={resolve(step.href as '/')}
					data-wow-delay={`0.${(index % 4) + 1}s`}
				>
					<div class="bohemcars-about-service__media">
						<img src={step.image} alt={step.title} loading="lazy" />
					</div>
					<div class="bohemcars-about-service__body">
						<h3>{step.title}</h3>
						<p>{step.description}</p>
						<span class="bohemcars-about-service__cta">
							Научи повече
							<svg
								width="15"
								height="15"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.4"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
							>
								<path d="M5 12h14" />
								<path d="M13 6l6 6-6 6" />
							</svg>
						</span>
					</div>
				</a>
			{/each}
		</div>
	</section>
</div>

<style>
	.bohemcars-about-story {
		display: block;
	}

	.bohemcars-about-services__grid {
		display: grid;
		gap: 20px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.bohemcars-about-service {
		display: flex;
		min-width: 0;
		flex-direction: column;
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface);
		box-shadow: none;
		color: #1c1c1c;
		text-decoration: none;
		transition:
			border-color 0.18s ease,
			background-color 0.18s ease;
	}

	.bohemcars-about-service:hover {
		border-color: #cbd8c1;
		background: var(--bc-surface-hover);
	}

	.bohemcars-about-service:hover h3 {
		color: #5f7d18;
	}

	.bohemcars-about-service__media {
		position: relative;
		overflow: hidden;
		aspect-ratio: 16 / 9;
		background: var(--bc-surface-soft);
	}

	.bohemcars-about-service__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.bohemcars-about-service__body {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		padding: 14px 16px 16px;
	}

	.bohemcars-about-service h3 {
		margin-bottom: 6px;
		color: #1c1c1c;
		font-size: 16px;
		font-weight: 700;
		line-height: 1.3;
		transition: color 0.18s ease;
	}

	.bohemcars-about-service p {
		margin: 0;
		color: #696665;
		font-size: 13.5px;
		font-weight: 500;
		line-height: 1.5;
	}

	.bohemcars-about-service__cta {
		display: inline-flex;
		width: fit-content;
		min-height: 34px;
		align-items: center;
		margin-top: auto;
		border-radius: 999px;
		background: #16240e;
		padding: 0 14px;
		gap: 8px;
		color: #ffffff;
		font-size: 13px;
		font-weight: 700;
		line-height: 1;
		transition:
			background-color 0.16s ease,
			color 0.16s ease;
	}

	.bohemcars-about-service__cta svg {
		flex: 0 0 auto;
	}

	.bohemcars-about-service:hover .bohemcars-about-service__cta {
		background: #98bc2a;
		color: #1c1c1c;
	}

	.bohemcars-about-service:hover .bohemcars-about-service__cta svg {
		transform: none;
	}

	@media (max-width: 1199px) {
		.bohemcars-about-services__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 767px) {
		.bohemcars-about-services__grid {
			grid-template-columns: 1fr;
		}
	}
</style>
