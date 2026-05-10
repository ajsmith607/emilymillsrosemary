# Website Design Plan

## Key Principles
1. **Restraint**: Let typography and spacing do the work
2. **Vertical rhythm**: All spacing in multiples of 1.7rem
3. **Minimal decoration**: No borders except where functionally necessary
4. **Color purpose**: Use color sparingly and intentionally
5. **Readability first**: Generous line-height and optimal measure

## Implementation Notes
- Start with the CSS reset
- Set up CSS custom properties for colors, see color pallette below
- Apply vertical rhythm consistently
- set a max-width for the main container that optimizes line length
- define a variable, defaulting to 1, that can be set to scale all sizing elements consistently, including margins, container widths, font sizes, line spacing and heights (maintaining vertical rhythm), etc.
- set clean, minimal default styling to lists, tables, code/pre, forms, buttons, etc.
- Ensure all interactive elements have clear hover/focus states
- Test responsive behavior, especially images
- Verify sufficient color contrast for accessibility (all combinations should pass WCAG AA)

## General
- I want to be able to format my page content as github formatted markdown and have it properly rendered on the page.
- The home page should have its own layout, every other page should have the same base layout
- Each page should render its `description` metadata as an `<h2>` element.  
- The footer should list all pages in the site, including home page as first element. The current page should not be linked. This list functionality should be coded as a shortcode and should optionally include a title.

## Fonts 
- Import Cormorant Garamond light 300 Italic for H1 only
- **Font hosting**: Vendored TTF locally rather than Google Fonts CDN, preserving the project's offline capability. The TTF is sourced from the open-source CatharsisFonts/Cormorant GitHub repository (SIL OFL license) and stored at `src/fonts/CormorantGaramond-LightItalic.ttf`.
- The default font should be a Helvetica/Arial based fallback stack.
- `<h2>` should specifically use Helvetica/Arial light 300
- `<h1>`: all lowercase (`text-transform: lowercase`)
- `<h2>`: all uppercase (`text-transform: uppercase`), significantly smaller than body text, tight tracking — functions as a small descriptor label closely associated with the `<h1>` above it, not a section heading
- links are only underlined on hover/focus

## Colors

Draw from the following proposed  color palette:

| Role | Color | Approx Hex |
|---|---|---|
| Leaf (primary green) | Silvery blue-green | `#6B8E7F` |
| Flower (primary blue) | Muted periwinkle | `#7B8EC8` |
| Leaf complement | Dusty rose (accent) | `#8E6B7A` |
| Flower complement | Warm gold (accent) | `#C8B87B` |
| Background option light | Near-white warm grey | `#F2EFE8` |
| Background option dark | Deep blue-grey | `#2A2E3A` |

Apply the colors:
- background is the light background option
- foreground is the dark background option
- `<h1>` is the leaf color
- `<h2>` is the flower color

## Implementation

### Stack
- **Eleventy v3** static site generator
- **Nunjucks** templates (`.njk`) for layouts and includes
- **Markdown** (`.md`) for page content — pre-processed by Nunjucks first (`markdownTemplateEngine: "njk"`), then rendered to HTML via `markdown-it` with `html`, `linkify`, and `typographer` options. The Nunjucks pass is what makes shortcodes available inside `.md` files.

### File Structure
```
src/
├── _includes/
│   ├── base.njk       — layout: DOCTYPE, head, body shell; renders description as <h2>
│   ├── header.njk     — <header> with nav links
│   └── footer.njk     — <footer> calling the pageList shortcode
├── css/
│   └── style.css      — full design system; no classes used
├── fonts/
│   └── CormorantGaramond-LightItalic.ttf
├── index.md
├── site.md
├── process.md
└── data.md
```

### CSS Scaling
The `--scale` custom property (default `1`) is set on `:root`. The root `font-size` is `calc(16px * var(--scale))`, so all `rem`-based values — spacing, container widths, font sizes, line-heights — scale uniformly when `--scale` is changed. The rhythm unit `--rhythm: 1.7rem` is used for all spacing.

### pageList Shortcode
Registered in `.eleventy.js` as a Nunjucks shortcode. Accepts the pages collection and an optional title string. Uses `this.page.url` to detect the current page and render it as plain text instead of a link.

```njk
{% pageList collections.pages %}
{% pageList collections.pages, "Pages" %}
```

The `pages` collection is sorted by the `weight` frontmatter field. Pages without a `weight` are excluded. Current weights: Home 100, Site 200, Process 300, Data 400.

### Filters
Registered in `.eleventy.js`:

| Filter | Usage | Description |
|---|---|---|
| `md` | `{{ string \| md \| safe }}` | Renders a markdown string to HTML via `markdown-it` |
| `year` | `{{ date \| year }}` | Extracts the four-digit year from a date |

The `md` filter enables markdown formatting inside `.njk` includes using `{% set %}` blocks:

```njk
{% set copy %}
This is **markdown** with [links](#).
{% endset %}
{{ copy | md | safe }}
```

### npm Scripts
| Command | Action |
|---|---|
| `npm run build` | One-shot build to `docs/` (local paths) |
| `npm run deploy` | One-shot build to `docs/` with GitHub Pages path prefix |
| `npm start` | Dev server with live reload |


