<script lang="ts">
	import type { AuxeroVehicleDetailFeatureTab } from '$lib/auxero/detail';

	let {
		description,
		descriptionLabel,
		tabs
	}: {
		description: string;
		descriptionLabel: string;
		tabs: AuxeroVehicleDetailFeatureTab[];
	} = $props();

	type DetailTabPanel = {
		description?: string;
		items?: string[];
		label: string;
	};

	let selectedTabLabel = $state<string>();

	const tabPanels: DetailTabPanel[] = $derived([{ description, label: descriptionLabel }, ...tabs]);
	const activeTabIndex = $derived.by(() => {
		const index = tabPanels.findIndex(
			(tab) => tab.label === (selectedTabLabel ?? descriptionLabel)
		);
		return index >= 0 ? index : 0;
	});
	const tabId = (index: number) => `bohemcars-pdp-feature-tab-${index}`;
	const panelId = (index: number) => `bohemcars-pdp-feature-panel-${index}`;
</script>

<div class="flat-tabs mb-40">
	<div class="mb-16 overflow-x-auto">
		<ul class="menu-tab menu-tab-style4" aria-label="Vehicle detail sections" role="tablist">
			{#each tabPanels as tab, index (tab.label)}
				<li class={[activeTabIndex === index && 'active']} role="presentation">
					<button
						aria-controls={panelId(index)}
						aria-selected={activeTabIndex === index}
						class="bohemcars-pdp-feature-tab"
						id={tabId(index)}
						onclick={() => {
							selectedTabLabel = tab.label;
						}}
						role="tab"
						tabindex={activeTabIndex === index ? 0 : -1}
						type="button"
					>
						<span class="text-secondary font-weight-600">{tab.label}</span>
					</button>
				</li>
			{/each}
		</ul>
	</div>
	<div class="content-tab">
		{#each tabPanels as tab, index (tab.label)}
			<div
				aria-labelledby={tabId(index)}
				class={['content-inner', activeTabIndex === index && 'active']}
				id={panelId(index)}
				role="tabpanel"
			>
				{#if tab.description}
					<p class="text-secondary bohemcars-pdp-tab-description">{tab.description}</p>
				{:else if tab.items}
					<ul class="xl-grid-cols-2 md-grid-cols-1 grid grid-cols-3 gap-8 gap-x-30">
						{#each tab.items as feature (`${tab.label}-${feature}`)}
							<li class="flex items-center gap-8">
								<img src="/assets/icons/check.svg" alt="check" />
								{feature}
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.bohemcars-pdp-feature-tab {
		all: unset;
		box-sizing: border-box;
		cursor: pointer;
		display: block;
		width: 100%;
	}

	.bohemcars-pdp-feature-tab:focus-visible {
		border-radius: 6px;
		outline: 2px solid #98bc2a;
		outline-offset: 3px;
	}
</style>
