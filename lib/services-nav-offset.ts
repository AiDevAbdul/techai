/*
 * Shared scroll offset between the server-rendered /services page sections
 * and the client-rendered ServicesNav. Lives outside the "use client" module
 * because Next 16 won't let a server component import non-component values
 * from a client module — the import gets wrapped in a server-reference proxy.
 *
 * Value = approximate height of (sticky Navbar 48px + sticky ServicesNav 60px
 * + ~16px breathing) so anchor jumps land below both bars.
 */
export const SERVICES_SECTION_SCROLL_MARGIN = 124;
