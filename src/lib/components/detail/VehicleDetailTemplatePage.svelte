<script lang="ts">
	import type { AuxeroVehicleDetailData } from '$lib/auxero/detail';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import { onMount } from 'svelte';
	import AuxeroVehicleMobileIsland from './AuxeroVehicleMobileIsland.svelte';

	let {
		afterDetailHtml,
		beforeDetailHtml,
		detail,
		detailHtml,
		pageDocument
	}: {
		afterDetailHtml: string;
		beforeDetailHtml: string;
		detail: AuxeroVehicleDetailData;
		detailHtml: string;
		pageDocument: AuxeroPageDocument;
	} = $props();

	const stripScripts = (html: string) => html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
	const scriptTags = (html: string) =>
		Array.from(html.matchAll(/<script\b[\s\S]*?<\/script>/gi), (match) => match[0]);

	let rawPageHtml = $derived(
		`${beforeDetailHtml}<div class="bohemcars-pdp-desktop">${detailHtml}</div>${afterDetailHtml}`
	);
	let renderedPageHtml = $derived(stripScripts(rawPageHtml));
	let deferredScriptTags = $derived(scriptTags(rawPageHtml));

	const appendDeferredScript = (scriptTag: string) =>
		new Promise<void>((resolve) => {
			const template = document.createElement('template');
			template.innerHTML = scriptTag.trim();
			const source = template.content.querySelector('script');

			if (!source) {
				resolve();
				return;
			}

			const script = document.createElement('script');
			for (const attribute of source.attributes) {
				script.setAttribute(attribute.name, attribute.value);
			}

			script.async = false;
			script.textContent = source.textContent;
			script.onload = () => resolve();
			script.onerror = () => resolve();
			document.body.appendChild(script);

			if (!script.src) {
				resolve();
			}
		});

	onMount(() => {
		const previousClassName = document.body.className;
		let cancelled = false;
		document.body.className = pageDocument.bodyClass;

		const loadDeferredScripts = async () => {
			for (const scriptTag of deferredScriptTags) {
				if (cancelled) return;
				await appendDeferredScript(scriptTag);
			}
		};

		void loadDeferredScripts();

		return () => {
			cancelled = true;
			document.body.className = previousClassName;
		};
	});
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<svelte:head>{@html pageDocument.headHtml}</svelte:head>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html renderedPageHtml}
<AuxeroVehicleMobileIsland {detail} />

<style>
	@media (max-width: 767.98px) {
		:global(.bohemcars-pdp-desktop) {
			display: none;
		}
	}
</style>
