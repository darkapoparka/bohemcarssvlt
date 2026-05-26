<script lang="ts">
	import type { AuxeroFaq } from '$lib/auxero/faqs';

	let {
		active,
		faq,
		forceWhite
	}: {
		active: boolean;
		faq: AuxeroFaq;
		forceWhite: boolean;
	} = $props();
</script>

<div class={`flat-toggle ${forceWhite ? 'bg-white' : ''} ${active ? 'active' : ''}`}>
	<div class={`toggle-title ${active ? 'active' : ''}`}>
		<p class="h5 title">{faq.question}</p>
		<span class="icon">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M20 15L12 7L4 15"
					stroke="#1C1C1C"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</span>
	</div>
	<div class="toggle-content">
		<p class="h7 text-secondary line-height-28">{faq.answer}</p>
	</div>
</div>
