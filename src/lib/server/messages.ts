import { bohemcarsContact } from '$lib/data/bohemcars';
import {
	createBohemcarsMessageRecord,
	listBohemcarsMessages,
	updateBohemcarsMessageRecord,
	type BohemcarsMessageStatus
} from './db';
import type { BohemcarsRole } from './roles';

export type BohemcarsMessageInput = {
	email?: string;
	message?: string;
	name?: string;
	routePath?: string;
	threadId?: string;
	vehicleSlug?: string;
};

export type BohemcarsMessageUpdateInput = {
	id: string;
	message?: string;
	status?: BohemcarsMessageStatus;
};

export const normalizeMessageStatus = (value: string | undefined) => {
	if (value === 'open' || value === 'read' || value === 'closed') return value;

	return undefined;
};

export const createMessage = (input: BohemcarsMessageInput) =>
	createBohemcarsMessageRecord({
		authorEmail: input.email ?? bohemcarsContact.emailLabel,
		authorName: input.name,
		message: input.message,
		routePath: input.routePath,
		threadId: input.threadId,
		vehicleSlug: input.vehicleSlug
	});

export const updateMessage = (input: BohemcarsMessageUpdateInput) =>
	updateBohemcarsMessageRecord(input.id, {
		message: input.message,
		status: input.status
	});

export const listMessagesForRole = (role: BohemcarsRole = 'customer') => {
	void role;

	return listBohemcarsMessages();
};
