<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroTermsSection } from '$lib/auxero/terms';

	let { sections, title }: { sections: AuxeroTermsSection[]; title: string } = $props();
</script>

<section class="bohemcars-terms" data-bohemcars-terms-page>
	<div class="bc-container">
		<h1 class="bohemcars-terms__title">{title}</h1>
		<div class="bohemcars-terms__spacer" aria-hidden="true"></div>
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
						<p class="h4 bohemcars-terms__section-title">{section.title}</p>
						{#each section.body as paragraph (paragraph)}
							<p class="bohemcars-terms__paragraph">{paragraph}</p>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.bohemcars-terms {
		background: var(--bc-bg);
		padding-bottom: 100px;
	}

	.bohemcars-terms__title {
		margin: 0;
		color: var(--bc-ink);
		font-family: var(--bc-font-body);
		font-size: var(--bc-text-h2);
		font-weight: 600;
		letter-spacing: 0;
		line-height: var(--bc-leading-h2);
		text-transform: none;
	}

	.bohemcars-terms__spacer {
		height: 80px;
	}

	.bohemcars-terms :global(.term-page) {
		display: flex;
		justify-content: space-between;
	}

	.bohemcars-terms :global(.term-page--nav-container) {
		position: relative;
		width: 360px;
	}

	.bohemcars-terms :global(.term-page--nav) {
		position: relative;
		display: flex;
		height: fit-content;
		flex-direction: column;
		gap: 36px;
		border-left: 1px solid var(--bc-border);
		padding-top: 11px;
	}

	.bohemcars-terms :global(.term-page--nav.menuFixed) {
		position: fixed !important;
		z-index: 10;
		top: 94px;
	}

	.bohemcars-terms :global(.term-page--nav.menuSticky) {
		position: absolute !important;
		top: auto;
		bottom: 0;
	}

	.bohemcars-terms :global(.term-page--nav li a) {
		position: relative;
		border-left: 3px solid transparent;
		padding-left: 12px;
		color: var(--bc-ink);
		font-size: 20px;
		font-weight: 600;
		line-height: 28px;
		text-decoration: none;
		transition:
			border-color var(--bc-motion-standard),
			color var(--bc-motion-standard);
	}

	.bohemcars-terms :global(.term-page--nav li a.active) {
		border-color: var(--bc-accent);
	}

	.bohemcars-terms :global(.content) {
		width: calc(100% - 490px);
	}

	.bohemcars-terms :global(.section:not(:first-child)) {
		margin-top: -60px;
		padding-top: 100px;
	}

	.bohemcars-terms__section-title {
		margin: 0 0 12px;
		color: var(--bc-ink);
		font-size: var(--bc-text-h4);
		font-weight: 600;
		line-height: var(--bc-leading-h4);
		text-transform: none;
	}

	.bohemcars-terms__paragraph {
		margin: 0 0 12px;
		color: var(--bc-copy);
		font-size: var(--bc-text-body-lg);
		font-weight: 400;
		line-height: var(--bc-leading-body-lg);
	}

	@media (max-width: 767.98px) {
		.bohemcars-terms {
			padding-bottom: 70px;
		}

		.bohemcars-terms__title {
			font-size: 28px;
			line-height: 1.1;
		}

		.bohemcars-terms__spacer {
			height: 40px;
		}

		.bohemcars-terms :global(.term-page) {
			flex-direction: column;
			gap: 40px;
		}

		.bohemcars-terms :global(.content),
		.bohemcars-terms :global(.term-page--nav) {
			width: 100%;
		}

		.bohemcars-terms :global(.term-page--nav a) {
			display: flex;
			min-height: 44px;
			align-items: center;
		}
	}

	@media (min-width: 768px) and (max-width: 1199.98px) {
		.bohemcars-terms :global(.term-page--nav) {
			width: 300px;
		}

		.bohemcars-terms :global(.content) {
			width: calc(100% - 340px);
		}
	}
</style>
