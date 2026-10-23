import Helpers from "@services/helpers";
import { inline } from "../codeBlock";

const html = Helpers.html;

const changelogTemplate = () => html`
    <el-docs>
        <div class="content-slate">
            <section>
                <h1>Changelog</h1>
                <p>
                    What's changed in Elemental, newest first. Elemental doesn't have version numbers, so everything goes by date. If you made your app from an older copy, the "Works differently" lists are the ones to read.
                </p>

                <h2>October 23, 2026</h2>
                <p>
                    A big catch-up. Elemental had kept growing inside the sites built with it, and this brings all of that back into Elemental itself, along with a rewrite of these docs to match.
                </p>
                <h4>Works differently</h4>
                <ul>
                    <li>${inline('html')} and ${inline('escapeHtml')} moved from the Elements service to the Helpers service: ${inline('Helpers.html')}. ${inline('htmlstring')} is gone, because a template literal without a tag already is a string.</li>
                    <li>${inline('el')} is imported from ${inline("'@elements'")}, and it's split into ${inline('BaseEl')} (Elemental's) and ${inline('el')} (yours). Your own getters go in ${inline('src/services/elements.ts')}, and they don't need setters anymore.</li>
                    <li>Getters for single elements return ${inline('null')} instead of throwing when the element isn't there, ${inline('id()')} returns ${inline('undefined')} instead of throwing, and lists come back empty instead of ${inline('null')}.</li>
                    <li>The CSRF token comes from a cookie and lasts a day, instead of being fetched before every request.</li>
                    <li>Failed requests now reject with the server's error.</li>
                    <li>${inline('synchronize')} is off, so database changes go through migrations, and the MySQL driver is ${inline('mysql2')}.</li>
                    <li>${inline('env-cmd')} is gone. With ${inline('ENV=development')}, the server starts browser-sync and nodemon itself.</li>
                    <li>The database is optional. Without ${inline('DB_HOST')}, the server starts anyway instead of failing.</li>
                </ul>
                <h4>Added</h4>
                <ul>
                    <li>${inline('getData()')}, ${inline('postData()')}, ${inline('putData()')}, and ${inline('delData()')} in the Request service, which put ${inline('/data')} in front of the path for you. Requests can send ${inline('FormData')} for file uploads.</li>
                    <li>${inline('el.signal')}, which removes your event listeners when the page goes away.</li>
                    <li>The ${inline('light-box')} and ${inline('title')} attributes, a warning for duplicate ids, and the form helpers: submit buttons that wait for required fields, a spinner on submit, and saving what someone typed if they leave.</li>
                    <li>A lightbox, a cookie banner, and modals loaded from the server.</li>
                    <li>${inline('headerName')} in server responses, for headers other than ${inline('Content-Type')}, like a redirect's ${inline('Location')}.</li>
                    <li>A shared server cache in ${inline('server/cache.ts')}.</li>
                    <li>An ${inline('EmailService')} for sending email, and a contact page whose form emails you, with spam protection built in.</li>
                    <li>${inline('checkAndMakeChanges()')} in ${inline('BaseController')}, and ${inline('readBody()')} can hand back the raw body.</li>
                    <li>CSS variables for the colors, corner sizes, and stacking order used across the site.</li>
                </ul>
                <h4>Fixed</h4>
                <ul>
                    <li>${inline('?flag=false')} in a URL came through as ${inline('true')}.</li>
                    <li>The copy step in Getting Started skipped dotfiles like ${inline('.env-example')} and ${inline('.gitignore')}, and the two development ports were the wrong way round.</li>
                </ul>
                <h4>Docs</h4>
                <ul>
                    <li>Every page rewritten to match the code as it is now, and the FAQ finally has questions in it.</li>
                    <li>Code samples are escaped properly, and text and code fill the page instead of being squeezed into the middle.</li>
                    <li>This changelog.</li>
                </ul>

                <h2>February 2025</h2>
                <ul>
                    <li>Routing moved into ${inline('RoutesBase')}: the home route, ${inline('view()')}, and the ${inline('query')} property, so ${inline('Routes')} only has to hold your pages.</li>
                    <li>Old leftovers from before TypeORM (${inline('Model')} and ${inline('SessionStorage')}) were removed.</li>
                    <li>The Server and components docs, the Routes page rewritten to match, and a page for FAQs (empty, for now).</li>
                    <li>Syntax highlighting for code in the docs, a View on GitHub button, and fixes for the mobile layout.</li>
                </ul>

                <h2>December 2024</h2>
                <ul>
                    <li>TypeORM, NodeCache, and the ${inline('migration:generate')}, ${inline('migration:run')}, and ${inline('migration:revert')} scripts.</li>
                    <li>The docs got started: Getting Started, Elements, Views, Routes, and the Request Service.</li>
                    <li>Reading the query string works in older versions of Safari on iOS.</li>
                    <li>A missing file, like the favicon, gets a 404 instead of taking the server down.</li>
                </ul>

                <h2>September and October 2024</h2>
                <ul>
                    <li>The beginning: a Node server with CSRF protection and a TypeScript front end bundled by esbuild.</li>
                    <li>Path aliases like ${inline('@services')} and ${inline('@views')}, and module-alias so they work on the server too.</li>
                    <li>browser-sync for reloading the page while you work.</li>
                    <li>Pages as tagged template literals with their own ${inline('el-')} tags, the Elements service, and the sidebar.</li>
                </ul>
            </section>
        </div>
    </el-docs>
`;

export default changelogTemplate;
