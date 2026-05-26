<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveModalVehicle, HomeFiveModalsData } from '$lib/auxero/home-five';

	let { modals }: { modals?: HomeFiveModalsData } = $props();

	const closeIcon = '/assets/icons/close-modal.svg';
</script>

{#if modals}
	<!-- Modal -->
	<div id="CardModal" class="modal">
		<div class="bg-modal"></div>
		<div class="modal-content">
			{@render closeButton()}
			<div class="modal-container">
				<div class="modal-inner">
					<div class="card-details">
						<div class="mb-40 flex">
							<div class="w-24"></div>
							<div class="grid w-76 grid-cols-2 gap-60">
								{@render cardModalVehicle(modals.cardCompare.left)}
								{@render cardModalVehicle(modals.cardCompare.right)}
							</div>
						</div>

						<table class="card-details--table">
							<tbody>
								{#each modals.cardCompare.rows as row (row.label)}
									<tr>
										<td>
											<div class="flex items-center gap-8">
												<img src={`/assets/icons/${row.icon}`} alt={row.label} />
												<span>{row.label}:</span>
											</div>
										</td>
										<td>{row.left}</td>
										<td>{row.right}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- /Modal -->

	<!-- LoginModal -->
	<div id="LoginModal" class="modal modal-login">
		<div class="bg-modal"></div>
		<div class="modal-content modal-sm">
			{@render closeButton()}
			<div class="modal-container">
				<div class="modal-inner">
					<h2 class="mb-20 text-center">Log In</h2>

					<form action="#">
						<div class="resutl mb-20">
							<p class="text-secondary mb-4">Use your Bohemcars account credentials.</p>
						</div>

						<label for="email-login" class="mb-20 px-2">
							<span class="mb-8 flex">Email*</span>
							<input
								class="input-large active"
								type="email"
								id="email-login"
								name="email-login"
								placeholder="Enter your email"
								required
							/>
						</label>

						<label for="Password-login" class="mb-24 px-2">
							<span class="mb-8 flex">Password*</span>
							<input
								class="input-large active password-input is-hidden"
								type="password"
								id="Password-login"
								name="Password-login"
								placeholder="Password"
								required
							/>
						</label>

						<div class="mb-20 flex justify-between gap-12">
							<label class="filter-checkbox style-5">
								<input type="checkbox" name="features" value="remember-me" checked />
								<span class="text-sm">Remember me</span>
							</label>

							<span
								class="open-modal text-underline cursor-pointer text-sm font-bold"
								data-modal-id="#ForgotPasswordModal">Forgot Your Password?</span
							>
						</div>

						<button type="submit" class="btn btn-primary btn-large font-weight-600 mb-12 w-full">
							Login
						</button>

						<p
							class="open-modal text-secondary flex cursor-pointer justify-center gap-8 text-sm"
							data-modal-id="#SignUpModal"
						>
							Not registered yet?
							<span class="text-underline font-weight-600 text-sm">Sign Up</span>
						</p>
					</form>
				</div>
			</div>
		</div>
	</div>
	<!-- /LoginModal -->

	<!-- ForgotPasswordModal -->
	<div id="ForgotPasswordModal" class="modal modal-login">
		<div class="bg-modal"></div>
		<div class="modal-content modal-sm">
			{@render closeButton()}
			<div class="modal-container">
				<div class="modal-inner">
					<h2 class="mt-20 mb-20 text-center">Forgot Password</h2>

					<form action="#">
						<label for="email-forgot-password" class="mb-20 px-2">
							<span class="mb-8 flex">Username or email address *</span>
							<input
								class="input-large active"
								type="email"
								id="email-forgot-password"
								name="email-forgot-password"
								placeholder="Username or email address *"
								required
							/>
						</label>

						<button type="submit" class="btn btn-primary btn-large font-weight-600 mb-12 w-full">
							Get Reset Code
						</button>

						<p
							class="open-modal text-secondary flex cursor-pointer justify-center gap-8 text-sm"
							data-modal-id="#SignUpModal"
						>
							Not registered yet?
							<span class="text-underline font-weight-600 text-sm">Sign Up</span>
						</p>
					</form>
				</div>
			</div>
		</div>
	</div>
	<!-- /ForgotPasswordModal -->

	<!-- Search Modal -->
	<div id="SearchModal" class="search-modal">
		<div class="search-modal__overlay"></div>
		<div class="search-modal__content">
			<button
				class="search-modal__close"
				id="searchModalClose"
				type="button"
				aria-label="Close search"
			>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M18 6L6 18M6 6L18 18"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
			<h2 class="search-modal__title">WHAT ARE YOU LOOKING FOR?</h2>
			<form
				class="search-modal__form"
				action="/inventory"
				method="get"
				data-bohemcars-search-form="inventory"
			>
				<div class="search-modal__input-wrapper">
					<input
						type="text"
						class="search-modal__input"
						name="q"
						placeholder="Search Bohemcars inventory"
						autocomplete="off"
						id="searchModalInput"
					/>
					<button type="submit" class="search-modal__submit" aria-label="Search">
						{@render searchIcon()}
					</button>
				</div>
			</form>
		</div>
	</div>
	<!-- /Search Modal -->

	<!-- SignUpModal -->
	<div id="SignUpModal" class="modal modal-login">
		<div class="bg-modal"></div>
		<div class="modal-content modal-sm">
			{@render closeButton()}
			<div class="modal-container">
				<div class="modal-inner">
					<h2 class="mb-20 text-center">Sign Up</h2>

					<form action="#">
						<label for="SignUp-login" class="mb-20 px-2">
							<span class="mb-8 flex">Email*</span>
							<input
								class="input-large active"
								type="email"
								id="SignUp-login"
								name="SignUp-login"
								placeholder="Enter your email"
								required
							/>
						</label>

						<label for="Password-SignUp" class="mb-24 px-2">
							<span class="mb-8 flex">Password*</span>
							<input
								class="input-large active password-input is-hidden"
								type="password"
								id="Password-SignUp"
								name="Password-SignUp"
								placeholder="Password"
								required
							/>
						</label>
						<label for="ConfirmPassword-SignUp" class="mb-20 px-2">
							<span class="mb-8 flex">Confirm password*</span>
							<input
								class="input-large active password-input is-hidden"
								type="password"
								id="ConfirmPassword-SignUp"
								name="ConfirmPassword-SignUp"
								placeholder="Password"
								required
							/>
						</label>

						<div class="mb-20 flex justify-between gap-12">
							<label class="filter-checkbox style-5">
								<input type="checkbox" name="features" value="terms" checked />
								<span class="text-sm"
									>I agree to the
									<a href={resolve('/terms')} class="text-underline pl-4 text-sm font-bold">
										Terms of User
									</a></span
								>
							</label>
						</div>

						<button type="submit" class="btn btn-primary btn-large font-weight-600 mb-12 w-full">
							Create a new account
						</button>

						<p class="text-secondary mb-20 flex justify-center gap-8 text-sm">
							Already have an account?
							<span
								class="open-modal text-underline font-weight-600 cursor-pointer text-sm"
								data-modal-id="#LoginModal">Login Here</span
							>
						</p>

						<div class="mb-20 flex items-center justify-center gap-20">
							<p class="divider w-full text-sm"></p>
							<p class="text-secondary min-w-max text-center text-sm">or sign up with</p>
							<p class="divider w-full text-sm"></p>
						</div>

						<div class="social-login flex flex-col gap-12">
							<a href={resolve('/account')} class="font-weight-500 flex items-center gap-8">
								<img src="/assets/icons/facebook.svg" alt="Facebook" />
								Facebook
							</a>

							<a href={resolve('/account')} class="font-weight-500 flex items-center gap-8">
								<img src="/assets/icons/Google.svg" alt="Google" />
								Google
							</a>

							<a href={resolve('/account')} class="font-weight-500 flex items-center gap-8">
								<img src="/assets/icons/Twitter.svg" alt="X" />
								X
							</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
	<!-- /SignUpModal -->

	<!-- CompareModal (Bottom Modal) -->
	<div id="CompareModal" class="modal modal-bottom">
		<div class="bg-modal"></div>
		<div class="modal-content">
			{@render closeButton()}
			<div class="modal-container">
				<div class="modal-inner">
					<div class="compare-modal-content">
						<div class="compare-items" id="compareItems">
							<div class="compare-item-list">
								{#each modals.comparePreview as vehicle (vehicle.slug)}
									{@render comparePreviewItem(vehicle)}
								{/each}
							</div>

							<div class="compare-action">
								<a href={resolve('/compare')} class="btn btn-primary btn-large font-weight-600">
									Compare
								</a>
							</div>
						</div>

						<div
							class="compare-empty-state text-center"
							id="compareEmptyState"
							style="display: none;"
						>
							<p class="text-muted">Your compare is currently empty</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- /CompareModal -->
{/if}

{#snippet closeButton()}
	<button class="close-modal" type="button">
		<img src={closeIcon} alt="close-modal" />
	</button>
{/snippet}

{#snippet cardModalVehicle(vehicle: HomeFiveModalVehicle)}
	<div>
		<img class="radius-16 mb-10" src={vehicle.image} alt={vehicle.title} />
		<p class="h4 text-center">{vehicle.title}</p>
	</div>
{/snippet}

{#snippet comparePreviewItem(vehicle: HomeFiveModalVehicle)}
	<div class="compare-item flex items-center gap-12">
		<button class="compare-item-remove" type="button" aria-label="Remove item">
			<img src={closeIcon} alt="car" class="radius-50" />
		</button>
		<div class="compare-item-image">
			<img src={vehicle.image} alt={vehicle.title} class="radius-50" />
		</div>
		<div class="compare-item-info">
			<p class="h7 font-weight-500 mb-8">{vehicle.title}</p>
			<div class="flex gap-4">
				<div class="flex items-center gap-4">
					<img src="/assets/icons/icon-gauge.svg" alt="mileage" width="16" height="16" />
					<span class="text-sm">{vehicle.mileageLabel}</span>
				</div>
				<div class="flex items-center gap-4">
					<img src="/assets/icons/calendar.svg" alt="year" width="16" height="16" />
					<span class="text-sm">{vehicle.year}</span>
				</div>
				<div class="flex items-center gap-4">
					<img src="/assets/icons/gaspump.svg" alt="fuel" width="16" height="16" />
					<span class="text-sm">{vehicle.fuel}</span>
				</div>
				<div class="flex items-center gap-4">
					<img src="/assets/icons/auto.svg" alt="transmission" width="16" height="16" />
					<span class="text-sm">{vehicle.transmission}</span>
				</div>
			</div>
		</div>
	</div>
{/snippet}

{#snippet searchIcon()}
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M15.8047 15.8047L21.0012 21.0012"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}
