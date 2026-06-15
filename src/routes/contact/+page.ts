// csr=true: the clean page needs client JS — the contact form's submit handler
// (preventDefault + local status message) and the clean header's language dropdown +
// search modal. The page is light (no app.css / no Auxero runtime), so hydration is cheap.
export const csr = true;
