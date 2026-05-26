import { agents } from '$lib/data/agents';
import { bohemcarsContact } from '$lib/data/bohemcars';
import { getVehicleBySlug, vehicles } from '$lib/data/vehicles';
import type { BohemcarsRole } from './roles';

export type BohemcarsUserStatus = 'active' | 'paused' | 'lead';

export type BohemcarsUser = {
	email: string;
	id: string;
	name: string;
	phone: string;
	role: BohemcarsRole;
	status: BohemcarsUserStatus;
};

export type BohemcarsSessionRecord = {
	createdAt: string;
	email: string;
	expiresAt: string;
	name: string;
	role: BohemcarsRole;
	token: string;
	userId: string;
};

export type BohemcarsInquiryStatus = 'new' | 'assigned' | 'contacted' | 'closed';

export type BohemcarsInquiryRecord = {
	assignedAgentSlug: string;
	contactEmail: string;
	contactName: string;
	contactPhone: string;
	createdAt: string;
	id: string;
	message: string;
	routePath: string;
	source: string;
	status: BohemcarsInquiryStatus;
	userRole: BohemcarsRole;
	vehicleSlug?: string;
	vehicleTitle?: string;
};

export type BohemcarsMessageStatus = 'open' | 'read' | 'closed';

export type BohemcarsMessageRecord = {
	authorEmail: string;
	authorName: string;
	createdAt: string;
	id: string;
	message: string;
	routePath: string;
	status: BohemcarsMessageStatus;
	threadId: string;
	vehicleSlug?: string;
};

export type BohemcarsVehicleSubmissionStatus = 'draft' | 'submitted' | 'reviewing' | 'published';

export type BohemcarsVehicleSubmissionRecord = {
	contactEmail: string;
	contactName: string;
	contactPhone: string;
	createdAt: string;
	expectedPrice: string;
	id: string;
	message: string;
	mileage: string;
	routePath: string;
	source: 'sell-your-car' | 'admin-listing' | 'customer-listing';
	status: BohemcarsVehicleSubmissionStatus;
	title: string;
	vin: string;
};

export type BohemcarsInventoryListingStatus = 'draft' | 'published' | 'archived';

export type BohemcarsInventoryListingRecord = {
	createdAt: string;
	id: string;
	mileage: string;
	priceLabel: string;
	routePath: string;
	slug: string;
	source: 'admin-listing';
	status: BohemcarsInventoryListingStatus;
	submissionId?: string;
	title: string;
	updatedAt: string;
	vin: string;
};

export type BohemcarsPasswordChangeRecord = {
	createdAt: string;
	email: string;
	id: string;
	role: BohemcarsRole;
	userId: string;
};

const stamp = () => new Date().toISOString();

let idSequence = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${++idSequence}`;

const prototypeUsers: BohemcarsUser[] = [
	{
		email: 'admin@bohemcars.local',
		id: 'user-admin',
		name: 'Bohemcars Admin',
		phone: bohemcarsContact.primaryPhoneLabel,
		role: 'admin',
		status: 'active'
	},
	{
		email: 'agent@bohemcars.local',
		id: 'user-agent',
		name: 'Bohemcars Agent',
		phone: bohemcarsContact.primaryPhoneLabel,
		role: 'agent',
		status: 'active'
	},
	{
		email: 'customer@bohemcars.local',
		id: 'user-customer',
		name: 'Bohemcars Customer',
		phone: bohemcarsContact.marketplacePhoneLabel,
		role: 'customer',
		status: 'active'
	}
];

const seededInquiries: BohemcarsInquiryRecord[] = vehicles.slice(0, 3).map((vehicle, index) => ({
	assignedAgentSlug: vehicle.agentSlug,
	contactEmail: index === 0 ? 'customer@bohemcars.local' : bohemcarsContact.emailLabel,
	contactName: ['Canada import lead', 'Sell-your-car submission', 'Document review'][index],
	contactPhone: bohemcarsContact.primaryPhoneLabel,
	createdAt: `2026-05-${20 + index}T09:00:00.000Z`,
	id: `inquiry-seed-${index + 1}`,
	message: [
		'Customer asked for source history, transport steps, and viewing timing.',
		'Seller submitted photos and requested a valuation appointment.',
		'Agent noted registration readiness and pending inspection documents.'
	][index],
	routePath: index === 1 ? '/sell-your-car' : `/inventory/${vehicle.slug}`,
	source: index === 1 ? 'sell-your-car' : 'vehicle-detail',
	status: index === 0 ? 'new' : 'assigned',
	userRole: index === 0 ? 'customer' : 'agent',
	vehicleSlug: vehicle.slug,
	vehicleTitle: vehicle.title
}));

const sessions: BohemcarsSessionRecord[] = [];
const inquiries: BohemcarsInquiryRecord[] = [...seededInquiries];
const messages: BohemcarsMessageRecord[] = [
	{
		authorEmail: 'customer@bohemcars.local',
		authorName: 'Bohemcars Customer',
		createdAt: '2026-05-22T10:00:00.000Z',
		id: 'message-seed-1',
		message: 'Please send appointment options and inspection notes.',
		routePath: '/account/messages',
		status: 'open',
		threadId: 'bohemcars-sales',
		vehicleSlug: vehicles[0]?.slug
	}
];
const vehicleSubmissions: BohemcarsVehicleSubmissionRecord[] = [
	{
		contactEmail: 'seller@bohemcars.local',
		contactName: 'Client vehicle seller',
		contactPhone: bohemcarsContact.primaryPhoneLabel,
		createdAt: '2026-05-23T11:00:00.000Z',
		expectedPrice: '25 000 EUR',
		id: 'submission-seed-1',
		message: 'Client vehicle submitted with VIN, photos, and service history for review.',
		mileage: '120 000 km',
		routePath: '/sell-your-car',
		source: 'sell-your-car',
		status: 'reviewing',
		title: 'Client BMW evaluation',
		vin: 'CLIENT-BMW-001'
	},
	{
		contactEmail: 'tradein@bohemcars.local',
		contactName: 'Trade-in customer',
		contactPhone: bohemcarsContact.marketplacePhoneLabel,
		createdAt: '2026-05-24T14:30:00.000Z',
		expectedPrice: 'On request',
		id: 'submission-seed-2',
		message: 'Customer asked whether Bohemcars can prepare a direct offer or client listing.',
		mileage: '98 000 km',
		routePath: '/account/listings',
		source: 'customer-listing',
		status: 'submitted',
		title: 'Trade-in review request',
		vin: 'TRADE-IN-002'
	}
];
const inventoryListings: BohemcarsInventoryListingRecord[] = [];
const passwordChanges: BohemcarsPasswordChangeRecord[] = [];

export const listBohemcarsUsers = () => prototypeUsers.map((user) => ({ ...user }));

export const findBohemcarsUserByEmail = (email: string) =>
	prototypeUsers.find((user) => user.email.toLowerCase() === email.trim().toLowerCase());

export const findBohemcarsUserByRole = (role: BohemcarsRole) =>
	prototypeUsers.find((user) => user.role === role);

export const createBohemcarsUserRecord = ({
	email,
	name,
	phone,
	role = 'customer',
	status = 'active'
}: {
	email: string;
	name?: string;
	phone?: string;
	role?: BohemcarsRole;
	status?: BohemcarsUserStatus;
}) => {
	const existing = findBohemcarsUserByEmail(email);

	if (existing) return { ...existing };

	const user: BohemcarsUser = {
		email: email.trim().toLowerCase(),
		id: nextId('user'),
		name: name?.trim() || 'Bohemcars Customer',
		phone: phone?.trim() || bohemcarsContact.marketplacePhoneLabel,
		role,
		status
	};

	prototypeUsers.push(user);

	return { ...user };
};

export const updateBohemcarsUserProfile = ({
	email,
	name,
	phone,
	role
}: {
	email?: string;
	name?: string;
	phone?: string;
	role?: BohemcarsRole;
}) => {
	const user =
		(email ? findBohemcarsUserByEmail(email) : undefined) ??
		(role ? findBohemcarsUserByRole(role) : undefined);

	if (!user) return undefined;

	const nextName = name?.trim();
	const nextPhone = phone?.trim();

	if (nextName) user.name = nextName;
	if (nextPhone) user.phone = nextPhone;

	return { ...user };
};

export const updateBohemcarsUserRecord = ({
	email,
	id,
	name,
	phone,
	status
}: {
	email?: string;
	id?: string;
	name?: string;
	phone?: string;
	status?: BohemcarsUserStatus;
}) => {
	const user = prototypeUsers.find(
		(candidate) =>
			(id && candidate.id === id) ||
			(email && candidate.email.toLowerCase() === email.trim().toLowerCase())
	);

	if (!user) return undefined;

	const nextName = name?.trim();
	const nextPhone = phone?.trim();

	if (nextName) user.name = nextName;
	if (nextPhone) user.phone = nextPhone;
	if (status) user.status = status;

	return { ...user };
};

export const createBohemcarsSessionRecord = (user: BohemcarsUser): BohemcarsSessionRecord => {
	const createdAt = stamp();
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString();
	const session = {
		createdAt,
		email: user.email,
		expiresAt,
		name: user.name,
		role: user.role,
		token: nextId('session'),
		userId: user.id
	};

	sessions.unshift(session);

	return session;
};

export const listBohemcarsSessions = () => [...sessions];

export const findBohemcarsSessionByToken = (token: string) =>
	sessions.find((session) => session.token === token);

export const deleteBohemcarsSessionByToken = (token: string) => {
	const index = sessions.findIndex((session) => session.token === token);

	if (index < 0) return false;

	sessions.splice(index, 1);

	return true;
};

export const listBohemcarsInquiries = () => [...inquiries];

const agentSlugFromRoute = (routePath?: string) => {
	const normalized = routePath?.replace(/^\/+|\/+$/g, '');
	const slug = normalized?.startsWith('agents/') ? normalized.split('/')[1] : undefined;

	return agents.some((agent) => agent.slug === slug) ? slug : undefined;
};

const vehicleSlugFromRoute = (routePath?: string) => {
	const normalized = routePath?.replace(/^\/+|\/+$/g, '');
	const slug = normalized?.startsWith('inventory/') ? normalized.split('/')[1] : undefined;

	return slug && getVehicleBySlug(slug) ? slug : undefined;
};

const normalizeAgentSlug = (slug?: string) => {
	const normalized = slug?.trim();

	return agents.some((agent) => agent.slug === normalized) ? normalized : undefined;
};

export const createBohemcarsInquiryRecord = (
	input: Partial<BohemcarsInquiryRecord>
): BohemcarsInquiryRecord => {
	const routePath = input.routePath ?? '/contact';
	const vehicleSlug = input.vehicleSlug ?? vehicleSlugFromRoute(routePath);
	const vehicle = vehicleSlug ? getVehicleBySlug(vehicleSlug) : undefined;
	const fallbackAgent = agents[0]?.slug ?? 'bohemcars-sales';
	const record: BohemcarsInquiryRecord = {
		assignedAgentSlug:
			normalizeAgentSlug(input.assignedAgentSlug) ??
			vehicle?.agentSlug ??
			agentSlugFromRoute(routePath) ??
			fallbackAgent,
		contactEmail: input.contactEmail?.trim() || bohemcarsContact.emailLabel,
		contactName: input.contactName?.trim() || 'Bohemcars website lead',
		contactPhone: input.contactPhone?.trim() || bohemcarsContact.primaryPhoneLabel,
		createdAt: stamp(),
		id: nextId('inquiry'),
		message: input.message?.trim() || 'Website inquiry queued for Bohemcars follow-up.',
		routePath,
		source: input.source ?? 'website',
		status: input.status ?? 'new',
		userRole: input.userRole ?? 'customer',
		vehicleSlug: vehicle?.slug ?? input.vehicleSlug,
		vehicleTitle: vehicle?.title ?? input.vehicleTitle
	};

	inquiries.unshift(record);

	return record;
};

export const updateBohemcarsInquiryRecord = (
	id: string,
	patch: Partial<Pick<BohemcarsInquiryRecord, 'assignedAgentSlug' | 'message' | 'status'>>
) => {
	const record = inquiries.find((inquiry) => inquiry.id === id);

	if (!record) return undefined;

	const assignedAgentSlug = patch.assignedAgentSlug?.trim();
	const message = patch.message?.trim();

	if (assignedAgentSlug) record.assignedAgentSlug = assignedAgentSlug;
	if (message) record.message = message;
	if (patch.status) record.status = patch.status;

	return { ...record };
};

export const listBohemcarsMessages = () => [...messages];

export const createBohemcarsMessageRecord = (
	input: Partial<BohemcarsMessageRecord>
): BohemcarsMessageRecord => {
	const record: BohemcarsMessageRecord = {
		authorEmail: input.authorEmail?.trim() || bohemcarsContact.emailLabel,
		authorName: input.authorName?.trim() || 'Bohemcars website visitor',
		createdAt: stamp(),
		id: nextId('message'),
		message: input.message?.trim() || 'Message queued for Bohemcars.',
		routePath: input.routePath ?? '/account/messages',
		status: input.status ?? 'open',
		threadId: input.threadId?.trim() || 'bohemcars-sales',
		vehicleSlug: input.vehicleSlug
	};

	messages.unshift(record);

	return record;
};

export const updateBohemcarsMessageRecord = (
	id: string,
	patch: Partial<Pick<BohemcarsMessageRecord, 'message' | 'status'>>
) => {
	const records = messages.filter((message) => message.id === id || message.threadId === id);

	if (records.length === 0) return undefined;

	const nextMessage = patch.message?.trim();

	for (const record of records) {
		if (nextMessage) record.message = nextMessage;
		if (patch.status) record.status = patch.status;
	}

	return { ...records[0] };
};

export const listBohemcarsVehicleSubmissions = () => [...vehicleSubmissions];

export const listBohemcarsInventoryListings = ({
	includeArchived = false
}: { includeArchived?: boolean } = {}) =>
	(includeArchived
		? inventoryListings
		: inventoryListings.filter((listing) => listing.status !== 'archived')
	).map((listing) => ({ ...listing }));

const slugFromTitle = (title: string) =>
	title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 64) || 'bohemcars-listing';

export const createBohemcarsInventoryListingRecord = (
	input: Partial<BohemcarsInventoryListingRecord>
): BohemcarsInventoryListingRecord => {
	const createdAt = stamp();
	const title = input.title?.trim() || 'Bohemcars inventory draft';
	const id = nextId('listing');
	const record: BohemcarsInventoryListingRecord = {
		createdAt,
		id,
		mileage: input.mileage?.trim() || 'On request',
		priceLabel: input.priceLabel?.trim() || 'On request',
		routePath: input.routePath ?? '/admin/inventory/new',
		slug: input.slug?.trim() || `${slugFromTitle(title)}-${id}`,
		source: 'admin-listing',
		status: input.status ?? 'draft',
		submissionId: input.submissionId,
		title,
		updatedAt: createdAt,
		vin: input.vin?.trim() || 'On request'
	};

	inventoryListings.unshift(record);

	return { ...record };
};

export const updateBohemcarsInventoryListingRecord = (
	id: string,
	patch: Partial<BohemcarsInventoryListingRecord>
) => {
	const listing = inventoryListings.find(
		(candidate) => candidate.id === id || candidate.slug === id || candidate.submissionId === id
	);

	if (!listing) return undefined;

	const title = patch.title?.trim();
	const priceLabel = patch.priceLabel?.trim();
	const mileage = patch.mileage?.trim();
	const vin = patch.vin?.trim();

	if (title) listing.title = title;
	if (priceLabel) listing.priceLabel = priceLabel;
	if (mileage) listing.mileage = mileage;
	if (vin) listing.vin = vin;
	if (patch.status) listing.status = patch.status;
	listing.updatedAt = stamp();

	return { ...listing };
};

export const archiveBohemcarsInventoryListingRecord = (id: string) =>
	updateBohemcarsInventoryListingRecord(id, { status: 'archived' });

export const createBohemcarsVehicleSubmissionRecord = (
	input: Partial<BohemcarsVehicleSubmissionRecord>
): BohemcarsVehicleSubmissionRecord => {
	const record: BohemcarsVehicleSubmissionRecord = {
		contactEmail: input.contactEmail?.trim() || bohemcarsContact.emailLabel,
		contactName: input.contactName?.trim() || 'Bohemcars customer',
		contactPhone: input.contactPhone?.trim() || bohemcarsContact.primaryPhoneLabel,
		createdAt: stamp(),
		expectedPrice: input.expectedPrice?.trim() || 'On request',
		id: nextId('submission'),
		message: input.message?.trim() || 'Vehicle submission queued for review.',
		mileage: input.mileage?.trim() || 'On request',
		routePath: input.routePath ?? '/sell-your-car',
		source: input.source ?? 'sell-your-car',
		status: input.status ?? 'submitted',
		title: input.title?.trim() || 'Client vehicle',
		vin: input.vin?.trim() || 'On request'
	};

	vehicleSubmissions.unshift(record);

	return record;
};

export const updateBohemcarsVehicleSubmissionRecord = (
	id: string,
	patch: Partial<
		Pick<
			BohemcarsVehicleSubmissionRecord,
			'expectedPrice' | 'message' | 'mileage' | 'status' | 'title' | 'vin'
		>
	>
) => {
	const record = vehicleSubmissions.find((submission) => submission.id === id);

	if (!record) return undefined;

	const expectedPrice = patch.expectedPrice?.trim();
	const message = patch.message?.trim();
	const mileage = patch.mileage?.trim();
	const title = patch.title?.trim();
	const vin = patch.vin?.trim();

	if (expectedPrice) record.expectedPrice = expectedPrice;
	if (message) record.message = message;
	if (mileage) record.mileage = mileage;
	if (title) record.title = title;
	if (vin) record.vin = vin;
	if (patch.status) record.status = patch.status;

	return { ...record };
};

export const createBohemcarsPasswordChangeRecord = (
	user: BohemcarsUser
): BohemcarsPasswordChangeRecord => {
	const record: BohemcarsPasswordChangeRecord = {
		createdAt: stamp(),
		email: user.email,
		id: nextId('password'),
		role: user.role,
		userId: user.id
	};

	passwordChanges.unshift(record);

	return record;
};

export const listBohemcarsPasswordChanges = () => [...passwordChanges];
