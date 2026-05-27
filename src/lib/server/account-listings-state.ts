import type {
	AuxeroAccountListingRow,
	AuxeroAccountListingsData
} from '$lib/auxero/account-listings';
import { bohemcarsContact } from '$lib/data/bohemcars';
import { vehicles, type Vehicle } from '$lib/data/vehicles';
import type { AuxeroRenderOptions } from './auxero-listing-data';
import {
	accountAvatarByRole,
	accountContext,
	type AccountContext
} from './account-dashboard-state';
import { listVehicleSubmissions } from './inventory';

export const accountInventoryListingRows = (
	source: Vehicle[] = vehicles.slice(0, 5)
): AuxeroAccountListingRow[] =>
	source.map((vehicle) => ({
		actions: [
			{
				ariaLabel: `Edit ${vehicle.title}`,
				href: `/admin/inventory/edit/${encodeURIComponent(vehicle.slug)}`,
				icon: '/assets/images/dashboard/AddListing.svg',
				kind: 'edit-inventory',
				label: 'Edit Listing'
			},
			{
				ariaLabel: `Remove ${vehicle.title}`,
				icon: '/assets/icons/trash.svg',
				kind: 'remove',
				label: 'Remove Listing'
			}
		],
		columns: [vehicle.brand, String(vehicle.year), vehicle.transmission, vehicle.fuel],
		description: vehicle.description || bohemcarsContact.appointmentNote,
		href: `/inventory/${encodeURIComponent(vehicle.slug)}`,
		id: vehicle.slug,
		image: vehicle.image,
		kind: 'inventory',
		priceLabel: vehicle.priceLabel,
		title: vehicle.title
	}));

export const accountSubmissionListingRows = (context: AccountContext): AuxeroAccountListingRow[] =>
	listVehicleSubmissions().map((submission) => ({
		actions: [
			{
				ariaLabel: `Edit ${submission.title}`,
				href: '/sell-your-car',
				icon: '/assets/images/dashboard/AddListing.svg',
				kind: 'edit-submission',
				label: 'Edit Submission'
			},
			{
				ariaLabel: 'Message Bohemcars',
				href: '/account/messages',
				icon: '/assets/images/dashboard/Messages.svg',
				kind: 'message',
				label: 'Message'
			}
		],
		columns: [
			submission.contactPhone,
			submission.expectedPrice,
			submission.mileage,
			submission.status
		],
		description: submission.message,
		id: submission.id,
		image: accountAvatarByRole[context.session.role],
		kind: 'submission',
		title: submission.title,
		titleMeta: submission.vin
	}));

export const accountListingsData = (
	context: AccountContext,
	source: Vehicle[] = vehicles.slice(0, 5)
): AuxeroAccountListingsData =>
	context.isAdmin
		? {
				footerText: `Showing ${source.length} of ${vehicles.length} Bohemcars entries`,
				headers: ['Car', 'Brand', 'Year', 'Transmission', 'Fuel Type', 'Action'],
				isSubmissions: false,
				pagination: ['1', '2', '3'],
				rows: accountInventoryListingRows(source)
			}
		: {
				footerText: `Showing ${listVehicleSubmissions().length} Bohemcars sell-your-car submissions`,
				headers: ['Submission', 'Contact', 'Expected Price', 'Mileage', 'Status', 'Action'],
				isSubmissions: true,
				rows: accountSubmissionListingRows(context)
			};

export const getAccountListingsData = (templateFile: string, options: AuxeroRenderOptions = {}) =>
	accountListingsData(accountContext(templateFile, options));
