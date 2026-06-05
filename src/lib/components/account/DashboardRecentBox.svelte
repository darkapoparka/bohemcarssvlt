<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroDashboardRecentData } from '$lib/auxero/dashboard';

	let { recent }: { recent: AuxeroDashboardRecentData } = $props();
</script>

<div class="dashboard-box bohemcars-dashboard-overview bg-white" data-bohemcars-dashboard-recent>
	<div class="bohemcars-dashboard-overview__header">
		<div class="bohemcars-dashboard-overview__title">
			<p class="h4 mb-8">{recent.heading}</p>
			<p class="h7 text-secondary">{recent.intro}</p>
		</div>
		<a
			href={resolve(recent.primaryAction.href)}
			class="btn btn-small btn-primary-3 font-weight-600 bohemcars-dashboard-overview__primary"
		>
			<img src={recent.primaryAction.icon} alt="" aria-hidden="true" />
			{recent.primaryAction.label}
		</a>
	</div>

	<div class="bohemcars-dashboard-overview__summary" aria-label="Dashboard summary">
		{#each recent.summary as item (item.id)}
			<div class={['bohemcars-dashboard-summary-item', item.tone && `is-${item.tone}`]}>
				<p class="bohemcars-dashboard-summary-item__value">{item.value}</p>
				<p class="bohemcars-dashboard-summary-item__label">{item.label}</p>
			</div>
		{/each}
	</div>

	<div class="bohemcars-dashboard-actions" aria-label="Quick dashboard actions">
		{#each recent.actions as action (action.id)}
			<a href={resolve(action.href)} class="bohemcars-dashboard-action">
				<span class="bohemcars-dashboard-action__icon">
					<img src={action.icon} alt="" aria-hidden="true" />
				</span>
				<span class="bohemcars-dashboard-action__copy">
					<span class="bohemcars-dashboard-action__label">{action.label}</span>
					<span class="bohemcars-dashboard-action__meta">{action.meta}</span>
				</span>
			</a>
		{/each}
	</div>

	<div class="bohemcars-dashboard-recent">
		<div class="bohemcars-dashboard-recent__header">
			<p class="h5 mb-0">Recent activity</p>
			<p class="text-secondary mb-0 text-sm">{recent.items.length} latest</p>
		</div>

		<div class="comments bohemcars-dashboard-recent__list">
			{#each recent.items as item (item.id)}
				<div class="comment-box bohemcars-dashboard-recent-card">
					<div class="comment-box__header mb-16 gap-12">
						<div class="comment-box__avatar">
							<img src={item.avatar} alt={item.name} />
						</div>
						<div class="bohemcars-dashboard-recent-card__person">
							<div class="text-secondary gap-4 pt-4">
								<p class="h5 mb-4">{item.name}</p>
								<p class="text-secondary mb-0 text-sm">{item.dateLabel}</p>
							</div>
						</div>
						<span class="bohemcars-dashboard-status">{item.statusLabel}</span>
					</div>
					<p class="h5 mb-8">{item.title}</p>
					<p class="bohemcars-dashboard-meta text-secondary mb-10">{item.metaLabel}</p>
					<p class="h7 line-height-28 mb-16">{item.body}</p>
					<a href={resolve(item.href)} class="view-details bohemcars-dashboard-recent-card__link">
						{item.actionLabel}
						<img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt="" aria-hidden="true" />
					</a>
				</div>
			{:else}
				<div class="comment-box bohemcars-dashboard-recent-card">
					<p class="h5 mb-8">Nothing needs attention right now</p>
					<p class="h7 line-height-28 mb-0">
						New leads, messages, and listing updates will appear here as soon as they arrive.
					</p>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.bohemcars-dashboard-overview {
		display: grid;
		gap: 22px;
	}

	.bohemcars-dashboard-overview__header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 18px;
	}

	.bohemcars-dashboard-overview__title {
		max-width: 680px;
	}

	.bohemcars-dashboard-overview__primary {
		min-height: 44px;
		white-space: nowrap;
	}

	.bohemcars-dashboard-overview__primary img {
		width: 18px;
		height: 18px;
		object-fit: contain;
	}

	.bohemcars-dashboard-overview__summary {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1px;
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-border);
	}

	.bohemcars-dashboard-summary-item {
		min-width: 0;
		background: #ffffff;
		padding: 16px 18px;
	}

	.bohemcars-dashboard-summary-item__value {
		margin: 0 0 5px;
		color: #1c1c1c;
		font-size: 28px;
		font-weight: 700;
		line-height: 34px;
	}

	.bohemcars-dashboard-summary-item__label {
		margin: 0;
		color: #687064;
		font-size: 13px;
		font-weight: 700;
		line-height: 18px;
	}

	.bohemcars-dashboard-summary-item.is-attention .bohemcars-dashboard-summary-item__value {
		color: #8fbd24;
	}

	.bohemcars-dashboard-summary-item.is-calm .bohemcars-dashboard-summary-item__value {
		color: #44513f;
	}

	.bohemcars-dashboard-actions {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 10px;
	}

	.bohemcars-dashboard-action {
		display: flex;
		min-width: 0;
		min-height: 62px;
		align-items: center;
		gap: 12px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-control);
		padding: 10px 12px;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease;
	}

	.bohemcars-dashboard-action:hover,
	.bohemcars-dashboard-action:focus-visible {
		border-color: #cfdac8;
		background: var(--bc-control-hover);
	}

	.bohemcars-dashboard-action__icon {
		display: inline-flex;
		width: 38px;
		min-width: 38px;
		height: 38px;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		background: #ffffff;
	}

	.bohemcars-dashboard-action__icon img {
		width: 20px;
		height: 20px;
		object-fit: contain;
	}

	.bohemcars-dashboard-action__copy {
		display: grid;
		min-width: 0;
		gap: 2px;
	}

	.bohemcars-dashboard-action__label,
	.bohemcars-dashboard-action__meta {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.bohemcars-dashboard-action__label {
		color: #1c1c1c;
		font-size: 15px;
		font-weight: 700;
		line-height: 20px;
	}

	.bohemcars-dashboard-action__meta,
	.bohemcars-dashboard-meta {
		color: #687064;
		font-size: 13px;
		font-weight: 600;
		line-height: 18px;
	}

	.bohemcars-dashboard-recent {
		display: grid;
		gap: 14px;
	}

	.bohemcars-dashboard-recent__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.bohemcars-dashboard-recent__list {
		display: grid;
		gap: 12px;
	}

	.bohemcars-dashboard-recent-card {
		margin: 0 !important;
	}

	.bohemcars-dashboard-recent-card__person {
		min-width: 0;
		flex: 1;
	}

	.bohemcars-dashboard-status {
		display: inline-flex;
		min-height: 30px;
		align-items: center;
		border-radius: 999px;
		background: #f3f7ea;
		color: #6f9818;
		padding: 0 12px;
		font-size: 12px;
		font-weight: 800;
		line-height: 15px;
		white-space: nowrap;
	}

	.bohemcars-dashboard-recent-card__link {
		display: inline-flex;
		min-height: 38px;
		align-items: center;
		color: #1c1c1c;
		font-weight: 700;
	}

	@media (max-width: 1199px) {
		.bohemcars-dashboard-actions {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 767.98px) {
		.bohemcars-dashboard-overview {
			gap: 16px;
		}

		.bohemcars-dashboard-overview__header,
		.bohemcars-dashboard-recent__header {
			align-items: stretch;
			flex-direction: column;
		}

		.bohemcars-dashboard-overview__primary {
			width: 100%;
			justify-content: center;
		}

		.bohemcars-dashboard-overview__summary,
		.bohemcars-dashboard-actions {
			grid-template-columns: 1fr;
		}

		.bohemcars-dashboard-summary-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			padding: 13px 14px;
		}

		.bohemcars-dashboard-summary-item__value {
			margin: 0;
			font-size: 24px;
			line-height: 30px;
		}

		.bohemcars-dashboard-summary-item__label {
			text-align: right;
		}

		.bohemcars-dashboard-recent-card :global(.comment-box__header) {
			align-items: flex-start;
		}

		.bohemcars-dashboard-status {
			margin-left: auto;
		}
	}
</style>
