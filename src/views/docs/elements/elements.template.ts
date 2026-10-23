import Helpers from "@services/helpers";
import codeBlock, { inline } from "../codeBlock";

const html = Helpers.html;

const elementsTemplate = () => html`
    <el-docs>
        <div class="content-slate">
            <section>
                <h1>Elements</h1>
                <p>
                    The Elements service is the heart and soul of the Elemental framework. It makes it super easy to get whatever DOM element you need to manipulate by using the native JavaScript ${inline('document.querySelector()')} method wrapped in a getter function.
                </p>
                <p>
                    For example, if you write a ${inline('<div>')} element with an id of "my-div" in your HTML, you can access that element in your TypeScript file by calling ${inline("el.divs.id('my-div')")}. This will return the ${inline('<div>')} element with the id of "my-div" that you can then manipulate as you see fit.
                </p>
                <p>
                    Import it at the top of your TypeScript file like this:
                </p>
                ${codeBlock(`import el from '@elements';`)}
                <p>
                    The lowercase ${inline('el')} is a convention that is used throughout the Elemental framework, and it's a good idea to stick with it. Everything on it is static, so there's nothing to create. Just import it and use it from anywhere.
                </p>

                <h4>Two Layers</h4>
                <p>
                    The Elements service is split into two files. ${inline('src/services/baseElements.ts')} holds ${inline('BaseEl')}, which is everything that comes with Elemental: the common elements, the loader, the event listener signal, and the login helpers. ${inline('src/services/elements.ts')} holds ${inline('el')}, which extends ${inline('BaseEl')} with the elements that belong to your app. That second file is the one you'll be editing. The first one you can mostly leave alone, which makes it easier to pull in Elemental updates later.
                </p>

                <h4>The Elements</h4>
                <p>
                    Some elements only ever exist once on a page. ${inline('el.root')}, ${inline('el.body')}, and ${inline('el.title')} are always there, so they come back as the element itself. Others might or might not be on the page, so they come back as the element or ${inline('null')}:
                </p>
                <ul>
                    <li>${inline('el.nav')} for the ${inline('<nav>')} element</li>
                    <li>${inline('el.modal')} for an ${inline('<el-modal>')} element</li>
                    <li>${inline('el.submitButton')} for the first ${inline('<button type="submit">')}</li>
                    <li>${inline('el.cookieBanner')} for the ${inline('<el-cookie-banner>')} element</li>
                </ul>
                <p>
                    Then there are the elements that usually show up more than once. These come back as a ${inline('NodeListOf')}, the browser's own list type:
                </p>
                <ul>
                    <li>${inline('el.buttons')} for ${inline('<button>')} elements</li>
                    <li>${inline('el.divs')} for ${inline('<div>')} elements</li>
                    <li>${inline('el.forms')} for ${inline('<form>')} elements</li>
                    <li>${inline('el.formInputs')} for every ${inline('<input>')} and ${inline('<textarea>')} inside a form</li>
                    <li>${inline('el.imgs')} for ${inline('<img>')} elements</li>
                    <li>${inline('el.inputs')} for ${inline('<input>')} elements</li>
                    <li>${inline('el.paragraphs')} for ${inline('<p>')} elements</li>
                    <li>${inline('el.sections')} for ${inline('<section>')} elements</li>
                    <li>${inline('el.selectors')} for ${inline('<select>')} elements</li>
                    <li>${inline('el.textareas')} for ${inline('<textarea>')} elements</li>
                </ul>
                <p>
                    Each of these lists has an ${inline('id()')} method that finds the one element in the list with that id. If there isn't one, you get ${inline('undefined')}. If there aren't any of that kind of element on the page at all, you get an empty list (and a note in the console), so ${inline("el.buttons.id('save')")} is always safe to call. You just have to check what comes back:
                </p>
                ${codeBlock(`
const saveButton = el.buttons.id('save');
if (saveButton) saveButton.disabled = true;
                `)}

                <h4>Adding Your Own</h4>
                <p>
                    The great thing about the Elements service is that if you think there's an element missing, you can just go ahead and add it. Add a getter to ${inline('el')} in ${inline('src/services/elements.ts')} using ${inline('this.getElement()')} for one element or ${inline('this.getElements()')} for a list:
                </p>
                ${codeBlock(`
export default class el extends BaseEl {
    public static get docs() {
        return this.getElement<HTMLElement>('el-docs');
    }
    public static get links() {
        return this.getElements<HTMLAnchorElement>('a');
    }
};
                `)}
                <p>
                    When you create a new page, you should create an element for that page. This element will follow the naming convention of ${inline('<el-docs>')} for a page named "Docs", and once you add the getter, you will be able to access that element in your TypeScript file by calling ${inline('el.docs')}. This will also make it easy for you to target that page in your CSS file by adding ${inline('el-docs')} in front of the target class or id, for example: ${inline('el-docs .content-slate')}.
                </p>

                <h4>Event Listeners</h4>
                <p>
                    ${inline('el.signal')} is an ${inline('AbortSignal')} that fires when the page goes away. Pass it to every ${inline('addEventListener()')} call and the listener cleans itself up, so you never have to remember to remove it:
                </p>
                ${codeBlock(`
el.buttons.id('save')?.addEventListener('click', () => {
    console.log('Saved!');
}, { signal: el.signal });
                `)}
                <p>
                    If you ever need to drop every one of those listeners early, ${inline('el.removeListeners()')} does it.
                </p>

                <h4>The Loader</h4>
                <p>
                    ${inline('el.loader')} is a special element that is used to display a loading spinner on the page. It works in tandem with the Request service to show up whenever a request is being made and disappear when the request is complete. If the loader is not currently on the page, it will show up if you simply reference it, and you can hide it again by calling ${inline('el.loader.remove()')}. It keeps count, too, so if three requests are running at once it stays up until the last one finishes.
                </p>
                <p>
                    The loader is a ${inline('<loader>')} tag wrapped around a ${inline('<spinner>')} tag. ${inline('src/views/loader.css')} has some default styles for it, but you can change them to be whatever you want.
                </p>

                <h4>Attributes That Do Things</h4>
                <p>
                    A second after a page loads, ${inline('BaseEl')} looks for a few attributes and wires them up for you:
                </p>
                <ul>
                    <li>${inline('bg')} sets the element's background image: ${inline('<div bg="/storage/images/forest.jpg"></div>')}</li>
                    <li>${inline('light-box')} opens the element in a lightbox when it's clicked. On an ${inline('<img>')}, ${inline('<video>')}, or ${inline('<iframe>')} it uses the element's own ${inline('src')}. On anything else, put the URL in the attribute and say what kind it is: ${inline('<button light-box="/storage/trailer.mp4" light-box-type="video">')}.</li>
                    <li>${inline('title')} shows its text for a few seconds when the element is tapped on a touch screen, since there's no hover there.</li>
                </ul>
                <p>
                    It also warns you in the console if two elements share an id, because ${inline('id()')} can only ever find one of them.
                </p>

                <h4>Forms</h4>
                <p>
                    The last line of ${inline('main.ts')} is ${inline('new el()')}, and that sets up a few conveniences for forms:
                </p>
                <ul>
                    <li>The submit button stays disabled until every ${inline('required')} input has something in it.</li>
                    <li>Submitting a form disables the button and swaps its text for a spinner, so nobody double-submits.</li>
                    <li>If someone leaves the page before submitting, what they typed is saved and filled back in when they come back. Inputs whose name starts with ${inline('_')}, and file inputs, are skipped.</li>
                    <li>Options in a multi-select toggle on click, so nobody has to hold down Ctrl.</li>
                </ul>
                <p>
                    Any of those can be deleted from the ${inline('BaseEl')} constructor if you'd rather have the browser's default behavior.
                </p>
                <p>
                    ${inline('BaseEl')} also adds two methods to every string: ${inline('stripScripts()')} removes any ${inline('<script>')} tags, which is handy for anything typed into a form, and ${inline('doubleBreakDivs()')} cleans up the ${inline('<div>')} tags a ${inline('contenteditable')} element likes to add.
                </p>

                <h4>Logging In</h4>
                <p>
                    ${inline('el.currentUser')}, ${inline('el.isAuth')}, ${inline('el.checkAuth()')}, and ${inline('el.checkAdmin()')} tell you who's logged in. They have <a href="/docs/login">their own page</a>.
                </p>

                <h4>Template Literals</h4>
                <p>
                    You'll notice there are no HTML files in Elemental except for the base ${inline('index.html')} file. This is because Elemental uses tagged template literals to create the HTML for the page. This is a great way to keep the HTML and TypeScript together to make it easy to see what the HTML looks like when you're working in TypeScript.
                </p>
                <p>
                    Tagged template literals are a feature of JavaScript that allows you to take a literal string and parse it with a function. In this case, the ${inline('html')} function takes the string and returns an element. It lives in the Helpers service, and it works like this:
                </p>
                ${codeBlock(`
import Helpers from '@services/helpers';

const html = Helpers.html;

const myElement = html\`
    <div>
        <p>My paragraph \${includingAVariable}</p>
    </div>
\`;
                `)}
                <p>
                    As you can see, a tagged template literal is used by immediately following the function name with a tick mark. In the Helpers service, that function looks like this:
                </p>
                ${codeBlock(`
public static html(html: TemplateStringsArray, ...values: any[]): HTMLElement {
    let string: string = '';
    html.forEach((str, i) => string += str + (values[i] ?? ''));
    const template = document.createElement('template');
    template.innerHTML = string.trim();
    return template.content.firstChild as HTMLElement;
}
                `)}
                <p>
                    The ${inline('html')} parameter is a ${inline('TemplateStringsArray')}, which is an array of strings that are the literal parts of the template literal divided by the values that are passed in by the ${inline('${}')}. The ${inline('values')} parameter is a rest parameter that takes all the values that are passed into the template literal. The function then loops through the ${inline('html')} array and adds the literal parts of the template literal to the ${inline('string')} variable. If there are values passed in, it adds those as well. It then creates a ${inline('template')} element, sets the ${inline('innerHTML')} to the ${inline('string')} variable, and returns the first child of the ${inline('content')} property of the ${inline('template')} element as an ${inline('HTMLElement')}.
                </p>
                <p>
                    One thing to be careful about: ${inline('html')} drops your values straight into the HTML. That's what you want for your own markup, but never put something a user typed in there, or they can put their own HTML (and scripts) on your page. Set user content with ${inline('textContent')} after the element is built instead:
                </p>
                ${codeBlock(`
const comment = html\`<p class="comment"></p>\`;
comment.textContent = userComment;
                `)}
                <p>
                    There's also ${inline('Helpers.escapeHtml')}, which turns a template into a string with the HTML escaped, so it shows up on the page as text instead of being treated as markup.
                </p>
                <p>
                    You can learn more about tagged template literals <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates" target="_blank">here</a>. But now that you have a basic idea of how they work here in Elemental, we can move on to creating <a href="/docs/views">Views</a>!
                </p>
            </section>
        </div>
    </el-docs>
`;

export default elementsTemplate;
