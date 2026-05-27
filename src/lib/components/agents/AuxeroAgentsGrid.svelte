<script lang="ts">
	import type { AuxeroAgentCard as AuxeroAgentCardData } from '$lib/auxero/agents';
	import AuxeroAgentCard from './AuxeroAgentCard.svelte';

	let { cards }: { cards: AuxeroAgentCardData[] } = $props();
</script>

<div
	class="sm-grid-cols-1 lg-grid-cols-2 xl-gap-16 bohemcars-agent-grid grid grid-cols-4 gap-30"
	data-bohemcars-agent-management="false"
>
	{#each cards as card (card.slug)}
		<AuxeroAgentCard {card} />
	{/each}
</div>

<style>
	:global(.bohemcars-agent-grid .sale-agent-box:hover .sale-agent-title),
	:global(.bohemcars-agent-grid .sale-agent-box.active .sale-agent-title) {
		text-decoration: none;
	}

	:global(.bohemcars-agent-grid .sale-agent-social li a:hover),
	:global(.bohemcars-agent-grid .sale-agent-box .card-bottom .contact li a:hover) {
		border-color: #d6dbd1;
		background-color: #eef0ec;
	}

	:global(.bohemcars-agent-grid .sale-agent-box .card-top img) {
		transform: none;
		transition:
			filter 0.2s ease,
			opacity 0.2s ease;
	}

	:global(.bohemcars-agent-grid .sale-agent-box:hover .card-top img) {
		transform: none;
		filter: saturate(1.02);
	}
</style>
