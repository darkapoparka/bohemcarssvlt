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
</script>

<div class="flat-tabs mb-40">
	<div class="mb-16 overflow-x-auto">
		<ul class="menu-tab menu-tab-style4">
			<li class="active">
				<span class="text-secondary font-weight-600">{descriptionLabel}</span>
			</li>
			{#each tabs as tab (tab.label)}
				<li>
					<span class="text-secondary font-weight-600">{tab.label}</span>
				</li>
			{/each}
		</ul>
	</div>
	<div class="content-tab">
		<div class="content-inner active">
			<p class="text-secondary bohemcars-pdp-tab-description">{description}</p>
		</div>

		{#each tabs as tab (tab.label)}
			<div class="content-inner">
				<ul class="xl-grid-cols-2 md-grid-cols-1 grid grid-cols-3 gap-8 gap-x-30">
					{#each tab.items as feature, featureIndex (`${tab.label}-${featureIndex}`)}
						<li class="flex items-center gap-8">
							<img src="/assets/icons/check.svg" alt="check" />
							{feature}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</div>
