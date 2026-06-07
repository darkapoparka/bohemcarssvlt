import { createContext } from 'svelte';
import { browser } from '$app/environment';

const favoriteKey = 'bohemcars:favorites';
const compareKey = 'bohemcars:compare';
const sessionKey = 'bohemcars:session';
const compareLimit = 4;

const readStoredList = (key: string) => {
	if (!browser) return [];

	try {
		const value = JSON.parse(localStorage.getItem(key) || '[]');

		return Array.isArray(value) ? value.filter((item) => typeof item === 'string') : [];
	} catch {
		return [];
	}
};

const writeStoredList = (key: string, value: string[]) => {
	if (!browser) return;

	localStorage.setItem(key, JSON.stringify(value));
};

const syncGarageDom = (
	favorites = readStoredList(favoriteKey),
	compare = readStoredList(compareKey)
) => {
	if (!browser) return;

	for (const card of document.querySelectorAll<HTMLElement>('[data-bohemcars-slug]')) {
		const slug = card.getAttribute('data-bohemcars-slug');
		const favorite = card.querySelector<HTMLElement>('.bohemcars-favorite, .heart');

		if (!slug || !favorite) continue;

		const isFavorite = favorites.includes(slug);
		favorite.classList.toggle('is-active', isFavorite);
		favorite.setAttribute('aria-pressed', String(isFavorite));
	}

	for (const link of document.querySelectorAll<HTMLElement>('[aria-label="Compare"]')) {
		link.setAttribute('data-badge', String(compare.length));
	}

	for (const link of document.querySelectorAll<HTMLElement>(
		'[aria-label="Wishlist"], [aria-label="Любими"]'
	)) {
		link.setAttribute('data-badge', String(favorites.length));
	}
};

const shouldSyncGarageApi = () => {
	if (!browser) return false;

	const pathname = window.location.pathname;
	return (
		Boolean(new URLSearchParams(window.location.search).get('role')) ||
		readStoredList(sessionKey).length > 0 ||
		pathname.startsWith('/account') ||
		pathname.startsWith('/admin')
	);
};

const syncGarageApi = async () => {
	if (!shouldSyncGarageApi()) return;

	try {
		const role = new URLSearchParams(window.location.search).get('role');
		const headers: Record<string, string> = { 'content-type': 'application/json' };
		if (role) headers['x-bohemcars-prototype-role'] = role;

		await fetch('/api/account/garage', {
			body: JSON.stringify({
				compare: readStoredList(compareKey),
				favorites: readStoredList(favoriteKey),
				...(role ? { role } : {})
			}),
			credentials: 'same-origin',
			headers,
			method: 'POST'
		});
	} catch {
		// LocalStorage remains the immediate source of truth when the prototype API is unavailable.
	}
};

const favoriteSlugsWith = (slug: string) => {
	const current = readStoredList(favoriteKey);

	return current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
};

const compareSlugsWith = (slug: string) =>
	[slug, ...readStoredList(compareKey).filter((item) => item !== slug)].slice(0, compareLimit);

export class GarageState {
	favorites = $state<string[]>(readStoredList(favoriteKey));
	compare = $state<string[]>(readStoredList(compareKey));
	formMessage = $state('');

	toggleFavorite(slug: string) {
		this.favorites = favoriteSlugsWith(slug);
		writeStoredList(favoriteKey, this.favorites);
		syncGarageDom();
		void syncGarageApi();
	}

	addCompare(slug: string) {
		this.compare = compareSlugsWith(slug);
		writeStoredList(compareKey, this.compare);
		syncGarageDom();
		void syncGarageApi();
	}

	toggleCompare(slug: string) {
		this.addCompare(slug);
	}

	isFavorite(slug: string) {
		return this.favorites.includes(slug);
	}

	isCompared(slug: string) {
		return this.compare.includes(slug);
	}

	clearCompare() {
		this.compare = [];
		writeStoredList(compareKey, this.compare);
		syncGarageDom();
		void syncGarageApi();
	}

	setMessage(message: string) {
		this.formMessage = message;
	}
}

export const [getGarageContext, setGarageContext] = createContext<GarageState>();
