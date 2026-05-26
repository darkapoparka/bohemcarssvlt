<script lang="ts">
	import type { AuxeroServiceFormData, AuxeroServiceInputField } from '$lib/auxero/services';

	let { form }: { form: AuxeroServiceFormData } = $props();

	const inputClass = (field: AuxeroServiceInputField) =>
		`${field.active ? 'active ' : ''}input-large`;
</script>

<div class="radius-20 services-center-form bg-white">
	<p class="h4 mb-16">{form.title}</p>
	<form action="#" class="send-inquiry bohemcars-service-form" novalidate>
		<div class="lg-grid-cols-1 mb-22 grid grid-cols-2 gap-x-12 gap-y-24">
			{#each form.fields as field (field.name)}
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

			<div>
				<p class="mb-8">{form.serviceLabel}</p>
				<select class="select-style-2" name={form.serviceName}>
					{#each form.serviceOptions as option (option)}
						<option>{option}</option>
					{/each}
				</select>
			</div>

			<div>
				<p class="mb-8">{form.vehicleField.label}</p>
				<input
					class={inputClass(form.vehicleField)}
					id={form.vehicleField.id}
					name={form.vehicleField.name}
					placeholder={form.vehicleField.placeholder}
					required={form.vehicleField.required}
					type={form.vehicleField.type}
				/>
			</div>
		</div>
		<button class="btn btn-primary btn-large font-weight-600 w-full">{form.submitLabel}</button>
		<p class="auxero-form-status text-highlight font-weight-600 mt-12" aria-live="polite"></p>
	</form>
</div>
