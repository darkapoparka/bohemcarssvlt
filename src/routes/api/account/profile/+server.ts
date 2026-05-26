import { errorJson, okJson, payloadString, readApiPayload } from '$lib/server/api';
import { resolveBohemcarsApiSession } from '$lib/server/auth';
import { updateBohemcarsUserProfile } from '$lib/server/db';

export async function POST({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const session = resolveBohemcarsApiSession(
		request,
		payloadString(payload, 'role', 'actorRole') ?? 'customer'
	);
	const name = [
		payloadString(payload, 'firstName', 'firstname', 'first_name', 'Firstname'),
		payloadString(payload, 'lastName', 'lastname', 'last_name', 'LastName')
	]
		.filter(Boolean)
		.join(' ')
		.trim();
	const phone = payloadString(payload, 'phone', 'Phone', 'SalesPhone');

	if (!session) {
		return errorJson('Bohemcars account session is required', 401);
	}

	const user = updateBohemcarsUserProfile({
		email: session.email,
		name: payloadString(payload, 'name') ?? name,
		phone,
		role: session.role
	});

	if (!user) {
		return errorJson('Bohemcars account profile not found', 404);
	}

	return okJson({
		email: user.email,
		name: user.name,
		phone: user.phone,
		role: user.role,
		status: 'saved',
		user
	});
}
