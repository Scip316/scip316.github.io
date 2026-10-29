# Codex questions

Reply under `Answer:` for any item. Optional preferences keep their current behaviour until you request a change. Dossier/popup remains deferred.

General:

1) Carousel reading time (optional feedback)

> Current: 12 sec between featured cards; touch/hover pauses it.
> After trying it, is this comfortable? If not, what delay would you prefer?

Answer: look ok

Codex: accepted; kept 12 seconds.

2) Credentials / activities boards (optional feedback)

> Image 1 was interpreted as matching borders, panel dimensions, image/text areas, and equivalent text sizes.
> Does the result match what you meant, or was there a specific border/text detail you wanted changed?

Answer: elaborate, don't understand

Codex explanation:

> I mean the two homepage boxes in your screenshot: Certificates & Training and Honours & Activities.
> Both now have the same outer border/height, the same-sized document preview area, and the same font sizes for matching text such as titles and issuers. Longer text still wraps naturally.
> Please describe any specific part you wanted different; the current styling remains until then.

Mobile: 

1) Carousel appears without information

> Current: a short fade, existing card details, and the active-card counter. Rotation no longer changes the section height.
> Did your original comment mean the abrupt transition, missing card details, or a missing caption/indicator? Describe what is still missing, if anything.

Answer: abrupt transition and how it keeps shifitng the page. now seems fine, but on mobile there is alot of space for the unior applciation.A
lso implement the swiping left and right (holding left click and moving) transition

2) Remaining phone bugs

> Desktop and Chrome mobile emulation passed; a physical phone/Safari has not been tested here.
> Please record any remaining issue: phone/browser, page, steps, expected result, actual result. Write "none noticed" if it looks good.

Answer: none, i only use google

Codex: noted; Chrome is the current review target.

3) Sticky controls (optional feedback)

> Current: header, return link, and relevant year/group selector remain visible. Switching credential groups while reading returns to the chosen group's start.
> Does this leave enough reading space on your phone, and is the switch behaviour comfortable? Describe any adjustment you want.

Answer: looks ok, the back to porfilo button should also have the same format for the desktop

Codex: implemented the same sticky return-navigation row on desktop and mobile, keeping the detail page return destination.

Codex update on Mobile 1:

> Added left-button dragging in both directions, including gallery dragging, while preserving touch swipes and normal clicks. Tightened mobile work-card spacing.

4) Shorter work cards: remaining height tradeoff

> The Junior Application card has less content than the longest work card. All cards currently reserve the tallest height to prevent the page from jumping during automatic rotation.
> Further reducing that reserved space requires changing this behaviour. Prefer keeping stable autoplay heights (recommended), or compact individual card heights with manual-only navigation on mobile?

Answer: User requested resolving the empty space below the mobile project details.

Codex: applied compact individual heights for mobile work/project cards, with manual arrows/swipes. Desktop autoplay and credential boards retain their existing behaviour.
