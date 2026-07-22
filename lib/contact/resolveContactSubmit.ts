export type ContactSubmitMode = "web3forms" | "api";

type ResolveOptions = {
  /** Explicit override from the host app. */
  submitMode?: ContactSubmitMode;
  web3formsKey?: string | null;
};

/** Prefer Web3Forms when a public key is present; otherwise the host `/api/contact` route. */
export function resolveContactSubmitMode({
  submitMode,
  web3formsKey,
}: ResolveOptions): ContactSubmitMode {
  if (submitMode === "web3forms" || submitMode === "api") {
    return submitMode;
  }
  return web3formsKey?.trim() ? "web3forms" : "api";
}

/** Client-side guard before calling a transport that cannot succeed. */
export function getContactFormConfigError(
  mode: ContactSubmitMode,
  web3formsKey?: string | null
): string | null {
  if (mode === "web3forms" && !web3formsKey?.trim()) {
    return "Contact form is not configured. Set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY.";
  }
  return null;
}

/** When the response body has no usable error (e.g. static 404 HTML). */
export function getContactFormFallbackError(mode: ContactSubmitMode): string {
  if (mode === "api") {
    return "Could not reach /api/contact. For static hosting (GitHub Pages) set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY; for Node hosts set RESEND_API_KEY and CONTACT_FORM_TO_EMAIL.";
  }
  return "Could not send your message. Check form configuration and try again.";
}
