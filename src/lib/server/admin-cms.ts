import { posts } from '$lib/data/blog';
import { vehicles } from '$lib/data/vehicles';
import { listManagedAgents } from './agents';
import { listInquiriesForRole } from './inquiries';
import { listInventoryForAdmin, listVehicleSubmissions } from './inventory';
import { listMessagesForRole } from './messages';
import { listManagedUsers } from './users';

export type AdminInventoryRow = {
	brand: string;
	fuel: string;
	id: string;
	image: string;
	mileage: string;
	priceLabel: string;
	routePath: string;
	slug: string;
	source: 'admin-listing' | 'static-vehicle';
	status: string;
	title: string;
	updatedAt: string;
	vin: string;
	year: number | string;
};

export type AdminRecentWorkHref = '/admin/imports' | '/admin/inquiries' | '/admin/messages';

export type AdminRecentWorkItem = {
	body: string;
	createdAt: string;
	href: AdminRecentWorkHref;
	id: string;
	label: string;
	meta: string;
	status: string;
	type: 'Import' | 'Inquiry' | 'Message';
};

const fallbackImage = '/assets/images/card/card-1.jpg';

const statusIsOpen = (status: string) => !['closed', 'archived', 'published'].includes(status);

export function getAdminInventoryRows(): AdminInventoryRow[] {
	return listInventoryForAdmin().map((record) => {
		const vehicle = vehicles.find(
			(candidate) => candidate.slug === record.id || candidate.slug === record.slug
		);

		return {
			brand: vehicle?.brand ?? record.title.split(' ')[0] ?? 'Bohemcars',
			fuel: vehicle?.fuel ?? 'On request',
			id: record.id,
			image: vehicle?.image ?? fallbackImage,
			mileage: record.mileage,
			priceLabel: record.priceLabel,
			routePath: record.routePath,
			slug: record.slug,
			source: record.source,
			status: record.status,
			title: record.title,
			updatedAt: 'updatedAt' in record ? record.updatedAt : new Date().toISOString(),
			vin: record.vin,
			year: vehicle?.year ?? 'Draft'
		};
	});
}

export function getAdminInventoryRow(id: string) {
	return getAdminInventoryRows().find((row) => row.id === id || row.id === decodeURIComponent(id));
}

export function getAdminCmsOverview() {
	const inventory = getAdminInventoryRows();
	const inquiries = listInquiriesForRole('admin');
	const messages = listMessagesForRole('admin');
	const agents = listManagedAgents();
	const users = listManagedUsers();
	const imports = listVehicleSubmissions();
	const liveInventory = inventory.filter((row) => row.status === 'published');
	const draftInventory = inventory.filter((row) => row.status === 'draft');
	const openInquiries = inquiries.filter((inquiry) => statusIsOpen(inquiry.status));
	const openMessages = messages.filter((message) => statusIsOpen(message.status));
	const openMessageThreadCount = new Set(openMessages.map((message) => message.threadId)).size;
	const activeImports = imports.filter((submission) => submission.status !== 'published');
	const recentWork: AdminRecentWorkItem[] = [
		...openInquiries.slice(0, 3).map((inquiry) => ({
			body: inquiry.message,
			createdAt: inquiry.createdAt,
			href: '/admin/inquiries' as const,
			id: inquiry.id,
			label: inquiry.contactName,
			meta: inquiry.vehicleTitle ?? inquiry.source,
			status: inquiry.status,
			type: 'Inquiry' as const
		})),
		...activeImports.slice(0, 2).map((submission) => ({
			body: submission.message,
			createdAt: submission.createdAt,
			href: '/admin/imports' as const,
			id: submission.id,
			label: submission.contactName,
			meta: submission.title,
			status: submission.status,
			type: 'Import' as const
		})),
		...openMessages.slice(0, 2).map((message) => ({
			body: message.message,
			createdAt: message.createdAt,
			href: '/admin/messages' as const,
			id: message.id,
			label: message.authorName,
			meta: message.threadId,
			status: message.status,
			type: 'Message' as const
		}))
	]
		.sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
		.slice(0, 6);

	return {
		agents,
		analytics: [
			{ label: 'Inventory coverage', value: inventory.length, status: 'Records' },
			{ label: 'Published stock', value: liveInventory.length, status: 'Live' },
			{
				label: 'Open work',
				value: openInquiries.length + openMessages.length + activeImports.length,
				status: 'Queue'
			},
			{ label: 'CMS content', value: posts.length, status: 'Posts' }
		],
		imports,
		inquiries,
		inventory,
		kpis: {
			activeImports: activeImports.length,
			activeUsers: users.filter((user) => user.status === 'active').length,
			agents: agents.length,
			draftListings: draftInventory.length,
			liveListings: liveInventory.length,
			openConversations: openMessageThreadCount,
			openLeads: openInquiries.length,
			publishedPosts: posts.length,
			totalUsers: users.length
		},
		messages,
		posts: posts.map((post) => ({
			...post,
			status: 'published' as const
		})),
		recentInventory: inventory.slice(0, 6),
		recentWork,
		settings: [
			{
				description: 'Prototype sessions are available for admin, agent, and customer role checks.',
				status: 'Active',
				title: 'Access control'
			},
			{
				description:
					'Inventory CRUD uses local Bohemcars server state before the Supabase migration.',
				status: 'Prototype',
				title: 'Inventory persistence'
			},
			{
				description: 'Public Auxero pages remain outside the shadcn admin CSS scope.',
				status: 'Protected',
				title: 'Visual isolation'
			}
		],
		users
	};
}
