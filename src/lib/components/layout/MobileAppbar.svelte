<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';

	let {
		actionsLabel = 'Контакт',
		children,
		logoAlt = 'Bohemcars'
	}: {
		actionsLabel?: string;
		children?: Snippet;
		logoAlt?: string;
	} = $props();
</script>

<!-- Standardized green-chrome appbar: identical metrics to the homepage header
     (56px row, 142px solid-ink logo, 40px hairlined discs) so flow pages and
     home stay visually aligned. Actions are contextual via children. -->
<header class="bc-mobile-appbar">
	<a class="bc-mobile-appbar__brand" href={resolve('/')} aria-label="Bohemcars начало">
		<img
			src="/assets/bohemcars/brand/bohemcars-logo-concept-light-template-clean.webp"
			alt={logoAlt}
			width="1285"
			height="235"
		/>
	</a>
	<div class="bc-mobile-appbar__actions" aria-label={actionsLabel}>
		{@render children?.()}
	</div>
</header>

<style>
	.bc-mobile-appbar {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		z-index: 20;
		display: flex;
		height: calc(56px + env(safe-area-inset-top));
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		background: transparent;
		padding: env(safe-area-inset-top) 12px 0 16px;
	}

	.bc-mobile-appbar__brand {
		display: flex;
		flex: 1 1 auto;
		min-width: 0;
		align-items: center;
		text-decoration: none !important;
	}

	.bc-mobile-appbar__brand img {
		display: block;
		/* Matches the rendered homepage header logo width on mobile; shrinks
		   when a page mounts more contextual actions. */
		width: 196px;
		max-width: 100%;
		height: auto;
		object-fit: contain;
		/* The wordmark's green "CARS" sinks into the green chrome — force solid ink. */
		filter: brightness(0);
	}

	.bc-mobile-appbar__actions {
		display: flex;
		flex: 0 0 auto;
		align-items: center;
		gap: 8px;
	}

	.bc-mobile-appbar__actions :global(a),
	.bc-mobile-appbar__actions :global(label),
	.bc-mobile-appbar__actions :global(button) {
		display: flex;
		width: 44px;
		height: 44px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 999px;
		background: #ffffff;
		box-shadow: inset 0 0 0 1px rgba(20, 33, 15, 0.14);
		color: #20350f;
		cursor: pointer;
		padding: 0;
		text-decoration: none !important;
		transition:
			background-color 0.18s ease,
			color 0.18s ease;
	}

	.bc-mobile-appbar__actions :global(.bc-mobile-appbar__action--primary) {
		background: var(--bc-accent-bright-soft);
		box-shadow: none;
		color: #111111;
	}

	.bc-mobile-appbar__actions :global(a:focus-visible),
	.bc-mobile-appbar__actions :global(label:focus-visible),
	.bc-mobile-appbar__actions :global(button:focus-visible) {
		outline: 2px solid rgba(20, 33, 15, 0.64);
		outline-offset: 2px;
	}

	.bc-mobile-appbar__actions :global(svg),
	.bc-mobile-appbar__actions :global(svg *) {
		color: currentColor;
		stroke: currentColor;
	}

	@media (max-width: 374px) {
		.bc-mobile-appbar__actions {
			gap: 6px;
		}

		.bc-mobile-appbar__actions :global(a),
		.bc-mobile-appbar__actions :global(label),
		.bc-mobile-appbar__actions :global(button) {
			width: 38px;
			height: 38px;
		}
	}

	@media (max-width: 359px) {
		.bc-mobile-appbar__brand img {
			width: 128px;
		}
	}
</style>
