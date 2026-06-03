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

	const setFormStatus = (form: HTMLFormElement, message: string) => {
		let status = form.querySelector<HTMLElement>('.auxero-form-status');

		if (!status) {
			status = document.createElement('p');
			status.className = 'auxero-form-status text-highlight font-weight-600 mt-12';
			status.setAttribute('aria-live', 'polite');
			form.appendChild(status);
		}

		status.textContent = message;
	};

	const handleRenderedSubmit = async (event: SubmitEvent) => {
		const form = event.target;

		if (
			!(form instanceof HTMLFormElement) ||
			!form.matches('.bohemcars-pdp-desktop form.send-inquiry')
		) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		const payload = Object.fromEntries(new FormData(form).entries());

		try {
			await fetch('/api/inquiries', {
				body: JSON.stringify({
					...payload,
					source: 'vehicle-detail',
					vehicleSlug: detail.slug
				}),
				headers: { 'content-type': 'application/json' },
				method: 'POST'
			});
		} catch {
			// Local confirmation remains available if the prototype API is unavailable.
		}

		setFormStatus(form, 'Inquiry sent to Bohemcars locally');
	};

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
<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html pageDocument.headHtml.replace(/<title>[\s\S]*?<\/title>/i, '')}
	<title>{detail.title} — Bohemcars</title>
</svelte:head>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<div onsubmit={handleRenderedSubmit}>{@html renderedPageHtml}</div>
<AuxeroVehicleMobileIsland {detail} />

<style>
	@media (max-width: 767.98px) {
		:global(.bohemcars-pdp-desktop) {
			display: none;
		}
	}
</style>
