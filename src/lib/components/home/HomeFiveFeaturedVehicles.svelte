<script lang="ts">
	import { resolve } from '$app/paths';
	import type {
		HomeFiveVehicleCardData,
		HomeFiveVehiclePill,
		HomeFiveVehiclePillIcon
	} from '$lib/auxero/home-five';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import HomeFiveVehicleCard from './HomeFiveVehicleCard.svelte';

	let {
		copy,
		pills,
		vehicles
	}: {
		copy: HomePageCopy;
		pills: HomeFiveVehiclePill[];
		vehicles: HomeFiveVehicleCardData[];
	} = $props();

	const mobileFeaturedTitle = $derived(
		copy.featuredTitle === 'Available Vehicles' ? 'Newest' : 'Нови коли'
	);
</script>

{#if vehicles.length}
	<section class="bohemcars-featured-vehicles background-light py-100" data-bohemcars-home-vehicles>
		<div class="container">
			<div class="bohemcars-home-section-surface">
				<div class="bohemcars-stock-unit wow fadeInUp mb-38" data-wow-delay="0.1s">
					<div class="bohemcars-stock-banner">
						<img
							class="bohemcars-stock-banner__car bohemcars-stock-banner__car--left"
							src="/assets/bohemcars/megamenu/inventory-bmw-x5-cutout.png"
							alt=""
							loading="lazy"
						/>
						<img
							class="bohemcars-stock-banner__car bohemcars-stock-banner__car--right"
							src="/assets/bohemcars/megamenu/inventory-audi-a7-cutout.png"
							alt=""
							loading="lazy"
						/>
						<div class="bohemcars-stock-banner__copy">
							<h2 data-mobile-title={mobileFeaturedTitle}>{copy.featuredTitle}</h2>
						</div>
						<a
							href={resolve('/inventory?view=4')}
							class="bohemcars-stock-banner__cta btn btn-primary-3 btn-large"
						>
							{copy.commonCta}
						</a>
					</div>
					<div class="bohemcars-vehicle-pills flex items-center gap-8 overflow-x-auto">
						<ul class="menu-tab menu-tab-style2 gap-10">
							{#each pills as pill (pill.href)}
								<li
									class={`bohemcars-quick-pill bohemcars-${pill.kind === 'body' ? 'type' : pill.kind}-pill bohemcars-vehicle-pill car-box ${pill.active ? 'active' : ''}`}
								>
									<a href={resolve(pill.href)}>
										{#if pill.icon}
											{@render vehicleIcon(pill.icon)}
										{:else if pill.image}
											<img
												class={`bohemcars-pill-image bohemcars-pill-image--${pill.kind}`}
												src={pill.image}
												alt=""
											/>
										{/if}
										<span>{pill.label}</span>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				</div>
				<div
					class="bohemcars-home-vehicle-grid wow fadeIn lg-grid-cols-2 sm-grid-cols-1 grid grid-cols-4 gap-30"
					data-wow-delay="0.1s"
				>
					{#each vehicles as vehicle (vehicle.slug)}
						<HomeFiveVehicleCard {vehicle} copy={copy.vehicleCard} />
					{/each}
				</div>
			</div>
		</div>
	</section>
{/if}

{#snippet vehicleIcon(icon: HomeFiveVehiclePillIcon)}
	{#if icon === 'sedan'}
		<svg
			class={`bohemcars-type-icon bohemcars-type-icon--${icon}`}
			width="41"
			height="18"
			viewBox="0 0 41 18"
			fill="none"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M8.88597 17.2766C10.6675 17.2766 12.1118 15.8323 12.1118 14.0508C12.1118 12.2692 10.6675 10.825 8.88597 10.825C7.1044 10.825 5.66016 12.2692 5.66016 14.0508C5.66016 15.8323 7.1044 17.2766 8.88597 17.2766Z"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M31.468 17.2766C33.2496 17.2766 34.6938 15.8323 34.6938 14.0508C34.6938 12.2692 33.2496 10.825 31.468 10.825C29.6864 10.825 28.2422 12.2692 28.2422 14.0508C28.2422 15.8323 29.6864 17.2766 31.468 17.2766Z"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M12.1133 14.0494H28.2424"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M34.6936 14.0484H40.5001V9.53228C37.5324 7.46776 34.0485 6.30647 30.4356 6.30647H29.5323L25.7904 1.53226C25.2743 0.887097 24.5001 0.5 23.7259 0.5H10.6936C10.4355 0.5 10.0484 0.629034 9.79034 0.758066L5.6613 4.37098H3.08065C2.30646 4.37098 1.79033 4.88711 1.79033 5.6613V9.53228L0.5 10.8226V12.7581L5.6613 14.0484"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M14.6927 8.23975H13.4023"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M21.1458 8.23975H19.8555"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M29.5313 6.30647H12.1119L9.53125 5.01614V3.72582L13.4022 0.5"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M1.78906 9.53134H3.07939C3.85358 9.53134 4.36971 9.01521 4.36971 8.24101C4.36971 7.46681 3.85358 6.95068 3.07939 6.95068H1.78906"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M36.6289 7.59521V9.5307C36.6289 10.3049 37.145 10.821 37.9192 10.821H40.4999"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M17.9219 0.5V6.30647"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if icon === 'suv'}
		<svg
			class={`bohemcars-type-icon bohemcars-type-icon--${icon}`}
			width="41"
			height="18"
			viewBox="0 0 41 18"
			fill="none"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M29.6618 14.6937H11.9844"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M35.8548 14.6937H37.2742L40.5 13.4033V8.24206L30.1774 5.66141L26.5645 2.04851C25.5323 1.01625 24.2419 0.500122 22.9516 0.500122H7.59677C4.75806 1.79044 2.30644 3.98399 1.01612 6.95173L0.5 8.24206V12.7582L5.01613 14.6937H5.79033"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M40.4992 9.53235H37.2734L37.9186 12.113H40.4992"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M0.5 8.24207H3.72581L3.20969 9.66142C2.82259 10.6937 1.66129 11.4679 0.5 11.4679"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M10.8228 0.500122L8.24219 4.37109L9.53251 5.66141H30.1777"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M8.88596 17.2744C10.6675 17.2744 12.1118 15.8301 12.1118 14.0486C12.1118 12.267 10.6675 10.8228 8.88596 10.8228C7.1044 10.8228 5.66016 12.267 5.66016 14.0486C5.66016 15.8301 7.1044 17.2744 8.88596 17.2744Z"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M32.7571 17.2744C34.5386 17.2744 35.9829 15.8301 35.9829 14.0486C35.9829 12.267 34.5386 10.8228 32.7571 10.8228C30.9755 10.8228 29.5312 12.267 29.5312 14.0486C29.5312 15.8301 30.9755 17.2744 32.7571 17.2744Z"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M7.59551 0.500122L4.36971 5.66141H1.78906"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M19.2109 5.66141V0.500122"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M12.1145 8.24207H10.8242"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M19.8555 8.24207H21.791"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if icon === 'pickup'}
		<svg
			class={`bohemcars-type-icon bohemcars-type-icon--${icon}`}
			width="41"
			height="18"
			viewBox="0 0 41 18"
			fill="none"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M10.8235 17.2742C12.605 17.2742 14.0493 15.83 14.0493 14.0484C14.0493 12.2669 12.605 10.8226 10.8235 10.8226C9.0419 10.8226 7.59766 12.2669 7.59766 14.0484C7.59766 15.83 9.0419 17.2742 10.8235 17.2742Z"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M33.4016 17.2742C35.1832 17.2742 36.6274 15.83 36.6274 14.0484C36.6274 12.2669 35.1832 10.8226 33.4016 10.8226C31.62 10.8226 30.1758 12.2669 30.1758 14.0484C30.1758 15.83 31.62 17.2742 33.4016 17.2742Z"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M7.59677 14.0484H1.79032L0.5 12.7581V5.66129H13.4032V0.5H24.1129C24.7581 0.5 25.2742 0.758057 25.6613 1.01612L31.4677 5.66129L39.3387 6.82257C39.9839 6.9516 40.5 7.46773 40.5 8.1129V12.7581C40.5 13.5323 39.9839 14.0484 39.2097 14.0484H36.629"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M30.1759 14.0483H14.0469"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M21.1445 0.5V5.66129"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M22.4349 8.24194H21.1445"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M0.5 7.5968H4.37097L3.46774 9.01616C3.20968 9.27423 2.95161 9.53229 2.56452 9.53229H0.629033"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M40.4986 10.1774H37.918V8.24194H40.4986"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if icon === 'luxury'}
		<svg
			class={`bohemcars-type-icon bohemcars-type-icon--${icon}`}
			width="41"
			height="16"
			viewBox="0 0 41 16"
			fill="none"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M29.832 11.8334H11.832"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M36.4999 11.8333H40.4999V8.49999V7.83332C40.4999 7.83332 40.6333 5.16666 28.5 4.49999C27.1666 3.16666 25.7 2.23333 24.1 1.56667C22.5 0.900003 20.6333 0.5 18.9 0.5H15.7C15.5666 0.5 15.4333 0.5 15.3 0.5C14.2333 0.5 13.3 0.766668 12.2333 1.03333L9.83332 1.7L7.16666 2.5H1.83333L1.16667 4.49999V6.49999L0.5 7.83332L1.16667 11.1666L5.16666 11.7"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M8.5013 15.1667C10.3422 15.1667 11.8346 13.6743 11.8346 11.8333C11.8346 9.99238 10.3422 8.5 8.5013 8.5C6.66035 8.5 5.16797 9.99238 5.16797 11.8333C5.16797 13.6743 6.66035 15.1667 8.5013 15.1667Z"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M33.1654 15.1667C35.0063 15.1667 36.4987 13.6743 36.4987 11.8333C36.4987 9.99238 35.0063 8.5 33.1654 8.5C31.3244 8.5 29.832 9.99238 29.832 11.8333C29.832 13.6743 31.3244 15.1667 33.1654 15.1667Z"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M1.16797 4.5H4.5013L3.16797 6.5H1.16797"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M9.83203 1.83337L10.632 2.90004C11.432 3.96671 12.632 4.50004 13.832 4.50004H28.4987"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M17.8333 6.5H16.5"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M28.4987 7.83337L27.5653 9.30004C27.2987 9.70004 26.8987 9.83337 26.4987 9.83337H17.832"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M15.168 0.5V4.49999"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M36.5 5.83337L37.0333 6.90004C37.5667 7.83337 38.5 8.50004 39.5667 8.50004H40.5"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if icon === 'crossover'}
		<svg
			class={`bohemcars-type-icon bohemcars-type-icon--${icon}`}
			width="41"
			height="16"
			viewBox="0 0 41 16"
			fill="none"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M9.53049 14.6937C11.3121 14.6937 12.7563 13.2494 12.7563 11.4679C12.7563 9.68631 11.3121 8.24207 9.53049 8.24207C7.74893 8.24207 6.30469 9.68631 6.30469 11.4679C6.30469 13.2494 7.74893 14.6937 9.53049 14.6937Z"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M32.7571 14.6937C34.5386 14.6937 35.9829 13.2494 35.9829 11.4679C35.9829 9.68631 34.5386 8.24207 32.7571 8.24207C30.9755 8.24207 29.5312 9.68631 29.5312 11.4679C29.5312 13.2494 30.9755 14.6937 32.7571 14.6937Z"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M6.30645 11.4679L0.5 10.1775V6.95173L1.79032 6.30657L0.5 4.37109C0.5 4.37109 5.91935 0.500122 12.1129 0.500122C17.0161 0.500122 21.7903 0.500122 23.5968 0.500122C24.1129 0.500122 24.629 0.629153 25.0161 0.887218L30.1774 4.37109C30.1774 4.37109 36.5 4.75819 40.5 5.66141L39.8548 6.95173L40.5 8.24206V10.8227L35.9839 11.4679"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M12.7578 11.4679H29.532"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M30.1777 4.37109H10.8228L8.24219 3.72593C9.14541 2.43561 10.3067 1.53238 11.7261 0.887218L12.7583 0.500122"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M13.4023 6.30652H14.6927"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M21.1445 6.30652H22.4349"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M1.79032 6.30658H4.37097L3.72581 4.37109H0.5"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M37.918 6.95178H39.8535"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M18.5664 4.37109V0.500122"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else}
		<svg
			class={`bohemcars-type-icon bohemcars-type-icon--${icon}`}
			width="41"
			height="18"
			viewBox="0 10 41 18"
			fill="none"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M9.875 25.937C11.6009 25.937 13 24.5379 13 22.812C13 21.0861 11.6009 19.687 9.875 19.687C8.14911 19.687 6.75 21.0861 6.75 22.812C6.75 24.5379 8.14911 25.937 9.875 25.937Z"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M34 23.9375L40.5 22.8125V20.3125L39.75 19.5625C38.75 18.5625 37.75 17.9375 36.5 17.4375C35.625 17.1875 34.875 16.9375 33.875 16.8125L29.125 16.4375H28.625H23.625H16.75L15.5 12.0625C6.125 12.8125 0.5 17.6875 0.5 17.6875V22.0625L6.75 23.3125"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M28.25 24.062L12.875 23.437"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M18.625 18.437H16.75"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M22.375 12.812L28.625 16.562"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M36.4995 17.563C36.1245 18.063 36.6245 19.188 37.6245 20.063C38.6245 20.938 39.8745 21.313 40.3745 20.813C40.4995 20.688 40.4995 20.563 40.4995 20.438"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M0.5 17.812H3.625V15.937"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M13.625 14.687L14.25 16.562H23.625"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M31.125 25.937C32.8509 25.937 34.25 24.5379 34.25 22.812C34.25 21.0861 32.8509 19.687 31.125 19.687C29.3991 19.687 28 21.0861 28 22.812C28 24.5379 29.3991 25.937 31.125 25.937Z"
				stroke="currentColor"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{/if}
{/snippet}

<style>
	.bohemcars-featured-vehicles {
		background: #f6f7f3;
		padding-top: 40px;
	}

	.bohemcars-home-section-surface {
		background: transparent;
		border: 0;
		border-radius: 0;
		padding: 0;
	}

	.bohemcars-stock-unit {
		border-radius: 18px;
		overflow: hidden;
		box-shadow: 0 14px 34px rgb(54 95 104 / 0.08);
	}

	.bohemcars-stock-banner {
		position: relative;
		display: flex;
		min-height: 196px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		overflow: hidden;
		border-radius: 0;
		background: #e4ecc6;
		padding: 28px 36px;
		text-align: center;
	}

	.bohemcars-stock-banner__copy {
		position: relative;
		z-index: 1;
	}

	.bohemcars-stock-banner__car {
		position: absolute;
		bottom: -6px;
		z-index: 0;
		width: min(25vw, 330px);
		height: auto;
		pointer-events: none;
		user-select: none;
		filter: drop-shadow(0 16px 20px rgb(0 0 0 / 0.18));
	}

	.bohemcars-stock-banner__car--left {
		left: -18px;
		transform: scaleX(-1);
	}

	.bohemcars-stock-banner__car--right {
		right: -18px;
	}

	.bohemcars-stock-banner h2 {
		margin: 0;
		color: #1c1c1c;
		font-size: 38px;
		font-weight: 500;
		letter-spacing: -0.01em;
		line-height: 1.06;
	}

	.bohemcars-stock-banner__cta {
		position: relative;
		z-index: 1;
	}

	.bohemcars-vehicle-pills {
		width: 100%;
		max-width: 100%;
		border: 0;
		border-radius: 0;
		background: #ffffff;
		box-shadow: none;
		padding: 14px;
		scrollbar-width: none;
	}

	.bohemcars-vehicle-pills::-webkit-scrollbar {
		display: none;
	}

	.bohemcars-vehicle-pills :global(.menu-tab-style2) {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: nowrap;
		width: auto;
		min-width: max-content;
		gap: 10px;
	}

	.bohemcars-vehicle-pill {
		min-height: 44px;
		overflow: hidden;
		color: #1c1c1c;
		padding: 0 !important;
	}

	.bohemcars-vehicle-pill a {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		gap: 7px;
		color: inherit;
		font-size: 15px;
		font-weight: 500;
		line-height: 22px;
		padding: 0 11px;
		white-space: nowrap;
	}

	.bohemcars-vehicle-pill span,
	.bohemcars-type-icon,
	.bohemcars-pill-image {
		flex: 0 0 auto;
	}

	.bohemcars-type-icon {
		width: 36px;
		height: 18px;
		color: currentColor;
		stroke-width: 1.15;
	}

	.bohemcars-pill-image {
		display: block;
		width: auto;
		object-fit: contain;
	}

	.bohemcars-pill-image--spec {
		height: 18px;
		max-width: 22px;
	}

	.bohemcars-pill-image--brand {
		height: 21px;
		max-width: 38px;
	}

	.bohemcars-home-vehicle-grid {
		overflow: visible;
	}

	@media (max-width: 991px) {
		.bohemcars-stock-banner__car {
			display: none;
		}

		.bohemcars-stock-banner {
			min-height: 128px;
		}
	}

	@media (max-width: 767px) {
		.bohemcars-featured-vehicles {
			background: #ffffff;
			padding-top: 0;
			padding-bottom: 28px;
		}

		.bohemcars-stock-unit {
			margin-bottom: 6px;
			border-radius: 0;
			overflow: visible;
			background: #ffffff;
			box-shadow: none;
		}

		.bohemcars-stock-banner {
			min-height: auto;
			align-items: center;
			flex-direction: row;
			justify-content: space-between;
			gap: 16px;
			border-radius: 0;
			background: #ffffff;
			padding: 22px 0 8px;
		}

		.bohemcars-stock-banner h2 {
			max-width: none;
			font-size: 0;
			font-weight: 700;
			line-height: 1.08;
			text-align: left;
			white-space: nowrap;
		}

		.bohemcars-stock-banner h2::before {
			content: attr(data-mobile-title);
			color: #1c1c1c;
			font-size: 26px;
			letter-spacing: 0;
			line-height: 1.08;
		}

		.bohemcars-stock-banner__cta {
			display: none !important;
		}

		.bohemcars-vehicle-pills {
			display: none !important;
		}

		.bohemcars-home-vehicle-grid {
			display: flex !important;
			grid-template-columns: none !important;
			gap: 14px;
			margin-inline: -16px;
			overflow-x: auto;
			padding: 0 16px 8px;
			scroll-padding-inline: 16px;
			scroll-snap-type: x proximity;
			scrollbar-width: none;
		}

		.bohemcars-home-vehicle-grid::-webkit-scrollbar {
			display: none;
		}

		.bohemcars-home-vehicle-grid :global(.card-box-style-1) {
			flex: 0 0 min(82vw, 320px);
			scroll-snap-align: start;
		}
	}
</style>
