<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight, MessageCircle, PhoneCall } from '@lucide/svelte';
	import type { AuxeroSellCarFormData, AuxeroSellCarInputField } from '$lib/auxero/sell-your-car';
	import { bohemcarsContact } from '$lib/data/bohemcars';

	let { form }: { form: AuxeroSellCarFormData } = $props();

	let submitted = $state(false);

	const fieldCopy: Record<string, { label: string; placeholder: string }> = {
		vin: { label: 'VIN номер', placeholder: 'Например WBA...' },
		mileage: { label: 'Пробег', placeholder: 'Пробег в км' },
		price: { label: 'Очаквана цена', placeholder: 'Цена в EUR' },
		phone: { label: 'Телефон', placeholder: 'Телефон за контакт' }
	};

	const steps = [
		{ title: 'Данни', text: 'VIN, пробег, цена и телефон.' },
		{ title: 'Преглед', text: 'Проверяваме историята и състоянието.' },
		{ title: 'Следващ ход', text: 'Оферта, съдействие или публикуване.' }
	] as const;

	const labelFor = (field: AuxeroSellCarInputField) => fieldCopy[field.name]?.label ?? field.label;
	const placeholderFor = (field: AuxeroSellCarInputField) =>
		fieldCopy[field.name]?.placeholder ?? field.placeholder ?? '';
	const autocompleteFor = (field: AuxeroSellCarInputField) =>
		field.name === 'phone' ? 'tel' : 'off';
	const inputModeFor = (field: AuxeroSellCarInputField): 'tel' | 'numeric' | undefined => {
		if (field.name === 'phone') return 'tel';
		if (field.name === 'mileage' || field.name === 'price') return 'numeric';
		return undefined;
	};
	const handleSubmit = (event: SubmitEvent) => {
		event.preventDefault();
		submitted = true;
	};
</script>

<div class="bohemcars-sell-mobile">
	<main class="bohemcars-sell-mobile__main">
		<section class="bohemcars-sell-mobile__intro" aria-labelledby="sell-mobile-title">
			<div class="bohemcars-sell-mobile__intro-copy">
				<span>Bohemcars оценка</span>
				<h1 id="sell-mobile-title">Продай автомобила си</h1>
				<p>Изпрати данните. Връщаме ясен следващ ход.</p>
			</div>
		</section>

		<form class="bohemcars-sell-mobile__form" onsubmit={handleSubmit}>
			<header>
				<p>Бърза заявка</p>
				<strong>Попълни за минута</strong>
			</header>

			<div class="bohemcars-sell-mobile__fields">
				{#each form.fields as field (field.id)}
					<label for={`mobile-${field.id}`}>
						<span>{labelFor(field)}</span>
						<input
							id={`mobile-${field.id}`}
							name={field.name}
							type={field.type}
							placeholder={placeholderFor(field)}
							required={field.required}
							autocomplete={autocompleteFor(field)}
							inputmode={inputModeFor(field)}
							value={field.value ?? ''}
						/>
					</label>
				{/each}
			</div>

			<button type="submit">
				Заяви оценка
				<ArrowRight size={19} strokeWidth={2.25} aria-hidden="true" />
			</button>

			{#if submitted}
				<p class="bohemcars-sell-mobile__status">
					Заявката е подготвена. Обади се или пиши, за да я финализираме веднага.
				</p>
			{/if}
		</form>

		<nav class="bohemcars-sell-mobile__contact" aria-label="Контакт">
			<a href={resolve('/contact')}>
				<PhoneCall size={19} strokeWidth={2.25} aria-hidden="true" />
				{bohemcarsContact.primaryPhoneLabel}
			</a>
			<a href={resolve('/contact')}>
				<MessageCircle size={19} strokeWidth={2.25} aria-hidden="true" />
				Пиши ни
			</a>
		</nav>

		<section class="bohemcars-sell-mobile__steps" aria-label="Стъпки">
			<p class="bohemcars-sell-mobile__steps-title">Как работи</p>
			{#each steps as step, index (step.title)}
				<article>
					<span class="bohemcars-sell-mobile__step-num" aria-hidden="true">{index + 1}</span>
					<div>
						<h2>{step.title}</h2>
						<p>{step.text}</p>
					</div>
				</article>
			{/each}
		</section>
	</main>
</div>

<style>
	.bohemcars-sell-mobile {
		min-height: 100vh;
		background: var(--bc-bg);
		color: #111111;
	}

	.bohemcars-sell-mobile__main {
		display: grid;
		gap: 10px;
		padding: 0 14px 92px;
	}

	.bohemcars-sell-mobile__intro {
		position: relative;
		display: flex;
		min-height: 120px;
		align-items: center;
		overflow: hidden;
		margin: 0 -14px;
		padding: 14px;
		background:
			linear-gradient(90deg, rgba(23, 31, 19, 0.97), rgba(23, 31, 19, 0.9)),
			url('/assets/bohemcars/cta/sell-car-banner-v2.png') 67% 52% / cover;
		box-shadow: inset 0 -1px 0 rgba(217, 242, 117, 0.36);
		color: #ffffff;
	}

	.bohemcars-sell-mobile__intro::before {
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

	.bohemcars-sell-mobile__intro-copy {
		position: relative;
		z-index: 2;
		display: grid;
		gap: 5px;
		min-width: 0;
		max-width: 330px;
	}

	.bohemcars-sell-mobile__intro span,
	.bohemcars-sell-mobile__form header p {
		margin: 0;
		color: #d9f275;
		font-size: 10.5px;
		font-weight: 900;
		letter-spacing: 0;
		line-height: 14px;
		text-transform: uppercase;
	}

	.bohemcars-sell-mobile__intro h1 {
		margin: 0;
		color: #ffffff;
		font-size: 23px;
		font-weight: 900;
		letter-spacing: 0;
		line-height: 27px;
		white-space: nowrap;
	}

	.bohemcars-sell-mobile__intro p {
		margin: 0;
		max-width: 256px;
		color: rgba(255, 255, 255, 0.86);
		font-size: 13px;
		font-weight: 800;
		line-height: 18px;
	}

	.bohemcars-sell-mobile__form {
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface);
		position: relative;
		z-index: 2;
		margin-top: -2px;
	}

	.bohemcars-sell-mobile__form {
		display: grid;
		gap: 13px;
		padding: 14px;
	}

	.bohemcars-sell-mobile__form header {
		display: grid;
		gap: 2px;
	}

	.bohemcars-sell-mobile__form header p {
		color: #626d7c;
	}

	.bohemcars-sell-mobile__form header strong {
		color: #111111;
		font-size: 21px;
		font-weight: 900;
		letter-spacing: 0;
		line-height: 26px;
	}

	.bohemcars-sell-mobile__fields {
		display: grid;
		gap: 9px;
	}

	.bohemcars-sell-mobile__fields label {
		display: grid;
		gap: 6px;
		margin: 0;
	}

	.bohemcars-sell-mobile__fields span {
		color: #111111;
		font-size: 13px;
		font-weight: 900;
		line-height: 16px;
	}

	.bohemcars-sell-mobile__fields input {
		display: block;
		width: 100%;
		height: 48px !important;
		border: 1px solid var(--bc-border) !important;
		border-radius: 8px !important;
		background: #ffffff !important;
		box-shadow: none !important;
		color: #111111;
		font-size: 16px;
		font-weight: 800;
		line-height: 22px;
		outline: 0;
		padding: 0 13px !important;
	}

	.bohemcars-sell-mobile__fields input::placeholder {
		color: #9ba0a5;
		opacity: 1;
	}

	.bohemcars-sell-mobile__fields input:focus-visible {
		border-color: #8fbd24 !important;
	}

	.bohemcars-sell-mobile__form button {
		display: flex;
		width: 100%;
		min-height: 50px;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 0;
		border-radius: 8px;
		background: #1c1c1c;
		color: #ffffff;
		font-size: 15px;
		font-weight: 900;
		line-height: 20px;
	}

	.bohemcars-sell-mobile__status {
		margin: -2px 0 0;
		color: #4b5563;
		font-size: 13px;
		font-weight: 800;
		line-height: 18px;
	}

	.bohemcars-sell-mobile__contact {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 0.78fr);
		gap: 9px;
	}

	.bohemcars-sell-mobile__contact a {
		display: flex;
		min-height: 48px;
		min-width: 0;
		align-items: center;
		justify-content: center;
		gap: 7px;
		overflow: hidden;
		border-radius: 8px;
		background: var(--bc-surface);
		padding: 0 10px;
		color: #111111;
		font-size: 14px;
		font-weight: 900;
		line-height: 18px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.bohemcars-sell-mobile__contact a:first-child {
		background: #d9f275;
	}

	.bohemcars-sell-mobile__steps {
		display: grid;
		gap: 8px;
	}

	.bohemcars-sell-mobile__steps-title {
		margin: 4px 0 2px;
		color: #111111;
		font-size: 12px;
		font-weight: 900;
		letter-spacing: 0;
		line-height: 16px;
		text-transform: uppercase;
	}

	.bohemcars-sell-mobile__steps article {
		display: grid;
		grid-template-columns: 34px minmax(0, 1fr);
		gap: 12px;
		align-items: center;
		min-height: 62px;
		border: 0;
		border-radius: 10px;
		background: var(--bc-surface);
		padding: 11px 14px;
		color: #111111;
	}

	.bohemcars-sell-mobile__step-num {
		display: flex;
		width: 34px;
		height: 34px;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: #1c1c1c;
		color: #d9f275;
		font-size: 15px;
		font-weight: 900;
		line-height: 1;
	}

	.bohemcars-sell-mobile__steps h2,
	.bohemcars-sell-mobile__steps p {
		margin: 0;
		letter-spacing: 0;
	}

	.bohemcars-sell-mobile__steps h2 {
		color: #111111;
		font-size: 15px;
		font-weight: 900;
		line-height: 19px;
	}

	.bohemcars-sell-mobile__steps p {
		margin-top: 2px;
		color: #56635a;
		font-size: 13px;
		font-weight: 700;
		line-height: 17px;
	}

	@media (max-width: 374px) {
		.bohemcars-sell-mobile__intro {
			min-height: 118px;
		}

		.bohemcars-sell-mobile__intro-copy {
			max-width: 300px;
		}
	}

	@media (max-width: 359px) {
		.bohemcars-sell-mobile__intro h1 {
			font-size: 21.5px;
			line-height: 25px;
		}

		.bohemcars-sell-mobile__intro p {
			font-size: 12.5px;
			line-height: 17px;
		}
	}
</style>
