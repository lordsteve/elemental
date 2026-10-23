import Helpers from "@services/helpers";
import { inline } from "../codeBlock";

const html = Helpers.html;

const faqTemplate = () => html`
    <el-docs>
        <div class="content-slate">
            <section>
                <h1>FAQs</h1>

                <h4>Do I need a database?</h4>
                <p>
                    Nope. Leave ${inline('DB_HOST')} out of your ${inline('.env')} file and the server runs without one. These docs run without one.
                </p>

                <h4>Why does my POST (or PUT, or DELETE) get a 403 Forbidden?</h4>
                <p>
                    It didn't have a CSRF token. The <a href="/docs/request-service">Request service</a> adds one to every request that goes through ${inline('fetch')}, but only after ${inline('initLoader()')} has run, so make sure it's still the first thing in ${inline('main.ts')}. If you're sending requests from somewhere else, like a script or another server, it needs to send the ${inline('csrf-token')} cookie and the same value in an ${inline('X-CSRF-TOKEN')} header.
                </p>

                <h4>Why is my element null (or undefined)?</h4>
                <p>
                    Either it isn't on the page yet, or the getter is looking for something different from what's there. Controllers run after their template is added to the page, so check that the template went in first in your route. Then check the getter's selector against the tag, and the id you passed to ${inline('id()')} against the one in the template. And if the console warned you about a duplicate id, ${inline('id()')} can only ever find the first one.
                </p>

                <h4>Why do I pass ${inline('{ signal: el.signal }')} to every event listener?</h4>
                <p>
                    So you never have to remove them yourself. Elemental removes every listener with that signal when the page goes away. There's more on the <a href="/docs/views">Views</a> page.
                </p>

                <h4>Can I put user input in a template?</h4>
                <p>
                    Not directly. ${inline('html')} doesn't escape what you put in it, so anything somebody typed could add its own HTML, or scripts, to your page. Build the element first, then set the text with ${inline('textContent')}. The <a href="/docs/elements">Elements</a> page has an example.
                </p>

                <h4>Can I use something other than MySQL?</h4>
                <p>
                    Yep. Change the ${inline('type')} in ${inline('server/services/database/data-source.ts')} to anything TypeORM supports. PostgreSQL's ${inline('pg')} package is already installed; for anything else, install its driver.
                </p>

                <h4>Why does the page reload on its own while I work?</h4>
                <p>
                    That's browser-sync, on ${inline('RELOAD_PORT')}. If it's getting in your way, use the address on ${inline('PORT')} instead, which doesn't reload. Or take ${inline('ENV=development')} out of your ${inline('.env')} file to turn it off completely.
                </p>

                <h4>I made my app with an older Elemental. What changed?</h4>
                <p>
                    Have a look at the <a href="/docs/changelog">Changelog</a>. The "Works differently" lists cover anything you might need to change in your own code.
                </p>
            </section>
        </div>
    </el-docs>
`;

export default faqTemplate;
