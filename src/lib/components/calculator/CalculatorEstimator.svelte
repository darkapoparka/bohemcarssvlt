<script lang="ts">
	import { resolve } from '$app/paths';
	import { formatEur, type AuxeroCalculatorData } from '$lib/auxero/calculator';

	let { calculator }: { calculator: AuxeroCalculatorData } = $props();

	const inputClass = (active: boolean) => `${active ? 'active ' : ''}input-large`;
</script>

<div class="lg-grid-cols-1 grid grid-cols-2 gap-40" data-bohemcars-calculator>
	<div class="border-box">
		<p class="h3 mb-28">Изчисли ориентировъчната крайна цена</p>
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
							aria-label={field.label}
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

<style>
	@media (max-width: 767.98px) {
		[data-bohemcars-calculator] {
			display: grid !important;
			grid-template-columns: minmax(0, 1fr) !important;
			gap: 10px !important;
			min-width: 0;
		}

		[data-bohemcars-calculator] :global(.border-box) {
			width: 100%;
			min-width: 0;
			border-color: transparent !important;
			border-radius: 8px !important;
			background: #eef3e9 !important;
			padding: 17px !important;
		}

		[data-bohemcars-calculator] :global(.border-box:last-child) {
			border-color: #111111 !important;
			background: #111111 !important;
			color: #ffffff !important;
		}

		[data-bohemcars-calculator] :global(.border-box:last-child p),
		[data-bohemcars-calculator] :global(.border-box:last-child span),
		[data-bohemcars-calculator] :global(.border-box:last-child .h3),
		[data-bohemcars-calculator] :global(.border-box:last-child .h4),
		[data-bohemcars-calculator] :global(.border-box:last-child .h5),
		[data-bohemcars-calculator] :global(.border-box:last-child .h7) {
			color: inherit !important;
		}

		[data-bohemcars-calculator] :global(.border-box:last-child .text-secondary) {
			color: rgb(255 255 255 / 0.68) !important;
		}

		[data-bohemcars-calculator] :global(.border-box:last-child .text-56),
		[data-bohemcars-calculator]
			:global(.border-box:last-child [data-bohemcars-calc-output='total']) {
			color: #d9f275 !important;
		}

		[data-bohemcars-calculator] :global(.border-box:last-child .divider) {
			background: rgb(255 255 255 / 0.18) !important;
		}

		[data-bohemcars-calculator] :global(.border-box > .h3) {
			margin-bottom: 14px !important;
			font-size: 22px !important;
			font-weight: 700 !important;
			line-height: 28px !important;
		}

		[data-bohemcars-calculator] :global(.calculate-form) {
			width: 100%;
			min-width: 0;
		}

		[data-bohemcars-calculator] :global(.calculate-form > .grid) {
			gap: 11px !important;
		}

		[data-bohemcars-calculator] :global(.calculate-form p),
		[data-bohemcars-calculator] :global(.h7) {
			font-size: 14px !important;
			font-weight: 600 !important;
			line-height: 18px !important;
		}

		[data-bohemcars-calculator] :global(input) {
			width: 100%;
			height: 48px !important;
			border-radius: 8px !important;
			font-size: 16px !important;
			line-height: 22px !important;
			padding: 0 13px !important;
		}

		[data-bohemcars-calculator] :global(.text-56) {
			font-size: 36px !important;
			line-height: 42px !important;
		}

		[data-bohemcars-calculator] :global(.h5) {
			margin-bottom: 18px !important;
			font-size: 14px !important;
			font-weight: 500 !important;
			line-height: 20px !important;
		}

		[data-bohemcars-calculator] :global(.divider) {
			margin-bottom: 18px !important;
		}

		[data-bohemcars-calculator] :global(.mb-28.flex.flex-col) {
			gap: 11px !important;
			margin-bottom: 18px !important;
		}

		[data-bohemcars-calculator] :global(.btn) {
			min-height: 50px;
			border-radius: 8px !important;
		}

		[data-bohemcars-calculator] :global(.border-box:last-child .btn) {
			border-color: #d9f275 !important;
			background: #d9f275 !important;
			color: #111111 !important;
		}
	}
</style>
