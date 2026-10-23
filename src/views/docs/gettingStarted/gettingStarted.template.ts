import Helpers from "@services/helpers";
import codeBlock, { inline } from "../codeBlock";

const html = Helpers.html;

const gettingStartedTemplate = () => html`
    <el-docs>
        <div class="content-slate">
            <section>
                <h1>Getting Started</h1>
                <h4>TL;DR</h4>
                ${codeBlock(`
git clone https://github.com/lordsteve/elemental.git {new-project-name}
cd {new-project-name}
rm -rf .git && git init
cp .env-example .env
npm install
npm run dev
                `, 'plaintext')}

                <h4>Prerequisites</h4>
                <p>
                    You're going to need git and Node.js installed on your machine to start. You can download git from <a href="https://git-scm.com/downloads" target="_blank">git-scm.com</a> and Node.js from <a href="https://nodejs.org/en/download/" target="_blank">nodejs.org</a>. Go with a current LTS version of Node (22 or newer).
                </p>
                <p>
                    That's all you need to get a site running. If your app needs to store anything, you can add a MySQL database whenever you're ready, but Elemental runs just fine without one.
                </p>

                <h4>Installation</h4>
                <p>
                    Clone the Elemental repository straight into a folder named after your new project, then throw away its git history so you can start your own:
                </p>
                ${codeBlock(`
git clone https://github.com/lordsteve/elemental.git {new-project-name}
cd {new-project-name}
rm -rf .git && git init
                `, 'plaintext')}
                <p>
                    Next, install the dependencies:
                </p>
                ${codeBlock(`npm install`, 'plaintext')}
                <p>
                    This will install a few different packages that you need to create and run an Elemental project. They include, but are not limited to, TypeScript, esbuild, TypeORM, browser-sync, and nodemon.
                </p>

                <h4>Environment Variables</h4>
                <p>
                    Elemental reads its settings from environment variables, and in development those come from a ${inline('.env')} file. There's an example ready to copy:
                </p>
                ${codeBlock(`cp .env-example .env`, 'plaintext')}
                <p>
                    The first four are the ones that matter right away:
                </p>
                ${codeBlock(`
ENV=development
PORT=3000
HOST=localhost
RELOAD_PORT=8080
                `, 'plaintext')}
                <p>
                    ${inline('ENV=development')} turns on live reloading. Leave it out in production. The ${inline('DB_')} variables are for the database, and you can leave them alone until you need one. Without ${inline('DB_HOST')}, the server simply runs without a database. There's more on that in <a href="/docs/the-server">The Server</a>.
                </p>
                <p>
                    Never commit your ${inline('.env')} file. It's already in ${inline('.gitignore')}, so you'd have to work at it.
                </p>

                <h4>Running the Project</h4>
                <p>
                    Once the dependencies are installed, you can run the project in development mode.
                </p>
                ${codeBlock(`npm run dev`, 'plaintext')}
                <p>
                    This compiles the server, starts watching your files, and starts the server. Because ${inline('ENV')} is set to ${inline('development')}, the server also starts browser-sync, which opens a browser tab for you. Use the address on ${inline('RELOAD_PORT')} (${inline('http://localhost:8080')} with the example settings). That one reloads the page whenever you change a file, and nodemon restarts the server whenever you change server code. If you'd rather the page didn't refresh on its own, the plain server is on ${inline('PORT')} (${inline('http://localhost:3000')}).
                </p>
                <p>
                    For production, ${inline('npm run build')} compiles everything into ${inline('server/comp')} and ${inline('www')}, and ${inline('npm start')} runs it. ${inline('npm run prod')} does both. Hosts like Heroku run the build script on their own when you deploy, and then run ${inline('npm start')}.
                </p>

                <h4>Clearing Out the Docs</h4>
                <p>
                    These docs are part of the project you just cloned, so you'll probably want to remove them before you build your own thing. Delete the ${inline('src/views/docs')} folder, then remove what pointed to it:
                </p>
                <ul>
                    <li>${inline('docs')}, ${inline('docsTemplate')}, and ${inline('DocsRoutes')} in ${inline('src/views/index.ts')}</li>
                    <li>the ${inline("['docs']")} route in ${inline('src/routes.ts')}</li>
                    <li>the ${inline('docs')} getter in ${inline('src/services/elements.ts')}</li>
                    <li>the Docs links in the nav, home, and about templates</li>
                </ul>
                <p>
                    TypeScript will tell you if you missed anything the next time it compiles.
                </p>

                <h4>Coding</h4>
                <p>
                    Now you can start coding! I recommend using Visual Studio Code as your editor. It has built-in TypeScript support and a lot of other features that make coding in TypeScript easy.
                </p>
                <p>
                    If you are using VS Code, I recommend using <a href="https://marketplace.visualstudio.com/items?itemName=lehwark.htmx-literals" target="_blank">htmx-literals</a> for syntax highlighting. You can install it through the extensions tab. Elemental relies heavily on template literals for creating HTML elements, and this extension will make it easier to read and write those literals.
                </p>
                <p>
                    I know that different people learn things differently, so there are comments all over the code that will help explain what's going on if you just want to dig in, but I'll also do my best to explain things in the documentation.
                </p>
                <p>
                    The first thing you should know about is the <a href="/docs/elements">Elements service</a>.
                </p>
            </section>
        </div>
    </el-docs>
`;

export default gettingStartedTemplate;
