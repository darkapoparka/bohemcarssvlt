<script lang="ts">
	import { CircleAlert, CircleDollarSign } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import type { Vehicle } from '$lib/data/vehicles';
	import { calculateMonthlyPayment, formatPrice } from '$lib/utils/format';
	import { cn } from '$lib/utils/cn';

	interface Props {
		vehicle: Vehicle;
	}

	let { vehicle }: Props = $props();
	let tab = $state<'Cash' | 'Finance'>('Finance');
	let downPayment = $state(1560);
	let months = $state(72);
	let rate = $state(7.89);
	let calculatorDirty = $state(false);
	let calculatorOpen = $state(false);
	const payment = $derived(
		calculatorDirty
			? calculateMonthlyPayment(vehicle.price, rate, months, downPayment)
			: vehicle.monthly
	);

	function setTab(item: string) {
		tab = item === 'Cash' ? 'Cash' : 'Finance';
	}
</script>

<section class="detail-side-card finance-panel">
	<div class="finance-tabs">
		{#each ['Cash', 'Finance'] as item (item)}
			<button class={cn(tab === item && 'active')} type="button" onclick={() => setTab(item)}>
				{item}
			</button>
		{/each}
	</div>

	<p class="detail-label">Price:</p>
	{#if tab === 'Cash'}
		<p class="finance-price">{formatPrice(vehicle.price)}</p>
		<p class="muted">List price w/o taxes, fees, and accessories</p>
	{:else}
		<p class="finance-price">{formatPrice(payment)}/mo</p>
		<p class="muted">Finance payment w/o taxes, fees, and accessories</p>
		<p class="muted">{formatPrice(downPayment)} due at signing · {months} mo · {rate}% APR</p>
		{#if calculatorOpen}
			<div class="finance-inputs">
				<label>
					<span>Down</span>
					<input
						type="number"
						bind:value={downPayment}
						min="0"
						step="500"
						oninput={() => (calculatorDirty = true)}
					/>
				</label>
				<label>
					<span>Months</span>
					<input
						type="number"
						bind:value={months}
						min="12"
						max="84"
						step="12"
						oninput={() => (calculatorDirty = true)}
					/>
				</label>
				<label>
					<span>APR</span>
					<input
						type="number"
						bind:value={rate}
						min="0"
						step="0.25"
						oninput={() => (calculatorDirty = true)}
					/>
				</label>
			</div>
		{/if}
	{/if}
	<p class="vat-line">
		<CircleAlert size={19} />
		<a href={resolve('/financing')}>Vehicle in the VAT system</a>
	</p>
	<button
		class="finance-panel__stamp"
		type="button"
		onclick={() => (calculatorOpen = !calculatorOpen)}
	>
		<CircleDollarSign size={20} />
		Instant local calculator
	</button>
</section>
