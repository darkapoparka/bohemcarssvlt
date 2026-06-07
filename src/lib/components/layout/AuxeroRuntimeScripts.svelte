<script lang="ts">
	import { onMount, tick } from 'svelte';

	type Props = {
		html: string;
		pageKey?: string;
	};

	type AuxeroWindow = Window & {
		__BOHEMCARS_AUXERO_BODY_LOADER_EXECUTED__?: number;
		__BOHEMCARS_AUXERO_RUNTIME_MOUNTS__?: number;
		__BOHEMCARS_BODY_SCRIPTS_LOADED__?: boolean;
	};

	let { html, pageKey = '' }: Props = $props();

	const replayAttribute = 'data-bohemcars-runtime-replay';
	const scriptTagPattern = /<script\b/i;

	const wait = (milliseconds: number) =>
		new Promise((resolve) => {
			window.setTimeout(resolve, milliseconds);
		});

	const hasUninitializedAuxeroWidgets = () =>
		Boolean(
			document.querySelector(
				'.swiper-container:not(.swiper-container-initialized):not(.bohemcars-native-scroll)'
			)
		);

	const hasLoadedAuxeroGlobals = () => {
		const auxeroWindow = window as Window & {
			jQuery?: unknown;
			Swiper?: unknown;
		};

		return typeof auxeroWindow.jQuery === 'function' || typeof auxeroWindow.Swiper === 'function';
	};

	const parseScriptTags = (source: string) => {
		const template = document.createElement('template');
		template.innerHTML = source;

		return Array.from(template.content.querySelectorAll('script'));
	};

	const executeScriptTag = (sourceScript: HTMLScriptElement) =>
		new Promise<void>((resolve) => {
			const script = document.createElement('script');

			for (const attribute of Array.from(sourceScript.attributes)) {
				script.setAttribute(attribute.name, attribute.value);
			}

			script.setAttribute(replayAttribute, 'true');

			if (sourceScript.textContent) {
				script.textContent = sourceScript.textContent;
			}

			if (sourceScript.src) {
				script.addEventListener('load', () => resolve(), { once: true });
				script.addEventListener('error', () => resolve(), { once: true });
			}

			document.body.append(script);

			if (!sourceScript.src) {
				resolve();
			}
		});

	const executeScriptTags = async (source: string) => {
		const scripts = parseScriptTags(source);

		if (!scripts.length) return;

		for (const script of document.querySelectorAll(`script[${replayAttribute}="true"]`)) {
			script.remove();
		}

		for (const script of scripts) {
			await executeScriptTag(script);
		}
	};

	const waitForServerRenderedScripts = async (isFirstAuxeroRuntimeMount: boolean) => {
		if (!isFirstAuxeroRuntimeMount) return false;

		let sawServerManagedScripts = false;
		let loadedButUninitializedAttempts = 0;

		for (let attempt = 0; attempt < 30; attempt += 1) {
			const auxeroWindow = window as AuxeroWindow;
			const bodyScriptsLoaded = Boolean(auxeroWindow.__BOHEMCARS_BODY_SCRIPTS_LOADED__);
			const widgetsNeedReplay = hasUninitializedAuxeroWidgets();
			sawServerManagedScripts =
				sawServerManagedScripts ||
				Boolean(auxeroWindow.__BOHEMCARS_AUXERO_BODY_LOADER_EXECUTED__) ||
				hasLoadedAuxeroGlobals();

			if (
				sawServerManagedScripts &&
				!widgetsNeedReplay &&
				(bodyScriptsLoaded || hasLoadedAuxeroGlobals())
			) {
				return true;
			}

			if (sawServerManagedScripts && bodyScriptsLoaded && widgetsNeedReplay) {
				loadedButUninitializedAttempts += 1;

				if (loadedButUninitializedAttempts >= 2) {
					return false;
				}
			}

			if (!sawServerManagedScripts && attempt >= 14) {
				return false;
			}

			await wait(100);
		}

		return false;
	};

	const runScriptsWhenNeeded = async () => {
		if (!scriptTagPattern.test(html)) return;

		await tick();

		const auxeroWindow = window as AuxeroWindow;
		const mountCount = auxeroWindow.__BOHEMCARS_AUXERO_RUNTIME_MOUNTS__ ?? 0;
		const isFirstAuxeroRuntimeMount = mountCount === 0;
		auxeroWindow.__BOHEMCARS_AUXERO_RUNTIME_MOUNTS__ = mountCount + 1;

		const serverScriptsHandledThisMount =
			await waitForServerRenderedScripts(isFirstAuxeroRuntimeMount);

		if (serverScriptsHandledThisMount && !hasUninitializedAuxeroWidgets()) return;
		if (
			!isFirstAuxeroRuntimeMount &&
			!hasUninitializedAuxeroWidgets() &&
			hasLoadedAuxeroGlobals()
		) {
			return;
		}

		await executeScriptTags(html);
	};

	onMount(() => {
		void pageKey;
		void runScriptsWhenNeeded();
	});
</script>
