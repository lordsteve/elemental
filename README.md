## Elemental

Get the documentation [right here](https://elemental.thegreenasterisk.com).

This is a boilerplate framework for working with Node and TypeScript. The intention here is to use this to build apps without having to learn any extra syntax like jQuery or React or Laravel or Entity Framework. If you know TypeScript, you can use this boilerplate.

On the front end, the idea is to use TypeScript to directly manipulate the DOM, and to create an easy way to understand how to do that. That's where the name comes from: manipulating DOM Elements. There should be no syntax here that is unique to Elemental. Rather, Elemental should provide an easy way of understanding how the existing TypeScript syntax could be utilized and organized to create an app.

This will never be a finished project, so feel free to hop in and help develop this!

### Getting started

You'll need git and Node.js (22 or newer).

```
git clone https://github.com/lordsteve/elemental.git {new-project-name}
cd {new-project-name}
rm -rf .git && git init
cp .env-example .env
npm install
npm run dev
```

With `ENV=development` in `.env`, the server starts browser-sync and opens a tab on `RELOAD_PORT` (8080 by default) that reloads whenever you change something. The plain server is on `PORT` (3000 by default).

`npm run build` compiles everything, `npm start` runs it, and `npm run prod` does both.

### What comes with it

- **Views**: templates written as `html` tagged template literals, with a controller and a stylesheet next to each one
- **Routes**: a front-end `Routes` class that maps the URL to a view, and a server `Routes` class for your `/data/` API
- **The Elements service** (`el`): getters for the elements on the page, a loading spinner, and listeners that clean up after themselves
- **The Request service**: `fetch` with CSRF tokens, the session key, and the loader already handled
- **A Node server** with CSRF protection and no framework underneath
- **A database, if you want one**: [TypeORM](https://typeorm.io/) with migrations, set up for MySQL. Without `DB_HOST`, the server runs without one.
- **Logging in with Discord**, with sessions that survive restarts. It turns on once there's a database and a Discord application.
- **Light and dark mode**, following the device's setting, with a toggle in the nav

### Where things are

```
server/
  main.ts                  the server: CSRF, static files, /data/ routing, startup
  routes.ts                your /data/ routes
  controllers/             what the routes call
  services/database/       TypeORM: data-source.ts, entity/, migration/
src/
  main.ts                  the front end's starting point
  routes.ts                your pages
  services/elements.ts     your element getters (BaseEl in baseElements.ts has the rest)
  views/                   one folder per view: .template.ts, .ctrl.ts, .css
  main.css                 global styles and the color variables
```

### Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | build, watch, and run with live reload |
| `npm run build` | compile the server and bundle the front end |
| `npm start` | run the compiled server |
| `npm run typecheck` | type check the front end |
| `npm run migration:generate server/services/database/migration/{name}` | write a migration from your entity changes |
| `npm run migration:run` | apply migrations |
| `npm run migration:revert` | undo the last migration |

Everything else is in the [docs](https://elemental.thegreenasterisk.com/docs), which are also the views in `src/views/docs`, so you can see how a site is put together by reading them. Delete them when you start your own.
