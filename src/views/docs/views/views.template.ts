import Helpers from '@services/helpers';
import codeBlock, { inline } from '../codeBlock';

const html = Helpers.html;

const viewsTemplate = () => html`
    <el-docs>
        <div class="content-slate">
            <section>
                <h1>Views</h1>
                <p>
                    Views consist of two main parts: templates, and controllers. Templates are the HTML structure of the view, and controllers are the TypeScript that controls the view. In Elemental, view templates are written in TypeScript as a function that returns an ${inline('html')} tagged template literal, and the controller is a function that is called after the template is on the page. Each view will be put inside of a folder with the same name as the view. This folder will contain ${inline('{viewName}.template.ts')} and ${inline('{viewName}.ctrl.ts')} files and ${inline('{viewName}.css')} if you want to include styles. Views can apply to pages, or to components that are used in multiple pages or multiple times in a page.
                </p>

                <h4>Template</h4>
                <p>
                    View templates start out by importing the Helpers service and pulling the ${inline('html')} tag off of it. Once you do that, you can start writing the page in a familiar HTML format. The end result will look something like this:
                </p>
                ${codeBlock(`
import Helpers from '@services/helpers';

const html = Helpers.html;

const helloWorldTemplate = () => html\`
    <div>
        <h1>Hello World!</h1>
    </div>
\`;

export default helloWorldTemplate;
                `)}
                <p>
                    There is, however, one important thing missing from the above code. And that's the view name tag. The outermost tag of the template should be named the same as the view name with the ${inline('el-')} prefix in front of it. So, if the view name is helloWorld, the outermost tag should be ${inline('<el-hello-world>')}. This will end up being how the Elements service and the CSS will look for this view. If you want the page to look like the rest of the site, put a ${inline('<div class="content-slate">')} and a ${inline('<section>')} inside it, too. So, the above code should look like this:
                </p>
                ${codeBlock(`
import Helpers from '@services/helpers';

const html = Helpers.html;

const helloWorldTemplate = () => html\`
    <el-hello-world>
        <div class="content-slate">
            <section>
                <h1>Hello World!</h1>
            </section>
        </div>
    </el-hello-world>
\`;

export default helloWorldTemplate;
                `)}
                <p>
                    After you come up with the tag name, add a getter for it to ${inline('el')} in ${inline('src/services/elements.ts')}:
                </p>
                ${codeBlock(`
public static get helloWorld() {
    return this.getElement<HTMLElement>('el-hello-world');
}
                `)}
                <p>
                    This will allow you to access the view in the controller.
                </p>
                <p>
                    Sometimes you might want to pass some data into the template. That's easily done by providing parameters to the template function. For example, if you wanted to pass a name to the template, you could do it like this:
                </p>
                ${codeBlock(`
const helloWorldTemplate = (name: string) => html\`
    <el-hello-world>
        <div class="content-slate">
            <section>
                <h1>Hello \${name}!</h1>
            </section>
        </div>
    </el-hello-world>
\`;
                `)}
                <p>
                    Remember from the <a href="/docs/elements">Elements</a> page that ${inline('html')} doesn't escape what you put in it. A name you wrote yourself is fine. A name somebody typed into a form should be set with ${inline('textContent')} in the controller instead.
                </p>
                <p>
                    If you want to manipulate the data that you pass into the template, you will have to provide a return statement in the template function. For example, if you wanted to capitalize the name before it's rendered, you could do it like this:
                </p>
                ${codeBlock(`
const helloWorldTemplate = (name: string) => {
    name = name.toUpperCase();
    return html\`
        <el-hello-world>
            <div class="content-slate">
                <section>
                    <h1>Hello \${name}!</h1>
                </section>
            </div>
        </el-hello-world>
    \`;
};
                `)}
                <p>
                    Be careful the amount of functionality you try to provide in the template, though. Most of the functionality should be provided in the controller. The template should remain as simple as possible.
                </p>
                <p>
                    The last thing you should know about templates is how to handle sub-views. When you navigate to a page, sometimes you'll want to organize that section of the app into deeper views. For example, this page is in the docs section, with a sub-view of views because you can see that the URL is ${inline('/docs/views')}. This should be done by creating another view folder within the parent view folder, importing the child view and then tacking it onto the parent view template. For example, if you had a home view and you wanted to add a helloWorld view to it, you would do it like this:
                </p>
                ${codeBlock(`
import Helpers from '@services/helpers';
import helloWorldTemplate from './helloWorld/helloWorld.template';

const html = Helpers.html;

const homeTemplate = () => html\`
    <el-home>
        <div class="content-slate">
            <section>
                <h1>Welcome Home!</h1>
            </section>
        </div>
    </el-home>
\`;

homeTemplate.helloWorld = helloWorldTemplate;

export default homeTemplate;
                `)}
                <p>
                    This will allow you to access the helloWorld view from the Routes file when it detects that a sub-view is being requested. (We'll get into how the Routes file works later.)
                </p>

                <h4>Controller</h4>
                <p>
                    An important thing to remember about a controller is that it's called after the template is on the page. So anything you create in the template will be available to the controller, and you'll get at it through the Elements service. The controller should be a function that is exported and called in the Routes file. Let's create a new controller for the helloWorld view. You would start out doing this:
                </p>
                ${codeBlock(`
import el from '@elements';

export default function helloWorld() {
    el.title.textContent = 'Hello World!';
}
                `)}
                <p>
                    The above code will set the title of the page (the text written in the browser tab) to 'Hello World!'. This is a very simple example, but you can see how you can manipulate the DOM and the data in the view from the controller utilizing the Elements service.
                </p>
                <p>
                    Let's say you created a ${inline('<button>')} in the template and you wanted something to happen when it's clicked. First you would give it an id in the template like this:
                </p>
                ${codeBlock(`
const helloWorldTemplate = () => html\`
    <el-hello-world>
        <div class="content-slate">
            <section>
                <h1>Hello World!</h1>
                <button id="hello-button">Say Hello!</button>
            </section>
        </div>
    </el-hello-world>
\`;
                `)}
                <p>
                    Then you would add the listener to the button in the controller like this:
                </p>
                ${codeBlock(`
import el from '@elements';

export default function helloWorld() {
    el.title.textContent = 'Hello World!';
    const button = el.buttons.id('hello-button');
    if (button)
        button.addEventListener('click', () => {
            console.log('Hello!');
        }, { signal: el.signal });
}
                `)}
                <p>
                    I know you're thinking, "But, Steve! I know I put the button on the template, why do I have to check if it exists?" Well, ${inline('id()')} gives you ${inline('undefined')} when it can't find the element, and TypeScript knows that. So, you should always check if the element exists before you try to manipulate it or else TypeScript will yell at you that it's possibly undefined. This is a useful practice if you want to use the same controller for multiple views and some of the elements are different.
                </p>
                <p>
                    Also, if you're unfamiliar with that ${inline('if')} statement syntax, it's a shorthand way of writing it that works if you only have one statement to execute.
                </p>
                <p>
                    Also, also, notice the ${inline('{ signal: el.signal }')} at the end. Event listeners have to be removed when you're done with them, or they can pile up and cause memory leaks. Passing ${inline('el.signal')} hands that job to Elemental, which removes them all when the page goes away. Do that with every listener and you'll never have to think about it again.
                </p>

                <h4>Styles</h4>
                <p>
                    Styles for the view should be written in a CSS file in the same folder with the same name as the view. For example, the styles for the helloWorld view should be written in a file called ${inline('helloWorld.css')}. All CSS files are imported into the base ${inline('views/index.css')} file like this:
                </p>
                ${codeBlock(`@import url('./helloWorld/helloWorld.css');`, 'css')}
                <p>
                    This will ensure that all the CSS files are loaded, but they are still separated by view so it's easier to find and manipulate them. Another good practice is to utilize the view name that you created for the view's tag name when writing CSS that is specific to that view. Like this:
                </p>
                ${codeBlock(`
el-hello-world .example-class {
    display: flex;
    justify-content: center;
    align-items: center;
}
                `, 'css')}
                <p>
                    If you want to write global styles that apply to all views, you can write them in the ${inline('main.css')} file. This is where you would put things like the body styles or the styles for global text or default buttons, etc. The colors, corner sizes, and shadows used across the site are CSS variables at the top of ${inline('main.css')}, like ${inline('var(--surface)')} and ${inline('var(--radius)')}. Use those instead of typing out a color and your view will match everything else.
                </p>

                <h4>View Index</h4>
                <p>
                    The last thing you need to know about views is very simple, but very important. They are all imported and exported in the base ${inline('views/index.ts')} file. This is so that the Routes file can access them all at once. This file should look something like this:
                </p>
                ${codeBlock(`
import helloWorld from './helloWorld/helloWorld.ctrl';
import helloWorldTemplate from './helloWorld/helloWorld.template';

export { default as helloWorld } from './helloWorld/helloWorld.ctrl';
export { default as helloWorldTemplate } from './helloWorld/helloWorld.template';

const views = {
    helloWorld,
    helloWorldTemplate
};
export default views;
                `)}
                <p>
                    Sub-views make it into this file when they are attached to their parent view, so it's not necessary to import them here.
                </p>

                <h4>Components</h4>
                <p>
                    Sometimes you'll want to create a view that is used in multiple views or multiple times in a view. This is where components come in. It gets tricky when making a view that's supposed to show up inside another view, because ${inline('html')} spits out an element, and you can't drop an element into the middle of another template's string. At the same time, there are times you'll want to allow the component to stand on its own, and a plain string isn't gonna cut it in that case.
                </p>
                <p>
                    The solution that I've come up with is to pass in a boolean that controls whether or not the view is a string. It'll look like this:
                </p>
                ${codeBlock(`
import Helpers from '@services/helpers';

const helloWorldButtonComponent = (string: boolean = false) => {
    const button = \`
        <button id="hello-button">Say Hello!</button>
    \`;
    return string ? button : Helpers.html\`\${button}\`;
};

export default helloWorldButtonComponent;
                `)}
                <p>
                    Written without a tag, the template literal is just a regular old string. That can be used to insert the component into the template of another view. The ${inline('html')} function, as you already know, will spit out an actual HTML element so that the view can stand on its own if it needs to. Writing the view like this means you don't have to write the same HTML twice. You write it once as a string and then use that same string to build an element only if you need to. The GitHub button in the corner of this page is built exactly like that.
                </p>
                <p>
                    Then you can place the component in another view like this:
                </p>
                ${codeBlock(`
import views from '@views';
import Helpers from '@services/helpers';

const html = Helpers.html;

const helloWorldTemplate = () => html\`
    <el-hello-world>
        <div class="content-slate">
            <section>
                <h1>Hello World!</h1>
                \${views.helloWorldButtonComponent(true)}
            </section>
        </div>
    </el-hello-world>
\`;

export default helloWorldTemplate;
                `)}
                <p>
                    If you create a controller for the component, you can call it from the main view's controller like this:
                </p>
                ${codeBlock(`
import el from '@elements';
import views from '@views';

export default function helloWorld() {
    el.title.textContent = 'Hello World!';
    views.helloWorldButton();
}
                `)}
                <p>
                    You can make a separate folder for components if you like, but that's up to you. It kind of depends on how many you're going to use. Just remember to add them to the view index file so your other views can access them.
                </p>
                <p>
                    That's basically how views work in Elemental. Next up, you need to know how the <a href="/docs/routes">Route files</a> work. And, yes, that's plural! You'll see why...
                </p>
            </section>
        </div>
    </el-docs>
`;

export default viewsTemplate;
