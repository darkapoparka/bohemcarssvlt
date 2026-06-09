<script lang="ts">
	import { resolve } from '$app/paths';
	import { Mail, MapPin, MessageCircle, Navigation, PhoneCall, Plus, X } from '@lucide/svelte';
	import type { AuxeroContactFormData, AuxeroContactPageInfo } from '$lib/auxero/contact';
	import { bohemcarsAssets, bohemcarsContact } from '$lib/data/bohemcars';
	import InquiryForm from '$lib/components/forms/InquiryForm.svelte';
	import type { InquiryFormField } from '$lib/components/forms/types';

	let { form, info }: { form: AuxeroContactFormData; info: AuxeroContactPageInfo } = $props();

	const fields: InquiryFormField[] = $derived([
		...form.fields.map((field) => ({
			...field,
			kind: 'input' as const,
			required: true,
			wrapperClass: 'bohemcars-contact-mobile-form__field'
		})),
		{
			className: 'bohemcars-contact-mobile-form__message',
			id: 'contact-mobile-message',
			kind: 'textarea' as const,
			label: form.messageLabel,
			name: 'message',
			placeholder: form.messagePlaceholder,
			required: true,
			rows: 3,
			wrapperClass: 'bohemcars-contact-mobile-form__field'
		}
	]);

	const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		bohemcarsContact.addressLabel
	)}`;
	const hrefAttributes = (href: string) => ({
		href: href.startsWith('/') ? resolve(href as '/') : href
	});
</script>

<div class="bohemcars-contact-mobile" data-bohemcars-contact-mobile>
	<input
		id="contact-mobile-form-toggle"
		class="bohemcars-contact-mobile__sheet-toggle"
		type="checkbox"
		autocomplete="off"
		tabindex="-1"
		aria-hidden="true"
	/>

	<header class="bohemcars-contact-mobile__appbar">
		<a class="bohemcars-contact-mobile__brand" href={resolve('/')} aria-label="Bohemcars начало">
			<img src={bohemcarsAssets.logoLight} alt="Bohemcars" width="180" height="33" />
		</a>

		<div class="bohemcars-contact-mobile__app-actions" aria-label="Контакт">
			<a
				class="bohemcars-contact-mobile__icon-action"
				{...hrefAttributes(info.phoneHref)}
				aria-label={info.phoneLabel}
			>
				<PhoneCall size={18} strokeWidth={2.35} aria-hidden="true" />
			</a>
			<a
				class="bohemcars-contact-mobile__icon-action"
				{...hrefAttributes(mapHref)}
				target="_blank"
				rel="noreferrer"
				aria-label={info.officeLabel}
			>
				<MapPin size={18} strokeWidth={2.35} aria-hidden="true" />
			</a>
			<label
				for="contact-mobile-form-toggle"
				class="bohemcars-contact-mobile__icon-action bohemcars-contact-mobile__icon-action--primary"
				aria-label={form.submitLabel}
				aria-controls="contact-mobile-form-sheet"
				aria-haspopup="dialog"
			>
				<Plus size={20} strokeWidth={2.5} aria-hidden="true" />
			</label>
		</div>
	</header>

	<main class="bohemcars-contact-mobile__main">
		<section class="bohemcars-contact-mobile__hero" aria-labelledby="contact-mobile-title">
			<div>
				<p>{info.eyebrow}</p>
				<h1 id="contact-mobile-title">{info.title}</h1>
				<span>{info.description}</span>
			</div>
		</section>

		<nav class="bohemcars-contact-mobile__actions" aria-label="Бърз контакт">
			<a {...hrefAttributes(info.phoneHref)}>
				<PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" />
				Обади се
			</a>
			<a {...hrefAttributes(bohemcarsContact.viberHref)}>
				<MessageCircle size={18} strokeWidth={2.25} aria-hidden="true" />
				Пиши ни
			</a>
			<label
				for="contact-mobile-form-toggle"
				aria-label={form.submitLabel}
				aria-controls="contact-mobile-form-sheet"
				aria-haspopup="dialog"
			>
				<Plus size={18} strokeWidth={2.35} aria-hidden="true" />
				Форма
			</label>
		</nav>

		<section class="bohemcars-contact-mobile__info" aria-label="Данни за контакт">
			<article>
				<span><MapPin size={18} strokeWidth={2.25} aria-hidden="true" /></span>
				<div>
					<p>{info.officeLabel}</p>
					<strong>{bohemcarsContact.addressLabel}</strong>
					<small>{info.workNote}</small>
				</div>
			</article>
			<article>
				<span><PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" /></span>
				<div>
					<p>Телефон</p>
					<a {...hrefAttributes(info.phoneHref)}>{info.phoneLabel}</a>
					{#if info.secondaryPhoneHref !== info.phoneHref || info.secondaryPhoneLabel !== info.phoneLabel}
						<a {...hrefAttributes(info.secondaryPhoneHref)}>{info.secondaryPhoneLabel}</a>
					{/if}
				</div>
			</article>
			<article>
				<span><Mail size={18} strokeWidth={2.25} aria-hidden="true" /></span>
				<div>
					<p>Имейл</p>
					<a {...hrefAttributes(info.emailHref)}>{info.emailLabel}</a>
				</div>
			</article>
		</section>

		<section class="bohemcars-contact-mobile__map-card" aria-label="Локация">
			<div class="bohemcars-contact-mobile__map-preview" aria-hidden="true">
				<span class="road road-a"></span>
				<span class="road road-b"></span>
				<span class="road road-c"></span>
				<span class="pin"><MapPin size={24} strokeWidth={2.45} /></span>
			</div>
			<div>
				<p>Огледи с уговорка</p>
				<strong>{bohemcarsContact.addressLabel}</strong>
				<a {...hrefAttributes(mapHref)} target="_blank" rel="noreferrer">
					Отвори карта
					<Navigation size={17} strokeWidth={2.3} aria-hidden="true" />
				</a>
			</div>
		</section>
	</main>

	<div
		id="contact-mobile-form-sheet"
		class="bohemcars-contact-mobile-sheet"
		role="dialog"
		aria-modal="true"
		aria-labelledby="contact-mobile-form-title"
	>
		<label
			for="contact-mobile-form-toggle"
			class="bohemcars-contact-mobile-sheet__backdrop"
			aria-label="Затвори формата"
		></label>

		<div class="bohemcars-contact-mobile-sheet__panel">
			<span class="bohemcars-contact-mobile-sheet__handle" aria-hidden="true"></span>
			<header class="bohemcars-contact-mobile-sheet__header">
				<div>
					<p>Bohemcars</p>
					<h2 id="contact-mobile-form-title">{form.title}</h2>
				</div>
				<label for="contact-mobile-form-toggle" aria-label="Затвори">
					<X size={20} strokeWidth={2.3} aria-hidden="true" />
				</label>
			</header>

			<div class="bohemcars-contact-mobile-sheet__body">
				<InquiryForm
					{fields}
					buttonClass="bohemcars-contact-mobile-form__submit"
					formClass="bohemcars-contact-mobile-form"
					gridClass="bohemcars-contact-mobile-form__grid"
					novalidate
					showEmptyStatus={false}
					statusClass="bohemcars-contact-mobile-form__status"
					statusMessage="Съобщението е подготвено локално за Bohemcars."
					submitLabel={form.submitLabel}
				/>
			</div>
		</div>
	</div>
</div>

<style>
	.bohemcars-contact-mobile {
		position: relative;
		min-height: 100svh;
		overflow-x: hidden;
		background: var(--bc-bg);
		color: #111111;
	}

	.bohemcars-contact-mobile__sheet-toggle {
		position: fixed;
		width: 1px;
		height: 1px;
		overflow: hidden;
		opacity: 0;
		pointer-events: none;
	}

	.bohemcars-contact-mobile__appbar {
		display: flex;
		min-height: 66px;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		border-bottom: 1px solid var(--bc-border);
		background: rgba(251, 252, 250, 0.96);
		padding: max(10px, env(safe-area-inset-top)) 14px 8px;
		backdrop-filter: blur(12px);
	}

	.bohemcars-contact-mobile__brand {
		display: flex;
		min-width: 0;
		align-items: center;
		text-decoration: none !important;
	}

	.bohemcars-contact-mobile__brand img {
		display: block;
		width: 144px;
		max-width: calc(100vw - 154px);
		height: auto;
		object-fit: contain;
	}

	.bohemcars-contact-mobile__app-actions {
		display: flex;
		flex: 0 0 auto;
		align-items: center;
		gap: 7px;
	}

	.bohemcars-contact-mobile__icon-action {
		display: flex;
		width: 36px;
		height: 36px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 999px;
		background: var(--bc-surface);
		color: #1c1c1c;
		cursor: pointer;
		padding: 0;
		text-decoration: none !important;
	}

	.bohemcars-contact-mobile__icon-action--primary {
		background: #1c1c1c;
		color: #ffffff;
	}

	.bohemcars-contact-mobile__icon-action:hover,
	.bohemcars-contact-mobile__icon-action:focus-visible {
		background: var(--bc-accent-bright-soft);
		color: #14210f;
		outline: 0;
	}

	.bohemcars-contact-mobile__icon-action :global(svg),
	.bohemcars-contact-mobile__icon-action :global(svg *) {
		color: currentColor;
		stroke: currentColor;
	}

	.bohemcars-contact-mobile__main {
		display: grid;
		gap: 10px;
		padding: 12px 14px 92px;
	}

	.bohemcars-contact-mobile__hero {
		position: relative;
		display: grid;
		min-height: 164px;
		align-content: end;
		overflow: hidden;
		border-radius: 8px;
		background:
			linear-gradient(90deg, rgba(23, 31, 19, 0.95), rgba(23, 31, 19, 0.72)),
			url('/assets/bohemcars/proof-studio-import-handoff.webp') 58% center / cover;
		color: #ffffff;
		padding: 18px;
	}

	.bohemcars-contact-mobile__hero div {
		display: grid;
		gap: 5px;
		max-width: 310px;
	}

	.bohemcars-contact-mobile__hero p,
	.bohemcars-contact-mobile__hero h1,
	.bohemcars-contact-mobile__hero span {
		margin: 0;
		letter-spacing: 0;
	}

	.bohemcars-contact-mobile__hero p {
		color: #d9f275;
		font-size: 12px;
		font-weight: 900;
		line-height: 15px;
		text-transform: uppercase;
	}

	.bohemcars-contact-mobile__hero h1 {
		color: #ffffff;
		font-size: 30px;
		font-weight: 800;
		line-height: 34px;
	}

	.bohemcars-contact-mobile__hero span {
		color: rgba(255, 255, 255, 0.82);
		font-size: 14px;
		font-weight: 600;
		line-height: 19px;
	}

	.bohemcars-contact-mobile__actions {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
	}

	.bohemcars-contact-mobile__actions a,
	.bohemcars-contact-mobile__actions label {
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
		color: #111111;
		cursor: pointer;
		font-size: 14px;
		font-weight: 800;
		line-height: 18px;
		padding: 0 8px;
		text-decoration: none !important;
		white-space: nowrap;
	}

	.bohemcars-contact-mobile__actions a:first-child {
		background: var(--bc-accent-bright-soft);
		color: #14210f;
	}

	.bohemcars-contact-mobile__actions label:hover,
	.bohemcars-contact-mobile__actions a:hover,
	.bohemcars-contact-mobile__actions label:focus-visible,
	.bohemcars-contact-mobile__actions a:focus-visible {
		background: var(--bc-surface-hover);
		color: #111111;
		outline: 0;
	}

	.bohemcars-contact-mobile__info {
		display: grid;
		gap: 8px;
	}

	.bohemcars-contact-mobile__info article {
		display: flex;
		min-width: 0;
		align-items: flex-start;
		gap: 12px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-raised);
		padding: 13px;
	}

	.bohemcars-contact-mobile__info article > span {
		display: flex;
		width: 38px;
		height: 38px;
		align-items: center;
		justify-content: center;
		flex: 0 0 38px;
		border-radius: 8px;
		background: var(--bc-surface);
		color: #17220f;
	}

	.bohemcars-contact-mobile__info div {
		display: grid;
		gap: 2px;
		min-width: 0;
	}

	.bohemcars-contact-mobile__info p,
	.bohemcars-contact-mobile__info strong,
	.bohemcars-contact-mobile__info small,
	.bohemcars-contact-mobile__info a {
		margin: 0;
		letter-spacing: 0;
	}

	.bohemcars-contact-mobile__info p {
		color: #637184;
		font-size: 12px;
		font-weight: 900;
		line-height: 16px;
		text-transform: uppercase;
	}

	.bohemcars-contact-mobile__info strong,
	.bohemcars-contact-mobile__info a {
		color: #111111;
		font-size: 16px;
		font-weight: 800;
		line-height: 21px;
		overflow-wrap: anywhere;
		text-decoration: none !important;
	}

	.bohemcars-contact-mobile__info small {
		color: #5f6b58;
		font-size: 13px;
		font-weight: 600;
		line-height: 18px;
	}

	.bohemcars-contact-mobile__map-card {
		display: grid;
		grid-template-columns: 118px minmax(0, 1fr);
		gap: 12px;
		align-items: stretch;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-raised);
		padding: 10px;
	}

	.bohemcars-contact-mobile__map-card > div:last-child {
		display: grid;
		align-content: center;
		gap: 4px;
		min-width: 0;
	}

	.bohemcars-contact-mobile__map-card p,
	.bohemcars-contact-mobile__map-card strong {
		margin: 0;
		letter-spacing: 0;
	}

	.bohemcars-contact-mobile__map-card p {
		color: #5d7e16;
		font-size: 12px;
		font-weight: 900;
		line-height: 16px;
		text-transform: uppercase;
	}

	.bohemcars-contact-mobile__map-card strong {
		color: #111111;
		font-size: 16px;
		font-weight: 800;
		line-height: 21px;
	}

	.bohemcars-contact-mobile__map-card a {
		display: inline-flex;
		width: fit-content;
		min-height: 38px;
		align-items: center;
		gap: 7px;
		margin-top: 4px;
		border-radius: 999px;
		background: #1c1c1c;
		color: #ffffff;
		font-size: 13px;
		font-weight: 800;
		line-height: 16px;
		padding: 0 13px;
		text-decoration: none !important;
	}

	.bohemcars-contact-mobile__map-preview {
		position: relative;
		min-height: 118px;
		overflow: hidden;
		border-radius: 8px;
		background:
			linear-gradient(135deg, rgba(217, 242, 117, 0.28), rgba(255, 255, 255, 0.82)),
			var(--bc-surface);
	}

	.bohemcars-contact-mobile__map-preview::before,
	.bohemcars-contact-mobile__map-preview::after {
		position: absolute;
		inset: 16px;
		border: 1px solid rgba(28, 28, 28, 0.08);
		border-radius: 18px;
		content: '';
	}

	.bohemcars-contact-mobile__map-preview::after {
		inset: 42px -22px auto 26px;
		height: 42px;
		border-right: 0;
		border-left: 0;
		transform: rotate(-8deg);
	}

	.bohemcars-contact-mobile__map-preview .road {
		position: absolute;
		border-radius: 999px;
		background: rgba(28, 28, 28, 0.12);
	}

	.bohemcars-contact-mobile__map-preview .road-a {
		top: 25px;
		left: -20px;
		width: 76%;
		height: 8px;
		transform: rotate(13deg);
	}

	.bohemcars-contact-mobile__map-preview .road-b {
		right: -10px;
		bottom: 28px;
		width: 74%;
		height: 8px;
		transform: rotate(-20deg);
	}

	.bohemcars-contact-mobile__map-preview .road-c {
		top: 7px;
		left: 48%;
		width: 8px;
		height: 118px;
		transform: rotate(20deg);
	}

	.bohemcars-contact-mobile__map-preview .pin {
		position: absolute;
		top: 39px;
		left: 50%;
		display: flex;
		width: 46px;
		height: 46px;
		align-items: center;
		justify-content: center;
		border: 4px solid #ffffff;
		border-radius: 999px;
		background: var(--bc-accent-bright-soft);
		color: #111111;
		transform: translateX(-50%);
	}

	.bohemcars-contact-mobile-sheet {
		position: fixed;
		inset: 0;
		z-index: 1200;
		visibility: hidden;
		pointer-events: none;
	}

	#contact-mobile-form-toggle:checked ~ .bohemcars-contact-mobile-sheet {
		visibility: visible;
		pointer-events: auto;
	}

	.bohemcars-contact-mobile-sheet__backdrop {
		position: absolute;
		inset: 0;
		display: block;
		border: 0;
		background: rgba(28, 28, 28, 0.36);
		cursor: pointer;
		opacity: 0;
		padding: 0;
		transition: opacity 180ms ease;
	}

	#contact-mobile-form-toggle:checked
		~ .bohemcars-contact-mobile-sheet
		.bohemcars-contact-mobile-sheet__backdrop {
		opacity: 1;
	}

	.bohemcars-contact-mobile-sheet__panel {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		display: grid;
		max-height: min(88dvh, 720px);
		gap: 13px;
		grid-template-rows: max-content max-content minmax(0, 1fr);
		overflow: hidden;
		border-top: 1px solid var(--bc-border);
		border-radius: 22px 22px 0 0;
		background: var(--bc-bg);
		color: #111111;
		padding: 10px 16px max(20px, env(safe-area-inset-bottom));
		transform: translateY(100%);
		transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
		-webkit-overflow-scrolling: touch;
	}

	#contact-mobile-form-toggle:checked
		~ .bohemcars-contact-mobile-sheet
		.bohemcars-contact-mobile-sheet__panel {
		transform: translateY(0);
	}

	:global(body:has(#contact-mobile-form-toggle:checked)) {
		overflow: hidden;
	}

	.bohemcars-contact-mobile-sheet__handle {
		display: block;
		width: 42px;
		height: 5px;
		justify-self: center;
		border-radius: 999px;
		background: var(--bc-border);
	}

	.bohemcars-contact-mobile-sheet__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
	}

	.bohemcars-contact-mobile-sheet__header div {
		min-width: 0;
	}

	.bohemcars-contact-mobile-sheet__header p,
	.bohemcars-contact-mobile-sheet__header h2 {
		margin: 0;
		letter-spacing: 0;
	}

	.bohemcars-contact-mobile-sheet__header p {
		margin-bottom: 2px;
		color: #5d7e16;
		font-size: 12px;
		font-weight: 900;
		line-height: 16px;
		text-transform: uppercase;
	}

	.bohemcars-contact-mobile-sheet__header h2 {
		color: #111111;
		font-size: 21px;
		font-weight: 800;
		line-height: 26px;
	}

	.bohemcars-contact-mobile-sheet__header label {
		display: flex;
		width: 44px;
		height: 44px;
		align-items: center;
		justify-content: center;
		flex: 0 0 44px;
		border: 0;
		border-radius: 999px;
		background: var(--bc-surface);
		color: #111111;
		cursor: pointer;
		padding: 0;
	}

	.bohemcars-contact-mobile-sheet__body {
		min-height: 0;
		overflow-y: auto;
		padding-right: 1px;
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}

	.bohemcars-contact-mobile-sheet__body::-webkit-scrollbar {
		display: none;
	}

	.bohemcars-contact-mobile-sheet__body :global(.bohemcars-contact-mobile-form) {
		display: grid;
		gap: 13px;
		min-width: 0;
	}

	.bohemcars-contact-mobile-sheet__body :global(.bohemcars-contact-mobile-form__grid) {
		display: grid;
		gap: 9px;
		min-width: 0;
	}

	.bohemcars-contact-mobile-sheet__body :global(.bohemcars-contact-mobile-form__field) {
		min-width: 0;
	}

	.bohemcars-contact-mobile-sheet__body :global(.bohemcars-contact-mobile-form p) {
		margin: 0 0 6px;
		color: #111111;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
	}

	.bohemcars-contact-mobile-sheet__body :global(.bohemcars-contact-mobile-form input),
	.bohemcars-contact-mobile-sheet__body :global(.bohemcars-contact-mobile-form textarea) {
		display: block;
		width: 100%;
		border: 1px solid var(--bc-border) !important;
		border-radius: 8px !important;
		background: #ffffff !important;
		box-shadow: none !important;
		color: #111111;
		font-size: 16px !important;
		font-weight: 500;
		line-height: 22px !important;
		outline: 0;
		padding: 0 13px !important;
	}

	.bohemcars-contact-mobile-sheet__body :global(.bohemcars-contact-mobile-form input) {
		height: 48px !important;
	}

	.bohemcars-contact-mobile-sheet__body :global(.bohemcars-contact-mobile-form textarea) {
		min-height: 98px !important;
		padding-top: 12px !important;
		resize: vertical;
	}

	.bohemcars-contact-mobile-sheet__body :global(.bohemcars-contact-mobile-form input::placeholder),
	.bohemcars-contact-mobile-sheet__body
		:global(.bohemcars-contact-mobile-form textarea::placeholder) {
		color: #9ba0a5;
		opacity: 1;
	}

	.bohemcars-contact-mobile-sheet__body :global(.bohemcars-contact-mobile-form input:focus),
	.bohemcars-contact-mobile-sheet__body :global(.bohemcars-contact-mobile-form textarea:focus) {
		border-color: #8fbd24 !important;
	}

	.bohemcars-contact-mobile-sheet__body :global(.bohemcars-contact-mobile-form__submit) {
		display: flex;
		width: 100%;
		min-height: 50px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 8px;
		background: #1c1c1c !important;
		color: #ffffff !important;
		cursor: pointer;
		font-size: 16px;
		font-weight: 800;
		line-height: 20px;
	}

	.bohemcars-contact-mobile-sheet__body :global(.bohemcars-contact-mobile-form__submit:hover),
	.bohemcars-contact-mobile-sheet__body
		:global(.bohemcars-contact-mobile-form__submit:focus-visible) {
		background: #d9f275 !important;
		color: #111111 !important;
		outline: 0;
	}

	.bohemcars-contact-mobile-sheet__body :global(.bohemcars-contact-mobile-form__status) {
		margin: -2px 0 0;
		color: #4b5563;
		font-size: 14px;
		font-weight: 600;
		line-height: 18px;
	}

	@media (max-width: 359px) {
		.bohemcars-contact-mobile__hero h1 {
			font-size: 27px;
			line-height: 31px;
		}

		.bohemcars-contact-mobile__map-card {
			grid-template-columns: 1fr;
		}
	}
</style>
