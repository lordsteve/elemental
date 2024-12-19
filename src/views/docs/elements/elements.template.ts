import { escapeHtml, html } from "@services/elements";

const elementsTemplate = html`
    <el-docs>
        <div class="content-slate">
            <section>
                <h1>Elements</h1>
                <p>
                    The Elements service is the heart and soul of the Elemental framework. It makes it super easy to get whatever DOM element you need to manipulate by using the native JavaScript <code>document.querySelector()</code> method wrapped in a getter function.
                </p>
                <p>
                    For example, if you write a <code>${escapeHtml`<div>`}</code> element with an id of <code>"my-div"</code> in your HTML, you can access that element in your TypeScript file by calling <code>el.divs.id('my-div')</code>. This will return the <code>${escapeHtml`<div>`}</code> element with the id of <code>"my-div"</code> that you can then manipulate with the Element API.
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
                    The great thing about the Elements service is that if you think there's an element mising, you can just go ahead and add it. Just add in a new getter and setter in the same way that the other elements are set up, and you're good to go.
                </p>
            </section>
        </div>
    </el-docs>
`;
export default elementsTemplate;