import {
	listBohemcarsInquiries,
	listBohemcarsUsers,
	updateBohemcarsUserRecord,
	type BohemcarsUser,
	type BohemcarsUserStatus
} from './db';
import { bohemcarsRoleLabel, type BohemcarsRole } from './roles';

export type ManagedUserKind = 'account' | 'lead';

export type ManagedUser = {
	avatarRole: BohemcarsRole;
	context: string;
	email: string;
	id: string;
	kind: ManagedUserKind;
	name: string;
	phone: string;
	role: BohemcarsRole | 'lead';
	roleLabel: string;
	status: BohemcarsUserStatus;
	statusLabel: string;
};

const roleContext = (user: BohemcarsUser) => {
	if (user.role === 'admin') return 'Inventory, users, agents';
	if (user.role === 'agent') return 'Inquiries and messages';

	return 'Favorites, compare, messages';
};

const statusLabel = (status: BohemcarsUserStatus) => {
	if (status === 'paused') return 'Paused';
	if (status === 'lead') return 'Open lead';

	return 'Active';
};

const managedUserFromAccount = (user: BohemcarsUser): ManagedUser => ({
	avatarRole: user.role,
	context: roleContext(user),
	email: user.email,
	id: user.id,
	kind: 'account',
	name: user.name,
	phone: user.phone,
	role: user.role,
	roleLabel: bohemcarsRoleLabel(user.role),
	status: user.status,
	statusLabel: statusLabel(user.status)
});

export const normalizeManagedUserStatus = (value: string | undefined) => {
	if (value === 'active' || value === 'paused' || value === 'lead') return value;

	return undefined;
};

const visibleManagedLeadInquiries = () => {
	const records = listBohemcarsInquiries();
	const seedLead = records.find((record) => record.id === 'inquiry-seed-1');

	if (!seedLead) return records.slice(0, 3);

	return [...records.filter((record) => record.id !== seedLead.id).slice(0, 2), seedLead];
};

export const listManagedUsers = () => [
	...listBohemcarsUsers().map(managedUserFromAccount),
	...visibleManagedLeadInquiries().map(
		(inquiry): ManagedUser => ({
			avatarRole: 'customer',
			context: inquiry.vehicleTitle ?? inquiry.message,
			email: inquiry.contactEmail,
			id: inquiry.id,
			kind: 'lead',
			name: inquiry.contactName,
			phone: inquiry.contactPhone,
			role: 'lead',
			roleLabel: 'Lead',
			status: 'lead',
			statusLabel: statusLabel('lead')
		})
	)
];

export const updateManagedUser = ({
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
	const user = updateBohemcarsUserRecord({ email, id, name, phone, status });

	return user ? managedUserFromAccount(user) : undefined;
};
