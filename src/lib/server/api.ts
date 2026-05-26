import { json } from '@sveltejs/kit';

export type ApiPayload = Record<string, unknown>;

export const readApiPayload = async (request: Request): Promise<ApiPayload> => {
	const contentType = request.headers.get('content-type') ?? '';

	if (contentType.includes('application/json')) {
		const body = await request.json();

		return typeof body === 'object' && body ? body : {};
	}

	const formData = await request.formData();

	return Object.fromEntries(formData.entries());
};

export const payloadString = (payload: ApiPayload, ...keys: string[]) => {
	for (const key of keys) {
		const value = payload[key];

		if (typeof value === 'string' && value.trim()) return value.trim();
	}

	return undefined;
};

export const okJson = <Data>(data: Data, init?: ResponseInit) => json({ ok: true, data }, init);

export const errorJson = (message: string, status = 400) =>
	json({ ok: false, message }, { status });
