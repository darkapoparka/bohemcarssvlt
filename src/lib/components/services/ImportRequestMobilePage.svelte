<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroServiceFormData } from '$lib/auxero/services';
	import { importRequestMobileCopy, importRequestSteps } from '$lib/auxero/services';
	import { bohemcarsContact } from '$lib/data/bohemcars';
	import InquiryForm from '$lib/components/forms/InquiryForm.svelte';
	import type { InquiryFormField } from '$lib/components/forms/types';
	import { Calculator, MessageCircle, PhoneCall } from '@lucide/svelte';

	let { form }: { form: AuxeroServiceFormData } = $props();

	/* Name + phone and date + service pair up so the form stays compact;
	   email and the listing link need the full row. */
	const inputOrder = [
		['name', 'bohemcars-import-mobile-form__half'],
		['phone', 'bohemcars-import-mobile-form__half'],
		['email', 'bohemcars-import-mobile-form__wide'],
		['date', 'bohemcars-import-mobile-form__half']
	] as const;

	const fields: InquiryFormField[] = $derived([
		...inputOrder.flatMap(([name, wrapperClass]) => {
			const field = form.fields.find((candidate) => candidate.name === name);
			return field ? [{ ...field, kind: 'input' as const, wrapperClass }] : [];
		}),
		{
			className: 'bohemcars-import-mobile-form__select',
			kind: 'select' as const,
			label: form.serviceLabel,
			name: form.serviceName,
			options: form.serviceOptions,
			wrapperClass: 'bohemcars-import-mobile-form__half'
		},
		{
			...form.vehicleField,
			kind: 'input' as const,
			wrapperClass: 'bohemcars-import-mobile-form__wide'
		}
	]);

	const hrefAttributes = (href: string) => ({
		href: href.startsWith('/') ? resolve(href as '/') : href
	});
</script>

<main class="bohemcars-import-mobile" data-bohemcars-import-mobile>
	<header class="bohemcars-import-mobile__appbar" aria-label="Bohemcars">
		<a class="bohemcars-import-mobile__brand" href={resolve('/')} aria-label="Bohemcars начало">
			<img
				src="/assets/bohemcars/brand/bohemcars-logo-concept-dark-template-clean-header2x.webp"
				alt="Bohemcars"
				width="180"
				height="33"
			/>
		</a>

		<div class="bohemcars-import-mobile__app-actions" aria-label="Контакт">
			<a
				class="bohemcars-import-mobile__icon-action"
				{...hrefAttributes(bohemcarsContact.primaryPhoneHref)}
				aria-label={bohemcarsContact.primaryPhoneLabel}
			>
				<PhoneCall size={18} strokeWidth={2.35} aria-hidden="true" />
			</a>
			<a
				class="bohemcars-import-mobile__icon-action"
				{...hrefAttributes(bohemcarsContact.viberHref)}
				aria-label="Пиши на Bohemcars"
			>
				<MessageCircle size={18} strokeWidth={2.35} aria-hidden="true" />
			</a>
		</div>
	</header>

	<section class="bohemcars-import-mobile__intro" aria-labelledby="import-mobile-title">
		<div class="bohemcars-import-mobile__intro-copy">
			<h1 id="import-mobile-title">{importRequestMobileCopy.title}</h1>
			<span>{importRequestMobileCopy.intro}</span>
		</div>
	</section>

	<section class="bohemcars-import-mobile__action-card" aria-label={form.title}>
		<span class="bohemcars-import-mobile__action-copy">
			<strong>Проверка от Bohemcars</strong>
			<span>Изпрати линк или VIN. Връщаме история, разходи и следващ ход.</span>
		</span>
		<img
			src="/assets/bohemcars/megamenu/inventory-audi-a7-cutout.webp"
			alt=""
			aria-hidden="true"
			loading="lazy"
		/>
	</section>

	<section class="bohemcars-import-mobile__form-section" aria-labelledby="import-mobile-form-title">
		<header class="bohemcars-import-mobile__form-header">
			<h2 id="import-mobile-form-title">{form.title}</h2>
			<span>Име, телефон и линк към обявата</span>
		</header>
		<InquiryForm
			{fields}
			buttonClass="bohemcars-import-mobile-form__submit"
			formClass="bohemcars-import-mobile-form"
			gridClass="bohemcars-import-mobile-form__grid"
			novalidate
			showEmptyStatus={false}
			statusClass="bohemcars-import-mobile-form__status"
			statusMessage="Заявката е запазена локално за Bohemcars."
			submitLabel={form.submitLabel}
		/>
	</section>

	<nav class="bohemcars-import-mobile__contact" aria-label="Контакт">
		<a {...hrefAttributes(bohemcarsContact.primaryPhoneHref)}>
			<PhoneCall size={19} strokeWidth={2.25} aria-hidden="true" />
			{bohemcarsContact.primaryPhoneLabel}
		</a>
		<a href={resolve('/calculator')}>
			<Calculator size={19} strokeWidth={2.25} aria-hidden="true" />
			Калкулатор
		</a>
		<a {...hrefAttributes(bohemcarsContact.viberHref)}>
			<MessageCircle size={19} strokeWidth={2.25} aria-hidden="true" />
			Пиши ни
		</a>
	</nav>

	<section class="bohemcars-import-mobile__steps" aria-label={importRequestMobileCopy.processLabel}>
		<p class="bohemcars-import-mobile__steps-title">{importRequestMobileCopy.processLabel}</p>
		{#each importRequestSteps as step, index (step.title)}
			<article>
				<span class="bohemcars-import-mobile__step-num" aria-hidden="true">{index + 1}</span>
				<div>
					<h2>{step.title}</h2>
					<p>{step.text}</p>
				</div>
			</article>
		{/each}
	</section>
</main>

<style>
	.bohemcars-import-mobile {
		position: relative;
		display: grid;
		gap: 10px;
		min-height: 100svh;
		align-content: start;
		overflow-x: hidden;
		background: var(--bc-surface);
		color: #111111;
		padding: 0 14px 92px;
	}

	.bohemcars-import-mobile__appbar {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		z-index: 20;
		display: flex;
		height: 74px;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		border: 0;
		background: transparent;
		padding: 12px 14px 0;
	}

	.bohemcars-import-mobile__brand {
		display: flex;
		min-width: 0;
		align-items: center;
		text-decoration: none !important;
	}

	.bohemcars-import-mobile__brand img {
		display: block;
		width: 150px;
		max-width: calc(100vw - 118px);
		height: auto;
		object-fit: contain;
	}

	.bohemcars-import-mobile__app-actions {
		display: flex;
		flex: 0 0 auto;
		align-items: center;
		gap: 7px;
	}

	.bohemcars-import-mobile__icon-action {
		display: flex;
		width: 38px;
		height: 38px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.94);
		color: #20350f;
		padding: 0;
		text-decoration: none !important;
		transition:
			background-color 0.18s ease,
			color 0.18s ease;
	}

	.bohemcars-import-mobile__icon-action:hover,
	.bohemcars-import-mobile__icon-action:focus-visible {
		background: #ffffff;
		color: #20350f;
		outline: 0;
	}

	.bohemcars-import-mobile__icon-action :global(svg),
	.bohemcars-import-mobile__icon-action :global(svg *) {
		color: currentColor;
		stroke: currentColor;
	}

	.bohemcars-import-mobile__intro {
		position: relative;
		display: grid;
		min-height: 180px;
		align-content: end;
		overflow: hidden;
		margin: 0 -14px;
		padding: 84px 14px 18px;
		background:
			linear-gradient(90deg, rgba(23, 31, 19, 0.97), rgba(23, 31, 19, 0.9)),
			url('/assets/bohemcars/services/import-canada-banner-generated.webp') 62% center / cover;
		box-shadow: inset 0 -1px 0 rgba(217, 242, 117, 0.36);
		color: #ffffff;
	}

	.bohemcars-import-mobile__intro::before {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			rgba(23, 31, 19, 0.98) 0%,
			rgba(23, 31, 19, 0.88) 58%,
			rgba(23, 31, 19, 0.72) 100%
		);
		content: '';
		pointer-events: none;
	}

	.bohemcars-import-mobile__intro-copy {
		position: relative;
		z-index: 2;
		display: grid;
		gap: 5px;
		min-width: 0;
		max-width: 330px;
	}

	.bohemcars-import-mobile__intro h1 {
		margin: 0;
		color: #ffffff;
		font-size: 27px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 31px;
	}

	.bohemcars-import-mobile__intro-copy span {
		display: block;
		max-width: 300px;
		color: rgba(255, 255, 255, 0.82);
		font-size: 14px;
		font-weight: 600;
		line-height: 18px;
	}

	.bohemcars-import-mobile__action-card {
		position: relative;
		isolation: isolate;
		display: block;
		min-height: 132px;
		overflow: hidden;
		border-radius: 8px 8px 0 0;
		background: #98bc2a;
		color: #14210f;
		padding: 17px 138px 16px 18px;
	}

	.bohemcars-import-mobile__action-copy {
		position: relative;
		z-index: 2;
		display: grid;
		gap: 6px;
		max-width: 200px;
		color: inherit;
	}

	.bohemcars-import-mobile__action-copy strong,
	.bohemcars-import-mobile__action-copy span {
		margin: 0;
		color: inherit;
		letter-spacing: 0;
	}

	.bohemcars-import-mobile__action-copy strong {
		font-size: 22px;
		font-weight: 800;
		line-height: 25px;
	}

	.bohemcars-import-mobile__action-copy span {
		max-width: 180px;
		font-size: 13.5px;
		font-weight: 600;
		line-height: 18px;
		opacity: 0.82;
	}

	.bohemcars-import-mobile__action-card img {
		position: absolute;
		right: -64px;
		bottom: -14px;
		z-index: 1;
		display: block;
		width: 236px;
		max-width: none;
		height: auto;
		object-fit: contain;
		pointer-events: none;
		user-select: none;
	}

	.bohemcars-import-mobile__form-section {
		position: relative;
		z-index: 3;
		display: grid;
		gap: 12px;
		min-width: 0;
		border: 0;
		border-radius: 8px;
		background: #ffffff;
		box-shadow: var(--bc-shadow-subtle);
		padding: 14px;
	}

	.bohemcars-import-mobile__form-header {
		display: grid;
		gap: 2px;
		min-width: 0;
	}

	.bohemcars-import-mobile__form-header h2 {
		margin: 0;
		color: #111111;
		font-size: 19px;
		font-weight: 800;
		letter-spacing: 0;
		line-height: 23px;
	}

	.bohemcars-import-mobile__form-header span {
		color: #626d7c;
		font-size: 13px;
		font-weight: 600;
		line-height: 17px;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form) {
		display: grid;
		gap: 12px;
		min-width: 0;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form__grid) {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
		min-width: 0;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form__half),
	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form__wide) {
		min-width: 0;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form__wide) {
		grid-column: 1 / -1;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form p) {
		margin: 0 0 5px;
		color: #4f5d57;
		font-size: 12px;
		font-weight: 700;
		line-height: 15px;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form input),
	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form select) {
		display: block;
		width: 100%;
		height: 46px !important;
		border: 0 !important;
		border-radius: 8px !important;
		background: var(--bc-surface-soft) !important;
		box-shadow: none !important;
		color: #111111;
		font-size: 16px !important;
		font-weight: 600;
		line-height: 22px !important;
		outline: 0;
		padding: 0 12px !important;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form select) {
		appearance: auto;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form input::placeholder) {
		color: #8f9892;
		opacity: 1;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form input:focus),
	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form select:focus) {
		background: #ffffff !important;
		box-shadow: 0 0 0 2px rgba(217, 242, 117, 0.7) !important;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form__submit) {
		display: flex;
		width: 100%;
		min-height: 48px;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 0;
		border-radius: 8px;
		background: #1c1c1c !important;
		color: #ffffff !important;
		cursor: pointer;
		font-size: 15px;
		font-weight: 800;
		line-height: 19px;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form__submit:hover),
	.bohemcars-import-mobile__form-section
		:global(.bohemcars-import-mobile-form__submit:focus-visible) {
		background: var(--bc-accent-bright-soft) !important;
		color: #111111 !important;
		outline: 0;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form__status) {
		margin: -2px 0 0;
		color: #4b5563;
		font-size: 14px;
		font-weight: 600;
		line-height: 18px;
	}

	.bohemcars-import-mobile__contact {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 0.78fr 0.7fr;
		gap: 8px;
	}

	.bohemcars-import-mobile__contact a {
		display: flex;
		min-height: 48px;
		min-width: 0;
		align-items: center;
		justify-content: center;
		gap: 7px;
		overflow: hidden;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-raised);
		box-shadow: var(--bc-shadow-subtle);
		padding: 0 9px;
		color: #111111;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.bohemcars-import-mobile__contact a:first-child {
		background: var(--bc-accent-bright-soft);
	}

	.bohemcars-import-mobile__steps {
		display: grid;
		gap: 7px;
	}

	.bohemcars-import-mobile__steps-title {
		margin: 3px 0 1px;
		color: #111111;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.04em;
		line-height: 16px;
		text-transform: uppercase;
	}

	.bohemcars-import-mobile__steps article {
		display: grid;
		grid-template-columns: 32px minmax(0, 1fr);
		gap: 11px;
		align-items: center;
		min-height: 60px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-raised);
		box-shadow: var(--bc-shadow-subtle);
		padding: 10px 14px;
		color: #111111;
	}

	.bohemcars-import-mobile__step-num {
		display: flex;
		width: 32px;
		height: 32px;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: #1c1c1c;
		color: var(--bc-accent-bright-soft);
		font-size: 14px;
		font-weight: 700;
		line-height: 1;
	}

	.bohemcars-import-mobile__steps h2,
	.bohemcars-import-mobile__steps p {
		margin: 0;
		letter-spacing: 0;
	}

	.bohemcars-import-mobile__steps h2 {
		color: #111111;
		font-size: 16px;
		font-weight: 700;
		line-height: 20px;
	}

	.bohemcars-import-mobile__steps p {
		margin-top: 2px;
		color: #56635a;
		font-size: 14px;
		font-weight: 500;
		line-height: 18px;
	}

	@media (max-width: 374px) {
		.bohemcars-import-mobile__intro {
			min-height: 176px;
		}

		.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form input),
		.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form select) {
			font-size: 15px !important;
			padding: 0 10px !important;
		}

		.bohemcars-import-mobile__app-actions {
			gap: 5px;
		}

		.bohemcars-import-mobile__icon-action {
			width: 36px;
			height: 36px;
		}

		.bohemcars-import-mobile__action-card {
			padding-right: 124px;
		}

		.bohemcars-import-mobile__action-card img {
			right: -82px;
		}
	}

	@media (max-width: 359px) {
		.bohemcars-import-mobile__intro h1 {
			font-size: 25px;
			line-height: 29px;
		}

		.bohemcars-import-mobile__brand img {
			width: 128px;
		}
	}
</style>
