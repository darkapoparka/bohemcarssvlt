import { createContext } from 'svelte';
import { browser } from '$app/environment';

const favoriteKey = 'bohemcars:favorites';
const compareKey = 'bohemcars:compare';

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

export class GarageState {
	favorites = $state<string[]>(readStoredList(favoriteKey));
	compare = $state<string[]>(readStoredList(compareKey));
	formMessage = $state('');

	toggleFavorite(slug: string) {
		this.favorites = this.favorites.includes(slug)
			? this.favorites.filter((item) => item !== slug)
			: [...this.favorites, slug];
		writeStoredList(favoriteKey, this.favorites);
	}

	toggleCompare(slug: string) {
		if (this.compare.includes(slug)) {
			this.compare = this.compare.filter((item) => item !== slug);
			writeStoredList(compareKey, this.compare);
			return;
		}

		this.compare = [...this.compare, slug].slice(-3);
		writeStoredList(compareKey, this.compare);
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
	}

	setMessage(message: string) {
		this.formMessage = message;
	}
}

export const [getGarageContext, setGarageContext] = createContext<GarageState>();
