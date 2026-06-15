<script lang="ts">
	import { resolve } from '$app/paths';
	import { Mail, MapPin, Navigation, PhoneCall } from '@lucide/svelte';
	import CleanSiteFooter from '$lib/components/layout/CleanSiteFooter.svelte';
	import CleanSiteHeader from '$lib/components/layout/CleanSiteHeader.svelte';
	import InquiryForm from '$lib/components/forms/InquiryForm.svelte';
	import type { InquiryFormField } from '$lib/components/forms/types';
	import type { AuxeroContactFormData, AuxeroContactPageInfo } from '$lib/auxero/contact';
	import type { HomeFiveFooterData, HomeFiveHeaderData } from '$lib/auxero/home-five';

	// Clean /contact — Auxero theme dropped. One responsive layout: a dark hero band
	// (proof studio image) carrying the contact details + the form card, then a light
	// section with quick-action shortcuts and the embedded map. Flat-card language,
	// green #98bc2a accents, Manrope, runes only. The form keeps the shared InquiryForm
	// so the native <form> field names + action are preserved 1:1.
	let {
		form,
		info,
		header,
		footer
	}: {
		form: AuxeroContactFormData;
		info: AuxeroContactPageInfo;
		header: HomeFiveHeaderData;
		footer: HomeFiveFooterData;
	} = $props();

	// External (tel:/mailto:/https:) hrefs pass through untouched; internal start with `/`.
	const linkHref = (href: string) => (href.startsWith('/') ? resolve(href as '/') : href);

	const hasSecondaryPhone = $derived(
		info.secondaryPhoneHref !== info.phoneHref || info.secondaryPhoneLabel !== info.phoneLabel
	);

	// Map the typed contact form to the shared InquiryForm field list — same field
	// names/types as the legacy ContactFormCard so the submitted payload is identical.
	const fields: InquiryFormField[] = $derived([
		...form.fields.map((field) => ({
			...field,
			kind: 'input' as const,
			required: true,
			wrapperClass: 'bc-contact-field'
		})),
		{
			className: 'bc-contact-message',
			id: 'message',
			kind: 'textarea' as const,
			label: form.messageLabel,
			name: 'message',
			placeholder: form.messagePlaceholder,
			required: true,
			rows: 3,
			wrapperClass: 'bc-contact-field bc-contact-field--full'
		}
	]);

	const mapHref = $derived(
		`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(info.officeLabel)}`
	);
</script>

<CleanSiteHeader {header} pathname="/contact" />

<main class="bg-bc-bg font-bc-body text-bc-ink">
	<!-- ===== Dark hero band: details (left) + form card (right) ===== -->
	<section class="relative isolate overflow-hidden bg-bc-ink" aria-labelledby="contact-title">
		<!-- proof studio backdrop + dark gradient (z-0); content sits at z-10 -->
		<div
			class="absolute inset-0 -z-0 bg-cover bg-center"
			style="background-image: linear-gradient(90deg, rgb(0 0 0 / 0.82), rgb(0 0 0 / 0.5)), url('/assets/bohemcars/proof-studio-import-handoff.webp');"
			aria-hidden="true"
		></div>

		<div class="bc-container relative z-10 grid gap-10 py-12 md:py-16 lg:grid-cols-2 lg:gap-14">
			<!-- Contact details -->
			<div class="max-w-[600px] text-white">
				<p class="text-sm font-bold tracking-[0.14em] text-bc-accent-bright-soft uppercase">
					{info.eyebrow}
				</p>
				<h1
					id="contact-title"
					class="mt-3 text-[clamp(1.85rem,4vw,2.65rem)] leading-tight font-bold text-white"
				>
					{info.title}
				</h1>
				<p class="mt-4 max-w-[520px] text-[1.0625rem] leading-relaxed text-white/85">
					{info.description}
				</p>

				<div class="mt-9 flex flex-col gap-5">
					<!-- Office -->
					<div class="flex items-start gap-4">
						<span
							class="grid h-12 w-12 shrink-0 place-items-center rounded-bc-md border border-white/25 bg-white/10 text-bc-accent-bright-soft"
						>
							<MapPin size={20} strokeWidth={2.2} aria-hidden="true" />
						</span>
						<div>
							<p class="text-lg font-semibold text-white">{info.officeLabel}</p>
							<p class="mt-0.5 text-white/80">{info.workNote}</p>
						</div>
					</div>

					<!-- Phones -->
					<div class="flex items-start gap-4">
						<span
							class="grid h-12 w-12 shrink-0 place-items-center rounded-bc-md border border-white/25 bg-white/10 text-bc-accent-bright-soft"
						>
							<PhoneCall size={20} strokeWidth={2.2} aria-hidden="true" />
						</span>
						<div class="flex flex-col gap-1">
							<a
								href={linkHref(info.phoneHref)}
								class="text-lg font-semibold text-white transition-colors hover:text-bc-accent-bright-soft"
							>
								{info.phoneLabel}
							</a>
							{#if hasSecondaryPhone}
								<a
									href={linkHref(info.secondaryPhoneHref)}
									class="text-lg font-semibold text-white transition-colors hover:text-bc-accent-bright-soft"
								>
									{info.secondaryPhoneLabel}
								</a>
							{/if}
						</div>
					</div>

					<!-- Email -->
					<div class="flex items-start gap-4">
						<span
							class="grid h-12 w-12 shrink-0 place-items-center rounded-bc-md border border-white/25 bg-white/10 text-bc-accent-bright-soft"
						>
							<Mail size={20} strokeWidth={2.2} aria-hidden="true" />
						</span>
						<a
							href={linkHref(info.emailHref)}
							class="self-center text-lg font-semibold text-white transition-colors hover:text-bc-accent-bright-soft"
						>
							{info.emailLabel}
						</a>
					</div>
				</div>

				<!-- Socials (legacy SVG glyphs, forced white over the dark hero) -->
				<ul class="mt-8 flex items-center gap-3">
					{#each info.socials as social (social.label)}
						<li>
							<a
								href={linkHref(social.href)}
								target="_blank"
								rel="noreferrer"
								aria-label={social.label}
								class="bc-contact-social flex h-11 w-11 items-center justify-center rounded-bc-md border border-white/25 bg-white/10 transition-colors hover:border-bc-accent hover:bg-bc-accent"
							>
								<img
									src={`/assets/icons/${social.icon}`}
									alt=""
									width="19"
									height="19"
									aria-hidden="true"
								/>
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Form card -->
			<div class="bc-contact-card rounded-bc-md border border-bc-border bg-white p-6 md:p-8">
				<p class="text-2xl leading-tight font-bold text-bc-ink md:text-[1.75rem]">{form.title}</p>
				<p class="mt-2 text-bc-muted">{form.subtitle}</p>

				<div class="mt-6">
					<InquiryForm
						{fields}
						buttonClass="bc-contact-submit"
						formClass="bc-contact-form"
						gridClass="bc-contact-grid"
						showEmptyStatus={false}
						statusClass="bc-contact-status"
						statusMessage="Съобщението е подготвено локално за Bohemcars."
						submitLabel={form.submitLabel}
					/>
				</div>
			</div>
		</div>
	</section>

	<!-- ===== Light section: quick actions + map ===== -->
	<section class="bc-container py-12 md:py-16">
		<div class="grid gap-3 sm:grid-cols-3">
			<a
				href={linkHref(info.phoneHref)}
				class="bc-calm-hover flex min-h-[56px] items-center justify-center gap-2.5 rounded-bc-md bg-bc-accent px-5 font-semibold text-bc-accent-contrast hover:bg-bc-hover-accent hover:text-white"
			>
				<PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" />
				Обади се
			</a>
			<a
				href={linkHref(info.emailHref)}
				class="bc-calm-hover flex min-h-[56px] items-center justify-center gap-2.5 rounded-bc-md border border-bc-border bg-white px-5 font-semibold text-bc-ink"
			>
				<Mail size={18} strokeWidth={2.25} aria-hidden="true" />
				Пиши ни
			</a>
			<a
				href={mapHref}
				target="_blank"
				rel="noreferrer"
				class="bc-calm-hover flex min-h-[56px] items-center justify-center gap-2.5 rounded-bc-md border border-bc-border bg-white px-5 font-semibold text-bc-ink"
			>
				<Navigation size={18} strokeWidth={2.25} aria-hidden="true" />
				Отвори карта
			</a>
		</div>

		<div class="mt-8 overflow-hidden rounded-bc-md border border-bc-border bg-white">
			<div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
				<div>
					<p class="text-sm font-bold tracking-[0.12em] text-bc-subtle uppercase">
						{info.officeLabel}
					</p>
					<p class="mt-0.5 text-lg font-semibold text-bc-ink">{info.workNote}</p>
				</div>
				<a
					href={mapHref}
					target="_blank"
					rel="noreferrer"
					class="inline-flex items-center gap-2 text-sm font-semibold text-bc-accent-contrast transition-colors hover:text-bc-hover-accent"
				>
					<MapPin size={16} strokeWidth={2.3} aria-hidden="true" />
					Виж локацията
				</a>
			</div>
			<iframe
				title="Bohemcars appointment area"
				src={info.mapSrc}
				height="420"
				class="block w-full border-0"
				style="border:0;"
				allowfullscreen
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
			></iframe>
		</div>
	</section>
</main>

<CleanSiteFooter {footer} />

<style>
	/* Social glyphs are legacy single-tone SVGs; force them white over the dark hero,
	   then dark-ink when the disc turns green on hover. */
	.bc-contact-social img {
		filter: brightness(0) invert(1);
		transition: filter var(--bc-motion-hover);
	}

	.bc-contact-social:hover img,
	.bc-contact-social:focus-visible img {
		filter: brightness(0) saturate(100%) invert(11%) sepia(18%) saturate(1500%) hue-rotate(58deg)
			brightness(95%) contrast(95%);
	}

	/* Form card hardening — the shared InquiryForm ships Auxero utility classes; here we
	   restyle its inputs to the flat-card language with bc-* tokens. Scoped via the card. */
	.bc-contact-card :global(.bc-contact-form) {
		display: grid;
		gap: 18px;
	}

	.bc-contact-card :global(.bc-contact-grid) {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px 16px;
	}

	.bc-contact-card :global(.bc-contact-field) {
		min-width: 0;
	}

	.bc-contact-card :global(.bc-contact-field--full) {
		grid-column: 1 / -1;
	}

	.bc-contact-card :global(.bc-contact-form p) {
		margin: 0 0 6px;
		color: var(--bc-ink);
		font-size: 14px;
		font-weight: 600;
		line-height: 18px;
	}

	.bc-contact-card :global(.bc-contact-form input),
	.bc-contact-card :global(.bc-contact-form textarea) {
		display: block;
		width: 100%;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-md);
		background: #ffffff;
		color: var(--bc-ink);
		font-family: var(--bc-font-body);
		font-size: 16px;
		line-height: 22px;
		outline: 0;
		padding: 0 14px;
		transition:
			border-color var(--bc-motion-hover),
			box-shadow var(--bc-motion-hover);
	}

	.bc-contact-card :global(.bc-contact-form input) {
		height: 48px;
	}

	.bc-contact-card :global(.bc-contact-form textarea) {
		min-height: 116px;
		padding-top: 12px;
		resize: vertical;
	}

	.bc-contact-card :global(.bc-contact-form input::placeholder),
	.bc-contact-card :global(.bc-contact-form textarea::placeholder) {
		color: var(--bc-muted-light);
		opacity: 1;
	}

	.bc-contact-card :global(.bc-contact-form input:focus),
	.bc-contact-card :global(.bc-contact-form textarea:focus) {
		border-color: var(--bc-accent);
		box-shadow: 0 0 0 3px rgb(152 188 42 / 0.22);
	}

	.bc-contact-card :global(.bc-contact-submit) {
		display: flex;
		width: 100%;
		min-height: 50px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: var(--bc-radius-md);
		background: var(--bc-accent);
		color: var(--bc-accent-contrast);
		cursor: pointer;
		font-family: var(--bc-font-body);
		font-size: 16px;
		font-weight: 700;
		line-height: 20px;
		transition:
			background-color var(--bc-motion-hover),
			color var(--bc-motion-hover);
	}

	.bc-contact-card :global(.bc-contact-submit:hover),
	.bc-contact-card :global(.bc-contact-submit:focus-visible) {
		background: var(--bc-hover-accent);
		color: #ffffff;
		outline: 0;
	}

	.bc-contact-card :global(.bc-contact-status) {
		margin: 0;
		color: var(--bc-subtle);
		font-size: 14px;
		font-weight: 600;
		line-height: 18px;
	}

	@media (max-width: 640px) {
		.bc-contact-card :global(.bc-contact-grid) {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
