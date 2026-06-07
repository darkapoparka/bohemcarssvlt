<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroDashboardPageData } from '$lib/auxero/dashboard';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import AuxeroPageShell from '$lib/components/layout/AuxeroPageShell.svelte';
	import DashboardRecentBox from './DashboardRecentBox.svelte';

	let {
		afterRecentHtml,
		beforeRecentHtml,
		dashboard,
		dashboardContentHtml,
		pageDocument
	}: {
		afterRecentHtml: string;
		beforeRecentHtml: string;
		dashboard: AuxeroDashboardPageData;
		dashboardContentHtml: string;
		pageDocument: AuxeroPageDocument;
	} = $props();

	const dashboardContainerOpenTag = '<div class="dashboard-container">';
	const dashboardContentOpenTag = '<div class="dashboard-content">';
	const dashboardContentInnerOpenTag = '<div class="dashboard-content--inner">';

	let dashboardShell = $derived.by(() => {
		const containerStart = beforeRecentHtml.lastIndexOf(dashboardContainerOpenTag);
		const contentStart = dashboardContentHtml.indexOf(dashboardContentOpenTag);
		const contentBodyStart = contentStart < 0 ? 0 : contentStart + dashboardContentOpenTag.length;
		const innerStart = dashboardContentHtml.indexOf(dashboardContentInnerOpenTag, contentBodyStart);

		if (containerStart < 0) {
			return {
				afterHtml: afterRecentHtml,
				beforeHtml: beforeRecentHtml,
				headerHtml: '',
				sidebarHtml: ''
			};
		}

		return {
			afterHtml: afterRecentHtml.replace(/^\s*<\/div>/, ''),
			beforeHtml: beforeRecentHtml.slice(0, containerStart),
			headerHtml: innerStart < 0 ? '' : dashboardContentHtml.slice(contentBodyStart, innerStart),
			sidebarHtml: beforeRecentHtml.slice(containerStart + dashboardContainerOpenTag.length)
		};
	});
</script>

<AuxeroPageShell
	{pageDocument}
	beforeHtml={dashboardShell.beforeHtml}
	afterHtml={dashboardShell.afterHtml}
>
	<div class="dashboard-container">
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html dashboardShell.sidebarHtml}
		<div class="dashboard-content">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html dashboardShell.headerHtml}
			<div class="dashboard-content--inner">
				<p class="h3 mb-30">{dashboard.title}</p>
				<div class="dashboard-content--details">
					<div class="xl-grid-cols-2 sm-grid-cols-1 mb-30 grid grid-cols-4 gap-30">
						{#each dashboard.stats as stat (stat.id)}
							<a
								href={resolve(stat.href)}
								class="dashboard-cart"
								data-bohemcars-dashboard-stat={stat.id}
								data-bohemcars-stat-value={stat.value}
							>
								<div>
									<p class="h7 font-weight-500 mb-4">{stat.label}</p>
									<p class="h3">{stat.value}</p>
								</div>
								<div class="icon">
									<img src={stat.icon} alt={stat.label} />
								</div>
							</a>
						{/each}
					</div>
					<DashboardRecentBox recent={dashboard.recent} />
				</div>
			</div>
		</div>
	</div>
</AuxeroPageShell>

<style>
	:global(body.dashboard .dashboard-content--inner) {
		padding-top: 42px !important;
	}

	:global(body.dashboard .dashboard-content--details > .grid:first-of-type) {
		gap: 18px !important;
		margin-bottom: 18px !important;
	}

	:global(body.dashboard .dashboard-content--details > .grid:first-of-type .dashboard-cart) {
		min-height: 132px;
		border-color: var(--bc-border) !important;
		border-radius: 14px !important;
		box-shadow: none !important;
		padding: 21px 24px !important;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease !important;
	}

	:global(body.dashboard .dashboard-content--details > .grid:first-of-type .dashboard-cart:hover),
	:global(
		body.dashboard .dashboard-content--details > .grid:first-of-type .dashboard-cart:focus-visible
	) {
		border-color: #cbd8c3 !important;
		background: #f8faf4 !important;
	}

	:global(body.dashboard .dashboard-content--details > .grid:first-of-type .dashboard-cart .h7) {
		max-width: 132px;
		color: #1c1c1c;
		font-size: 16px;
		font-weight: 650 !important;
		line-height: 22px;
	}

	:global(body.dashboard .dashboard-content--details > .grid:first-of-type .dashboard-cart .h3) {
		font-size: 32px;
		font-weight: 500;
		line-height: 38px;
	}

	:global(body.dashboard .dashboard-content--details > .grid:first-of-type .dashboard-cart .icon) {
		flex: 0 0 62px !important;
		width: 62px !important;
		min-width: 62px !important;
		max-width: 62px !important;
		height: 62px !important;
		border-radius: 14px !important;
		padding: 15px !important;
	}

	@media (max-width: 767.98px) {
		:global(body.dashboard .dashboard-content--inner) {
			padding-top: 18px !important;
		}

		:global(body.dashboard .dashboard-content--details > .grid:first-of-type) {
			gap: 12px !important;
			margin-bottom: 14px !important;
		}

		:global(body.dashboard .dashboard-content--details > .grid:first-of-type .dashboard-cart) {
			min-height: 98px;
			padding: 16px !important;
		}

		:global(body.dashboard .dashboard-content--details > .grid:first-of-type .dashboard-cart .h7) {
			max-width: none;
			font-size: 15px;
			line-height: 20px;
		}

		:global(body.dashboard .dashboard-content--details > .grid:first-of-type .dashboard-cart .h3) {
			font-size: 28px;
			line-height: 34px;
		}
	}
</style>
