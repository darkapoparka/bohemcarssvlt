<script lang="ts">
	import type { AuxeroSellCarFormData, AuxeroSellCarInputField } from '$lib/auxero/sell-your-car';

	let { form }: { form: AuxeroSellCarFormData } = $props();

	const inputClass = (field: AuxeroSellCarInputField) =>
		`${field.active ? 'active ' : ''}input-large`;
</script>

<form action="#" class="calculate-form bohemcars-sell-form" novalidate>
	<div class="mb-28 grid grid-cols-1 gap-15">
		{#each form.fields as field (field.id)}
			<div>
				<p class="mb-8">{field.label}</p>
				<input
					class={inputClass(field)}
					id={field.id}
					name={field.name}
					placeholder={field.placeholder}
					required={field.required}
					type={field.type}
				/>
			</div>
		{/each}
	</div>
	<button type="submit" class="btn btn-primary btn-large font-weight-600 w-full">
		{form.submitLabel}
	</button>
	<p class="auxero-form-status text-highlight font-weight-600 mt-12" aria-live="polite"></p>
</form>
