import { error } from '@sveltejs/kit';
import {
	canRoleAccessBohemcarsRoute,
	defaultRoleForBohemcarsRoute,
	normalizeBohemcarsRole
} from './roles';
import {
	createBohemcarsSessionRecord,
	createBohemcarsUserRecord,
	deleteBohemcarsSessionByToken,
	findBohemcarsSessionByToken,
	findBohemcarsUserByEmail,
	findBohemcarsUserByRole,
	type BohemcarsUser
} from './db';
import type { BohemcarsRole, BohemcarsSession, BohemcarsSessionRecord } from '$lib/types/account';

export type { BohemcarsRole, BohemcarsSession } from '$lib/types/account';
export { bohemcarsRoleLabel } from './roles';

export const bohemcarsDemoSessions: Record<BohemcarsRole, BohemcarsSession> = {
	admin: {
		email: 'admin@bohemcars.local',
		name: 'Bohemcars Admin',
		role: 'admin'
	},
	agent: {
		email: 'agent@bohemcars.local',
		name: 'Bohemcars Agent',
		role: 'agent'
	},
	customer: {
		email: 'customer@bohemcars.local',
		name: 'Bohemcars Customer',
		role: 'customer'
	}
};

export const bohemcarsSessionCookieName = 'bohemcars_session';

const roleFromSearch = (searchParams?: URLSearchParams): BohemcarsRole | undefined =>
	normalizeBohemcarsRole(searchParams?.get('role'));

const sessionFromUser = (user: BohemcarsUser): BohemcarsSession => ({
	email: user.email,
	name: user.name,
	role: user.role
});

const sessionFromRecord = (session: BohemcarsSessionRecord): BohemcarsSession => ({
	email: session.email,
	name: session.name,
	role: session.role,
	token: session.token
});

const bearerToken = (request: Request) => {
	const authorization = request.headers.get('authorization') ?? '';
	const match = authorization.match(/^Bearer\s+(.+)$/i);

	return match?.[1]?.trim();
};

const cookieToken = (request: Request) => {
	const cookie = request.headers.get('cookie') ?? '';

	return cookie
		.split(';')
		.map((part) => part.trim())
		.find((part) => part.startsWith(`${bohemcarsSessionCookieName}=`))
		?.slice(bohemcarsSessionCookieName.length + 1);
};

const sessionTokenFromRequest = (request: Request) =>
	request.headers.get('x-bohemcars-session')?.trim() ??
	bearerToken(request) ??
	cookieToken(request);

const roleFromRequestSearch = (request: Request): BohemcarsRole | undefined => {
	try {
		return normalizeBohemcarsRole(new URL(request.url).searchParams.get('role'));
	} catch {
		return undefined;
	}
};

const explicitPrototypeRole = (request: Request) =>
	normalizeBohemcarsRole(request.headers.get('x-bohemcars-prototype-role')) ??
	roleFromRequestSearch(request);

export const resolveBohemcarsSession = (
	routePath = '',
	searchParams?: URLSearchParams
): BohemcarsSession => {
	const role = roleFromSearch(searchParams) ?? defaultRoleForBohemcarsRoute(routePath);
	const user = findBohemcarsUserByRole(role);

	if (user) {
		return sessionFromUser(user);
	}

	return bohemcarsDemoSessions[role];
};

export const canAccessBohemcarsRoute = (session: BohemcarsSession, routePath = '') =>
	canRoleAccessBohemcarsRoute(session.role, routePath);

export const sessionCookieForBohemcarsSession = (session: BohemcarsSession) =>
	session.token
		? `${bohemcarsSessionCookieName}=${encodeURIComponent(
				session.token
			)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 8}`
		: undefined;

export const expiredBohemcarsSessionCookie = () =>
	`${bohemcarsSessionCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;

export const resolveBohemcarsApiSession = (
	request: Request,
	fallbackRole?: BohemcarsRole | string
): BohemcarsSession | undefined => {
	const token = sessionTokenFromRequest(request);
	const record = token ? findBohemcarsSessionByToken(decodeURIComponent(token)) : undefined;

	if (record && new Date(record.expiresAt).getTime() > Date.now()) {
		return sessionFromRecord(record);
	}

	const role = normalizeBohemcarsRole(fallbackRole);
	const user =
		role && explicitPrototypeRole(request) === role ? findBohemcarsUserByRole(role) : undefined;

	return user ? sessionFromUser(user) : undefined;
};

export const resolveBohemcarsRequestSession = (
	request: Request,
	routePath = '',
	searchParams?: URLSearchParams
): BohemcarsSession =>
	resolveBohemcarsApiSession(request) ?? resolveBohemcarsSession(routePath, searchParams);

const isProtectedPageRoute = (routePath = '') => {
	const normalized = routePath.replace(/^\/+|\/+$/g, '');

	return normalized.startsWith('account') || normalized.startsWith('admin');
};

export const resolveBohemcarsPageSession = (
	request: Request,
	routePath = '',
	searchParams?: URLSearchParams
): BohemcarsSession | undefined => {
	const authenticated = resolveBohemcarsApiSession(request);

	if (authenticated) return authenticated;
	if (isProtectedPageRoute(routePath) && !roleFromSearch(searchParams)) return undefined;

	return resolveBohemcarsSession(routePath, searchParams);
};

export const requireBohemcarsPageSession = (
	request: Request,
	routePath = '',
	searchParams?: URLSearchParams
): BohemcarsSession => {
	const session = resolveBohemcarsPageSession(request, routePath, searchParams);

	if (!session) {
		error(401, 'Bohemcars account session is required');
	}

	if (!canAccessBohemcarsRoute(session, routePath)) {
		error(403, 'Bohemcars account role cannot access this route');
	}

	return session;
};

export const clearBohemcarsRequestSession = (request: Request) => {
	const token = sessionTokenFromRequest(request);

	return token ? deleteBohemcarsSessionByToken(decodeURIComponent(token)) : false;
};

export const authenticateBohemcarsUser = ({
	email,
	password,
	role
}: {
	email: string;
	password: string;
	role?: BohemcarsRole | string;
}): BohemcarsSession | undefined => {
	const user = findBohemcarsUserByEmail(email);
	const requestedRole = normalizeBohemcarsRole(role);
	const passwordLooksIntentional = password.trim().length >= 8;

	if (!user || !passwordLooksIntentional || (requestedRole && user.role !== requestedRole)) {
		return undefined;
	}

	const session = createBohemcarsSessionRecord(user);

	return {
		email: session.email,
		name: session.name,
		role: session.role,
		token: session.token
	};
};

export const registerBohemcarsCustomer = ({
	email,
	name,
	password,
	phone
}: {
	email: string;
	name?: string;
	password: string;
	phone?: string;
}): BohemcarsSession | undefined => {
	const normalizedEmail = email.trim().toLowerCase();
	const passwordLooksIntentional = password.trim().length >= 8;

	if (!normalizedEmail.includes('@') || !passwordLooksIntentional) {
		return undefined;
	}

	const existing = findBohemcarsUserByEmail(normalizedEmail);

	if (existing && existing.role !== 'customer') {
		return undefined;
	}

	const user =
		existing ??
		createBohemcarsUserRecord({
			email: normalizedEmail,
			name,
			phone,
			role: 'customer',
			status: 'active'
		});
	const session = createBohemcarsSessionRecord(user);

	return {
		email: session.email,
		name: session.name,
		role: session.role,
		token: session.token
	};
};
