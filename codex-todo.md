# Codex todo

Implemented 1 Oct 2026. Highest priority first within each group. Preserve desktop behaviour, routes, content, links, and PDF previews.

General:

1) (Done) Carousel too fast

> Increased featured-card delay from 4.6 to 12 sec; timer and progress bar share one duration.

2) (Done) Allow swiping

> Featured cards support horizontal touch swipes and left-button dragging in both directions; vertical gestures remain scrolling.
> Multi-image galleries keep their own swipe and looping behaviour. Swiping does not open links.

3) (Done) Light / dark mode switch

> Header button works on desktop/mobile, remembers the choice, and ignores the OS theme. Default is dark.
> Shared layout CSS with separate colour-variable blocks; document previews retain their light backgrounds.

4) (Done) Standardise credentials and activities card panels

> Homepage boards have matching borders, image/text areas, and equivalent text sizes, following image 1.

5) (Done) Current role looks clickable

> Replaced the red rounded pill in image 2 with an informational border: fine top/bottom rules, a red left edge, and a transparent background. Role content unchanged.

6) (Done) Final code cleanup

> Extracted shared carousel timing/pause and swipe logic, reused existing components, and removed redundant wrappers.
> Kept changes within the todo's affected code; no new packages or content/schema changes.
> Follow-up: load the PDF renderer separately from the main application; preview behaviour and direct document links remain.

7) (Idea only) Dossier and popup

> Deferred; existing dedicated URLs remain. No popup implementation planned.

Desktop:

NA

Mobile:

1) (Done) Carousel changes move the page / appear abruptly

> Mobile work/project cards fit their own content; arrows and touch/mouse swipes navigate manually, preventing autoplay from shifting the page. Credential boards retain stable shared heights and their short fade.
> Bounded image heights and allowed longer work/project content to fit at desktop/tablet widths too.

2) (Done) Pause carousel while touching

> Rotation/progress pause during touch and resume on release/cancel; desktop hover and keyboard focus pauses remain independent.
> Hidden groups/pages and reduced-motion preferences pause autoplay too.

3) (Done) About Me contacts too big

> Removed the Contacts card's mobile 320px minimum height and tightened spacing; links remain easy to tap.

4) (Done) Journey timeline navigation follows the user

> Sticky horizontal year selector below the header/return link; selected years stay visible above the content.
> Reused section tracking for mobile and preserved the existing desktop year-highlighting behaviour.

5) (Done) Toggle credentials / activities

> Shared sticky selector on both homepage and archive; desktop still shows both groups.
> Switching while reading returns to the selected group's start. Existing credential cards remain in use.

6) (Done, optional item) Back to portfolio follows the user

> Return navigation uses the same sticky row below the header on mobile and desktop; experience details still return to all work experiences.

Validation:

> Chrome mobile emulation: touch/swipe/cancel, gallery looping, vertical scrolling, stable autoplay height, theme persistence, sticky controls, menu, links, and browser Back passed.
> Checked all five main pages for horizontal overflow at 320, 390, 560, 760, 820, 1280, and 1920px; checked homepage content clipping after layout fixes.
> Type check and production build passed. PDF rendering now loads as a separate chunk; main JavaScript reduced from ~518 to ~120 kB. Production Chrome checks passed for all 13 PDF thumbnails/direct links, and PDF-free project pages do not request the renderer. User reports no remaining bugs in Chrome; Chrome is the current review target.

Feedback:

> Reply inline in [codex-questions.md](codex-questions.md) for remaining interpretation questions and phone feedback. Optional preferences retain their current behaviour.

Follow-up feedback:

> Removed WhatsApp and Telegram contact links from About Me and the footer; LinkedIn/email remain.
> Mouse-drag directions, gallery isolation, touch regression, role-border styling, contact removal, and sticky desktop return navigation passed production Chrome checks. Type check/build passed.
> Resolved the reported blank space below mobile project/work details with compact individual card heights and manual mobile navigation. Desktop autoplay remains enabled.

Performance follow-up:

1) (Done) Smaller images and static document previews

> Tested a photo/certificate sample before generating 17 sources. Responsive WebP images and all 10 PDF thumbnails load correctly; original files/links remain. Generation runs before dev/build.

2) (Done) Load secondary pages on demand

> Direct URLs, internal links, Back, timeline hash links, mobile cards, and load-failure/reload recovery passed. Main JavaScript reduced from 121.5 to 111.4 kB; initial mobile transfer measured ~325 kB versus the previous ~1.06 MB.

3) (Reverted) Batch scroll calculations

> A final-year timeline highlighting check failed. Reverted this optimisation and retained established scroll tracking; the edge case needs separate investigation.

4) (Done) Give contact links more room

> Narrow panels use stacked rows with more padding and a 16px label/arrow gap. Checked 320?1920px for overflow.
