import { html, escapeHtml } from "@services/elements";

const elementsTemplate = html`
    <el-docs>
        <div class="content-slate">
            <section>
                <h1>Elements</h1>
                <p>
                    The Elements service the heart and soul of the Elemental framework. It creates a refernce to every relevent DOM element on the page and stores it in an object for easy access. This allows you to create and manipulate elements on the page without having to query the DOM every time you need to access an element.
                </p>
                <p>
                    For example, if you write a <code>${escapeHtml`<div>`}</code> element with an id of <code>"myDiv"</code> in your HTML, you can access that element in your TypeScript file by calling <code>el.divs.id('myDiv')</code>. This will return the <code>${escapeHtml`<div>`}</code> element with the id of <code>"myDiv"</code> that you can then manipulate with the Element API.
                </p>
                <h4>Adding to the Existing Element Objects</h4>
                <p>
                    JavaScript and TypeScript already have established ways of accessing and manipulating DOM elements on the page. Every kind of element has a type associated with it, such as <code>HTMLDivElement</code> for a <code>${escapeHtml`<div>`}</code> element. Usually, you would access a single element by calling <code>document.getElementById('myDiv')</code>, and, behind the scenes, the Elements service does the same thing. Another way to access elements is by using the <code>querySelector()</code> method, which allows you to access elements by class, tag, or any other CSS selector. In the case of any tag selector (like 'div' or 'span', etc.), it would return a NodeList of all the elements on the page that correspond to that selector with a type of <code>${escapeHtml`NodeListOf`}</code>. The Elements service queries many of the most relevant tags and provides them as objects named after those tags (for example, <code>el.divs</code> for <code>${escapeHtml`<div>`}</code> elements). It also takes the <code>NodeListOf</code> and adds the <code>id()</code> method to it, which allows you to access a single element within the NodeListOf that selector by its id.
                </p>
            </section>
        </div>
    </el-docs>
`;
export default elementsTemplate;