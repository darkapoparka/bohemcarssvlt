<script lang="ts">
	import { MapPin, MessageCircle, Phone, ShieldCheck } from '@lucide/svelte';
	import type { Agent } from '$lib/data/agents';
	import type { Dealer } from '$lib/data/dealers';

	interface Props {
		dealer: Dealer;
		agent: Agent;
	}

	let { dealer, agent }: Props = $props();
	let contacted = $state(false);
</script>

<section class="detail-side-card dealer-contact">
	<div class="dealer-contact__person">
		<img src={agent.image} alt={agent.name} />
		<div>
			<a href={`/agents/${agent.slug}`}>{agent.name}</a>
			<p><ShieldCheck size={16} /> Verified Dealer</p>
		</div>
	</div>

	<ul class="dealer-contact__info">
		<li>
			<MapPin size={20} />
			<span>{dealer.address}</span>
		</li>
		<li>
			<Phone size={20} />
			<span>{dealer.phone}<br />{agent.phone}</span>
		</li>
	</ul>

	<button class="btn btn-primary" type="button" onclick={() => (contacted = true)}>
		<Phone size={18} />
		Call To Dealer
	</button>
	<button class="btn btn-secondary" type="button" onclick={() => (contacted = true)}>
		<MessageCircle size={18} />
		Chat via WhatsApp
	</button>
	{#if contacted}
		<p class="form-note">Request captured. {agent.name} will follow up from {dealer.name}.</p>
	{/if}
</section>
