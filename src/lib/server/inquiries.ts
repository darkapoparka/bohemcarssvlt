import { bohemcarsContact } from '$lib/data/bohemcars';
import {
	createBohemcarsInquiryRecord,
	listBohemcarsInquiries,
	updateBohemcarsInquiryRecord,
	type BohemcarsInquiryStatus
} from './db';
import { normalizeBohemcarsRole, type BohemcarsRole } from './roles';

export type BohemcarsInquiryInput = {
	agentSlug?: string;
	email?: string;
	message?: string;
	name?: string;
	phone?: string;
	routePath?: string;
	source?: string;
	userRole?: BohemcarsRole | string;
	vehicleSlug?: string;
};

export type BohemcarsInquiryUpdateInput = {
	assignedAgentSlug?: string;
	id: string;
	message?: string;
	status?: BohemcarsInquiryStatus;
};

export const normalizeInquiryStatus = (value: string | undefined) => {
	if (value === 'new' || value === 'assigned' || value === 'contacted' || value === 'closed') {
		return value;
	}

	return undefined;
};

export const createInquiry = (input: BohemcarsInquiryInput) =>
	createBohemcarsInquiryRecord({
		assignedAgentSlug: input.agentSlug,
		contactEmail: input.email ?? bohemcarsContact.emailLabel,
		contactName: input.name,
		contactPhone: input.phone,
		message: input.message,
		routePath: input.routePath,
		source: input.source,
		userRole: normalizeBohemcarsRole(input.userRole) ?? 'customer',
		vehicleSlug: input.vehicleSlug
	});

export const updateInquiry = (input: BohemcarsInquiryUpdateInput) =>
	updateBohemcarsInquiryRecord(input.id, {
		assignedAgentSlug: input.assignedAgentSlug,
		message: input.message,
		status: input.status
	});

export const listInquiriesForRole = (role: BohemcarsRole = 'admin') => {
	const records = listBohemcarsInquiries();

	if (role === 'admin') return records;
	if (role === 'agent') return records.filter((record) => record.status !== 'closed');

	return records.filter((record) => record.userRole === 'customer');
};
