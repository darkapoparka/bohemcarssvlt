<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroVehicleDetailData } from '$lib/auxero/detail';
	import AuxeroVehicleOverview from './AuxeroVehicleOverview.svelte';

	let { detail }: { detail: AuxeroVehicleDetailData } = $props();
</script>

<div class="listing-details--sidebar">
	<div class="listing-details--sidebar-box mb-40">
		<div class="flat-tabs">
			<div class="mb-15 overflow-x-auto">
				<ul class="menu-tab menu-tab-style5 grid-cols-2">
					<li>Cash</li>
					<li class="active">Finance</li>
				</ul>
			</div>

			<div class="content-tab visible">
				<div class="content-inner">
					<p class="h5 mb-4">Price:</p>
					<p class="h4 mb-4">{detail.priceLabel}</p>
					<p class="text-secondary mb-16">
						Listed vehicle price. Final taxes and registration costs confirmed before purchase.
					</p>

					<p class="flex items-center gap-8">
						<img src="/assets/icons/Info.svg" alt="info" />
						<a href={resolve('/contact')} class="text-underline text-highlight">{detail.priceBgn}</a
						>
					</p>
				</div>

				<div class="content-inner active">
					<p class="h5 mb-4">Price:</p>
					<p class="h4 mb-4">{detail.monthlyLabel}</p>
					<p class="text-secondary mb-4">
						Estimated payment before final taxes, registration, and transport costs.
					</p>
					<p class="text-secondary mb-16">
						Estimated over 72 months. Final terms confirmed by Bohemcars.
					</p>

					<div class="core-dropdown flex items-center gap-8">
						<img src="/assets/icons/Info.svg" alt="info" />
						<a
							href={resolve('/contact')}
							class="text-underline text-highlight"
							id="coreDropdownBtn"
						>
							{detail.priceBgn}
						</a>
						<div class="core-dropdown__menu" id="coreDropdownMenu">
							<ul class="core-dropdown__list">
								<li class="core-dropdown__item">
									<p class="text-secondary text-sm">Price:</p>
									<p class="font-weight-600">$23.577</p>
								</li>
								<li class="core-dropdown__item">
									<p class="text-secondary text-sm">Special tax on motor vehicles:</p>
									<p class="font-weight-600">$1.322</p>
								</li>
								<li class="core-dropdown__item">
									<p class="text-secondary text-sm">Price with special tax:</p>
									<p class="font-weight-600">$24.900</p>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="listing-details--sidebar-box mb-40">
		<p class="h5 mb-4 capitalize">Car Overview</p>
		<AuxeroVehicleOverview items={detail.overviewItems} />
	</div>

	<div class="listing-details--sidebar-box mb-40">
		<div class="listing-details--contact">
			<div class="listing-details--contact-dealer mb-28">
				<img src={detail.consultant.image} alt="dealer" />

				<div class="content">
					<a href={resolve('/contact')} class="h4 font-weight-600 mb-8">{detail.consultant.name}</a>

					<div class="verify">
						<img src="/assets/icons/SealCheck.svg" alt="verified" />
						<p class="text-highlight text-sm">Bohemcars Consultant</p>
					</div>
				</div>
			</div>

			<ul class="contact-info mb-20">
				<li>
					<p class="icon"><img src="/assets/icons/MapPin.svg" alt="phone" /></p>
					<div class="flex flex-col gap-4">
						<a href={resolve('/contact')}>
							{detail.contact.address}
						</a>
						<a href={resolve('/contact')} class="text-underline text-highlight text-sm"
							>Get Directions</a
						>
					</div>
				</li>
			</ul>
			<ul class="contact-info mb-28">
				<li class="items-center">
					<p class="icon"><img src="/assets/icons/PhoneCall.svg" alt="phone" /></p>
					<div class="flex flex-col">
						<a href={resolve('/contact')}>
							{detail.contact.primaryPhoneLabel}
						</a>
						<a href={resolve('/contact')}>
							{detail.contact.marketplacePhoneLabel}
						</a>
					</div>
				</li>
			</ul>

			<a
				href={resolve('/agents/[slug]', { slug: detail.consultant.slug })}
				class="btn btn-medium btn-primary-3 font-weight-600 mb-12 gap-5"
			>
				<img src="/assets/icons/PhoneCall-2.svg" alt="phone" />
				Call Bohemcars
			</a>

			<a href={resolve('/contact')} class="btn btn-medium btn-primary-4 font-weight-600 gap-5">
				<img src="/assets/icons/ChatCircleDots.svg" alt="phone" />
				Chat on Viber
			</a>
		</div>
	</div>

	<div class="listing-details--sidebar-box">
		<p class="h5 mb-16 capitalize">Send Inquiry about Vehicle</p>

		<form action="#" class="send-inquiry">
			<div class="mb-8 grid grid-cols-1 gap-18">
				<div>
					<p class="mb-8">Name</p>
					<input
						class="active input-large"
						id="SendInquiryname"
						name="SendInquiryname"
						type="text"
						value=""
						required
					/>
				</div>
				<div>
					<p class="mb-8">Email</p>
					<input
						class="input-large"
						name="SendInquiryemail"
						id="SendInquiryemail"
						type="text"
						value={detail.contact.email}
						required
					/>
				</div>
				<div>
					<p class="mb-8">Phone</p>
					<input
						placeholder="Phone (optional)"
						class="input-large"
						name="SendInquiryphone"
						id="SendInquiryphone"
						type="number"
						value=""
						required
					/>
				</div>

				<div>
					<p class="mb-8">Subject</p>
					<select>
						<option>This Vehicle's Availability</option>
						<option>Registration and documents</option>
						<option>Viewing appointment</option>
					</select>
				</div>

				<div class="padding-0">
					<p class="mb-6">Message</p>
					<textarea
						placeholder="Comment"
						rows="3"
						name="message"
						class="message"
						id="message"
						required
					></textarea>
				</div>
			</div>
			<button class="btn btn-primary btn-large font-weight-600 mb-18 w-full">Send Inquiry</button>
			<label class="filter-checkbox style-2 mb-6">
				<input type="checkbox" name="features" value="touch-screen" />
				<span class="text-sm">
					Yes, I would like to receive price alerts on this vehicle and helpful shopping
					information.
				</span>
			</label>

			<p class="text-secondary text-xs">
				By using this service, you accept our
				<a href={resolve('/contact')} class="text-underline text-highlight text-xs">
					Visitor Agreement.
				</a>
			</p>
		</form>
	</div>
</div>
