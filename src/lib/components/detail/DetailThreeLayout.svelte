<script lang="ts">
	import { GitCompare, Heart, Share2 } from '@lucide/svelte';
	import type { Agent } from '$lib/data/agents';
	import type { Dealer } from '$lib/data/dealers';
	import type { Vehicle } from '$lib/data/vehicles';
	import { getRelatedVehicles } from '$lib/data/vehicles';
	import { getGarageContext } from '$lib/state/garage.svelte';
	import { cn } from '$lib/utils/cn';
	import DealerContactCard from './DealerContactCard.svelte';
	import FinancePanel from './FinancePanel.svelte';
	import OverviewSpecs from './OverviewSpecs.svelte';
	import RelatedVehicles from './RelatedVehicles.svelte';
	import VehicleMediaSlider from './VehicleMediaSlider.svelte';

	interface Props {
		vehicle: Vehicle;
		dealer: Dealer;
		agent: Agent;
	}

	let { vehicle, dealer, agent }: Props = $props();
	const garage = getGarageContext();
	let activeInfo = $state('Overview');
	const isFavorite = $derived(garage.favorites.includes(vehicle.slug));
	const isCompared = $derived(garage.compare.includes(vehicle.slug));
	const related = $derived(getRelatedVehicles(vehicle, 4));
	const tabs = ['Overview', 'Features', 'History'];
</script>

<main class="detail-page">
	<div class="detail-grid container">
		<div class="detail-main">
			<div class="detail-title-row">
				<h1>{vehicle.title}</h1>
				<div class="detail-title-row__actions">
					<button
						class={cn('btn btn-line', isCompared && 'active')}
						type="button"
						onclick={() => garage.toggleCompare(vehicle.slug)}
					>
						<GitCompare size={19} />
						{isCompared ? 'Compared' : 'Compare'}
					</button>
					<button
						class={cn('circle-action', isFavorite && 'active')}
						type="button"
						aria-label="Toggle favorite"
						onclick={() => garage.toggleFavorite(vehicle.slug)}
					>
						<Heart size={27} />
					</button>
					<button class="circle-action" type="button" aria-label="Share vehicle">
						<Share2 size={27} />
					</button>
				</div>
			</div>

			<VehicleMediaSlider {vehicle} />

			<section class="detail-copy">
				<h2>Description</h2>
				<p>{vehicle.description}</p>
				<div class="detail-tabs">
					{#each tabs as tab (tab)}
						<button
							class={cn(activeInfo === tab && 'active')}
							type="button"
							onclick={() => (activeInfo = tab)}
						>
							{tab}
						</button>
					{/each}
				</div>
				{#if activeInfo === 'Overview'}
					<p>
						This vehicle is reviewed through Bohemcars with source details, document context, and
						viewing steps confirmed before purchase.
					</p>
				{:else if activeInfo === 'Features'}
					<ul class="feature-list">
						{#each vehicle.features as feature (feature)}
							<li>{feature}</li>
						{/each}
					</ul>
				{:else}
					<p>
						Clean title, documented service, no open recalls found in the local prototype data, and
						dealer review available before purchase.
					</p>
				{/if}
			</section>
		</div>

		<aside class="detail-sidebar">
			<FinancePanel {vehicle} />
			<OverviewSpecs {vehicle} />
			<DealerContactCard {dealer} {agent} />
		</aside>
	</div>
	<RelatedVehicles vehicles={related} />
</main>
