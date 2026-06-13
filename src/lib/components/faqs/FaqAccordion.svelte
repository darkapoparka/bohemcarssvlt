<script lang="ts">
	import type { AuxeroFaq } from '$lib/auxero/faqs';
	import FaqAccordionItem from './FaqAccordionItem.svelte';

	let {
		forceWhite = false,
		items
	}: {
		forceWhite?: boolean;
		items: AuxeroFaq[];
	} = $props();

	// Svelte owns the open state (the template ships no accordion JS, so previously only the
	// first item was ever open). First item open by default; clicking an open item closes it.
	let openIndex = $state(0);

	const toggle = (index: number) => {
		openIndex = openIndex === index ? -1 : index;
	};
</script>

<div class="flat-accordion max-width-930 wow fadeIn flex flex-col gap-18" data-wow-delay=".3s">
	{#each items as faq, index (faq.question)}
		<FaqAccordionItem
			active={openIndex === index}
			{faq}
			{forceWhite}
			ontoggle={() => toggle(index)}
		/>
	{/each}
</div>
