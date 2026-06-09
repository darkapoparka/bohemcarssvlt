<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroServiceFormData } from '$lib/auxero/services';
	import { importRequestMobileCopy } from '$lib/auxero/services';
	import { bohemcarsAssets, bohemcarsContact } from '$lib/data/bohemcars';
	import InquiryForm from '$lib/components/forms/InquiryForm.svelte';
	import type { InquiryFormField } from '$lib/components/forms/types';
	import { MessageCircle, PhoneCall } from '@lucide/svelte';

	let { form }: { form: AuxeroServiceFormData } = $props();

	const fields: InquiryFormField[] = $derived([
		...form.fields.map((field) => ({
			...field,
			kind: 'input' as const
		})),
		{
			className: 'bohemcars-import-mobile-form__select',
			kind: 'select' as const,
			label: form.serviceLabel,
			name: form.serviceName,
			options: form.serviceOptions
		},
		{
			...form.vehicleField,
			kind: 'input' as const
		}
	]);

	const hrefAttributes = (href: string) => ({
		href: href.startsWith('/') ? resolve(href as '/') : href
	});
</script>

<main class="bohemcars-import-mobile" data-bohemcars-import-mobile>
	<header class="bohemcars-import-mobile__appbar" aria-label="Bohemcars">
		<a class="bohemcars-import-mobile__brand" href={resolve('/')} aria-label="Bohemcars начало">
			<img src={bohemcarsAssets.logoLight} alt="Bohemcars" width="180" height="33" />
		</a>

		<div class="bohemcars-import-mobile__app-actions" aria-label="Контакт">
			<a
				class="bohemcars-import-mobile__icon-action"
				{...hrefAttributes(bohemcarsContact.primaryPhoneHref)}
				aria-label={bohemcarsContact.primaryPhoneLabel}
			>
				<PhoneCall size={19} strokeWidth={2.35} aria-hidden="true" />
			</a>
			<a
				class="bohemcars-import-mobile__icon-action"
				{...hrefAttributes(bohemcarsContact.viberHref)}
				aria-label="Пиши на Bohemcars"
			>
				<MessageCircle size={19} strokeWidth={2.35} aria-hidden="true" />
			</a>
		</div>
	</header>

	<section class="bohemcars-import-mobile__intro" aria-labelledby="import-mobile-title">
		<h1 id="import-mobile-title">{importRequestMobileCopy.title}</h1>
		<p>{importRequestMobileCopy.intro}</p>
	</section>

	<section class="bohemcars-import-mobile__form-section" aria-labelledby="import-mobile-form-title">
		<h2 id="import-mobile-form-title">{form.title}</h2>
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
</main>

<style>
	.bohemcars-import-mobile {
		display: grid;
		gap: 12px;
		min-height: 100svh;
		overflow-x: hidden;
		background: #ffffff;
		color: #111111;
		padding: 0 14px 92px;
	}

	.bohemcars-import-mobile__appbar {
		display: flex;
		min-height: 68px;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		background: #ffffff;
		padding-top: max(10px, env(safe-area-inset-top));
	}

	.bohemcars-import-mobile__brand {
		display: flex;
		min-width: 0;
		align-items: center;
		text-decoration: none !important;
	}

	.bohemcars-import-mobile__brand img {
		display: block;
		width: 164px;
		max-width: calc(100vw - 118px);
		height: auto;
		object-fit: contain;
	}

	.bohemcars-import-mobile__app-actions {
		display: flex;
		flex: 0 0 auto;
		align-items: center;
		gap: 8px;
	}

	.bohemcars-import-mobile__icon-action {
		display: flex;
		width: 42px;
		height: 42px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 999px;
		background: #f2f6ea;
		color: #1c1c1c;
		padding: 0;
		text-decoration: none !important;
	}

	.bohemcars-import-mobile__icon-action:hover,
	.bohemcars-import-mobile__icon-action:focus-visible {
		background: #d9f275;
		color: #14210f;
		outline: 0;
	}

	.bohemcars-import-mobile__icon-action :global(svg),
	.bohemcars-import-mobile__icon-action :global(svg *) {
		color: currentColor;
		stroke: currentColor;
	}

	.bohemcars-import-mobile__intro {
		display: grid;
		gap: 4px;
		min-width: 0;
	}

	.bohemcars-import-mobile__intro h1,
	.bohemcars-import-mobile__intro p {
		margin: 0;
		letter-spacing: 0;
	}

	.bohemcars-import-mobile__intro h1 {
		color: #111111;
		font-size: 31px;
		font-weight: 800;
		line-height: 35px;
	}

	.bohemcars-import-mobile__intro p {
		color: #626d7c;
		font-size: 15px;
		font-weight: 600;
		line-height: 20px;
	}

	.bohemcars-import-mobile__form-section {
		display: grid;
		gap: 13px;
		min-width: 0;
		border-radius: 8px;
		background: #ffffff;
		padding: 0;
	}

	.bohemcars-import-mobile__form-section h2 {
		margin: 0;
		color: #111111;
		font-size: 22px;
		font-weight: 800;
		letter-spacing: 0;
		line-height: 27px;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form) {
		display: grid;
		gap: 13px;
		min-width: 0;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form__grid) {
		display: grid;
		gap: 10px;
		min-width: 0;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form__grid > div) {
		min-width: 0;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form p) {
		margin: 0 0 6px;
		color: #111111;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form input),
	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form select) {
		display: block;
		width: 100%;
		height: 48px !important;
		border: 0 !important;
		border-radius: 8px !important;
		background: #f5f9ec !important;
		box-shadow: none !important;
		color: #111111;
		font-size: 16px !important;
		font-weight: 500;
		line-height: 22px !important;
		outline: 0;
		padding: 0 14px !important;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form select) {
		appearance: auto;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form input::placeholder) {
		color: #9ba0a5;
		opacity: 1;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form input:focus),
	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form select:focus) {
		outline: 2px solid #d9f275;
		outline-offset: 2px;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form__submit) {
		display: flex;
		width: 100%;
		min-height: 52px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 8px;
		background: #d9f275 !important;
		color: #111111 !important;
		cursor: pointer;
		font-size: 16px;
		font-weight: 800;
		line-height: 20px;
	}

	.bohemcars-import-mobile__form-section :global(.bohemcars-import-mobile-form__submit:hover),
	.bohemcars-import-mobile__form-section
		:global(.bohemcars-import-mobile-form__submit:focus-visible) {
		background: #cfee50 !important;
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
</style>
