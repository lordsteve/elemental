import { html } from "@services/elements";

const gettingStartedTemplate = html`
    <el-docs>
        <div class="content-slate">
            <section>
                <h1>Getting Started</h1>
                <h4>TL;DR</h4>
                <code>
                    git clone https://github.com/lordsteve/elemental.git<br>
                    git init {new-project-name}<br>
                    cp -r elemental/* {new-project-name}/<br>
                    cd {new-project-name}<br>
                    npm install<br>
                    npm run dev
                </code>

                <h4>Prerequisites</h4>
                <p>
                    You're going to need git and Node.js installed on your machine to start. You can download git from <a href="https://git-scm.com/downloads" target="_blank">git-scm.com</a> and Node.js from <a href="https://nodejs.org/en/download/" target="_blank">nodejs.org</a>.
                </p>

                <h4>Installation</h4>
                <p>
                    Once you have those, you can clone the Elemental repository onto your computer and then copy the files into a new project folder. So, open git bash and run the following commands:
                </p>
                <code>
                    git clone https://github.com/lordsteve/elemental.git<br>
                    git init {new-project-name}<br>
                    cp -r elemental/* {new-project-name}/
                </code>
                <p>
                    This will ensure you have all the necessary files to start a new project with Elemental. You can go ahead and delete the docs folder at <code>src/views/docs</code> to start fresh.
                </p>
                <p>
                    Next, navigate to the new project folder and install the dependencies.
                </p>
                <code>
                    cd {new-project-name}<br>
                    npm install
                </code>
                <p>
                    This will install a few different packages that you need to create and run an Elemental project. They include, but are not limited to, TypeScript, TypeORM, reflect-metadata, and a few others.
                </p>

                <h4>Running the Project</h4>
                <p>
                    Once the dependencies are installed, you can run the project in development mode.
                </p>
                <code>
                    npm run dev
                </code>
                <p>
                    This will start a local server on port 3000 and automatically open a browser window to the project. The server and the browser will automatically reload when you make changes to the project files. If you don't want to have the browser refresh automatically, you can access the project on port 8080.
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