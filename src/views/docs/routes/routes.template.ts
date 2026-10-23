import Helpers from "@services/helpers";
import codeBlock, { inline } from "../codeBlock";

const html = Helpers.html;

const routesTemplate = () => html`
    <el-docs>
        <div class="content-slate">
            <section>
                <h1>Routes</h1>
                <p>
                    Elemental is a very front-end focused framework and, as such, it serves its pages based on whatever URL is passed into a front-end Routes class. There is also a Routes class for the backend, and it works very similarly, but it has a few more options for handling requests and responses. I'll cover that in the section for <a href="/docs/the-server">the server</a>. The basic idea here, though, is that, in ${inline('main.ts')}, you split the URL path into an array divided by the ${inline('/')}, pass it into ${inline('new Routes(path)')}, and then call ${inline('.view()')} on it to serve the page. Easy peasy, right? Let's get into the nitty-gritty.
                </p>

                <h4>main.ts</h4>
                <p>
                    So, ${inline('main.ts')} looks like this, right?:
                </p>
                ${codeBlock(`
import el from '@elements';
import CookieJar from '@services/cookieJar';
import { getData, initLoader } from '@services/request';
import views from '@views';
import Routes from './routes';

initLoader();
el.establishAuth();
if (el.sessionKey) {
    // Sessions last three months on the server; drop one it no longer knows
    getData<boolean>('/check-auth').then(isAuth => {
        if (!isAuth) {
            localStorage.removeItem('sessionKey');
            localStorage.removeItem('currentUser');
            location.reload();
        }
    }).catch(() => { });
}

const path = location.pathname.split('/');
path.shift();

el.body.appendChild(views.navTemplate());
views.nav();
if (!CookieJar.get<boolean>('cookies-are-cool')) {
    el.body.appendChild(views.cookieBannerTemplate());
    views.cookieBanner();
}
new Routes(path).view();
new el();
                `)}
                <p>
                    Taking it from the top: ${inline('initLoader()')} sets up the <a href="/docs/request-service">Request service</a>, and ${inline('el.establishAuth()')} and the ${inline('check-auth')} call pick up whoever is <a href="/docs/login">logged in</a>. The nav and the cookie banner are optional. They're just there to put a navigation bar and a cookie notice on every page you load, so you can remove them if you don't want them. ${inline('new el()')} at the end sets up the form helpers from the <a href="/docs/elements">Elements</a> page.
                </p>
                <p>
                    ${inline('path.shift();')} is there to remove the first element of the array, which is always an empty string, because the URL always starts with a ${inline('/')}. So, what happens when you pass the path into the Routes class?
                </p>

                <h4>Creating a New Route</h4>
                <p>
                    The Routes class is set up like this:
                </p>
                ${codeBlock(`
import el from '@elements';
import views from "@views";
import RoutesBase from "./routes.base";

export default class Routes extends RoutesBase {

    ['about']() {
        el.body.appendChild(views.aboutTemplate());
        views.about();
    }

    ['docs']() {
        if (this.path[1]) {
            this.path.shift();
            new views.DocsRoutes(this.path).view();
        } else {
            el.body.appendChild(views.docsTemplate());
            views.docs();
        }
    }

}
                `)}
                <p>
                    But the really important part is in the RoutesBase class in ${inline('routes.base.ts')}. Here's the part that matters for routing:
                </p>
                ${codeBlock(`
export default class RoutesBase {
    query: { [key: string]: boolean | number | string } = {};
    constructor(
        public path: string[]
    ) {
        for (const [key, value] of new URLSearchParams(location.search).entries()) {
            this.query[key] = isNaN(Number(value))
                ? value.toLowerCase() == 'true' || value.toLowerCase() == 'false'
                    ? value.toLowerCase() == 'true'
                    : value
                : Number(value);
        }
    }

    ['']() {
        el.body.appendChild(views.homeTemplate(
            "It's Elemental",
            "A boilerplate framework for TypeScript web development."
        ));
        views.home();
    }

    view() {
        const view = this[this.path[0]]?.bind(this);
        if (typeof view !== 'function') {
            getHtml(location.pathname)
                .then((page) => {
                    // ...adds whatever the server sent to the page...

                    if (!el.nav?.nextElementSibling) {
                        el.body.appendChild(views.homeTemplate('404', 'Page Not Found'));
                        views.home();
                    }
                });
        } else {
            view();
        }
    }
    [key: string]: any;
}
                `)}
                <p>
                    RoutesBase looks complicated so that Routes can be simple.
                </p>
                <p>
                    As you know, the path is being passed in as an array. So, what the ${inline('view()')} function does is call whatever function corresponds to the first string in the array. If there's no function that corresponds to that string, it asks the server for that path first, and if that comes back with nothing, it serves a 404 page.
                </p>
                <p>
                    If the URL is just ${inline('/')}, then the first string in the array will be blank (even after shifting it in ${inline('main.ts')}). So, the ${inline("['']()")} function is called, which serves the home page. See what I did there? The Routes class is an object with functions that are indexed by the strings of the paths in the array. So, when ${inline('view()')} sees that the string is blank, it calls ${inline("['']()")} which, in turn, calls up ${inline('el.body')} and appends the home page to it. Which, in this case, takes two arguments: a title and a subtitle. Then, it calls ${inline('views.home()')} which is the controller for the home page.
                </p>
                <p>
                    RoutesBase also has two routes of its own, ${inline("['start']()")} and ${inline("['logout']()")}. Those are part of logging in, and they're covered on the <a href="/docs/login">Logging In</a> page. Just don't name any of your own pages "start" or "logout."
                </p>
                <p>
                    So, that means if you want to add a new page, all you have to do is add a new function indexed by the string of the path you want to serve. For example, if you want to add a page at ${inline('/about')}, you would add a function like this:
                </p>
                ${codeBlock(`
['about']() {
    el.body.appendChild(views.aboutTemplate());
    views.about();
}
                `)}
                <p>
                    If you want to add a view that has sub-views, you'll have to check if there are any further strings in the path array. That's what the ${inline("['docs']()")} function above is doing: if there's a second string in the array, it knocks off the first one and passes the rest to a whole new routes class. If there's not, it'll just serve the docs page.
                </p>
                <p>
                    Oh, look! There's a new routes class in there! So, now I should explain what's up with the DocsRoutes class.
                </p>

                <h4>Sub-Routes</h4>
                <p>
                    The DocsRoutes class is set up like this:
                </p>
                ${codeBlock(`
import el from '@elements';
import views from '@views';
import Routes from '@routes';

export default class DocsRoutes extends Routes {

    ['getting-started']() {
        el.body.appendChild(
            views.docsTemplate.gettingStarted()
        );
        views.docs();
    }

    ['elements']() {
        el.body.appendChild(
            views.docsTemplate.elementsTemplate()
        );
        views.docs();
    }

    // ...and so on for the rest of the docs pages
}
                `)}
                <p>
                    So, the DocsRoutes class is just an extension of the Routes class. It's set up the same way, but it has functions for each of the sub-views of the ${inline('/docs')} page. So, if you want to add a new sub-view, you just add a new function indexed by the string of the path you want to serve. For example, if you want to add a page at ${inline('/docs/faq')}, you would add a function like this:
                </p>
                ${codeBlock(`
['faq']() {
    el.body.appendChild(
        views.docsTemplate.faqTemplate()
    );
    views.docs();
}
                `)}
                <p>
                    This sub-route file will already have the ${inline('view()')} function and ${inline('query')} property from the RoutesBase class, so you don't have to worry about those. (Don't worry, I'll get to the ${inline('query')} property!) Just add the function for the sub-view you want to serve.
                </p>
                <p>
                    The sub-route file should be saved in the same directory as the view it's serving. So, if you're adding a sub-view for the ${inline('/docs')} page, you should save the file as ${inline('docs.routes.ts')} in the docs directory. Then it should be imported and exported in the ${inline('views/index.ts')} file like this:
                </p>
                ${codeBlock(`
import DocsRoutes from './docs/docs.routes';
// ...
export { default as DocsRoutes } from './docs/docs.routes';

const views = {
    // ...
    DocsRoutes
};
export default views;
                `)}
                <p>
                    Now the DocsRoutes class is available to be used in the ${inline('routes.ts')} file. And now, as promised:
                </p>

                <h4>The Query Property</h4>
                <p>
                    The ${inline('query')} property is an object with all the query parameters from the URL. You saw it being set up in the RoutesBase constructor up there. It's just taking the query parameters from the URL and adding them to the ${inline('query')} object. If the query parameter is a number, it adds it as a number. If it's ${inline('true')} or ${inline('false')}, it adds it as a boolean. Otherwise, it adds it as a string. So, if you have a URL like ${inline('/about?name=John&age=30&isCool=true')}, the ${inline('query')} object will look like this:
                </p>
                ${codeBlock(`
{
    name: 'John',
    age: 30,
    isCool: true
}
                `)}
                <p>
                    So, if you want to use the query parameters in your view, you can just pass the query into the view template or controller like this:
                </p>
                ${codeBlock(`
['about']() {
    el.body.appendChild(views.aboutTemplate(this.query));
    views.about(this.query);
}
                `)}
                <p>
                    And then you can use the query parameters in your view, keeping in mind that anything in a URL was typed by somebody, so it goes in with ${inline('textContent')}:
                </p>
                ${codeBlock(`
import el from '@elements';

export default function about(query: { [key: string]: boolean | number | string }) {
    const heading = el.about?.querySelector('h1');
    if (heading && query.name) heading.textContent = \`About \${query.name}\`;
}
                `)}
                <p>
                    And the ${inline('query')} property will be available in all your sub-route files, too, so just pass it in and use it as needed.
                </p>
            </section>
        </div>
    </el-docs>
`;

export default routesTemplate;
