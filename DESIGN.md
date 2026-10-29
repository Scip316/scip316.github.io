# Sci-Fi Galaxy Portfolio — Agreed Design

Last updated: 30 October 2026

## Status and project layout

This document records the agreed design, not implemented functionality.

- The original, working website is preserved in `og code/`. Leave it intact.
- Build the new portfolio in the project root, separate from the original.
- Use the existing portfolio content as the content baseline for the redesign.
- No new website implementation has started yet.

## Visual references

- [mass_effect_space.png](mass_effect_space.png): the main galaxy map, its angled
  perspective, red circular nodes, and blue grid lines.
- [sub_node_overview.png](sub_node_overview.png): the translucent, blue-framed
  sci-fi detail panel over a space scene.

These images establish the visual direction: an interactive Mass Effect-style
galaxy interface rather than a conventional scrolling portfolio.

## Main galaxy map

- Visitors enter a galaxy scene with moving galaxy particles.
- Red circular markers, called **nodes**, represent portfolio sections such as
  Work Experience, Projects, and Certifications.
- A grey-framed, sci-fi news-style board sits on the left of the main map and
  displays brief summaries of portfolio highlights.
- The highlights board is part of the main-map view, including when returning
  from a section.

## About Me: central Command Centre

- Place **About Me** at the galaxy's bright central core.
- Label it **Darrel Lim — Command Centre**.
- Selecting it zooms in to reveal sub-nodes for the profile, interests, and
  journey/timeline.
- Its sub-nodes use the same detail-panel interaction as the other sections.

## Navigation and entry details

```text
Main galaxy map
    -> Select a section node
    -> Smoothly zoom into that section
    -> Reveal sub-nodes for its individual entries
    -> Select an entry sub-node
    -> Open its detailed pop-out panel over the space scene
```

- Zooming in and out should feel like navigating the Mass Effect galaxy map.
- Selecting an entry opens a sci-fi pop-out panel, not a separate detail page.
- The panel contains that entry's in-depth description and relevant content.
- Closing the panel returns to the same section/sub-node view.
- Provide a clear way to return from the section to the main galaxy map, using
  a smooth zoom-out transition.
- Navigation must remain understandable; the game-like presentation must not
  leave visitors stuck in a section or panel.

## Not yet specified

- Final node labels, positions, and entry arrangements beyond the central
  About Me Command Centre.
- Exact highlights-board content and detailed panel layouts.
- Technical rendering approach and precise animation timings.
- Authentication has not been requested or agreed; entering the homepage does
  not, by itself, imply a login system.
