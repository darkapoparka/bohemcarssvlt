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
				src="/assets/bohemcars/brand/bohemcars-logo-concept-light-template-clean.webp"
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

	<section
		class="bohemcars-import-mobile__process"
		aria-label={importRequestMobileCopy.processLabel}
	>
		<header>
			<h2>{importRequestMobileCopy.processLabel}</h2>
			<span>Отговор до 24 ч</span>
		</header>
		{#each importRequestSteps as step, index (step.title)}
			<article>
				<span class="bohemcars-import-mobile__process-num" aria-hidden="true">{index + 1}</span>
				<div>
					<h3>{step.title}</h3>
					<p>{step.text}</p>
				</div>
			</article>
		{/each}
		<footer aria-label="Контакт">
			<a {...hrefAttributes(bohemcarsContact.primaryPhoneHref)}>
				<PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" />
				Обади се
			</a>
			<a href={resolve('/calculator')}>
				<Calculator size={18} strokeWidth={2.25} aria-hidden="true" />
				Калкулатор
			</a>
			<a {...hrefAttributes(bohemcarsContact.viberHref)}>
				<MessageCircle size={18} strokeWidth={2.25} aria-hidden="true" />
				Пиши ни
			</a>
		</footer>
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
		padding: max(12px, env(safe-area-inset-top)) 14px 0;
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
		/* The wordmark's green "CARS" sinks into the green chrome — force solid ink. */
		filter: brightness(0);
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
		background: #ffffff;
		box-shadow: inset 0 0 0 1px rgba(20, 33, 15, 0.14);
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

	/* Green chrome: flat brand green hero with dark ink and the vehicle cutout,
	   matching the homepage language instead of a dark photo banner. */
	.bohemcars-import-mobile__intro {
		position: relative;
		display: grid;
		min-height: 230px;
		align-content: start;
		overflow: hidden;
		margin: 0 -14px;
		/* Extra bottom room — the form card docks into the green below. */
		padding: 84px 148px 66px 14px;
		background: #8fca1a;
		color: #14210f;
	}

	.bohemcars-import-mobile__intro img {
		position: absolute;
		right: -42px;
		bottom: 52px;
		z-index: 1;
		display: block;
		width: 194px;
		max-width: none;
		height: auto;
		object-fit: contain;
		pointer-events: none;
		user-select: none;
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
		color: #14210f;
		font-size: 27px;
		font-weight: 800;
		letter-spacing: 0;
		line-height: 31px;
	}

	.bohemcars-import-mobile__intro-copy span {
		display: block;
		max-width: 300px;
		color: rgba(20, 33, 15, 0.78);
		font-size: 14px;
		font-weight: 600;
		line-height: 18px;
	}

	/* Docked into the green hero — the primary control lives in the chrome,
	   exactly like the homepage search pill. */
	.bohemcars-import-mobile__form-section {
		position: relative;
		z-index: 3;
		display: grid;
		gap: 12px;
		min-width: 0;
		margin-top: -52px;
		border: 0;
		border-radius: 8px;
		background: #ffffff;
		box-shadow: 0 14px 30px rgba(20, 33, 15, 0.12);
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
		border: 1px solid var(--bc-border) !important;
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

	/* One substantial dark process card (home's consultation-card language)
	   instead of three near-empty white strips and an orphan chip row. */
	.bohemcars-import-mobile__process {
		display: grid;
		gap: 13px;
		border-radius: 8px;
		background: #171f13;
		color: #ffffff;
		padding: 16px;
	}

	.bohemcars-import-mobile__process header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
	}

	.bohemcars-import-mobile__process h2 {
		margin: 0;
		color: #ffffff;
		font-size: 18px;
		font-weight: 800;
		letter-spacing: 0;
		line-height: 23px;
	}

	.bohemcars-import-mobile__process header span {
		flex: 0 0 auto;
		border-radius: 999px;
		background: rgba(217, 242, 117, 0.16);
		color: var(--bc-accent-bright-soft);
		font-size: 12px;
		font-weight: 700;
		line-height: 16px;
		padding: 5px 10px;
		white-space: nowrap;
	}

	.bohemcars-import-mobile__process article {
		display: grid;
		grid-template-columns: 30px minmax(0, 1fr);
		gap: 11px;
		align-items: start;
	}

	.bohemcars-import-mobile__process-num {
		display: flex;
		width: 30px;
		height: 30px;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: rgba(217, 242, 117, 0.14);
		color: var(--bc-accent-bright-soft);
		font-size: 14px;
		font-weight: 800;
		line-height: 1;
	}

	.bohemcars-import-mobile__process h3,
	.bohemcars-import-mobile__process article p {
		margin: 0;
		letter-spacing: 0;
	}

	.bohemcars-import-mobile__process h3 {
		color: #ffffff;
		font-size: 15px;
		font-weight: 700;
		line-height: 19px;
	}

	.bohemcars-import-mobile__process article p {
		margin-top: 3px;
		color: rgba(255, 255, 255, 0.72);
		font-size: 13.5px;
		font-weight: 500;
		line-height: 18px;
	}

	.bohemcars-import-mobile__process footer {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.15fr) minmax(0, 1fr);
		gap: 8px;
		margin-top: 1px;
	}

	.bohemcars-import-mobile__process footer a {
		display: flex;
		min-height: 48px;
		min-width: 0;
		align-items: center;
		justify-content: center;
		gap: 6px;
		overflow: hidden;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.08);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16);
		color: #ffffff;
		font-size: 13.5px;
		font-weight: 700;
		line-height: 17px;
		padding: 0 8px;
		text-decoration: none !important;
		white-space: nowrap;
	}

	.bohemcars-import-mobile__process footer a:first-child {
		background: var(--bc-accent-bright-soft);
		box-shadow: none;
		color: #14210f;
	}

	.bohemcars-import-mobile__process footer a :global(svg),
	.bohemcars-import-mobile__process footer a :global(svg *) {
		color: currentColor;
		stroke: currentColor;
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

		.bohemcars-import-mobile__intro {
			padding-right: 118px;
		}

		.bohemcars-import-mobile__intro img {
			right: -78px;
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
