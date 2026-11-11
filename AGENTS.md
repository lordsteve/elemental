# Elemental: instructions for AI agents

Elemental is a boilerplate for building sites with nothing but TypeScript, HTML, and CSS: a Node server with no framework underneath, and a front end that manipulates the DOM directly. These instructions are distilled from the docs in `src/views/docs` (published at elemental.thegreenasterisk.com). When they and the code disagree, the code wins. Fix the docs, then this file.

## Ground rules

- **No front-end frameworks or DOM libraries.** No React, jQuery, Lit, htmx, or anything else that adds syntax. Elemental's whole point is that plain TypeScript and the DOM are enough. Solve things with the patterns below.
- **No Elemental-specific syntax either.** Helpers should read like ordinary TypeScript.
- **Never edit generated output.** `www/` and `server/comp/` are build output (both gitignored). Edit `src/` and `server/` instead.
- **Keep the framework generic.** `BaseEl`, `RoutesBase`, the Request service, `server/main.ts`, and `BaseController` are what every app built on Elemental inherits. App-specific code goes in `src/services/elements.ts`, `src/routes.ts`, `server/routes.ts`, and views/controllers.
- **The docs are part of the product.** A change to how the framework behaves isn't done until the docs say so (see [Docs](#docs)).

## Commands

| Command | Use |
| --- | --- |
| `npm install` | install (Node 22+) |
| `cp .env-example .env` | settings for development |
| `npm run dev` | build, watch, and serve; with `ENV=development`, live reload on `RELOAD_PORT` (8080), plain server on `PORT` (3000) |
| `npm run build` | compile the server to `server/comp` and bundle the front end to `www` |
| `npm start` / `npm run prod` | run the build / build and run |
| `npm run typecheck` | type check the front end (esbuild doesn't) |
| `npx tsc -p server/tsconfig.json --noEmit` | type check the server |
| `npm run migration:generate server/services/database/migration/{name}` | write a migration from entity changes (the path is required) |
| `npm run migration:run` / `npm run migration:revert` | apply / undo migrations |

There is no test suite. Before calling a change done, run both type checks and `npm run build`, and look at the affected pages with `npm run dev`.

## Front end (`src/`)

### Views

A view is a folder in `src/views/` named after the view, holding `{name}.template.ts`, `{name}.ctrl.ts`, and optionally `{name}.css`. Adding one takes four steps, and skipping any of them breaks it:

1. **Template.** A function returning `Helpers.html`. The outermost tag is `el-` plus the view name in kebab case (`helloWorld` → `<el-hello-world>`). For a normal page, put `<div class="content-slate"><section>…</section></div>` inside it.
   ```ts
   import Helpers from '@services/helpers';
   const html = Helpers.html;
   const helloWorldTemplate = () => html`
       <el-hello-world>
           <div class="content-slate"><section><h1>Hello World!</h1></section></div>
       </el-hello-world>
   `;
   export default helloWorldTemplate;
   ```
2. **Getter.** Add one to `el` in `src/services/elements.ts`:
   `public static get helloWorld() { return this.getElement<HTMLElement>('el-hello-world'); }`
3. **Index.** In `src/views/index.ts`, import the controller and template, re-export both, and add both to the default `views` object.
4. **Styles.** `@import url('./helloWorld/helloWorld.css');` in `src/views/index.css`. Scope rules under the view's tag (`el-hello-world .thing { … }`).

Then route to it (see [Routes](#routes)).

**Templates**
- `Helpers.html` returns the template's **first** element only, so a template must have exactly one root element.
- `html` does **not** escape interpolated values. Never put user input, URL query values, or anything from the server that a user wrote into a template. Build the element, then set `textContent`. `Helpers.escapeHtml` gives an escaped string when you need one.
- Data goes in as template-function parameters. Keep logic in controllers; a template that needs to transform data uses a block body with a `return`.
- **Sub-views** live in a folder inside the parent view and attach to the parent template function (`homeTemplate.helloWorld = helloWorldTemplate;`). They don't go in the views index separately.
- **Components** used inside other templates take a `string` flag: build the markup once as an untagged template literal, and return it as-is for embedding or through `Helpers.html` when standing alone.
  ```ts
  const helloButtonComponent = (string = false) => {
      const button = `<button id="hello-button">Say Hello!</button>`;
      return string ? button : Helpers.html`${button}`;
  };
  ```

**Controllers**
- A controller is the default-exported function the route calls **after** appending the template, so everything in the template exists by then.
- Get elements through `el`, never by caching `document.querySelector` results in module scope.
- `el.<list>.id('x')` returns `undefined` when the element isn't there, so check it before use.
- Pass `{ signal: el.signal }` to **every** `addEventListener`. Elemental removes those listeners when the page goes away.
  ```ts
  import el from '@elements';
  export default function helloWorld() {
      el.title.textContent = 'Hello World!';
      el.buttons.id('hello-button')?.addEventListener('click', () => { /* … */ }, { signal: el.signal });
  }
  ```

### The Elements service (`el`, imported from `@elements`)

- **Two layers.** `src/services/baseElements.ts` holds `BaseEl`, the framework's part; leave it alone unless the change belongs to every Elemental app. `src/services/elements.ts` holds `el extends BaseEl`, the app's getters; add yours there with `this.getElement<T>(selector)` (one element or `null`) or `this.getElements<T>(selector)` (a `NodeListOf<T>` with `id()`).
- **Return types.** `el.root`, `el.body`, and `el.title` always exist. Single getters (`el.nav`, `el.modal`, `el.submitButton`, `el.cookieBanner`) return the element or `null`. List getters (`el.buttons`, `el.divs`, `el.forms`, `el.formInputs`, `el.imgs`, `el.inputs`, `el.paragraphs`, `el.sections`, `el.selectors`, `el.textareas`) return a list, empty when there are none.
- **Loader.** `el.loader` shows a spinner when referenced; `el.loader.remove()` hides it. It counts, and the Request service drives it, so you rarely touch it directly.
- **Attributes wired up after page load:** `bg="/storage/…"` (background image), `light-box` (opens in a lightbox, with `light-box-type` for non-media elements), and `title` (shown on tap on touch screens). Duplicate ids log a console warning, because `id()` only finds the first.
- **Form helpers** (from `new el()` at the end of `main.ts`):
  - a submit button stays disabled until every `required` input is filled
  - submitting shows a spinner and blocks double submits
  - typed values are saved if the visitor leaves and restored when they return; inputs whose name starts with `_`, and file inputs, are skipped, so use a `_` name for anything sensitive
  - multi-selects toggle on click
- **String helpers.** `stripScripts()` and `doubleBreakDivs()` are added to every string.

### Routes

- `src/main.ts` runs `initLoader()` **first**, so every `fetch` gets CSRF handling. Then it splits `location.pathname` on `/`, shifts off the empty first segment, renders the nav and cookie banner, calls `new Routes(path).view()`, and finally `new el()`. Keep that order.
- `src/routes.ts`: `Routes extends RoutesBase`. Each page is a method named by its first path segment, which appends the template and calls the controller:
  ```ts
  ['about']() {
      el.body.appendChild(views.aboutTemplate());
      views.about();
  }
  ```
  The home page `['']()` lives in `RoutesBase`. An unmatched segment first tries `getHtml(location.pathname)` from the server, then falls back to a 404 page.
- **Sub-routes.** In the parent's route method, check `this.path[1]`. If it's there, `this.path.shift()` and call `new views.XRoutes(this.path).view()`. `XRoutes extends Routes`, lives in the parent view's folder as `{name}.routes.ts`, and is exported through the views index.
- **Query values.** `this.query` holds the query string with numbers, `true`, and `false` converted. Pass it into templates and controllers. It's typed by users, so treat it as untrusted and use `textContent`.

### Styles

- Global styles and the design tokens are in `src/main.css`. Use its variables (`var(--surface)`, `var(--radius)`, the color, shadow, and z-index variables) instead of literal colors, so views match and dark mode works.
- Dark mode follows the device and has a nav toggle. Anything new must look right in both modes.

### Requests (`@services/request`)

- Call `initLoader()` once (already done in `main.ts`). It wraps `window.fetch` so every request shows the loader, sends `X-Requested-With: Elemental`, and, for anything but GET, sends the CSRF token from the `csrf-token` cookie (fetching `/csrf-token` if needed). Failed responses reject with the server's error body. Don't bypass it with another HTTP client.
- **Helpers.**
  - `get` / `post` / `put` / `del` take a full path.
  - `getData` / `postData` / `putData` / `delData` prefix `/data`, which is where server routes live.
  - All of them parse JSON except `del` and `delData`, which return the `Response`.
  - GET data becomes the query string; other methods send JSON, or `FormData` as-is for uploads.
- **HTML.** `getHtml<T>('/views/…')` fetches HTML (for modals and the like) as an element or a node list.
- **Errors.** Handle rejections and show the server's message: `postData('/save', x).then(…).catch(err => …)`.

## Server (`server/`)

- **Request flow.** `server/main.ts` is a plain Node `http` server:
  - It hands out the CSRF cookie and rejects non-GET requests without a matching `X-CSRF-TOKEN` header (403).
  - It serves `/favicon.ico` and `/csrf-token`.
  - `/views/*` from `www/views` requires `X-Requested-With: Elemental`.
  - `/storage/*` serves from `www/storage` (copied from `src/storage` on build).
  - `/data/*` goes to `server/routes.ts`.
  - Everything else gets `index.html`, `main.css`, or `main.js`, so client-side routing works on any URL.
  - Don't weaken the CSRF or `X-Requested-With` checks.
- **Server routes** (`server/routes.ts`). The method name is the path after `/data`, with the query string removed. `@Method` returns 405 for the wrong HTTP method, and a missing route gets 404. Delegate to a controller:
  ```ts
  @Method('POST')
  private ['/save-link'](req: http.IncomingMessage, res: http.ServerResponse): ResponsePromise {
      return LinkController.saveLink(req, res);
  }
  ```
  Every route resolves to `{ response, status, header?, headerName? }`. `response` is usually `JSON.stringify(...)`; `header` is the Content-Type (default JSON); `headerName` sends `header` under another name (a redirect is `status: 301, headerName: 'Location', header: url`).
- **Controllers** (`server/controllers/`) extend `BaseController` and use its static helpers:
  - `readBody<T>(req)` (pass `false` for the raw Buffer)
  - `parseUrlQuery(req.url)`
  - `checkAndMakeChanges(obj, newObj)` (copies changes and tells you whether to save)

  **Validate every body.** Anyone can call `/data/*`, not just your pages.
- **Server-side HTML.** `.html` files under `server/` are copied next to the compiled code (`server-html` script). Read one in a controller and return it with `header: 'text/html'`. `buildModalFromUrl()` in `src/views/modal/modal.ctrl.ts` shows it as a modal.
- **Email** (`server/services/email.ts`).
  - `EmailService.sendEmail(to, subject, text, html?, replyTo?)` resolves to whether it sent.
  - It's optional: `EmailService.isConfigured` is false until `EMAIL_USER` and `EMAIL_PASS` are set.
  - Escape anything a user typed before putting it in the HTML body.
  - The contact form (`/contact` → `/data/send-contact` → `ContactController`) emails `CONTACT_EMAIL`, with validation, rate limiting, and a honeypot field. Keep those defenses if you change it.
- **Cache.** `server/cache.ts` is one shared NodeCache (`cache.set(key, value, seconds)`, `cache.get(key)`). It's memory only and empty after a restart, so anything that must persist goes in the database.

### Database (optional)

- TypeORM, configured from `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, and `DB_NAME` in `server/services/database/data-source.ts`. MySQL through `mysql2` by default; `pg` is installed for PostgreSQL.
- Without `DB_HOST` the server runs without a database. If `DB_HOST` is set and the connection fails, it exits. Since the database is optional, a route that needs it should answer with an error when `AppDataSource.isInitialized` is false, rather than throw.
- Entities go in `server/services/database/entity/`, where they're picked up automatically. Use them as `AppDataSource.getRepository(Entity)`.
- `synchronize` is off. **Every schema change needs a migration**, generated with `npm run migration:generate server/services/database/migration/{name}` and applied with `migration:run`. Never hand-edit tables. Production needs `migration:run` before (or as part of) deploying code that depends on the change.

### Environment variables

Settings come from `.env` in development (never commit it). Add any new variable to `.env-example` with a comment saying what it's for and whether it's optional, and mention it in the docs.

## Docs

The docs site is `src/views/docs`, and it is itself an Elemental view, so it also shows how a site fits together. When framework behavior, an API, a default, or setup changes:

1. **Update the docs page** that covers it (`gettingStarted`, `elements`, `views`, `routes`, `requestService`, `theServer`, `faq`) in the same change. Code samples in the docs must match the real code.
2. **Add a changelog entry** at the top of `changelog/changelog.template.ts`. It's dated, not versioned (`<h2>Month D, YYYY</h2>`), with `<h4>` lists for **Works differently** (anything an existing app must change), **Added**, **Fixed**, and **Docs**, using only the ones that apply.
3. **Update `README.md`** if setup, scripts, or "What comes with it" changed.
4. **For a new docs page:**
   - write a template in its own folder
   - add a method to `DocsRoutes` in `docs.routes.ts`
   - attach the template to `docsTemplate`
   - add a link to the docs nav in `docs.template.ts`

Write docs in the existing voice: plain, second person, friendly, short sentences, explaining *why* as well as *how*. Use `codeBlock()` and `inline()` from `docs/codeBlock.ts` for code.

## Relationship to apps built on Elemental

Elemental is pulled out of real sites (thegreenasterisk-2 most of all), and framework improvements made there get brought back here in sync passes. When a fix belongs to the framework, make it here in the generic layer (`BaseEl`, `RoutesBase`, request, server main, `BaseController`), not just in the app.

## Git

- One branch per change, merged into `master` with `git merge --no-ff` ("Merge branch '{branch}'").
- Commit subjects are plain sentences describing the change ("Adds a changelog to the docs").
- Don't push or merge unless asked.
