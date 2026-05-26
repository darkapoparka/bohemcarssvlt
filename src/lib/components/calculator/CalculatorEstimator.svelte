<script lang="ts">
	import { resolve } from '$app/paths';
	import { formatEur, type AuxeroCalculatorData } from '$lib/auxero/calculator';

	let { calculator }: { calculator: AuxeroCalculatorData } = $props();

	const inputClass = (active: boolean) => `${active ? 'active ' : ''}input-large`;
</script>

<div class="lg-grid-cols-1 grid grid-cols-2 gap-40" data-bohemcars-calculator>
	<div class="border-box">
		<p class="h3 mb-28">Calculate Estimated Landed Cost</p>
		<form action="#" class="calculate-form" novalidate>
			<div class="grid grid-cols-1 gap-15">
				{#each calculator.fields as field (field.key)}
					<div>
						<p class="mb-8">
							{field.label}
							{#if field.mutedLabel}
								<span class="text-muted">{field.mutedLabel}</span>
							{/if}
						</p>
						<input
							class={inputClass(field.active)}
							data-bohemcars-calc-input={field.key}
							min={field.min}
							name={field.name}
							step={field.step}
							type="number"
							value={field.value}
						/>
					</div>
				{/each}
			</div>
		</form>
	</div>
	<div class="border-box">
		<p class="h3 mb-8">{calculator.title}</p>
		<p class="mb-10">
			<span class="text-56 font-weight-600" data-bohemcars-calc-output="total">
				{formatEur(calculator.total)}
			</span>
		</p>
		<p class="h5 mb-28 capitalize">{calculator.totalNote}</p>
		<div class="divider mb-28 w-full"></div>
		<p class="h4 mb-20">{calculator.subtitle}</p>
		<div class="mb-28 flex flex-col gap-18">
			{#each calculator.summaryRows as row (row.key)}
				<p class="flex justify-between gap-8">
					<span class="h7 text-secondary">{row.label}</span>
					<span class="h7" data-bohemcars-calc-output={row.key}>{formatEur(row.value)}</span>
				</p>
			{/each}
		</div>
		<div class="divider mb-28 w-full"></div>
		<div class="mb-16 flex justify-between gap-8">
			<p class="h4">Estimated Total</p>
			<p class="h4" data-bohemcars-calc-output="totalSmall">{formatEur(calculator.total)}</p>
		</div>
		<a
			href={resolve(calculator.ctaHref as '/')}
			class="btn btn-primary btn-large font-weight-600 w-full"
		>
			{calculator.ctaLabel}
		</a>
	</div>
</div>
