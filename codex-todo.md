# Codex todo

Draft for feedback. All items pending; highest priority first within each group. No website changes yet.

Current setup: Vue 3 + TypeScript + Vite, with JSON content in `src/data/`. `App.vue` handles routes and featured carousels; shared components provide navigation, image/PDF galleries, and credential cards. Preserve desktop behaviour, links, and content.

General:

1) Carousel too fast

> Increase the delay between cards and keep the progress bar in sync.
> Currently 4.6 sec in `App.vue` and `showcase.css`. The 100 sec was example wording, not the requested duration; choose a suitable reading delay before implementation.

2) Allow swiping

> Add swiping between featured cards while preserving vertical scrolling and links.
> `MediaCarousel.vue` already supports image/PDF swiping; reuse its approach and avoid moving both carousels with one gesture.

3) Light / dark mode switch

> Add a button in the main header, accessible on desktop and mobile; disable the OS colour-scheme override.
> Recommended: shared layout CSS with separate light/dark colour-variable blocks, selected by JavaScript via a theme attribute. Easier to maintain than two full stylesheets with duplicated layout rules.
> Check hard-coded card colours in both modes.

4) Standardise credentials and activities card panels

> Focus on the homepage carousel boards shown in image 1: consistent borders, panel sizing, and equivalent text sizes, with balanced image/text areas despite different content lengths.
> Check `showcase.css`; this is not a request to restyle the whole credentials archive or a new popup.

5) Current role looks clickable

> Image 2 refers to the red, rounded Current role pill. Replace its button-like treatment with informational text styling.
> Preserve the role in `portfolio.ts` (currently NSF).

6) Final code cleanup

> After fixes, clean up affected code and genuine duplication; preserve routes, PDF previews, and desktop behaviour.

7) (Idea only) Dossier and popup

> Bounce ideas if useful; no implementation planned. Existing dedicated URLs may already serve this purpose.

Desktop:

NA

Mobile:

1) Carousel changes move the page / appear abruptly

> Reproduce the page movement and abrupt changes on mobile, then fix the cause; navigation versus layout shift is not yet established.
> Keep card information readable with a clear transition / active-card indicator.

2) Pause carousel while touching

> Pause featured-card rotation and its progress bar during touch; resume safely on release/cancel.
> Preserve the existing desktop hover pause.

3) About Me contacts too big

> Reduce Contacts card height and spacing on mobile; keep links easy to tap.
> `AboutView.vue` currently gives it the same 320px minimum height as the profile cards.

4) Journey timeline navigation follows the user

> Keep the year selector visible while scrolling within the timeline, with the active year highlighted.
> Reuse year links/tracking in `AboutView.vue` and account for the sticky header. `SectionRail.vue` is hidden below 1601px.

5) Toggle credentials / activities

> Add a mobile selector to switch between groups instead of scrolling through both.
> Reuse item 4's navigation pattern where suitable and keep `CredentialColumn.vue` for content. Confirm homepage, archive, or both.

6) (Optional) Back to portfolio follows the user

> Keep the return link accessible while scrolling without covering content or the header.
> Reuse `ArchivePageHeader.vue` where applicable; preserve the detail page's return to all work experiences.

Validation:

> Check mobile touch/swipe, scroll stability, content, and navigation; check desktop hover, controls, links, and both themes after relevant changes.
> Run existing type-check/build after code changes. Reported mobile bugs are not yet browser-verified.
