<script lang="ts">
	import type { Vehicle } from '$lib/data/vehicles';
	import { formatMileage } from '$lib/utils/format';

	interface Props {
		vehicle: Vehicle;
	}

	let { vehicle }: Props = $props();

	const isLockedAuxeroDetail = $derived(vehicle.slug === 'audi-a6-avant-e-tron');
	const specs = $derived([
		{
			label: 'Mileage:',
			value: isLockedAuxeroDetail ? '51600 km' : formatMileage(vehicle.mileage),
			icon: '/assets/icons/icon-gauge.svg'
		},
		{ label: 'Years:', value: String(vehicle.year), icon: '/assets/icons/calendar.svg' },
		{
			label: 'Fuel:',
			value: isLockedAuxeroDetail ? 'Petrol' : vehicle.fuel,
			icon: '/assets/icons/gaspump.svg'
		},
		{
			label: 'Color:',
			value: isLockedAuxeroDetail ? 'White' : vehicle.exterior,
			icon: '/assets/icons/palette.svg'
		},
		{ label: 'Location:', value: vehicle.location, icon: '/assets/icons/MapPin.svg' },
		{ label: 'Interior:', value: vehicle.interior, icon: '/assets/icons/Seatbelt.svg' },
		{ label: 'Engine:', value: vehicle.engine, icon: '/assets/icons/Frame.svg' },
		{
			label: 'Transmission:',
			value: vehicle.transmission,
			icon: '/assets/icons/manual.svg'
		},
		{ label: 'VIN:', value: vehicle.vin, icon: '/assets/icons/Frame.svg' },
		{ label: 'Stock Number:', value: vehicle.stockNumber, icon: '/assets/icons/Frame.svg' }
	]);
</script>

<section class="detail-side-card">
	<h3>Car Overview</h3>
	<ul class="overview-list">
		{#each specs as spec (spec.label)}
			<li>
				<span>
					<img src={spec.icon} alt="" />
					{spec.label}
				</span>
				<strong>{spec.value}</strong>
			</li>
		{/each}
	</ul>
</section>
