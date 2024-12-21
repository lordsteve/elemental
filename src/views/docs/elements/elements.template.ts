import { escapeHtml, html } from "@services/elements";

const elementsTemplate = () => html`
    <el-docs>
        <div class="content-slate">
            <section>
                <h1>Elements</h1>
                <p>
                    The Elements service is the heart and soul of the Elemental framework. It makes it super easy to get whatever DOM element you need to manipulate by using the native JavaScript <code>document.querySelector()</code> method wrapped in a getter function.
                </p>
                <p>
                    For example, if you write a <code>${escapeHtml`<div>`}</code> element with an id of <code>"my-div"</code> in your HTML, you can access that element in your TypeScript file by calling <code>el.divs.id('my-div')</code>. This will return the <code>${escapeHtml`<div>`}</code> element with the id of <code>"my-div"</code> that you can then manipulate as you see fit.
                </p>
                <p>
                    It's important to import the Elements service at the top of your TypeScript file with <code>import el from '@services/elements';</code>. The lowercase <code>el</code> is a convention that is used throughout the Elemental framework, and it's a good idea to stick with it. The Elements service is a singleton, so you can access it from anywhere in your TypeScript file.
                </p>
                <h4>Adding to the Existing Element Objects</h4>
                <p>
                    JavaScript and TypeScript already have established ways of accessing and manipulating DOM elements on the page. Every kind of element has a type associated with it, such as <code>HTMLDivElement</code> for a <code>${escapeHtml`<div>`}</code> element. Usually, you would access a single element by calling <code>document.getElementById('my-div')</code>, and, behind the scenes, the Elements service does the same thing. Another way to access elements is by using the <code>document.querySelector()</code> method, which allows you to access elements by class, tag, or any other CSS selector. In the case of any tag selector (like 'div' or 'span', etc.), it would return a NodeList of all the elements on the page that correspond to that selector with a type of <code>${escapeHtml`NodeListOf`}</code>. The Elements service queries many of the most relevant tags and provides them as objects named after those tags (for example, <code>el.divs</code> for <code>${escapeHtml`<div>`}</code> elements). It also takes the <code>NodeListOf</code> and adds the <code>id()</code> method to it, which allows you to access a single element within the NodeListOf that selector by its id.
                </p>
                <p>
                    The Elements service also provides an easy way to add a background to an element. When you write your HTML, you can add a <code>bg</code> attribute to any element and provide a URL to an image. For example: <code>${escapeHtml`<div bg="path/to/image.jpg">`}</code>. The Elements service will then add a background image to that element with the URL you provided.
                </p>
                <h4>The Loader</h4>
                <p>
                    <code>el.loader</code> is a special element that is used to display a loading spinner on the page. It works in tadem with the Request service to show up whenever a request is being made and disappear when the request is complete. If the loader is not currently on the page, it will show up if you simply reference it, and you can hide it again by calling <code>el.loader.remove()</code>.
                </p>
                <p>
                    The loader is a <code>${escapeHtml`<loader>`}</code> tag in the HTML wrapped around a <code>${escapeHtml`<spinner>`}</code> tag. <code>main.css</code> has some default styles for the loader, but you can change them to be whatever you want. The basic idea is that the <code>${escapeHtml`<loader>`}</code> tag covers the screen and the <code>${escapeHtml`<spinner>`}</code> tag is a spinning circle.
                </p>
                <h4>The Elements</h4>
                <p>
                    Other than the <code>loader</code> element, the Elements service provides access several other commonly used elements. These include:
                    <ul>
                        <li><code>el.anchors</code> for <code>${escapeHtml`<a>`}</code> elements</li>
                        <li><code>el.buttons</code> for <code>${escapeHtml`<button>`}</code> elements</li>
                        <li><code>el.divs</code> for <code>${escapeHtml`<div>`}</code> elements</li>
                        <li><code>el.forms</code> for <code>${escapeHtml`<form>`}</code> elements</li>
                        <li><code>el.headings</code> for <code>${escapeHtml`<h1>`}</code> through <code>${escapeHtml`<h6>`}</code> elements</li>
                        <li><code>el.images</code> for <code>${escapeHtml`<img>`}</code> elements</li>
                        <li><code>el.inputs</code> for <code>${escapeHtml`<input>`}</code> elements</li>
                        <li><code>el.labels</code> for <code>${escapeHtml`<label>`}</code> elements</li>
                        <li><code>el.lists</code> for <code>${escapeHtml`<ol>`}</code> and <code>${escapeHtml`<ul>`}</code> elements</li>
                        <li><code>el.paragraphs</code> for <code>${escapeHtml`<p>`}</code> elements</li>
                        <li><code>el.selects</code> for <code>${escapeHtml`<select>`}</code> elements</li>
                        <li><code>el.spans</code> for <code>${escapeHtml`<span>`}</code> elements</li>
                        <li><code>el.tables</code> for <code>${escapeHtml`<table>`}</code> elements</li>
                        <li><code>el.textareas</code> for <code>${escapeHtml`<textarea>`}</code> elements</li>
                    </ul>
                </p>
                <p>
                    Each of these elements has the <code>id()</code> method that allows you to access a single element by its id. If you don't use the <code>id()</code> method, you will get a <code>NodeListOf</code> of all the elements on the page that correspond to that tag.
                </p>
                <p>
                    There are some elements that are only single elements. These include:
                    <ul>
                        <li><code>el.body</code> for the <code>${escapeHtml`<body>`}</code> element</li>
                        <li><code>el.html</code> for the <code>${escapeHtml`<html>`}</code> element</li>
                        <li><code>el.root</code> for the root of the page</li>
                        <li><code>el.title</code> for the <code>${escapeHtml`<title>`}</code> element</li>
                    </ul>
                </p>
                <p>
                    The great thing about the Elements service is that if you think there's an element mising, you can just go ahead and add it. Just add in a new getter and setter in the same way that the other elements are set up, and you're good to go. For example, when you create a new page, you should create an element for that page. This element will follow the naming convention of <code>${escapeHtml`<el-docs>`}</code> for a page named "Docs", and once you add the getter and setter, you will be able to access that element in your TypeScript file by calling <code>el.docs</code>. This will also make it easy for you to target that page in your CSS file by adding <code>el-docs</code> in front of the target class or id, for example: <code>el-docs .content-slate</code>.
                </p>
                <p>
                    But now we're getting into how to organize Views, so let's get into that next. But before we do that, there is one essential part of the Elements service that is critical to making new views, and that is the <code>html</code> function. Let's take a look at that next.
                </p>

                <h4>Template Literals</h4>
                <p>
                    You'll notice there are no html files in Elemental except for the base <code>index.html</code> file. This is because Elemental uses tagged template literals to create the HTML for the page. This is a great way to keep the HTML and TypeScript together to make it easy to see what the HTML looks like when you're working in TypeScript.
                </p>
                <p>
                    Tagged template literals are a relatively new feature in JavaScript that allows you to take a literal string and parse it with a function. In this case, the <code>html</code> function takes the string and returns an element. it works like this:
                </p>
                <code>
                    const myElement = html${escapeHtml`\``}<br>
                    ${escapeHtml`  <div>`}<br>
                    ${escapeHtml`    <p>My paragraph $\{including a variable\}</p>`}<br>
                    ${escapeHtml`  </div>`}<br>
                    ${escapeHtml`\``};
                </code>
                <p>
                    As you can see, a tagged template literal is used by immediately following the function name with a tick mark. In the Elements service, that function looks like this:
                </p>
                <code>
                    export function html(html: TemplateStringsArray, ...values: any[]): HTMLElement {<br>
                    &nbsp;&nbsp;let string: string = '';<br>
                    &nbsp;&nbsp;html.forEach((str, i) => string += str + (values[i] ?? ''));<br>
                    &nbsp;&nbsp;const template = document.createElement('template');<br>
                    &nbsp;&nbsp;template.innerHTML = string.trim();<br>
                    &nbsp;&nbsp;return template.content.firstChild as HTMLElement;<br>
                    }
                </code>
                <p>
                    The <code>html</code> parameter is a <code>TemplateStringsArray</code>, which is an array of strings that are the literal parts of the template literal divided by the values that are passed in by the <code>${escapeHtml`$\{\}`}</code>. The <code>values</code> parameter is a rest parameter that takes all the values that are passed into the template literal. The function then loops through the <code>html</code> array and adds the literal parts of the template literal to the <code>string</code> variable. If there are values passed in, it adds those as well. It then creates a <code>template</code> element, sets the <code>innerHTML</code> to the <code>string</code> variable, and returns the first child of the <code>content</code> property of the <code>template</code> element as an <code>HTMLElement</code>.
                </p>
                <p>
                    Template literal tags are not a part of the Elements object, so you'll have to import the <code>html</code> function at the top of your TypeScript file with <code>import { html } from '@services/elements';</code>. You can also import the <code>escapeHtml</code> function in the same way. This tag allows you to type out HTML that will be interpreted as a string and not as actual HTML.
                </p>
                <p>
                    You can learn more about tagged template literals <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates" target="_blank">here</a>. But now that you have a basic idea of how they work here in Elemental, we can move on to <a href="/docs/views">creating Views</a>!
                </p>
            </section>
        </div>
    </el-docs>
`;
export default elementsTemplate;