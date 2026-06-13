<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';
	import { ArrowRight, Camera, Check, ChevronLeft, X } from '@lucide/svelte';

	type WizardInitial = {
		mileage?: string;
		phone?: string;
		price?: string;
		vin?: string;
	};

	let {
		initial,
		onclose
	}: {
		initial?: WizardInitial;
		onclose?: () => void;
	} = $props();

	const stepLabels = ['Автомобил', 'Снимки', 'Преглед'];
	const fuelOptions = ['Бензин', 'Дизел', 'Хибрид', 'Електрически'];
	const gearboxOptions = ['Автомат', 'Ръчни'];
	const conditionOptions = ['Отлично', 'Много добро', 'За ремонт'];
	const accidentOptions = ['Без щети', 'Има щети'];
	const timeOptions = ['9:00 – 12:00', '12:00 – 15:00', '15:00 – 18:00'];
	const yearOptions = Array.from({ length: 19 }, (_, index) => String(2026 - index));

	let step = $state(0);
	let submitted = $state(false);

	/* The wizard deliberately snapshots the fast-form values at mount —
	   it owns its own editable copies from then on. */
	// svelte-ignore state_referenced_locally
	let vin = $state(initial?.vin ?? '');
	// svelte-ignore state_referenced_locally
	let mileage = $state(initial?.mileage ?? '');
	// svelte-ignore state_referenced_locally
	let price = $state(initial?.price ?? '');
	let year = $state('');
	let fuel = $state('');
	let gearbox = $state('');
	let condition = $state('');
	let accidents = $state('');
	// svelte-ignore state_referenced_locally
	let phone = $state(initial?.phone ?? '');
	let contactTime = $state('');

	type PhotoSlot = { key: string; label: string; url: string | null };
	const photoSlots = $state<PhotoSlot[]>([
		{ key: 'front', label: 'Отпред', url: null },
		{ key: 'rear', label: 'Отзад', url: null },
		{ key: 'interior', label: 'Интериор', url: null },
		{ key: 'dash', label: 'Табло', url: null },
		{ key: 'engine', label: 'Двигател', url: null },
		{ key: 'extra', label: 'Друго', url: null }
	]);
	const photoCount = $derived(photoSlots.filter((slot) => slot.url).length);

	const canContinue = $derived(
		step === 0 ? vin.trim().length >= 5 : step === 2 ? phone.trim().length >= 6 : true
	);
	const carSummary = $derived([year, fuel, gearbox].filter(Boolean).join(' · ') || 'По телефона');

	const setPhoto = (slot: PhotoSlot, files: FileList | null) => {
		const file = files?.[0];
		if (!file) return;
		if (slot.url) URL.revokeObjectURL(slot.url);
		slot.url = URL.createObjectURL(file);
	};
	const clearPhoto = (slot: PhotoSlot) => {
		if (!slot.url) return;
		URL.revokeObjectURL(slot.url);
		slot.url = null;
	};
	const goBack = () => {
		if (step > 0) step -= 1;
	};
	const goNext = () => {
		if (!canContinue) return;
		if (step < 2) {
			step += 1;
			return;
		}

		submitted = true;
		if (browser) {
			try {
				localStorage.setItem(
					'bohemcars:sell-wizard',
					JSON.stringify({
						accidents,
						condition,
						contactTime,
						fuel,
						gearbox,
						mileage,
						phone,
						photoCount,
						price,
						submittedAt: new Date().toISOString(),
						vin,
						year
					})
				);
			} catch {
				/* prototype storage only */
			}
		}
	};

	onDestroy(() => {
		photoSlots.forEach((slot) => {
			if (slot.url) URL.revokeObjectURL(slot.url);
		});
	});
</script>

<div class="bc-sell-wizard">
	<header class="bc-sell-wizard__header">
		<div>
			<p>По-точна оферта</p>
			<h2>Снимки и детайли</h2>
		</div>
		{#if onclose}
			<button type="button" aria-label="Затвори" onclick={onclose}>
				<X size={20} strokeWidth={2.3} aria-hidden="true" />
			</button>
		{/if}
	</header>

	{#if submitted}
		<div class="bc-sell-wizard__success">
			<span aria-hidden="true"><Check size={26} strokeWidth={2.6} /></span>
			<h3>Заявката е приета</h3>
			<p>
				Екипът преглежда историята и снимките и се обажда до 24 ч с конкретна оферта и следващ ход.
			</p>
			<button type="button" onclick={() => onclose?.()}>Готово</button>
		</div>
	{:else}
		<div class="bc-sell-wizard__progress" aria-hidden="true">
			{#each stepLabels as label, index (label)}
				<span class:done={index <= step}></span>
			{/each}
		</div>
		<p class="bc-sell-wizard__step-label">
			Стъпка {step + 1} от {stepLabels.length} · <strong>{stepLabels[step]}</strong>
		</p>

		{#if step === 0}
			<div class="bc-sell-wizard__fields">
				<label class="bc-sell-wizard__field--wide" for="sell-wizard-vin">
					<span>VIN номер</span>
					<input
						id="sell-wizard-vin"
						type="text"
						placeholder="Например WBA..."
						autocomplete="off"
						bind:value={vin}
					/>
				</label>
				<label for="sell-wizard-mileage">
					<span>Пробег</span>
					<input
						id="sell-wizard-mileage"
						type="text"
						inputmode="numeric"
						placeholder="Пробег в км"
						bind:value={mileage}
					/>
				</label>
				<label for="sell-wizard-price">
					<span>Очаквана цена</span>
					<input
						id="sell-wizard-price"
						type="text"
						inputmode="numeric"
						placeholder="Цена в EUR"
						bind:value={price}
					/>
				</label>
				<label for="sell-wizard-year">
					<span>Година</span>
					<select id="sell-wizard-year" bind:value={year}>
						<option value="">Избери</option>
						{#each yearOptions as option (option)}
							<option value={option}>{option}</option>
						{/each}
					</select>
				</label>
				<label for="sell-wizard-fuel">
					<span>Гориво</span>
					<select id="sell-wizard-fuel" bind:value={fuel}>
						<option value="">Избери</option>
						{#each fuelOptions as option (option)}
							<option value={option}>{option}</option>
						{/each}
					</select>
				</label>

				<fieldset class="bc-sell-wizard__field--wide">
					<legend>Скорости</legend>
					<div class="bc-sell-wizard__chips">
						{#each gearboxOptions as option (option)}
							<button
								type="button"
								class:active={gearbox === option}
								aria-pressed={gearbox === option}
								onclick={() => (gearbox = gearbox === option ? '' : option)}
							>
								{option}
							</button>
						{/each}
					</div>
				</fieldset>
				<fieldset class="bc-sell-wizard__field--wide">
					<legend>Състояние</legend>
					<div class="bc-sell-wizard__chips">
						{#each conditionOptions as option (option)}
							<button
								type="button"
								class:active={condition === option}
								aria-pressed={condition === option}
								onclick={() => (condition = condition === option ? '' : option)}
							>
								{option}
							</button>
						{/each}
					</div>
				</fieldset>
				<fieldset class="bc-sell-wizard__field--wide">
					<legend>Удари и щети</legend>
					<div class="bc-sell-wizard__chips">
						{#each accidentOptions as option (option)}
							<button
								type="button"
								class:active={accidents === option}
								aria-pressed={accidents === option}
								onclick={() => (accidents = accidents === option ? '' : option)}
							>
								{option}
							</button>
						{/each}
					</div>
				</fieldset>
			</div>
		{:else if step === 1}
			<div class="bc-sell-wizard__photos">
				{#each photoSlots as slot (slot.key)}
					{#if slot.url}
						<div class="bc-sell-wizard__photo bc-sell-wizard__photo--filled">
							<img src={slot.url} alt={slot.label} />
							<button
								type="button"
								aria-label={`Премахни снимка: ${slot.label}`}
								onclick={() => clearPhoto(slot)}
							>
								<X size={14} strokeWidth={2.5} aria-hidden="true" />
							</button>
							<span>{slot.label}</span>
						</div>
					{:else}
						<label class="bc-sell-wizard__photo">
							<input
								type="file"
								accept="image/*"
								onchange={(event) => setPhoto(slot, event.currentTarget.files)}
							/>
							<Camera size={20} strokeWidth={2} aria-hidden="true" />
							<span>{slot.label}</span>
						</label>
					{/if}
				{/each}
			</div>
			<p class="bc-sell-wizard__hint">
				Снимки при дневна светлина дават най-точна оценка. Стъпката не е задължителна.
			</p>
		{:else}
			<div class="bc-sell-wizard__fields">
				<label class="bc-sell-wizard__field--wide" for="sell-wizard-phone">
					<span>Телефон за контакт</span>
					<input
						id="sell-wizard-phone"
						type="tel"
						inputmode="tel"
						autocomplete="tel"
						placeholder="Вашият телефон"
						bind:value={phone}
					/>
				</label>
				<label class="bc-sell-wizard__field--wide" for="sell-wizard-time">
					<span>Удобно време за обаждане</span>
					<select id="sell-wizard-time" bind:value={contactTime}>
						<option value="">Без значение</option>
						{#each timeOptions as option (option)}
							<option value={option}>{option}</option>
						{/each}
					</select>
				</label>
			</div>
			<dl class="bc-sell-wizard__summary">
				<div>
					<dt>VIN</dt>
					<dd>{vin.trim() || '—'}</dd>
				</div>
				<div>
					<dt>Автомобил</dt>
					<dd>{carSummary}</dd>
				</div>
				<div>
					<dt>Пробег и цена</dt>
					<dd>{[mileage.trim(), price.trim()].filter(Boolean).join(' км · ') || '—'}</dd>
				</div>
				<div>
					<dt>Състояние</dt>
					<dd>{[condition, accidents].filter(Boolean).join(' · ') || '—'}</dd>
				</div>
				<div>
					<dt>Снимки</dt>
					<dd>{photoCount ? `${photoCount} добавени` : 'Без снимки'}</dd>
				</div>
			</dl>
			<p class="bc-sell-wizard__promise">Отговор до 24 ч</p>
		{/if}

		<footer class="bc-sell-wizard__nav">
			{#if step > 0}
				<button type="button" class="bc-sell-wizard__back" onclick={goBack}>
					<ChevronLeft size={18} strokeWidth={2.4} aria-hidden="true" />
					Назад
				</button>
			{/if}
			<button type="button" class="bc-sell-wizard__next" disabled={!canContinue} onclick={goNext}>
				{step < 2 ? 'Продължи' : 'Изпрати заявка'}
				<ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
			</button>
		</footer>
	{/if}
</div>

<style>
	.bc-sell-wizard {
		display: grid;
		gap: 14px;
		min-width: 0;
		color: #111111;
	}

	.bc-sell-wizard__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.bc-sell-wizard__header p {
		margin: 0 0 2px;
		color: #4c6b12;
		font-size: 12px;
		font-weight: 700;
		line-height: 16px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.bc-sell-wizard__header h2 {
		margin: 0;
		color: #111111;
		font-size: 20px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 25px;
	}

	.bc-sell-wizard__header button {
		display: flex;
		width: 44px;
		height: 44px;
		flex: 0 0 44px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 999px;
		background: var(--bc-surface-soft);
		color: #111111;
		cursor: pointer;
		padding: 0;
	}

	.bc-sell-wizard__progress {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 6px;
	}

	.bc-sell-wizard__progress span {
		height: 5px;
		border-radius: 999px;
		background: var(--bc-border);
	}

	.bc-sell-wizard__progress span.done {
		background: #8fca1a;
	}

	.bc-sell-wizard__step-label {
		margin: -6px 0 0;
		color: #56635a;
		font-size: 13px;
		font-weight: 500;
		line-height: 17px;
	}

	.bc-sell-wizard__step-label strong {
		color: #111111;
		font-weight: 700;
	}

	.bc-sell-wizard__fields {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px 8px;
	}

	.bc-sell-wizard__fields label,
	.bc-sell-wizard__fields fieldset {
		display: grid;
		gap: 6px;
		min-width: 0;
		margin: 0;
		border: 0;
		padding: 0;
	}

	.bc-sell-wizard__field--wide {
		grid-column: 1 / -1;
	}

	.bc-sell-wizard__fields span,
	.bc-sell-wizard__fields legend {
		color: #4f5d57;
		font-size: 12px;
		font-weight: 700;
		line-height: 15px;
		padding: 0;
	}

	.bc-sell-wizard__fields input,
	.bc-sell-wizard__fields select {
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

	.bc-sell-wizard__fields select {
		appearance: auto;
	}

	.bc-sell-wizard__fields input::placeholder {
		color: #8f9892;
		opacity: 1;
	}

	.bc-sell-wizard__fields input:focus-visible,
	.bc-sell-wizard__fields select:focus-visible {
		border-color: #8fbd24 !important;
		background: #ffffff !important;
	}

	.bc-sell-wizard__chips {
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
	}

	.bc-sell-wizard__chips button {
		display: inline-flex;
		min-height: 40px;
		align-items: center;
		border: 1px solid var(--bc-border);
		border-radius: 999px;
		background: #ffffff;
		color: #111111;
		cursor: pointer;
		font-size: 13.5px;
		font-weight: 600;
		line-height: 17px;
		padding: 0 14px;
	}

	.bc-sell-wizard__chips button.active {
		border-color: transparent;
		background: var(--bc-accent-bright-soft);
		color: #14210f;
		font-weight: 700;
	}

	.bc-sell-wizard__photos {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
	}

	.bc-sell-wizard__photo {
		position: relative;
		display: grid;
		gap: 5px;
		aspect-ratio: 1;
		align-content: center;
		justify-items: center;
		overflow: hidden;
		margin: 0;
		border: 1px dashed #c9d3c2;
		border-radius: 10px;
		background: var(--bc-surface-soft);
		color: #56635a;
		cursor: pointer;
	}

	.bc-sell-wizard__photo input {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}

	.bc-sell-wizard__photo span {
		font-size: 12px;
		font-weight: 600;
		line-height: 15px;
	}

	.bc-sell-wizard__photo :global(svg) {
		color: #6f7d68;
		stroke: #6f7d68;
	}

	.bc-sell-wizard__photo--filled {
		display: block;
		border: 1px solid var(--bc-border);
		cursor: default;
	}

	.bc-sell-wizard__photo--filled img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.bc-sell-wizard__photo--filled span {
		position: absolute;
		bottom: 5px;
		left: 5px;
		border-radius: 999px;
		background: rgba(20, 33, 15, 0.78);
		color: #ffffff;
		font-size: 10.5px;
		font-weight: 600;
		line-height: 14px;
		padding: 2px 8px;
	}

	.bc-sell-wizard__photo--filled button {
		position: absolute;
		top: 5px;
		right: 5px;
		display: flex;
		width: 28px;
		height: 28px;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 999px;
		background: #ffffff;
		color: #111111;
		cursor: pointer;
		padding: 0;
	}

	.bc-sell-wizard__photo--filled button :global(svg) {
		color: #111111;
		stroke: #111111;
	}

	.bc-sell-wizard__hint {
		margin: -4px 0 0;
		color: #56635a;
		font-size: 13px;
		font-weight: 500;
		line-height: 18px;
	}

	.bc-sell-wizard__summary {
		display: grid;
		gap: 0;
		margin: 0;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: #ffffff;
		overflow: hidden;
	}

	.bc-sell-wizard__summary div {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		padding: 10px 12px;
	}

	.bc-sell-wizard__summary div + div {
		border-top: 1px solid #edf0e8;
	}

	.bc-sell-wizard__summary dt {
		color: #56635a;
		font-size: 12.5px;
		font-weight: 600;
		line-height: 17px;
		white-space: nowrap;
	}

	.bc-sell-wizard__summary dd {
		margin: 0;
		color: #111111;
		font-size: 13.5px;
		font-weight: 700;
		line-height: 18px;
		overflow-wrap: anywhere;
		text-align: right;
	}

	.bc-sell-wizard__promise {
		width: fit-content;
		margin: 0;
		border-radius: 999px;
		background: rgba(143, 202, 26, 0.18);
		color: #3a540e;
		font-size: 12px;
		font-weight: 700;
		line-height: 17px;
		padding: 6px 11px;
	}

	.bc-sell-wizard__nav {
		display: flex;
		gap: 8px;
	}

	.bc-sell-wizard__back {
		display: inline-flex;
		min-height: 48px;
		flex: 0 0 auto;
		align-items: center;
		gap: 5px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-soft);
		color: #111111;
		cursor: pointer;
		font-size: 14px;
		font-weight: 700;
		line-height: 18px;
		padding: 0 14px;
	}

	.bc-sell-wizard__next {
		display: flex;
		min-height: 48px;
		flex: 1 1 auto;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 0;
		border-radius: 8px;
		background: #1c1c1c;
		color: #ffffff;
		cursor: pointer;
		font-size: 15px;
		font-weight: 700;
		line-height: 19px;
		padding: 0 16px;
	}

	.bc-sell-wizard__next:disabled {
		background: #d4d9d0;
		color: #6b746a;
		cursor: not-allowed;
	}

	.bc-sell-wizard__nav :global(svg),
	.bc-sell-wizard__header button :global(svg) {
		color: currentColor;
		stroke: currentColor;
	}

	.bc-sell-wizard__success {
		display: grid;
		gap: 10px;
		justify-items: start;
		padding: 6px 0 2px;
	}

	.bc-sell-wizard__success span {
		display: flex;
		width: 52px;
		height: 52px;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: var(--bc-accent-bright-soft);
		color: #14210f;
	}

	.bc-sell-wizard__success span :global(svg) {
		color: #14210f;
		stroke: #14210f;
	}

	.bc-sell-wizard__success h3 {
		margin: 2px 0 0;
		color: #111111;
		font-size: 19px;
		font-weight: 700;
		line-height: 24px;
	}

	.bc-sell-wizard__success p {
		margin: 0;
		color: #56635a;
		font-size: 14px;
		font-weight: 500;
		line-height: 19px;
	}

	.bc-sell-wizard__success button {
		display: flex;
		min-height: 48px;
		width: 100%;
		align-items: center;
		justify-content: center;
		margin-top: 4px;
		border: 0;
		border-radius: 8px;
		background: #1c1c1c;
		color: #ffffff;
		cursor: pointer;
		font-size: 15px;
		font-weight: 700;
		line-height: 19px;
	}
</style>
