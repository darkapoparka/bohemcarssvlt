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
