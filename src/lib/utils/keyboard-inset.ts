import type { Attachment } from 'svelte/attachments';

/**
 * Exposes the on-screen keyboard height as `--bc-kb-inset` on the attached element.
 *
 * On Android Chrome the viewport meta `interactive-widget=resizes-content` already
 * shrinks the layout viewport, so the computed inset stays ~0 and this is inert.
 * iOS Safari ignores that meta — there the visual viewport shrinks while the layout
 * viewport (and `position: fixed` anchoring) does not, so bottom sheets need to be
 * lifted by the keyboard height via `bottom: var(--bc-kb-inset, 0px)`.
 */
export const keyboardInset: Attachment<HTMLElement> = (node) => {
	const viewport = window.visualViewport;
	if (!viewport) return;

	const update = () => {
		const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
		node.style.setProperty('--bc-kb-inset', `${Math.round(inset)}px`);
	};

	update();
	viewport.addEventListener('resize', update);
	viewport.addEventListener('scroll', update);

	return () => {
		viewport.removeEventListener('resize', update);
		viewport.removeEventListener('scroll', update);
		node.style.removeProperty('--bc-kb-inset');
	};
};
