# Portfolio — Technical Design Doc

**Status:** Draft
**Last updated:** 2026-09-04

Covers the stack choices for the portfolio rebuild and the design of the
photography page, which combines a persistent ink-bleed reveal mask over an
infinite directional photo gallery.

Decisions are recorded as ADRs: what was chosen, what was rejected, and why. If a
decision is reversed later, update the ADR in place and note what changed the
call — don't delete it.

---

## 1. Goals

- Ship a portfolio that stands out on interaction design, not just layout.
- Learn TypeScript, React, and Next.js properly in the process (never used TS).
- Ship soon. Where learning and speed conflict, note the tradeoff explicitly.

**Non-goals:** a CMS, a backend, auth, user accounts, a blog engine.

---

## 2. Page concept

**This is not the landing page.** Technical work — the thing a recruiter needs —
is directly on the first page. This is a secondary page reached by choosing to
click through, showing the photography / creative side.

The mechanic *is* the content:

- Mask layer reads **"tech by day."**
- User sweeps. Ink bleeds outward from each stroke.
- Past a coverage threshold the remaining mask dissolves, revealing
  **"art by night"** fixed on the background behind the drifting gallery.

This resolves the gating concern that shaped an earlier draft of §7. A gate is
justified when the gate is the point, and when everything a recruiter needs is
already behind them on page one.

The "art by night" text is fixed to the background layer, behind the images, and
does not move with the gallery offset. No clash to design around.

---

## 3. Stack

### ADR-001: Next.js 16 + TypeScript + Tailwind v4

**Chosen.** Next.js 16 (Active LTS), React 19, Tailwind v4, GSAP, deployed on
Vercel. Biome for lint + format. MDX for project write-ups.

**Why:** mainstream, employable, well-documented. Claude Code has deep familiarity
with it, which matters given it's assisting.

**Rejected:**
- *Astro or plain Vite + React* — simpler and arguably a better technical fit for
  a mostly-static site, but less recognisable on a résumé.
- *Any state management library, tRPC, a CMS, a database* — no problem here that
  needs them.
- *Rive* — built for authored vector animations driven by state machines. These
  interactions are math-driven and canvas-wide. Would mean learning a separate
  editor and runtime for zero benefit.

**Known cost:** a static portfolio doesn't need server components or the App
Router's data model, and both flagship interactions are client-only. Paying real
complexity tax for framework familiarity. Accepted deliberately.

### ADR-002: GSAP for orchestration only

**Chosen.** GSAP for page-load timelines, the mask dissolve tween, and
`gsap.quickTo` for lerping the gallery offset. GSAP's Observer plugin for input
normalisation (wheel / trackpad / touch / pointer drag → one event stream).

**Why:** GSAP is a tweening engine — value A to value B over a duration. That's
exactly what load sequences and the dissolve are. It is *not* the right tool for
per-frame input-driven rendering, which is what the mask and gallery motion are;
those are hand-written canvas and transform math.

Fully free including all former Club plugins since April 2025 (Webflow acquired
GreenSock). No licensing concern.

---

## 4. Page architecture

Two subsystems on one page: a persistent bleed mask layered over an infinite
gallery. They compete for the same pointer input, so they're coordinated by a
phase state machine rather than left to fight over event listeners.

### ADR-003: Phase state machine

*Revised 2026-09-04 — phase gates input, not rendering.*

**Chosen.** A single enum drives the page:

```
REVEALING → DISSOLVING → EXPLORING
```

**The phase gates input, not existence.** The gallery mounts and ticks from frame
one in every phase. `REVEALING` simply means its `addInput()` is never called.

- `REVEALING` — mask accepts pointer input; gallery ticks but receives no input.
- `DISSOLVING` — neither accepts input; brief.
- `EXPLORING` — mask disposed; gallery owns input.

Every input handler checks phase before acting. One transition function owns all
phase changes.

**Rejected:**
- *Both components attaching their own listeners*, sorted out with
  `stopPropagation` or z-index. Works until it doesn't, and it's miserable to
  retrofit once both systems exist.
- *Gating gallery mount/tick on phase.* This was the original design. It makes
  ambient drift during `REVEALING` (see ADR-009) a restructure of the phase
  machine, the RAF loop, and mount logic rather than a config change. Rejected
  specifically to keep that option cheap.

**Consequence:** the mask is a fixed, viewport-sized canvas. The gallery must not
respond to scroll during `REVEALING`, which avoids ever having to reconcile
scroll offset against erased regions.

### ADR-004: One RAF loop, not two

**Chosen.** A single `requestAnimationFrame` loop owned by the page, ticking both
subsystems with one shared timestamp.

**Rejected:** one loop per component. Two schedulers, no guaranteed ordering
between them, double the cleanup surface, and much harder to debug.

### ADR-005: React owns mount, not motion

**Chosen.** All per-frame values — cursor position, scroll offset, stamp list,
item transforms, coverage — live in refs and are mutated inside the RAF loop,
which writes directly to the DOM and canvas. React handles mount/unmount, layout,
and content only.

**Why:** putting cursor position in `useState` triggers a React render on every
`pointermove`. Performance dies immediately.

**This is the central architectural boundary of the project.** React on one side,
an imperative animation layer on the other, communicating through refs and a
small explicit interface (see §8).

---

## 5. The reveal

### ADR-006: Two-canvas stamp system with time-based bleed

*Revised 2026-09-04 — was a single stateless punch-and-forget canvas. The bleed
requirement makes the mask a simulation with per-stamp lifecycle.*

**Chosen.** Full-viewport canvas, erasing via
`globalCompositeOperation = 'destination-out'`. Reveal is permanent — nothing
heals. But each stamp *grows* for ~1.5s after creation before reaching its mature
radius and stopping.

Stamps are immutable records: `{x, y, bornAt, rotation}`. Radius is derived from
age, never stored or mutated.

Two canvases, which is what makes the bleed affordable:

- **`matureCanvas`** — stamps older than `growthDuration` are drawn into it once,
  at mature radius, and never touched again.
- **Active stamps** — only those under ~1.5s old are redrawn per frame.

Each frame: composite `matureCanvas` onto the visible canvas, then punch the
active stamps at their current age-derived radius.

**Why this works:** because growth *stops*, the active set is provably bounded by
pointer speed × 1.5s — realistically 100–200 stamps per frame regardless of how
long the user sweeps. If stamps grew indefinitely, baking would be impossible and
per-frame cost would grow without limit.

**Easing:** ease-out hard. Most spread should happen in the first ~300ms of the
1.5s. Ink wicks fast then stalls; linear growth reads as a balloon inflating.

**Rejected:**
- *CSS `mask-image` with a radial gradient* — trivially easy, but only gives a
  moving spotlight. Can't accumulate a persistent region.
- *Redrawing all stamps every frame, unbaked* — tanks after a minute of sweeping.
- *True diffusion (ping-pong framebuffers, GLSL blur-and-threshold)* — the only
  approach that gives real wicking that follows existing shape and paper grain.
  Requires WebGL, a GLSL rewrite, and a new coverage strategy since mask state
  would live in an unreadable GPU texture. Weeks, not days. Revisit never.

**Optional enhancement — gooey merge.** `filter: blur(8px) contrast(20)` on the
mask layer makes nearby blobs merge into organic connected shapes instead of
reading as overlapping circles. Large chunk of the ink look for almost no code.
Cost is a full-viewport GPU blur every frame — test on a phone before committing,
and treat as progressive enhancement that can be dropped.

### ADR-010: Textured brush via stamped image

**Chosen.** Author a brush PNG in Figma — rough ink blot, soft irregular alpha —
and `drawImage` it with `destination-out` instead of filling a circle. Randomise
rotation per stamp so repeats don't visibly tile.

**Why:** how real paint software works. Best quality per unit of effort, and it
puts aesthetic control in Figma rather than in tuning parameters by trial.

**Rejected:**
- *Solid-fill circle* — hard geometric edge, wrong for the concept.
- *Radial-gradient circle* — soft edge, five lines, no asset. Good fallback if
  the PNG route stalls. Note that soft edges accumulate: repeat passes erase
  further, which feels like rubbing harder.
- *Procedural (simplex-noise-perturbed polygon radius)* — no asset, animatable,
  but means tuning noise parameters instead of drawing what you want.

**Required regardless of brush type:** `pointermove` does not fire densely enough
for fast cursor movement. Interpolate along the segment between previous and
current point, stamping every `stampSpacing` px. Without this, quick sweeps leave
visible gaps or scalloping.

### ADR-007: Coverage measured on a coarse grid, at mature radius

*Revised 2026-09-04 — marking uses mature radius, not current radius.*

**Chosen.** Invisible grid (~24×14 cells). At stamp creation, mark every cell
within the stamp's **mature** radius. `coverage = revealedCells / totalCells`.
Use a `Set` so overlapping sweeps don't double-count.

**Why mature radius:** bleed means revealed area grows with no cursor movement,
so coverage must account for it. Because growth is bounded at 1.5s, mature radius
is known exactly at creation time — this is precise, not an approximation.
Coverage therefore runs slightly ahead of what's currently visible, so the gate
fires a touch early. Acceptable, and errs in the right direction.

**Rejected:**
- *`getImageData` pixel counting* — accurate, but GPU readback stalls the
  pipeline. Unacceptable inside a render loop.
- *Accumulated cursor distance × brush width* — counts repeat passes over the
  same patch, so scribbling in one corner would trigger the reveal without
  revealing anything.

**Threshold:** ~45–55%. Needs playtesting. Latch with a boolean so the transition
fires exactly once.

### ADR-008: Dissolve as a tween

**Chosen.** On threshold, GSAP-tween the whole mask layer's opacity to 0 over
600–900ms with a slight scale or blur so it lifts rather than switches off. On
complete: set phase to `EXPLORING`, dispose canvases and listeners.

Optional polish: gradually reduce mask opacity as coverage approaches the
threshold, so the dissolve reads as earned rather than arbitrary.

### Resize handling

*Revised 2026-09-04 — replay stamps rather than rebuild from grid cells.*

Resizing a canvas clears it, wiping progress. Replay the stamp list at mature
radius into a fresh `matureCanvas`. Higher fidelity than rebuilding from grid
cells (which would look blocky with a textured brush), and the stamp list already
exists — this is the payoff for stamps being immutable records.

---

## 6. The infinite gallery

### ADR-009: Virtual offset with modulo wrapping and ambient velocity

*Revised 2026-09-04 — added `ambientVelocity` to keep drift a config change.*

**Chosen.** Keep a virtual offset `{x, y}` that both input and ambient velocity
mutate. Lay items on a tiled grid with per-cell jitter for the pseudo-random
look. Each frame, compute `base + offset` per item and modulo-wrap so anything
leaving one edge reappears on the opposite side. Apply via `translate3d`.

Randomness **must be deterministic** — seed it. Calling `Math.random()` in the
render loop makes images teleport on wrap.

Write the wrapping math by hand (worth learning); use GSAP Observer for input
normalisation (eats a day for no learning).

**Ambient drift is a config value, not a feature flag:**

```ts
interface GalleryConfig {
  /** px/sec ambient drift. {x:0, y:0} = static. */
  readonly ambientVelocity: { x: number; y: number };
}
```

Applied unconditionally in tick:

```ts
this.offset.x += config.ambientVelocity.x * dt + inputImpulse.x;
```

**Ships as `{x: 0, y: 0}`.** Undecided whether the gallery should drift during
`REVEALING` — movement glimpsed through bled patches may make the layer beneath
feel alive and pull people to keep sweeping, or may just be distracting. Enabling
it later is changing two numbers; scoping it to one phase is one conditional in
the transition function. If enabled, keep it **very** slow.

**Requirements:**
- Scale by `dt`, not per-frame increments, or drift runs at double speed on a
  120Hz display.
- Dirty-check the tick: a frame with zero velocity and zero input must
  early-return rather than recomputing every item transform. Otherwise the
  gallery costs full price while the mask is doing the expensive work.

**Icon-on-proximity:** each frame, distance-check item position against viewport
centre.

### ADR-011: Static grid fallback uses a curated subset

**Chosen.** A `featured: boolean` on the photo record. Static grid renders
`photos.filter(p => p.featured)`. Both layouts read the same source of truth.

**Why:** the two layouts do different jobs. The infinite canvas is a discovery
mechanic — scattered placement, wandering, stumbling on things — which is what
justifies showing sixty photos. A static grid has none of that; sixty photos
becomes a long scroll through a contact sheet and the weakest images drag the set
down. 15–20 strong ones reads as an edit rather than an archive.

Reduced-motion users are already getting the lesser version of this page. Don't
also hand them the tedious version.

**Rejected:** *same full set in both.* Assumed to be simpler, but it isn't — one
boolean per photo and one `.filter()` is the entire implementation cost. The real
cost is making the curation decision, which is work either way.

---

## 7. Accessibility and fallbacks

The reveal gates content. Anyone who can't operate a pointer is otherwise locked
out of the page entirely. §2 justifies gating for pointer users; it does not
justify excluding non-pointer users.

### `prefers-reduced-motion`

An OS-level setting ("Reduce motion" on macOS/iOS, "Show animations" on Windows)
exposed as a CSS media query. People turn it on because motion causes real
physical symptoms — vestibular disorders, migraine triggers, in some cases
seizure risk. Not a taste preference.

Read with `window.matchMedia('(prefers-reduced-motion: reduce)')`.

Required behaviour:
- Skip straight to `EXPLORING`. No mask, no dissolve. "art by night" visible
  immediately.
- Gallery renders as a **static grid** of featured photos (ADR-011) — ordinary
  vertical scroll, no drift. Infinite multi-directional scroll is close to a
  worst case for vestibular triggers.
- Page-load timelines become fades or instant final state.

Principle: reduced motion means *less movement*, not *no feedback*. Substitute
opacity and colour for travel.

### Other requirements

- Gallery content stays in the DOM through all phases — never conditionally
  rendered on phase. Screen readers must find the photos regardless of what's
  painted on top.
- Skip control keyboard-reachable and focusable.
- Nav sits above the mask, or the mask doesn't cover it.

### Touch

Finger-drag as a sweep is natural, and the gallery ignores input during
`REVEALING`, so there's no gesture conflict. This interaction suits mobile better
than most cursor effects.

**Note:** the static grid is the *reduced-motion* path, not the mobile path.
Touch works fine on the infinite canvas. Falling back to the grid on a specific
device is a separate performance decision, not a structural requirement.

---

## 8. UX backstops

*Revised 2026-09-04 — softened substantially given §2. The earlier version
assumed the mask blocked content a recruiter needed. It doesn't.*

- **Idle backstop** — ~15s with no pointer movement → slow *partial* fade as a
  hint, not a full dissolve. Someone confused gets a nudge; someone reading gets
  left alone.
- **Skip control** — keep, but visually demoted. Its real job is keyboard
  accessibility, not impatience.
- **Once per session — OFF.** Do *not* `sessionStorage`-skip on repeat visits.
  This experience is the page. A returning visitor probably wants it again.
- **Content on mask layer** — resolved: "tech by day."

---

## 9. Interfaces

Written before implementation. Each of these encodes an ADR — the types are where
the architecture is enforced.

```ts
/** A single brush stamp. Immutable once created. */
export interface Stamp {
  readonly x: number;
  readonly y: number;
  /** performance.now() at creation */
  readonly bornAt: number;
  /** radians, randomised so brush texture doesn't visibly tile */
  readonly rotation: number;
}

export interface MaskConfig {
  /** ms from birth to mature radius. ~1500. */
  readonly growthDuration: number;
  readonly startRadius: number;
  readonly matureRadius: number;
  /** px between interpolated stamps along a pointer segment */
  readonly stampSpacing: number;
  /** 0–1; coverage at which auto-dissolve fires */
  readonly dissolveThreshold: number;
}

export interface MaskController {
  /** Called from the page's single RAF loop with a shared timestamp. */
  tick(now: number): void;
  /** Feed a pointer sample. Interpolates from the previous point. */
  addPoint(x: number, y: number): void;
  /** 0–1, from the coverage grid. */
  getCoverage(): number;
  /** Replays stamps at mature radius into a fresh canvas. */
  resize(width: number, height: number): void;
  dispose(): void;
}

export function createMask(
  canvas: HTMLCanvasElement,
  config: MaskConfig,
  onThresholdReached: () => void
): MaskController;
```

Phase state as a discriminated union, so illegal combinations don't compile:

```ts
type PageState =
  | { phase: 'REVEALING'; mask: MaskController; gallery: GalleryController }
  | { phase: 'DISSOLVING'; mask: MaskController; progress: number }
  | { phase: 'EXPLORING'; gallery: GalleryController };
```

`EXPLORING` has no `mask` field at all — accessing it there is a compile error,
not a 2am bug. Switching on `state.phase` narrows automatically.

Design decisions visible in the types above:
- `tick` / `dispose` as methods → the mask is imperative, not a React component
  (ADR-005).
- `tick(now)` takes time as a parameter → one RAF loop drives everything from a
  single timestamp (ADR-004).
- `Stamp` fields `readonly` → growth derived from `bornAt`, never mutated. This
  is what makes replay-on-resize work (ADR-006).
- Threshold fires via callback → the mask doesn't own the phase machine; the page
  does (ADR-003).
- `getCoverage()` returns a number, says nothing about grids → the grid is an
  implementation detail, changeable without touching callers (ADR-007).

---

## 10. Build sequence

1. Design tokens from Figma into the Tailwind theme layer — before any
   components. Skipping this produces arbitrary values (`text-[17px]`,
   `mt-[23px]`) scattered everywhere.
2. Write real content. Projects die at the lorem-ipsum stage more often than the
   technical one.
3. One full vertical slice: a page designed → typed → built → styled → deployed
   to a live URL. Hits every category of problem once, while the codebase is
   small enough to throw away.
4. **Gallery**, standalone, at a fixed URL. Get it good.
5. **Mask**, standalone and self-contained. Circle brush first; swap in the
   textured PNG once the stamp lifecycle works.
6. **Wire the state machine** between them last.

Steps 4–6 in that order matter. Building them entangled means debugging two
unfinished systems through each other, which is how projects like this stall out
three weeks in.

If time runs short: one excellent interaction beats two half-finished ones.

---

## 11. Gotchas

- **Cancel the RAF loop in effect cleanup.** `cancelAnimationFrame(rafId)` in the
  `useEffect` return. Otherwise the loop outlives the component — writing to dead
  DOM nodes, leaking references, burning CPU.
- **StrictMode double-mount.** Next.js dev mounts → unmounts → remounts to catch
  exactly this. Missing cleanup = two loops at once, usually visible as
  double-speed or jittering animation. Dev-only, which means the bug is loud
  where you'll see it and silent where it hurts users. Treat as a real signal.
- **Cap the canvas backing store** at `min(devicePixelRatio, 2)`. Two
  full-viewport canvases with per-frame redraw, possibly plus a blur filter —
  rendering at native 3x on a phone triples pixel count for no visible gain.
- **Scale motion by `dt`.** Both drift and stamp growth. Otherwise everything
  runs at double speed on 120Hz displays.
- **Interpolate stamps along pointer segments.** See ADR-010.
- **Lazy-load gallery images**, or ship 40MB.
- **Seed the layout jitter.** See ADR-009.

---

## 12. Learning practice (personal)

Not part of the technical design; recorded so it doesn't get quietly dropped
under deadline pressure.

- `strict: true` from day one. No `any` — reach for `unknown` plus narrowing.
- Write types *before* asking Claude for implementations (see §9). Hand the
  interface over as the contract.
- Prefer discriminated unions over optional-field bags. Make illegal states
  unrepresentable.
- Read type errors before asking for help. Form a hypothesis first.
- Ask Claude to *explain* rather than *fix*, at least half the time.
- Ask for 2–3 approaches with tradeoffs before implementation. Pick, and write
  down why. Inability to articulate the why = signal to dig in, not to accept
  the code.
- Review every diff as if it were a PR from a stranger.

---

## 13. Open questions

- [ ] Ambient drift during `REVEALING` — yes or no? Deferred by design; ADR-009
      makes this cheap to decide after playtesting.
- [ ] Exact coverage threshold. Playtesting, not reasoning.
- [ ] Gooey filter (`blur` + `contrast`) — keep or drop? Depends on measured
      mobile perf.
- [ ] Which ~15–20 photos are `featured` for the static grid.
