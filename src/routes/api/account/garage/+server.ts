import { errorJson, okJson, payloadString, readApiPayload } from '$lib/server/api';
import {
	getBohemcarsGarageState,
	updateBohemcarsGarageState,
	type BohemcarsGarageState
} from '$lib/server/garage';
import { resolveBohemcarsApiSession } from '$lib/server/auth';

const hasPayloadKey = (payload: Record<string, unknown>, key: string) =>
	Object.prototype.hasOwnProperty.call(payload, key);

export function GET({ request, url }: { request: Request; url: URL }) {
	const session = resolveBohemcarsApiSession(request, url.searchParams.get('role') ?? undefined);

	if (!session) {
		return errorJson('Bohemcars account session is required', 401);
	}

	return okJson(getBohemcarsGarageState(session));
}

export async function POST({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const session = resolveBohemcarsApiSession(request, payloadString(payload, 'actorRole', 'role'));

	if (!session) {
		return errorJson('Bohemcars account session is required', 401);
	}

	const patch: Partial<BohemcarsGarageState> = {};

	if (hasPayloadKey(payload, 'favorites')) {
		patch.favorites = Array.isArray(payload.favorites) ? payload.favorites : [];
	}

	if (hasPayloadKey(payload, 'compare')) {
		patch.compare = Array.isArray(payload.compare) ? payload.compare : [];
	}

	return okJson(updateBohemcarsGarageState(session, patch));
}
