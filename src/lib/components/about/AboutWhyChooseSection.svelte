<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroAboutContent } from '$lib/auxero/about';

	let { about }: { about: AuxeroAboutContent } = $props();
</script>

<section class="bohemcars-about-why background-light">
	<div class="container">
		<div class="bohemcars-about-process why-choose-us style2 style3">
			<div class="bohemcars-about-process__title wow fadeInUp" data-wow-delay="0.1s">
				<p class="bohemcars-about-process__eyebrow">Процес</p>
				<h2>{about.why.heading}</h2>
				<p>{about.why.description}</p>
			</div>

			<div class="bohemcars-about-process__grid">
				{#each about.process as step, index (step.title)}
					<article
						class="bohemcars-about-process-card wow fadeInUp"
						data-wow-delay={`0.${index + 1}s`}
					>
						<span>{String(index + 1).padStart(2, '0')}</span>
						<h3>{step.title}</h3>
						<p>{step.description}</p>
					</article>
				{/each}
			</div>

			<div class="bohemcars-about-process__actions wow fadeInUp" data-wow-delay="0.2s">
				<a href={resolve('/services')} class="btn btn-primary btn-large font-weight-600">
					Виж услугите
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	.bohemcars-about-why {
		padding: 58px 0;
	}

	.bohemcars-about-process {
		display: block !important;
		margin-bottom: 0;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #ffffff;
		padding: 38px;
	}

	.bohemcars-about-process__title {
		max-width: 820px;
		margin: 0 auto 30px;
		text-align: center;
	}

	.bohemcars-about-process__eyebrow {
		margin-bottom: 10px;
		color: #84a928;
		font-size: 13px;
		font-weight: 800;
		letter-spacing: 0;
		line-height: 18px;
		text-transform: uppercase;
	}

	.bohemcars-about-process__title h2 {
		margin-bottom: 12px;
		font-size: 36px;
		font-weight: 600;
		line-height: 1.15;
	}

	.bohemcars-about-process__title p {
		margin: 0;
		color: #696665;
		font-size: 16px;
		line-height: 1.6;
	}

	.bohemcars-about-process__grid {
		display: grid;
		gap: 16px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.bohemcars-about-process-card {
		min-height: 170px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface);
		padding: 22px;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease;
	}

	.bohemcars-about-process-card:hover {
		border-color: var(--primary);
		background: var(--bc-surface-hover);
	}

	.bohemcars-about-process-card span {
		display: inline-flex;
		margin-bottom: 16px;
		color: #84a928;
		font-size: 13px;
		font-weight: 800;
		line-height: 1;
	}

	.bohemcars-about-process-card h3 {
		margin-bottom: 10px;
		font-size: 20px;
		font-weight: 600;
		line-height: 1.2;
	}

	.bohemcars-about-process-card p {
		margin: 0;
		color: #696665;
		font-size: 15px;
		line-height: 1.5;
	}

	.bohemcars-about-process__actions {
		display: flex;
		margin-top: 28px;
		justify-content: center;
	}

	@media (max-width: 1199px) {
		.bohemcars-about-process__grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 767px) {
		.bohemcars-about-why {
			padding: 44px 0;
		}

		.bohemcars-about-process {
			padding: 22px;
		}

		.bohemcars-about-process__title h2 {
			font-size: 28px;
		}

		.bohemcars-about-process__grid {
			grid-template-columns: 1fr;
		}
	}
</style>
