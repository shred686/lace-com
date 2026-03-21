# Design System Document

## 1. Overview & Creative North Star: The Quantum Terminal
This design system is engineered to feel like a high-performance instrument—a window into the LACE protocol’s multi-dimensional data flow. We move beyond the flat, utilitarian web and into a space of **"The Quantum Terminal."** 

The aesthetic is characterized by high-gloss surfaces, ultra-technical precision, and a sense of "activated" energy. We achieve this through a signature mix of high-energy emerald accents against obsidian depths. The interface should feel like a singular, living organism rather than a collection of independent widgets. We break the rigid grid through intentional overlapping of glass layers, asymmetric information density, and the juxtaposition of sharp editorial headlines with high-fidelity monospace data.

## 2. Colors & Surface Philosophy
The palette centers on the contrast between the void (`#050505`) and the surge (`#00FFC2`).

### Surface Hierarchy & Nesting
Traditional borders are a relic of low-fidelity design. In this system, we utilize **Tonal Layering** to define space:
*   **The Foundation:** Use `surface` (#0e0e0e) for the primary background.
*   **The Depth Scale:** Nest containers using the `surface-container` tiers. A `surface-container-low` section should sit directly on the `surface` to create a subtle recessed area. Conversely, use `surface-bright` for primary interactive panels to pull them forward into the user's focus.
*   **The "No-Line" Rule:** Explicitly prohibit 1px solid, opaque borders for sectioning. Definition must come from background shifts or the **Ghost Border** (see Elevation).

### Signature Textures
*   **Glassmorphism:** All floating panels (modals, dropdowns, hovered cards) must utilize `backdrop-blur-2xl` combined with a semi-transparent `surface_container` fill.
*   **The Emerald Surge:** Use linear gradients for primary CTAs and active states, transitioning from `primary` (#aaffdc) to `primary_container` (#00fdc1) at a 135-degree angle. This provides a "liquid light" effect that flat color cannot replicate.

## 3. Typography: The Editorial Tech-Stack
The type system balances the authority of a high-end publication with the precision of a terminal.

*   **Display & Headlines (Manrope):** These are the "Editorial" voice. Use `display-lg` and `headline-md` with tight letter-spacing (-0.02em) to create a sharp, high-contrast impact.
*   **Body & Titles (Inter):** The "Narrative" voice. Optimized for legibility. Use `body-md` for standard prose and `title-sm` for section headers.
*   **Labels & Data (Monospace/Manrope):** The "Technical" voice. All technical labels, timestamps, and protocol data must use a monospace font or `label-sm` in Manrope. This emphasizes the "State-of-the-art" nature of the data flow.

## 4. Elevation & Depth: Light as Structure
We do not use shadows to represent distance from a wall; we use them to represent the emission of light within a dark space.

*   **Ambient Shadows:** Floating elements use a highly diffused blur (40px+) with `primary` color at 4-8% opacity. This creates a "glow" rather than a shadow, making the element feel like an energized node.
*   **Specular Highlights (Ghost Borders):** When a boundary is required for legibility, use a 1px border with `white` at 10-20% opacity. This simulates the way light catches the edge of a precision-cut glass pane.
*   **Inner Glows:** For interactive states (e.g., an active input or a clicked button), apply a subtle inner shadow using `primary_dim` to suggest the element is being "powered on."

## 5. Components

### Buttons
*   **Primary:** High-gloss gradient (`primary` to `primary_container`). Text in `on_primary_fixed`. No border.
*   **Secondary:** Ghost Border (white/20%) with a `backdrop-blur-md`. On hover, the background fills with `surface_bright` at 10% opacity.
*   **Tertiary:** Monospaced text in `tertiary` (#1ccfe8). No background. Underline on hover only.

### Technical Cards
*   **Construction:** Use `surface_container_low`. 
*   **Detailing:** Forbid divider lines. Separate "Header," "Body," and "Footer" of a card using `1.5` (0.5rem) vertical spacing and subtle shifts in monospace font weight.
*   **Interaction:** On hover, the Specular Highlight (Ghost Border) should increase in opacity from 10% to 30%, and the backdrop blur should intensify.

### Data Inputs
*   **Field:** Deep obsidian background (`surface_container_lowest`). 
*   **Indicator:** A 2px vertical "power bar" of `primary` color on the left edge to indicate focus.
*   **Feedback:** Error states use `error_dim` glows rather than flat red boxes.

### Quantum Nodes (Specialty Component)
For the LACE protocol visualization, use circular or hexagonal nodes with `primary` outer glows and `label-sm` monospace labels positioned asymmetrically (e.g., top-right of the node) to break the "centered" look of standard icons.

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts where content is weighted heavily to one side to suggest a "flow" of data.
*   **Do** mix font families within a single component (e.g., an Inter title with a Manrope monospaced label).
*   **Do** utilize the full depth of the `surface-container` scale to create nested "intelligence."

### Don't
*   **Don't** use 100% opaque grey or black borders. They "kill" the light in a glassmorphic system.
*   **Don't** use standard "Drop Shadows." If the element doesn't glow, it shouldn't have a shadow.
*   **Don't** use rounded corners larger than `xl` (0.75rem) for main containers; keep the edges sharp and technical. Full rounding is reserved only for chips and pill-style tags.
*   **Don't** use dividers. If you feel the need for a line, use white space (Spacing `4` or `6`) or a background tonal shift instead.