<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroTermsSection } from '$lib/auxero/terms';

	let { sections, title }: { sections: AuxeroTermsSection[]; title: string } = $props();
</script>

<section class="bohemcars-terms" data-bohemcars-terms-page>
	<div class="bc-container">
		<header class="bohemcars-terms__header">
			<h1 class="bohemcars-terms__title">{title}</h1>
			<p class="bohemcars-terms__intro">
				Кратко и ясно: как Bohemcars представя информация, организира огледи и обработва запитвания.
			</p>
		</header>
		<div class="term-page" id="scrollContainer" data-bohemcars-terms>
			<nav class="term-page--nav-container" aria-label="Раздели в условията">
				<ul class="term-page--nav" id="sidebarSticky">
					{#each sections as section (section.id)}
						<li><a href={resolve(`/terms#${section.id}`)}>{section.title}</a></li>
					{/each}
				</ul>
			</nav>
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
		padding: 52px 0 104px;
	}

	.bohemcars-terms__header {
		max-width: 760px;
		margin-bottom: 42px;
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

	.bohemcars-terms__intro {
		max-width: 660px;
		margin: 14px 0 0;
		color: var(--bc-copy);
		font-size: var(--bc-text-body-lg);
		font-weight: 400;
		line-height: var(--bc-leading-body-lg);
	}

	.bohemcars-terms :global(.term-page) {
		display: grid;
		grid-template-columns: minmax(260px, 320px) minmax(0, 760px);
		gap: clamp(32px, 5vw, 78px);
		align-items: start;
		justify-content: start;
	}

	.bohemcars-terms :global(.term-page .term-page--nav-container) {
		position: relative;
		width: auto;
		min-width: 0;
	}

	.bohemcars-terms :global(.term-page .term-page--nav) {
		position: relative;
		display: flex;
		width: 100%;
		height: fit-content;
		flex-direction: column;
		gap: 6px;
		border: 1px solid var(--bc-border);
		border-radius: 12px;
		background: color-mix(in srgb, var(--bc-accent) 7%, #fff);
		padding: 10px;
	}

	.bohemcars-terms :global(.term-page .term-page--nav.menuFixed) {
		position: fixed !important;
		z-index: 10;
		top: 94px;
		width: min(320px, calc(100vw - 32px));
	}

	.bohemcars-terms :global(.term-page .term-page--nav.menuSticky) {
		position: absolute !important;
		top: auto;
		bottom: 0;
	}

	.bohemcars-terms :global(.term-page .term-page--nav li a) {
		position: relative;
		display: block;
		border-radius: 8px;
		padding: 11px 13px;
		color: var(--bc-ink);
		font-size: 15px;
		font-weight: 600;
		line-height: 1.35;
		text-decoration: none;
		transition:
			background-color var(--bc-motion-standard),
			color var(--bc-motion-standard);
	}

	.bohemcars-terms :global(.term-page .term-page--nav li a:hover),
	.bohemcars-terms :global(.term-page .term-page--nav li a.active) {
		background: #fff;
		color: var(--bc-accent);
	}

	.bohemcars-terms :global(.term-page .content) {
		width: 100%;
		min-width: 0;
		max-width: 760px;
	}

	.bohemcars-terms :global(.term-page .section:not(:first-child)) {
		margin-top: 30px;
		border-top: 1px solid var(--bc-border);
		padding-top: 30px;
	}

	.bohemcars-terms__section-title {
		margin: 0 0 10px;
		color: var(--bc-ink);
		font-size: 24px;
		font-weight: 600;
		line-height: 1.25;
		text-transform: none;
	}

	.bohemcars-terms__paragraph {
		margin: 0 0 11px;
		color: var(--bc-copy);
		font-size: 17px;
		font-weight: 400;
		line-height: 1.7;
	}

	@media (max-width: 767.98px) {
		.bohemcars-terms {
			padding: 28px 0 86px;
		}

		.bohemcars-terms__header {
			margin-bottom: 22px;
		}

		.bohemcars-terms__title {
			font-size: 27px;
			line-height: 1.15;
		}

		.bohemcars-terms__intro {
			margin-top: 10px;
			font-size: 15px;
			line-height: 1.55;
		}

		.bohemcars-terms :global(.term-page) {
			display: block;
		}

		.bohemcars-terms :global(.term-page .content),
		.bohemcars-terms :global(.term-page .term-page--nav-container),
		.bohemcars-terms :global(.term-page .term-page--nav) {
			width: 100%;
		}

		.bohemcars-terms :global(.term-page .term-page--nav-container) {
			overflow-x: auto;
			margin: 0 -15px 26px;
			padding: 0 15px 4px;
			scrollbar-width: none;
		}

		.bohemcars-terms :global(.term-page .term-page--nav-container::-webkit-scrollbar) {
			display: none;
		}

		.bohemcars-terms :global(.term-page .term-page--nav) {
			display: inline-flex;
			width: max-content;
			max-width: none;
			flex-direction: row;
			gap: 8px;
			border: 0;
			background: transparent;
			padding: 0;
		}

		.bohemcars-terms :global(.term-page .term-page--nav.menuFixed),
		.bohemcars-terms :global(.term-page .term-page--nav.menuSticky) {
			position: relative !important;
			top: auto;
			bottom: auto;
			width: max-content;
		}

		.bohemcars-terms :global(.term-page .term-page--nav a) {
			display: flex;
			min-height: 40px;
			align-items: center;
			border: 1px solid var(--bc-border);
			border-radius: 999px;
			background: color-mix(in srgb, var(--bc-accent) 7%, #fff);
			padding: 9px 13px;
			font-size: 14px;
			line-height: 1.25;
			white-space: nowrap;
		}

		.bohemcars-terms :global(.term-page .section:not(:first-child)) {
			margin-top: 24px;
			padding-top: 24px;
		}

		.bohemcars-terms__section-title {
			font-size: 22px;
			line-height: 1.25;
		}

		.bohemcars-terms__paragraph {
			font-size: 16px;
			line-height: 1.6;
		}
	}

	@media (min-width: 768px) and (max-width: 1199.98px) {
		.bohemcars-terms :global(.term-page) {
			grid-template-columns: minmax(230px, 280px) minmax(0, 1fr);
			gap: 36px;
		}
	}
</style>
