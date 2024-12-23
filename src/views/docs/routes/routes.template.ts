import { escapeHtml, html } from "@services/elements";

const routesTemplate = () => html`
    <el-docs>
        <div class="content-slate">
            <section>
                <h1>Routes</h1>
                <p>
                    Elemental is a very front-end focused framework and, as such, it serves its pages based on whatever URL is passed into a front-end Routes class. There is also a Routes class for the backend, and it works very similarly, but it has a few more options for handling requests and responses. I'll cover that in the section for the server. The basic idea here, though, is that, in <code>main.ts</code>, you split the URL path into an array divided by the <code>/</code>, call <code>new Routes</code> and pass in the path into it like this: <code>new Routes(path)</code>. This will create a new instance of the Routes class, and then you call <code>.view()</code> on it to serve the page. Easy peasy, right? Let's get into the nitty-gritty.
                </p>
                <h4>Creating a New Route</h4>
                <p>
                    So, <code>main.ts</code> looks like this, right?:
                </p>
                <code>
                    import el from '@services/elements';<br>
                    import { initLoader } from '@services/request';<br>
                    import views from '@views';<br>
                    import Routes from './routes';<br>
                    <br>
                    initLoader();<br>
                    <br>
                    const path = window.location.pathname.split('/');<br>
                    path.shift();<br>
                    <br>
                    el.body.appendChild(views.navTemplate());<br>
                    views.nav();<br>
                    new Routes(path).view();
                </code>
                <p>
                    Note that <code>el.body.appendChild(views.navTemplate()); views.nav();</code> is optional. It's just there to add the navigation bar to every single page you load. You can remove it if you don't want it.
                </p>
                <p>
                    <code>path.shift();</code> is there to remove the first element of the array, which is always an empty string, because the URL always starts with a <code>/</code>. So, what happens when you pass the path into the Routes class?
                </p>
                <p>
                    The Routes class is set up like this:
                </p>
                <code>
                    import el from "@services/elements";<br>
                    import views from "@views";<br>
                    import { getHtml } from "@services/request";<br>
                    <br>
                    export default class Routes {<br>
                    &nbsp;&nbsp;query: {[key: string]: any} = {};<br>
                    &nbsp;&nbsp;constructor(<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;public path: string[]<br>
                    &nbsp;&nbsp;) {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;new URLSearchParams(location.search).entries().forEach((entry) => {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;this.query[entry[0]] = isNaN(Number(entry[1])<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;? entry[1].toLowerCase() == 'true' || entry[1].toLowerCase() == 'false'<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;? Boolean(entry[1].toLowerCase())<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: entry[1]<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Number(entry[1]);<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;});<br>
                    &nbsp;&nbsp;}<br>
                    <br>
                    &nbsp;&nbsp;['']() {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;el.body.appendChild(views.homeTemplate(<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"It's Elemental",<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"A boilerplate framework for TypeScript web development."<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;));<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;views.home();<br>
                    &nbsp;&nbsp;}<br>
                    <br>
                    view() {<br>
                    &nbsp;&nbsp;const view = this[this.path[0]].bind(this);<br>
                    &nbsp;&nbsp;if (typeof view !== 'function') {<br>
                    &nbsp;&nbsp;&nbsp;getHtml(location.pathname)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;.then((page) => {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (page instanceof HTMLElement) {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;el.body.appendChild(page);<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;} else if (page instanceof NodeList) {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;page.forEach((element) => {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;el.body.appendChild(element);<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (el.nav.nextElementSibling === null) {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;el.body.appendChild(views.homeTemplate('404', 'Page Not Found'));<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;views.home();<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;});<br>
                    &nbsp;&nbsp;} else {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;view();<br>
                    &nbsp;&nbsp;}<br>
                    }<br>
                </code>
                <p>
                    So, it looks like there's a lot going on here, but it's really pretty simple. As you know, the path is being passed in as an array. So, what the <code>view()</code> function does is call whatever function corresponds to the first string in the array. If there's no function that corresponds to that string, it defaults to the server first, and if that returns nothing, it serves a 404 page.
                </p>
                <p>
                    If the URL is just <code>/</code>, then the first string in the array will be blank (even after shifting it in <code>main.ts</code>). So, the <code>['']()</code> function is called, which serves the home page. See what I did there? The Routes class is an object with functions that are indexed by the strings of the paths in the array. So, when <code>view()</code> sees that the string is blank, it calls <code>['']()</code> which, in turn, calls up <code>el.body</code> and appends the home page to it. Which, in this case, takes two arguments: a title and a subtitle. Then, it calls <code>views.home()</code> which is the controller for the home page.
                </p>
                <p>
                    So, that means if you want to add a new page, all you have to do is add a new function indexed by the string of the path you want to serve. For example, if you want to add a page at <code>/about</code>, you would add a function like this:
                </p>
                <code>
                    ['about']() {<br>
                    &nbsp;&nbsp;el.body.appendChild(views.aboutTemplate());<br>
                    &nbsp;&nbsp;views.about();<br>
                    }
                </code>
                <p>
                    If you want to add a view that has sub-views, you'll have to check if there are any further strings in the path array. For example, if you want to add a page at <code>/docs</code> that has sub-views for <code>/getting-started</code>, <code>/elements</code>, <code>/routes</code>, <code>/views</code>, and <code>/faq</code>, you would add a function like this:
                </p>
                <code>
                    ['docs']() {<br>
                    &nbsp;&nbsp;if (this.path[1]) {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;this.path.shift();<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;new views.DocsRoutes(this.path).view();<br>
                    &nbsp;&nbsp;} else {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;el.body.appendChild(views.docsTemplate());<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;views.docs();<br>
                    &nbsp;&nbsp;}<br>
                    }
                </code>
                <p>
                    Oh, look! There's a new routes class in there! I'll get to that in a second, but first, I should explain that this function is checking if there's a second string in the array, and if there is, it knocks off the first string and passes the rest. If there's not, it'll just serve the docs page.
                </p>
                <p>
                    So, now I should explain what's up with the <code>DocsRoutes</code> class.
                </p>
                <h4>Sub-Routes</h4>
                <p>
                    The <code>DocsRoutes</code> class is set up like this:
                </p>
                <code>
                    import el, { html } from '@services/elements';<br>
                    import views from '@views';<br>
                    import Routes from '@routes';<br>
                    <br>
                    export default class DocsRoutes extends Routes {<br>
                    &nbsp;&nbsp;constructor(public path: string[]) {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;super(path);<br>
                    &nbsp;&nbsp;}<br>
                    <br>
                    &nbsp;&nbsp;['getting-started']() {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;el.body.appendChild(<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;views.docsTemplate.gettingStarted()<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;);<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;views.docs();<br>
                    &nbsp;&nbsp;}<br>
                    <br>
                    &nbsp;&nbsp;['elements']() {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;el.body.appendChild(<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;views.docsTemplate.elementsTemplate()<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;);<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;views.docs();<br>
                    &nbsp;&nbsp;}<br>
                    <br>
                    &nbsp;&nbsp;['routes']() {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;el.body.appendChild(<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;views.docsTemplate.routesTemplate()<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;);<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;views.docs();<br>
                    &nbsp;&nbsp;}<br>
                    <br>
                    &nbsp;&nbsp;['views']() {<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;el.body.appendChild(<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;views.docsTemplate.viewsTemplate()<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;);<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;views.docs();<br>
                    &nbsp;&nbsp;}<br>
                    }
                </code>
                <p>
                    So, the <code>DocsRoutes</code> class is just an extension of the <code>Routes</code> class. It's set up the same way, but it has functions for each of the sub-views of the <code>/docs</code> page. So, if you want to add a new sub-view, you just add a new function indexed by the string of the path you want to serve. For example, if you want to add a page at <code>/docs/faq</code>, you would add a function like this:
                </p>
                <code>
                    ['faq']() {<br>
                    &nbsp;&nbsp;el.body.appendChild(<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;views.docsTemplate.faqTemplate<br>
                    &nbsp;&nbsp;);<br>
                    &nbsp;&nbsp;views.docs();<br>
                    }
                </code>
                <p>
                    This sub-route file will already have the <code>view()</code> function and <code>query</code> property from the <code>Routes</code> class, so you don't have to worry about those. (Don't worry, I'll get to the <code>query</code> property!) Just add the function for the sub-view you want to serve.
                </p>
                <p>
                    The sub-route file should be saved in the same directory as the view file it's serving. So, if you're adding a sub-view for the <code>/docs</code> page, you should save the file as <code>docs.routes.ts</code> in the <code>docs</code> directory. Then it should be imported and exported in the <code>views/index.ts</code> file like this:
                </p>
                <code>
                    ...<br>
                    import DocsRoutes from './docs/docs.routes';<br>
                    <br>
                    ...<br>
                    export { default as DocsRoutes } from './docs/docs.routes';<br>
                    <br>
                    conts views = {<br>
                    &nbsp;&nbsp;...<br>
                    &nbsp;&nbsp;DocsRoutes<br>
                    }<br>
                    export default views;
                </code>
                <p>
                    Now the <code>DocsRoutes</code> class is available to be used in the <code>routes.ts</code> file. And now, as promised:
                </p>
                <h4>The Query Property</h4>
                <p>
                    The <code>query</code> property is a property of the <code>Routes</code> class that is an object with all the query parameters from the URL. It's set up in the constructor like this:
                </p>
                <code>
                    new URLSearchParams(location.search).entries().forEach((entry) => {<br>
                    &nbsp;&nbsp;this.query[entry[0]] = isNaN(Number(entry[1]))<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;? entry[1].toLowerCase() == 'true' || entry[1].toLowerCase() == 'false'<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;? Boolean(entry[1].toLowerCase())<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: entry[1]<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;: Number(entry[1]);<br>
                    });
                </code>
                <p>
                    So, as you can see, it's just taking the query parameters from the URL and adding them to the <code>query</code> object. If the query parameter is a number, it adds it as a number. If it's a boolean, it adds it as a boolean. Otherwise, it adds it as a string. So, if you have a URL like <code>/about?name=John&age=30&isCool=true</code>, the <code>query</code> object will look like this:
                </p>
                <code>
                    {<br>
                    &nbsp;&nbsp;name: 'John',<br>
                    &nbsp;&nbsp;age: 30,<br>
                    &nbsp;&nbsp;isCool: true<br>
                    }
                </code>
                <p>
                    So, if you want to use the query parameters in your view, you can just pass the query into the view template or controller like this:
                </p>
                <code>
                    ['about']() {<br>
                    &nbsp;&nbsp;el.body.appendChild(views.aboutTemplate(this.query));<br>
                    &nbsp;&nbsp;views.about(this.query);<br>
                    }
                </code>
                <p>
                    And then you can use the query parameters in your view like this:
                </p>
                <code>
                    import el from "@services/elements";<br>
                    import { escapeHtml, html } from "@services/elements";<br>
                    <br>
                    const aboutTemplate = (query: {[key: string]: any}) => html${escapeHtml`\``}<br>
                    ${escapeHtml`  <h1>About $\{query.name}</h1>`}<br>
                    ${escapeHtml`\`;`}<br>
                    <br>
                    export default aboutTemplate;
                </code>
                <p>
                    And the query parameter will be available in all your sub-route files, too, so just pass it in and use it as needed.
                </p>
            </section>
        </div>
    </el-docs>
`;

export default routesTemplate;