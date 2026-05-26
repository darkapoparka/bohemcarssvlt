import { vehicles } from '$lib/data/vehicles';
import type { BohemcarsSession } from './auth';

export type BohemcarsGarageState = {
	compare: string[];
	favorites: string[];
};

type GaragePatch = Partial<BohemcarsGarageState>;

const vehicleSlugs = new Set(vehicles.map((vehicle) => vehicle.slug));
const garageByAccount = new Map<string, BohemcarsGarageState>();

export const normalizeGarageList = (value: unknown) =>
	Array.isArray(value)
		? value.filter((item): item is string => vehicleSlugs.has(String(item)))
		: [];

const defaultGarageState = (): BohemcarsGarageState => ({
	compare: vehicles.slice(0, 2).map((vehicle) => vehicle.slug),
	favorites: vehicles.slice(0, 3).map((vehicle) => vehicle.slug)
});

const accountGarageKey = (session: BohemcarsSession) =>
	`${session.role}:${session.email.toLowerCase()}`;

const cloneGarageState = (state: BohemcarsGarageState): BohemcarsGarageState => ({
	compare: [...state.compare],
	favorites: [...state.favorites]
});

export const getBohemcarsGarageState = (session: BohemcarsSession) => {
	const key = accountGarageKey(session);
	const state = garageByAccount.get(key) ?? defaultGarageState();

	if (!garageByAccount.has(key)) {
		garageByAccount.set(key, cloneGarageState(state));
	}

	return cloneGarageState(state);
};

export const updateBohemcarsGarageState = (session: BohemcarsSession, patch: GaragePatch) => {
	const current = getBohemcarsGarageState(session);
	const next = {
		compare: patch.compare ? normalizeGarageList(patch.compare).slice(0, 4) : current.compare,
		favorites: patch.favorites ? normalizeGarageList(patch.favorites) : current.favorites
	};

	garageByAccount.set(accountGarageKey(session), next);

	return cloneGarageState(next);
};
