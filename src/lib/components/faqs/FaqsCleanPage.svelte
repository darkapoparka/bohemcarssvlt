<script lang="ts">
	import CleanSiteFooter from '$lib/components/layout/CleanSiteFooter.svelte';
	import CleanSiteHeader from '$lib/components/layout/CleanSiteHeader.svelte';
	import type { AuxeroFaq, AuxeroFaqGroup } from '$lib/auxero/faqs';
	import type { HomeFiveFooterData, HomeFiveHeaderData } from '$lib/auxero/home-five';

	// Clean /faqs — 1:1 with the original: a centered single column, a centered group
	// title above each group, and white accordion rows (native <details>, chevron).
	// No sidebar, no number-chip cards, no breadcrumb/intro/CTA — matches the themed page.
	let {
		featured,
		groups,
		header,
		footer
	}: {
		featured: AuxeroFaq[];
		groups: AuxeroFaqGroup[];
		header: HomeFiveHeaderData;
		footer: HomeFiveFooterData;
	} = $props();
</script>

{#snippet faqList(items: AuxeroFaq[])}
	<div class="mx-auto flex w-full max-w-[850px] flex-col gap-3">
		{#each items as faq (faq.question)}
			<details class="group rounded-bc-md border border-bc-border bg-white">
				<summary
					class="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 select-none [&::-webkit-details-marker]:hidden"
				>
					<span class="text-[1.0625rem] font-semibold text-bc-ink">{faq.question}</span>
					<svg
						class="h-5 w-5 shrink-0 text-bc-ink transition-transform duration-200 group-open:rotate-180"
						viewBox="0 0 24 24"
						fill="none"
						aria-hidden="true"
					>
						<path
							d="M6 9L12 15L18 9"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</summary>
				<div class="border-t border-bc-border px-5 pt-4 pb-5">
					<p class="leading-[1.75] text-bc-ink-soft">{faq.answer}</p>
				</div>
			</details>
		{/each}
	</div>
{/snippet}

<CleanSiteHeader {header} pathname="/faqs" />

<main class="bg-bc-bg font-bc-body">
	<div class="bc-container py-12 md:py-16">
		<h1 class="text-[clamp(1.85rem,3.6vw,2.5rem)] leading-tight font-semibold text-bc-ink">
			Често задавани въпроси
		</h1>

		<!-- Featured group -->
		<section class="mt-10 md:mt-12">
			<h2 class="mb-6 text-center text-xl font-semibold text-bc-ink md:text-2xl">
				Съдействие от Bohemcars
			</h2>
			{@render faqList(featured)}
		</section>

		<!-- Topical groups -->
		{#each groups as group (group.title)}
			<section class="mt-12 md:mt-14">
				<h2 class="mb-6 text-center text-xl font-semibold text-bc-ink md:text-2xl">
					{group.title}
				</h2>
				{@render faqList(group.items)}
			</section>
		{/each}
	</div>
</main>

<CleanSiteFooter {footer} />
