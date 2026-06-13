<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight, CircleHelp, PhoneCall, ReceiptText, X } from '@lucide/svelte';
	import { Drawer } from 'vaul-svelte';
	import {
		auxeroCalculatorInitial,
		calculateAuxeroCalculatorTotals,
		formatEur,
		type AuxeroCalculatorBudgetLink,
		type AuxeroCalculatorData,
		type AuxeroCalculatorInputKey,
		type AuxeroCalculatorSummaryRow
	} from '$lib/auxero/calculator';
	import type { AuxeroFaq } from '$lib/auxero/faqs';
	import { bohemcarsContact } from '$lib/data/bohemcars';

	type CalculatorValues = Record<AuxeroCalculatorInputKey, number>;
	type CalculatorDrawer = 'breakdown' | 'faq';

	let {
		budgetLinks,
		calculator,
		faqs
	}: {
		budgetLinks: AuxeroCalculatorBudgetLink[];
		calculator: AuxeroCalculatorData;
		faqs: AuxeroFaq[];
	} = $props();

	const fieldValue = (key: AuxeroCalculatorInputKey) =>
		calculator.fields.find((field) => field.key === key)?.value ?? auxeroCalculatorInitial[key];
	const fieldId = (key: AuxeroCalculatorInputKey) => `calculator-mobile-${key}`;
	const inputMode = (key: AuxeroCalculatorInputKey) =>
		key === 'dutyRate' || key === 'vatRate' ? 'decimal' : 'numeric';
	const hrefAttributes = (href: string) => ({
		href: href.startsWith('/') ? resolve(href as '/') : href
	});
	const shortFieldLabel = (key: AuxeroCalculatorInputKey, label: string) => {
		if (key === 'price') return 'Цена';
		if (key === 'transport') return 'Транспорт';
		if (key === 'dutyRate') return 'Мито';
		if (key === 'vatRate') return 'ДДС';
		if (key === 'prep') return 'Регистрация';

		return label;
	};
	const summaryLabel = (key: AuxeroCalculatorSummaryRow['key'], fallback: string) =>
		calculator.summaryRows.find((row) => row.key === key)?.label ?? fallback;

	let values = $state<CalculatorValues>({
		dutyRate: fieldValue('dutyRate'),
		prep: fieldValue('prep'),
		price: fieldValue('price'),
		transport: fieldValue('transport'),
		vatRate: fieldValue('vatRate')
	});
	let activeDrawer = $state<CalculatorDrawer | null>(null);
	let drawerOpen = $state(false);

	const totals = $derived.by(() =>
		calculateAuxeroCalculatorTotals({
			dutyRate: values.dutyRate,
			prep: values.prep,
			price: values.price,
			transport: values.transport,
			vatRate: values.vatRate
		})
	);
	const totalLabel = $derived(formatEur(totals.total));
	const budgetPreview = $derived(budgetLinks.slice(0, 4));
	const summaryRows = $derived<AuxeroCalculatorSummaryRow[]>([
		{ key: 'price', label: summaryLabel('price', 'Цена на автомобила'), value: values.price },
		{ key: 'transport', label: summaryLabel('transport', 'Транспорт'), value: values.transport },
		{ key: 'duty', label: summaryLabel('duty', 'Мито'), value: totals.duty },
		{ key: 'vat', label: summaryLabel('vat', 'ДДС'), value: totals.vat },
		{ key: 'prep', label: summaryLabel('prep', 'Подготовка и регистрация'), value: values.prep }
	]);
	const drawerTitle = $derived.by(() => {
		if (activeDrawer === 'breakdown') return 'Разбивка на сумата';

		return 'Въпроси за калкулатора';
	});
	const drawerEyebrow = $derived.by(() => {
		if (activeDrawer === 'breakdown') return totalLabel;

		return 'Помощ';
	});
	const drawerDescription =
		'Калкулаторът е ориентировъчен. Екипът потвърждава точната цена за конкретния автомобил.';

	const setNumberValue = (key: AuxeroCalculatorInputKey, event: Event) => {
		const input = event.currentTarget as HTMLInputElement;
		const next = input.valueAsNumber;

		values[key] = Number.isFinite(next) ? next : 0;
	};
	const openDrawer = (drawer: CalculatorDrawer) => {
		activeDrawer = drawer;
		drawerOpen = true;
	};
	const closeDrawer = () => {
		drawerOpen = false;
		activeDrawer = null;
	};
</script>

<main class="bohemcars-calculator-mobile" data-bohemcars-calculator-mobile>
	<header class="bohemcars-calculator-mobile__header">
		<div class="bohemcars-calculator-mobile__topbar">
			<div>
				<p>Внос от Канада</p>
				<h1>Калкулатор</h1>
			</div>
			<nav aria-label="Помощ и контакт">
				<button
					type="button"
					aria-label="Въпроси за калкулатора"
					aria-haspopup="dialog"
					aria-expanded={activeDrawer === 'faq'}
					onclick={() => openDrawer('faq')}
				>
					<CircleHelp size={21} strokeWidth={2.35} aria-hidden="true" />
				</button>
				<a
					{...hrefAttributes(bohemcarsContact.primaryPhoneHref)}
					aria-label={bohemcarsContact.primaryPhoneLabel}
				>
					<PhoneCall size={20} strokeWidth={2.35} aria-hidden="true" />
				</a>
			</nav>
		</div>

		<section class="bohemcars-calculator-mobile__result" aria-label={calculator.title}>
			<div>
				<span>{calculator.title}</span>
				<strong data-bohemcars-calc-output="total">{totalLabel}</strong>
				<small>{calculator.totalNote}</small>
			</div>
			<button
				type="button"
				aria-haspopup="dialog"
				aria-expanded={activeDrawer === 'breakdown'}
				onclick={() => openDrawer('breakdown')}
			>
				<ReceiptText size={18} strokeWidth={2.25} aria-hidden="true" />
				Разбивка
			</button>
		</section>
	</header>

	<section class="bohemcars-calculator-mobile__form-card" aria-label="Калкулатор">
		<header>
			<p>Сметни за минута</p>
			<h2>Въведи разходите</h2>
		</header>
		<div class="bohemcars-calculator-mobile__fields" data-bohemcars-calculator-mobile-fields>
			{#each calculator.fields as field (field.key)}
				<label for={fieldId(field.key)}>
					<span>
						{shortFieldLabel(field.key, field.label)}
						{#if field.mutedLabel}
							<small>{field.mutedLabel}</small>
						{/if}
					</span>
					<input
						id={fieldId(field.key)}
						aria-label={field.label}
						data-bohemcars-calc-input={field.key}
						inputmode={inputMode(field.key)}
						min={field.min}
						name={field.name}
						step={field.step}
						type="number"
						value={values[field.key]}
						oninput={(event) => setNumberValue(field.key, event)}
					/>
				</label>
			{/each}
		</div>
	</section>

	<section class="bohemcars-calculator-mobile__actions" aria-label="Следващи стъпки">
		<a class="bohemcars-calculator-mobile__offer" href={resolve(calculator.ctaHref as '/')}>
			<span>Заяви оферта</span>
			<ArrowRight size={18} strokeWidth={2.35} aria-hidden="true" />
		</a>
		<a {...hrefAttributes(bohemcarsContact.primaryPhoneHref)}>
			<PhoneCall size={18} strokeWidth={2.25} aria-hidden="true" />
			Обади се
		</a>
	</section>

	<section class="bohemcars-calculator-mobile__budget" aria-labelledby="calculator-mobile-budget">
		<header>
			<div>
				<p>Следваща стъпка</p>
				<h2 id="calculator-mobile-budget">Разгледай по бюджет</h2>
			</div>
			<a href={resolve('/inventory')}>Всички</a>
		</header>
		<div>
			{#each budgetPreview as link (`${link.href}-${link.label}-${link.price}`)}
				<a href={resolve(link.href as '/inventory')}>
					<span>{link.price}</span>
					<strong>{link.label}</strong>
					<ArrowRight size={17} strokeWidth={2.35} aria-hidden="true" />
				</a>
			{/each}
		</div>
	</section>

	<Drawer.Root
		bind:open={drawerOpen}
		onOpenChange={(open) => !open && closeDrawer()}
		direction="bottom"
		fixed
	>
		<Drawer.Overlay class="bohemcars-calculator-mobile-drawer__backdrop">
			<span>Затвори</span>
		</Drawer.Overlay>
		<Drawer.Content class="bohemcars-calculator-mobile-drawer__sheet">
			<Drawer.Handle class="bohemcars-calculator-mobile-drawer__handle" />
			<header>
				<div>
					<p>{drawerEyebrow}</p>
					<Drawer.Title>
						<span class="bohemcars-calculator-mobile-drawer__title">{drawerTitle}</span>
					</Drawer.Title>
				</div>
				<button type="button" aria-label="Затвори" onclick={closeDrawer}>
					<X size={20} strokeWidth={2.25} aria-hidden="true" />
				</button>
			</header>
			<Drawer.Description>
				<span class="bohemcars-calculator-mobile-drawer__description">
					{drawerDescription}
				</span>
			</Drawer.Description>

			{#if activeDrawer === 'breakdown'}
				<div class="bohemcars-calculator-mobile-drawer__breakdown" data-vaul-no-drag>
					{#each summaryRows as row (row.key)}
						<p>
							<span>{row.label}</span>
							<strong data-bohemcars-calc-output={row.key}>{formatEur(row.value)}</strong>
						</p>
					{/each}
					<div>
						<span>Ориентировъчно общо</span>
						<strong data-bohemcars-calc-output="totalSmall">{totalLabel}</strong>
					</div>
				</div>
			{:else}
				<div class="bohemcars-calculator-mobile-drawer__faq" data-vaul-no-drag>
					{#each faqs as faq, index (faq.question)}
						<details open={index === 0}>
							<summary>{faq.question}</summary>
							<p>{faq.answer}</p>
						</details>
					{/each}
				</div>
			{/if}
		</Drawer.Content>
	</Drawer.Root>
</main>

<style>
	.bohemcars-calculator-mobile {
		display: grid;
		width: 100%;
		max-width: 100vw;
		min-height: 100svh;
		align-content: start;
		gap: 10px;
		grid-auto-rows: max-content;
		overflow-x: hidden;
		background: var(--bc-surface);
		color: #111111;
		padding: 0 14px 92px;
	}

	/* Green chrome: flat brand green with dark ink and a white result card,
	   matching the homepage language instead of a dark photo banner. */
	.bohemcars-calculator-mobile__header {
		display: grid;
		gap: 10px;
		margin: 0 -14px;
		/* Extra bottom room — the costs card docks into the green below. */
		padding: max(12px, env(safe-area-inset-top)) 14px 64px;
		background: #8fca1a;
		color: #14210f;
	}

	.bohemcars-calculator-mobile__topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
	}

	.bohemcars-calculator-mobile__topbar p,
	.bohemcars-calculator-mobile__topbar h1 {
		margin: 0;
		letter-spacing: 0;
	}

	.bohemcars-calculator-mobile__topbar p {
		color: rgba(20, 33, 15, 0.66);
		font-size: 12px;
		font-weight: 700;
		line-height: 16px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.bohemcars-calculator-mobile__topbar h1 {
		color: #14210f;
		font-size: 24px;
		font-weight: 700;
		line-height: 29px;
	}

	.bohemcars-calculator-mobile__topbar nav {
		display: flex;
		flex: 0 0 auto;
		gap: 8px;
	}

	.bohemcars-calculator-mobile__topbar button,
	.bohemcars-calculator-mobile__topbar a {
		display: flex;
		width: 44px;
		height: 44px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 999px;
		background: #ffffff;
		box-shadow: inset 0 0 0 1px rgba(20, 33, 15, 0.14);
		color: #20350f;
		cursor: pointer;
		padding: 0;
	}

	/* White result card on green — same pairing as the homepage search pill. */
	.bohemcars-calculator-mobile__result {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: end;
		gap: 8px;
		border-radius: 12px;
		background: #ffffff;
		box-shadow: none;
		padding: 12px;
	}

	.bohemcars-calculator-mobile__result div {
		display: grid;
		min-width: 0;
		gap: 3px;
	}

	.bohemcars-calculator-mobile__result span,
	.bohemcars-calculator-mobile__result small {
		color: #56635a;
		font-size: 12px;
		font-weight: 700;
		line-height: 17px;
	}

	.bohemcars-calculator-mobile__result strong {
		overflow-wrap: anywhere;
		color: #14210f;
		font-size: 30px;
		font-weight: 700;
		line-height: 34px;
	}

	.bohemcars-calculator-mobile__result button {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		gap: 7px;
		border: 0;
		border-radius: 999px;
		background: #1c1c1c;
		color: #ffffff;
		cursor: pointer;
		font-size: 13px;
		font-weight: 700;
		line-height: 17px;
		padding: 0 14px;
		white-space: nowrap;
	}

	/* The global `* { color: #1c1c1c }` rule paints icons black-on-black here. */
	.bohemcars-calculator-mobile__result button :global(svg),
	.bohemcars-calculator-mobile__result button :global(svg *),
	.bohemcars-calculator-mobile__topbar nav :global(svg),
	.bohemcars-calculator-mobile__topbar nav :global(svg *) {
		color: currentColor;
		stroke: currentColor;
	}

	/* Docked into the green hero — the primary control lives in the chrome,
	   exactly like the homepage search pill. */
	.bohemcars-calculator-mobile__form-card {
		position: relative;
		z-index: 3;
		display: grid;
		gap: 12px;
		margin-top: -52px;
		border: 0;
		border-radius: 8px;
		background: #ffffff;
		box-shadow: 0 14px 30px rgba(20, 33, 15, 0.12);
		color: #111111;
		padding: 16px;
	}

	.bohemcars-calculator-mobile__form-card header {
		display: grid;
		gap: 2px;
	}

	.bohemcars-calculator-mobile__form-card p,
	.bohemcars-calculator-mobile__form-card h2 {
		margin: 0;
		letter-spacing: 0;
	}

	.bohemcars-calculator-mobile__form-card p {
		color: #4c6b12;
		font-size: 12px;
		font-weight: 700;
		line-height: 16px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.bohemcars-calculator-mobile__form-card h2 {
		color: #111111;
		font-size: 19px;
		font-weight: 700;
		line-height: 24px;
	}

	.bohemcars-calculator-mobile__fields {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 9px 8px;
	}

	.bohemcars-calculator-mobile__fields label {
		display: grid;
		gap: 6px;
		margin: 0;
	}

	.bohemcars-calculator-mobile__fields label:last-child {
		grid-column: 1 / -1;
	}

	.bohemcars-calculator-mobile__fields span {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
		color: #111111;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
	}

	.bohemcars-calculator-mobile__fields small {
		color: #7a8493;
		font-size: 13px;
		font-weight: 700;
		line-height: 18px;
	}

	.bohemcars-calculator-mobile__fields input {
		display: block;
		width: 100%;
		height: 46px !important;
		border: 1px solid var(--bc-border) !important;
		border-radius: 8px !important;
		background: var(--bc-surface-soft) !important;
		box-shadow: none !important;
		color: #111111;
		font-size: 16px;
		font-weight: 700;
		line-height: 22px;
		outline: 0;
		padding: 0 13px !important;
	}

	.bohemcars-calculator-mobile__fields input:focus-visible {
		border-color: #8fbd24 !important;
		box-shadow: 0 0 0 2px rgba(217, 242, 117, 0.55) !important;
	}

	.bohemcars-calculator-mobile__actions {
		display: grid;
		grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.9fr);
		gap: 9px;
	}

	.bohemcars-calculator-mobile__actions a {
		display: flex;
		min-height: 52px;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border-radius: 8px;
		background: #ffffff;
		color: #111111;
		box-shadow: none;
		font-size: 15px;
		font-weight: 700;
		line-height: 19px;
		text-align: center;
		text-decoration: none;
	}

	.bohemcars-calculator-mobile__actions a:last-child {
		background: var(--bc-accent-bright-soft);
		color: #14210f;
	}

	.bohemcars-calculator-mobile__actions a.bohemcars-calculator-mobile__offer {
		background: #111111;
		color: #ffffff;
	}

	.bohemcars-calculator-mobile__actions a.bohemcars-calculator-mobile__offer span,
	.bohemcars-calculator-mobile__actions a.bohemcars-calculator-mobile__offer :global(svg),
	.bohemcars-calculator-mobile__actions a.bohemcars-calculator-mobile__offer :global(path) {
		color: #ffffff;
		stroke: currentColor;
	}

	.bohemcars-calculator-mobile__budget {
		display: grid;
		gap: 9px;
		min-width: 0;
	}

	.bohemcars-calculator-mobile__budget header {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 12px;
	}

	.bohemcars-calculator-mobile__budget header div {
		min-width: 0;
	}

	.bohemcars-calculator-mobile__budget p,
	.bohemcars-calculator-mobile__budget h2 {
		margin: 0;
		letter-spacing: 0;
	}

	.bohemcars-calculator-mobile__budget p {
		color: #4c6b12;
		font-size: 12px;
		font-weight: 700;
		line-height: 16px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.bohemcars-calculator-mobile__budget h2 {
		color: #111111;
		font-size: 19px;
		font-weight: 700;
		line-height: 24px;
	}

	.bohemcars-calculator-mobile__budget header > a {
		display: inline-flex;
		min-height: 38px;
		align-items: center;
		border: 1px solid var(--bc-border);
		border-radius: 999px;
		background: #ffffff;
		color: #111111;
		font-size: 13px;
		font-weight: 700;
		line-height: 16px;
		padding: 0 14px;
		text-decoration: none;
		white-space: nowrap;
	}

	.bohemcars-calculator-mobile__budget > div {
		display: grid;
		gap: 8px;
	}

	.bohemcars-calculator-mobile__budget > div > a {
		display: grid;
		min-height: 60px;
		align-items: center;
		grid-template-columns: auto minmax(0, 1fr) 32px;
		gap: 10px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #ffffff;
		box-shadow: none;
		color: #111111;
		padding: 10px 10px 10px 11px;
		text-decoration: none;
	}

	.bohemcars-calculator-mobile__budget > div > a:hover,
	.bohemcars-calculator-mobile__budget > div > a:focus-visible {
		background: var(--bc-surface-hover);
		color: #111111;
	}

	.bohemcars-calculator-mobile__budget span,
	.bohemcars-calculator-mobile__budget strong {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Budget as a green accent pill — the brand language for price chips —
	   instead of bare olive text. */
	.bohemcars-calculator-mobile__budget > div > a span {
		display: inline-flex;
		min-height: 28px;
		align-items: center;
		justify-self: start;
		border-radius: 999px;
		background: rgba(143, 202, 26, 0.18);
		color: #3a540e;
		font-size: 13px;
		font-weight: 700;
		line-height: 16px;
		padding: 0 11px;
	}

	.bohemcars-calculator-mobile__budget strong {
		color: #111111;
		font-size: 14.5px;
		font-weight: 700;
		line-height: 19px;
	}

	.bohemcars-calculator-mobile__budget > div > a :global(svg) {
		width: 32px;
		height: 32px;
		border-radius: 999px;
		background: var(--bc-surface-soft);
		color: #111111;
		stroke: #111111;
		padding: 7px;
	}

	.bohemcars-calculator-mobile__budget > div > a :global(svg) {
		justify-self: center;
		color: #111111;
	}

	:global(.bohemcars-calculator-mobile-drawer__backdrop) {
		position: fixed;
		inset: 0;
		display: block;
		z-index: 1200;
		border: 0;
		background: rgba(17, 17, 17, 0.34);
		cursor: pointer;
	}

	:global(.bohemcars-calculator-mobile-drawer__backdrop span) {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	:global(.bohemcars-calculator-mobile-drawer__sheet[data-vaul-drawer]) {
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
		display: grid;
		z-index: 1201;
		max-height: min(88dvh, 720px);
		align-content: start;
		gap: 14px;
		overflow: hidden;
		border-radius: 18px 18px 0 0;
		background: var(--bc-bg);
		color: #111111;
		outline: 0;
		padding: 10px 16px max(22px, env(safe-area-inset-bottom));
		-webkit-overflow-scrolling: touch;
	}

	:global(.bohemcars-calculator-mobile-drawer__handle[data-vaul-handle]) {
		position: relative;
		display: block;
		width: 56px;
		height: 22px;
		justify-self: center;
		border-radius: 0;
		background: transparent;
		opacity: 1;
	}

	:global(.bohemcars-calculator-mobile-drawer__handle[data-vaul-handle])::after {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 44px;
		height: 5px;
		transform: translate(-50%, -50%);
		border-radius: 999px;
		background: var(--bc-border);
		content: '';
	}

	:global(.bohemcars-calculator-mobile-drawer__sheet header) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
	}

	:global(.bohemcars-calculator-mobile-drawer__sheet header div) {
		min-width: 0;
	}

	:global(.bohemcars-calculator-mobile-drawer__sheet header p) {
		margin: 0 0 2px;
		color: #5d7e16;
		font-size: 12px;
		font-weight: 700;
		line-height: 16px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.bohemcars-calculator-mobile-drawer__title {
		display: block;
		color: #111111;
		font-size: 21px;
		font-weight: 700;
		line-height: 26px;
	}

	.bohemcars-calculator-mobile-drawer__description {
		display: block;
		color: #637184;
		font-size: 14px;
		font-weight: 600;
		line-height: 20px;
	}

	:global(.bohemcars-calculator-mobile-drawer__sheet header button) {
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

	.bohemcars-calculator-mobile-drawer__breakdown,
	.bohemcars-calculator-mobile-drawer__faq {
		display: grid;
		min-height: 0;
		gap: 9px;
		overflow-y: auto;
		scrollbar-width: none;
	}

	.bohemcars-calculator-mobile-drawer__breakdown::-webkit-scrollbar,
	.bohemcars-calculator-mobile-drawer__faq::-webkit-scrollbar {
		display: none;
	}

	.bohemcars-calculator-mobile-drawer__breakdown {
		border: 1px solid var(--bc-border);
		border-radius: 10px;
		background: var(--bc-surface-raised);
		padding: 14px;
	}

	.bohemcars-calculator-mobile-drawer__breakdown p,
	.bohemcars-calculator-mobile-drawer__breakdown div {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		margin: 0;
		color: #111111;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
	}

	.bohemcars-calculator-mobile-drawer__breakdown p {
		border-bottom: 1px solid var(--bc-border);
		padding-bottom: 9px;
	}

	.bohemcars-calculator-mobile-drawer__breakdown div {
		padding-top: 2px;
		font-size: 16px;
		font-weight: 700;
		line-height: 21px;
	}

	.bohemcars-calculator-mobile-drawer__breakdown strong {
		text-align: right;
		white-space: nowrap;
	}

	.bohemcars-calculator-mobile-drawer__faq details {
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-raised);
		padding: 0;
	}

	.bohemcars-calculator-mobile-drawer__faq summary {
		display: flex;
		min-height: 50px;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		cursor: pointer;
		color: #111111;
		font-size: 15px;
		font-weight: 700;
		line-height: 20px;
		list-style: none;
		padding: 12px;
	}

	.bohemcars-calculator-mobile-drawer__faq summary::-webkit-details-marker {
		display: none;
	}

	.bohemcars-calculator-mobile-drawer__faq summary::after {
		width: 8px;
		height: 8px;
		flex: 0 0 8px;
		transform: rotate(45deg);
		border-right: 2px solid #111111;
		border-bottom: 2px solid #111111;
		content: '';
	}

	.bohemcars-calculator-mobile-drawer__faq details[open] summary::after {
		transform: rotate(225deg);
	}

	.bohemcars-calculator-mobile-drawer__faq p {
		margin: -2px 0 0;
		color: #637184;
		font-size: 14px;
		font-weight: 600;
		line-height: 21px;
		padding: 0 12px 13px;
	}

	@media (max-width: 360px) {
		.bohemcars-calculator-mobile__result {
			grid-template-columns: minmax(0, 1fr);
		}

		.bohemcars-calculator-mobile__result button {
			justify-self: start;
		}

		.bohemcars-calculator-mobile__actions {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
