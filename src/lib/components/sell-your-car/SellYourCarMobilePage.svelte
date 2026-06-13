<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		ArrowRight,
		Camera,
		MapPin,
		MessageCircle,
		Navigation,
		PhoneCall,
		X
	} from '@lucide/svelte';
	import type {
		AuxeroSellCarFormData,
		AuxeroSellCarMobileCopy,
		AuxeroSellCarMobileStep
	} from '$lib/auxero/sell-your-car';
	import { bohemcarsContact } from '$lib/data/bohemcars';
	import { Drawer } from 'vaul-svelte';
	import MobileAppbar from '$lib/components/layout/MobileAppbar.svelte';
	import SellCarWizard from './SellCarWizard.svelte';

	let {
		copy,
		form,
		steps
	}: {
		copy: AuxeroSellCarMobileCopy;
		form: AuxeroSellCarFormData;
		steps: AuxeroSellCarMobileStep[];
	} = $props();

	let submitted = $state(false);
	let wizardOpen = $state(false);
	/* Editable copies of the fast-form values so the wizard can prefill
	   from whatever the visitor already typed. */
	// svelte-ignore state_referenced_locally
	let fieldValues = $state(
		Object.fromEntries(form.fields.map((field) => [field.name, field.value ?? ''])) as Record<
			string,
			string
		>
	);

	const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		bohemcarsContact.addressLabel
	)}`;
	const hrefAttributes = (href: string) => ({
		href: href.startsWith('/') ? resolve(href as '/') : href
	});

	const handleSubmit = (event: SubmitEvent) => {
		event.preventDefault();
		submitted = true;
	};
</script>

<div class="bohemcars-sell-mobile">
	<input
		id="sell-mobile-location-toggle"
		class="bohemcars-sell-mobile__sheet-toggle"
		type="checkbox"
		autocomplete="off"
		tabindex="-1"
		aria-hidden="true"
	/>

	<MobileAppbar actionsLabel={copy.contactLabel} logoAlt={copy.logoAlt}>
		<label
			for="sell-mobile-location-toggle"
			aria-label={bohemcarsContact.addressLabel}
			aria-controls="sell-mobile-location-sheet"
			aria-haspopup="dialog"
		>
			<MapPin size={18} strokeWidth={2.35} aria-hidden="true" />
		</label>
		<a
			{...hrefAttributes(bohemcarsContact.primaryPhoneHref)}
			aria-label={bohemcarsContact.primaryPhoneLabel}
		>
			<PhoneCall size={18} strokeWidth={2.35} aria-hidden="true" />
		</a>
		<a {...hrefAttributes(bohemcarsContact.viberHref)} aria-label={copy.messageLabel}>
			<MessageCircle size={18} strokeWidth={2.35} aria-hidden="true" />
		</a>
	</MobileAppbar>

	<main class="bohemcars-sell-mobile__main">
		<section class="bohemcars-sell-mobile__intro" aria-labelledby="sell-mobile-title">
			<div class="bohemcars-sell-mobile__intro-copy">
				<h1 id="sell-mobile-title">{copy.title}</h1>
				<span>Изпрати VIN, пробег и телефон — екипът връща реален следващ ход.</span>
			</div>
		</section>

		<form
			class="bohemcars-sell-mobile__inline-drawer"
			aria-label={copy.formTitle}
			onsubmit={handleSubmit}
		>
			<header class="bohemcars-sell-mobile__inline-header">
				<div>
					<strong>{copy.submitLabel}</strong>
					<span>VIN, пробег, цена и телефон</span>
				</div>
			</header>

			<div class="bohemcars-sell-mobile__inline-fields">
				{#each form.fields as field (field.id)}
					<label
						class:bohemcars-sell-mobile__inline-field--wide={field.name === 'vin' ||
							field.name === 'phone'}
						for={`inline-${field.id}`}
					>
						<span>{field.mobileLabel}</span>
						<input
							id={`inline-${field.id}`}
							name={field.name}
							type={field.type}
							placeholder={field.mobilePlaceholder}
							required={field.required}
							autocomplete={field.autocomplete}
							inputmode={field.inputMode}
							bind:value={fieldValues[field.name]}
						/>
					</label>
				{/each}
			</div>

			<button class="bohemcars-sell-mobile__inline-submit" type="submit">
				{copy.submitLabel}
				<ArrowRight size={18} strokeWidth={2.3} aria-hidden="true" />
			</button>

			<button
				class="bohemcars-sell-mobile__wizard-cta"
				type="button"
				onclick={() => (wizardOpen = true)}
			>
				<Camera size={17} strokeWidth={2.2} aria-hidden="true" />
				Добави снимки и детайли — по-точна оферта
			</button>

			{#if submitted}
				<p class="bohemcars-sell-mobile__status">
					{copy.statusMessage}
				</p>
			{/if}
		</form>

		<section class="bohemcars-sell-mobile__process" aria-label={copy.stepsTitle}>
			<header>
				<h2>{copy.stepsTitle}</h2>
				<span>Отговор до 24 ч</span>
			</header>
			{#each steps as step, index (step.title)}
				<article>
					<span class="bohemcars-sell-mobile__process-num" aria-hidden="true">{index + 1}</span>
					<div>
						<h3>{step.title}</h3>
						<p>{step.text}</p>
					</div>
				</article>
			{/each}
			<footer aria-label={copy.contactLabel}>
				<a {...hrefAttributes(bohemcarsContact.primaryPhoneHref)}>
					<PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" />
					Обади се
				</a>
				<a {...hrefAttributes(bohemcarsContact.viberHref)}>
					<MessageCircle size={18} strokeWidth={2.25} aria-hidden="true" />
					{copy.messageLabel}
				</a>
			</footer>
		</section>
	</main>

	<div
		id="sell-mobile-location-sheet"
		class="bohemcars-sell-mobile-sheet bohemcars-sell-mobile-sheet--location"
		role="dialog"
		aria-modal="true"
		aria-labelledby="sell-mobile-location-title"
	>
		<label
			for="sell-mobile-location-toggle"
			class="bohemcars-sell-mobile-sheet__backdrop"
			aria-label="Затвори локацията"
		></label>
		<div class="bohemcars-sell-mobile-sheet__panel">
			<span class="bohemcars-sell-mobile-sheet__handle" aria-hidden="true"></span>
			<header class="bohemcars-sell-mobile-sheet__header">
				<div>
					<p>Bohemcars шоурум</p>
					<h2 id="sell-mobile-location-title">{bohemcarsContact.addressLabel}</h2>
				</div>
				<label for="sell-mobile-location-toggle" aria-label="Затвори">
					<X size={20} strokeWidth={2.3} aria-hidden="true" />
				</label>
			</header>
			<div class="bohemcars-sell-mobile__map-preview" aria-hidden="true">
				<span class="road road-a"></span>
				<span class="road road-b"></span>
				<span class="road road-c"></span>
				<span class="pin"><MapPin size={24} strokeWidth={2.4} /></span>
				<span class="badge">Bohemcars</span>
			</div>
			<div class="bohemcars-sell-mobile__location-copy">
				<span>{bohemcarsContact.appointmentNote}</span>
				<strong>{bohemcarsContact.addressLabel}</strong>
				<p>Огледите са с уговорка. Обади се преди посещение, за да подготвим човека и времето.</p>
			</div>
			<div class="bohemcars-sell-mobile-sheet__actions">
				<a {...hrefAttributes(mapHref)} target="_blank" rel="noreferrer">
					<Navigation size={18} strokeWidth={2.25} aria-hidden="true" />
					Отвори карта
				</a>
				<a {...hrefAttributes(bohemcarsContact.primaryPhoneHref)}>
					<PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" />
					Обади се
				</a>
			</div>
		</div>
	</div>

	<Drawer.Root bind:open={wizardOpen} direction="bottom" fixed={true}>
		<Drawer.Overlay class="bohemcars-sell-wizard-drawer__backdrop">
			<span>Затвори</span>
		</Drawer.Overlay>
		<Drawer.Content class="bohemcars-sell-wizard-drawer__sheet">
			<Drawer.Handle class="bohemcars-sell-wizard-drawer__handle" />
			<Drawer.Title class="bohemcars-sell-wizard-drawer__title">Снимки и детайли</Drawer.Title>
			<SellCarWizard
				initial={{
					mileage: fieldValues.mileage,
					phone: fieldValues.phone,
					price: fieldValues.price,
					vin: fieldValues.vin
				}}
				onclose={() => (wizardOpen = false)}
			/>
		</Drawer.Content>
	</Drawer.Root>
</div>

<style>
	.bohemcars-sell-mobile {
		position: relative;
		min-height: 100vh;
		background: var(--bc-bg);
		color: #111111;
	}

	.bohemcars-sell-mobile__sheet-toggle {
		position: fixed;
		width: 1px;
		height: 1px;
		overflow: hidden;
		opacity: 0;
		pointer-events: none;
	}

	.bohemcars-sell-mobile__main {
		display: grid;
		gap: 10px;
		padding: 0 14px 92px;
	}

	/* Green chrome: the hero speaks the homepage language — flat brand green
	   with dark ink; typography carries it, no cropped cutout. */
	.bohemcars-sell-mobile__intro {
		position: relative;
		display: grid;
		align-content: start;
		gap: 0;
		overflow: hidden;
		margin: 0 -14px;
		/* Extra bottom room — the form card docks into the green below. */
		padding: 84px 14px 66px;
		background: #8fca1a;
		color: #14210f;
	}

	.bohemcars-sell-mobile__intro-copy {
		position: relative;
		z-index: 2;
		display: grid;
		gap: 5px;
		min-width: 0;
		max-width: 330px;
	}

	.bohemcars-sell-mobile-sheet__header p {
		margin: 0;
		color: var(--bc-accent-bright-soft);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.04em;
		line-height: 16px;
		text-transform: uppercase;
	}

	.bohemcars-sell-mobile__intro h1 {
		margin: 0;
		color: #14210f;
		font-size: 27px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 31px;
	}

	.bohemcars-sell-mobile__intro-copy span {
		display: block;
		max-width: 300px;
		color: rgba(20, 33, 15, 0.78);
		font-size: 14px;
		font-weight: 500;
		line-height: 18px;
	}

	/* Docked into the green hero — the primary control lives in the chrome,
	   exactly like the homepage search pill. */
	.bohemcars-sell-mobile__inline-drawer {
		position: relative;
		z-index: 3;
		display: grid;
		gap: 12px;
		margin-top: -52px;
		border: 0;
		border-radius: 8px;
		background: #ffffff;
		box-shadow: 0 14px 30px rgba(20, 33, 15, 0.12);
		padding: 14px;
	}

	.bohemcars-sell-mobile__drawer-handle {
		display: none;
		width: 42px;
		height: 5px;
		justify-self: center;
		border-radius: 999px;
		background: #d9dee4;
	}

	.bohemcars-sell-mobile__inline-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.bohemcars-sell-mobile__inline-header div {
		display: grid;
		gap: 2px;
		min-width: 0;
	}

	.bohemcars-sell-mobile__inline-header strong,
	.bohemcars-sell-mobile__inline-header span {
		margin: 0;
		letter-spacing: 0;
	}

	.bohemcars-sell-mobile__inline-header strong {
		color: #111111;
		font-size: 19px;
		font-weight: 700;
		line-height: 23px;
	}

	.bohemcars-sell-mobile__inline-header span {
		color: #626d7c;
		font-size: 13px;
		font-weight: 600;
		line-height: 17px;
	}

	.bohemcars-sell-mobile__inline-fields {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}

	.bohemcars-sell-mobile__inline-fields label {
		display: grid;
		gap: 5px;
		margin: 0;
	}

	.bohemcars-sell-mobile__inline-field--wide {
		grid-column: 1 / -1;
	}

	.bohemcars-sell-mobile__inline-fields span {
		color: #4f5d57;
		font-size: 12px;
		font-weight: 700;
		line-height: 15px;
	}

	.bohemcars-sell-mobile__inline-fields input {
		display: block;
		width: 100%;
		height: 46px !important;
		border: 1px solid var(--bc-border) !important;
		border-radius: 8px !important;
		background: var(--bc-surface-soft) !important;
		box-shadow: none !important;
		color: #111111;
		font-size: 16px;
		font-weight: 600;
		line-height: 22px;
		outline: 0;
		padding: 0 12px !important;
	}

	.bohemcars-sell-mobile__inline-fields input::placeholder {
		color: #8f9892;
		opacity: 1;
	}

	.bohemcars-sell-mobile__inline-fields input:focus-visible {
		border-color: #8fbd24 !important;
		background: #ffffff !important;
	}

	.bohemcars-sell-mobile__inline-submit {
		display: flex;
		width: 100%;
		min-height: 48px;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 0;
		border-radius: 8px;
		background: #1c1c1c;
		color: #ffffff;
		font-size: 15px;
		font-weight: 700;
		line-height: 19px;
	}

	/* Quiet "add" affordance — dashed border signals the optional deep path. */
	.bohemcars-sell-mobile__wizard-cta {
		display: flex;
		width: 100%;
		min-height: 46px;
		align-items: center;
		justify-content: center;
		gap: 8px;
		margin-top: -2px;
		border: 1px dashed #c9d3c2;
		border-radius: 8px;
		background: transparent;
		color: #3a540e;
		cursor: pointer;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
		padding: 0 12px;
	}

	.bohemcars-sell-mobile__wizard-cta :global(svg),
	.bohemcars-sell-mobile__wizard-cta :global(svg *) {
		color: currentColor;
		stroke: currentColor;
	}

	:global(.bohemcars-sell-wizard-drawer__backdrop) {
		position: fixed;
		inset: 0;
		z-index: 1200;
		border: 0;
		background: rgba(17, 17, 17, 0.38);
		cursor: pointer;
		padding: 0;
	}

	:global(.bohemcars-sell-wizard-drawer__backdrop span),
	:global(.bohemcars-sell-wizard-drawer__title) {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	:global(.bohemcars-sell-wizard-drawer__sheet) {
		position: fixed;
		right: 0;
		/* vaul repositions the sheet itself when the mobile keyboard opens. */
		bottom: 0;
		left: 0;
		z-index: 1201;
		display: grid;
		grid-template-rows: max-content minmax(0, 1fr);
		gap: 6px;
		height: min(92dvh, 760px);
		overflow: hidden;
		border-radius: 20px 20px 0 0;
		background: var(--bc-bg);
		outline: 0;
		padding: 10px 14px max(16px, env(safe-area-inset-bottom));
	}

	:global(.bohemcars-sell-wizard-drawer__sheet .bc-sell-wizard) {
		min-height: 0;
		overflow-y: auto;
		padding-bottom: 4px;
		scrollbar-width: none;
	}

	:global(.bohemcars-sell-wizard-drawer__sheet .bc-sell-wizard)::-webkit-scrollbar {
		display: none;
	}

	:global(.bohemcars-sell-wizard-drawer__handle) {
		position: relative;
		display: block;
		width: 56px;
		height: 22px;
		justify-self: center;
		border-radius: 0;
		background: transparent;
		opacity: 1;
	}

	:global(.bohemcars-sell-wizard-drawer__handle)::after {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 42px;
		height: 4px;
		transform: translate(-50%, -50%);
		border-radius: 999px;
		background: var(--bc-border);
		content: '';
	}

	.bohemcars-sell-mobile__status {
		margin: -2px 0 0;
		color: #4b5563;
		font-size: 14px;
		font-weight: 600;
		line-height: 18px;
	}

	.bohemcars-sell-mobile-sheet {
		position: fixed;
		inset: 0;
		z-index: 1000;
		visibility: hidden;
		pointer-events: none;
	}

	#sell-mobile-location-toggle:checked ~ #sell-mobile-location-sheet {
		visibility: visible;
		pointer-events: auto;
	}

	.bohemcars-sell-mobile-sheet__backdrop {
		position: absolute;
		inset: 0;
		border: 0;
		background: rgba(28, 28, 28, 0.36);
		cursor: pointer;
		opacity: 0;
		padding: 0;
		transition: opacity 180ms ease;
	}

	#sell-mobile-location-toggle:checked
		~ #sell-mobile-location-sheet
		.bohemcars-sell-mobile-sheet__backdrop {
		opacity: 1;
	}

	.bohemcars-sell-mobile-sheet__panel {
		position: absolute;
		right: 0;
		/* Lifted above the on-screen keyboard on iOS; --bc-kb-inset stays 0 elsewhere. */
		bottom: var(--bc-kb-inset, 0px);
		left: 0;
		display: grid;
		gap: 12px;
		max-height: min(calc(88dvh - var(--bc-kb-inset, 0px)), 720px);
		overflow-y: auto;
		border: 0;
		border-top: 1px solid var(--bc-border);
		border-radius: 22px 22px 0 0;
		background: var(--bc-bg);
		box-shadow: 0 -18px 42px rgba(28, 28, 28, 0.18);
		padding: 10px 14px calc(18px + env(safe-area-inset-bottom));
		transform: translateY(100%);
		transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	#sell-mobile-location-toggle:checked
		~ #sell-mobile-location-sheet
		.bohemcars-sell-mobile-sheet__panel {
		transform: translateY(0);
	}

	.bohemcars-sell-mobile-sheet__handle {
		display: block;
		width: 42px;
		height: 5px;
		justify-self: center;
		border-radius: 999px;
		background: var(--bc-border);
	}

	.bohemcars-sell-mobile-sheet__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.bohemcars-sell-mobile-sheet__header div {
		display: grid;
		gap: 2px;
		min-width: 0;
	}

	.bohemcars-sell-mobile-sheet__header p {
		color: #626d7c;
	}

	.bohemcars-sell-mobile-sheet__header h2 {
		margin: 0;
		color: #111111;
		font-size: 22px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 27px;
	}

	.bohemcars-sell-mobile-sheet__header label {
		display: flex;
		width: 44px;
		height: 44px;
		flex: 0 0 44px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 999px;
		background: #ffffff;
		color: #111111;
		cursor: pointer;
		padding: 0;
	}

	.bohemcars-sell-mobile__map-preview {
		position: relative;
		height: 132px;
		overflow: hidden;
		border-radius: 8px;
		background:
			linear-gradient(135deg, rgba(217, 242, 117, 0.22), rgba(255, 255, 255, 0.74)), #ffffff;
	}

	.bohemcars-sell-mobile__map-preview::before,
	.bohemcars-sell-mobile__map-preview::after {
		position: absolute;
		inset: 18px;
		border: 1px solid rgba(28, 28, 28, 0.08);
		border-radius: 18px;
		content: '';
	}

	.bohemcars-sell-mobile__map-preview::after {
		inset: 42px -22px auto 44px;
		height: 48px;
		border-right: 0;
		border-left: 0;
		transform: rotate(-7deg);
	}

	.bohemcars-sell-mobile__map-preview .road {
		position: absolute;
		border-radius: 999px;
		background: rgba(28, 28, 28, 0.1);
	}

	.bohemcars-sell-mobile__map-preview .road-a {
		top: 29px;
		left: -20px;
		width: 72%;
		height: 8px;
		transform: rotate(12deg);
	}

	.bohemcars-sell-mobile__map-preview .road-b {
		right: 18px;
		bottom: 31px;
		width: 58%;
		height: 8px;
		transform: rotate(-19deg);
	}

	.bohemcars-sell-mobile__map-preview .road-c {
		top: 15px;
		left: 47%;
		width: 8px;
		height: 116px;
		transform: rotate(21deg);
	}

	.bohemcars-sell-mobile__map-preview .pin {
		position: absolute;
		top: 45px;
		left: 50%;
		display: flex;
		width: 48px;
		height: 48px;
		align-items: center;
		justify-content: center;
		border: 4px solid #ffffff;
		border-radius: 999px;
		background: var(--bc-accent-bright-soft);
		color: #111111;
		transform: translateX(-50%);
	}

	.bohemcars-sell-mobile__map-preview .badge {
		position: absolute;
		right: 15px;
		bottom: 14px;
		border-radius: 999px;
		background: #1c1c1c;
		color: #ffffff;
		font-size: 12px;
		font-weight: 700;
		line-height: 16px;
		padding: 7px 10px;
	}

	.bohemcars-sell-mobile__location-copy {
		display: grid;
		gap: 4px;
		border-radius: 8px;
		background: #ffffff;
		padding: 13px 14px;
	}

	.bohemcars-sell-mobile__location-copy span,
	.bohemcars-sell-mobile__location-copy strong,
	.bohemcars-sell-mobile__location-copy p {
		margin: 0;
		letter-spacing: 0;
	}

	.bohemcars-sell-mobile__location-copy span {
		color: #626d7c;
		font-size: 12px;
		font-weight: 700;
		line-height: 16px;
		text-transform: uppercase;
	}

	.bohemcars-sell-mobile__location-copy strong {
		color: #111111;
		font-size: 17px;
		font-weight: 700;
		line-height: 22px;
	}

	.bohemcars-sell-mobile__location-copy p {
		color: #56635a;
		font-size: 14px;
		font-weight: 500;
		line-height: 18px;
	}

	.bohemcars-sell-mobile-sheet__actions {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}

	.bohemcars-sell-mobile-sheet__actions a {
		display: flex;
		min-height: 48px;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border-radius: 8px;
		background: #ffffff;
		color: #14210a;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
	}

	.bohemcars-sell-mobile-sheet__actions a:first-child {
		background: var(--bc-accent-bright-soft);
	}

	/* One substantial process card in the site's white flat-card language —
	   green accent pills carry the brand, same as the calculator budget rows. */
	.bohemcars-sell-mobile__process {
		display: grid;
		gap: 14px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #ffffff;
		color: #111111;
		padding: 18px 16px;
	}

	.bohemcars-sell-mobile__process header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
	}

	.bohemcars-sell-mobile__process h2 {
		margin: 0;
		color: #111111;
		font-size: 20px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 25px;
	}

	.bohemcars-sell-mobile__process header span {
		flex: 0 0 auto;
		border-radius: 999px;
		background: rgba(143, 202, 26, 0.18);
		color: #3a540e;
		font-size: 12px;
		font-weight: 700;
		line-height: 17px;
		padding: 6px 11px;
		white-space: nowrap;
	}

	.bohemcars-sell-mobile__process article {
		display: grid;
		grid-template-columns: 34px minmax(0, 1fr);
		gap: 12px;
		align-items: start;
	}

	.bohemcars-sell-mobile__process-num {
		display: flex;
		width: 34px;
		height: 34px;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: rgba(143, 202, 26, 0.18);
		color: #3a540e;
		font-size: 15px;
		font-weight: 700;
		line-height: 1;
	}

	.bohemcars-sell-mobile__process h3,
	.bohemcars-sell-mobile__process article p {
		margin: 0;
		letter-spacing: 0;
	}

	.bohemcars-sell-mobile__process h3 {
		color: #111111;
		font-size: 16px;
		font-weight: 700;
		line-height: 21px;
	}

	.bohemcars-sell-mobile__process article p {
		margin-top: 4px;
		color: #56635a;
		font-size: 14.5px;
		font-weight: 500;
		line-height: 20px;
	}

	.bohemcars-sell-mobile__process footer {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
		margin-top: 2px;
	}

	.bohemcars-sell-mobile__process footer a {
		display: flex;
		min-height: 50px;
		min-width: 0;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-soft);
		color: #111111;
		font-size: 15px;
		font-weight: 700;
		line-height: 19px;
		text-decoration: none !important;
		white-space: nowrap;
	}

	.bohemcars-sell-mobile__process footer a:first-child {
		border-color: transparent;
		background: var(--bc-accent-bright-soft);
		color: #14210f;
	}

	.bohemcars-sell-mobile__process footer a :global(svg),
	.bohemcars-sell-mobile__process footer a :global(svg *) {
		color: currentColor;
		stroke: currentColor;
	}

	@media (max-width: 359px) {
		.bohemcars-sell-mobile__intro h1 {
			font-size: 25px;
			line-height: 29px;
		}
	}
</style>
