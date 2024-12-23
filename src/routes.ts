import el from "@services/elements";
import { getHtml } from "@services/request";
import views from "@views";

export default class Routes {
    query: {[key: string]: any} = {};
    constructor(
        public path: string[]
    ) {
        new URLSearchParams(location.search).entries().forEach((entry) => {
            this.query[entry[0]] = isNaN(Number(entry[1]))
                ? entry[1].toLowerCase() == 'true' || entry[1].toLowerCase() == 'false'
                    ? Boolean(entry[1].toLowerCase())
                    : entry[1]
                : Number(entry[1]);
        });
    }

    ['']() {
        el.body.appendChild(views.homeTemplate(
            "It's Elemental",
            "A boilerplate framework for TypeScript web development."
        ));
        views.home();
    }

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

    view() {
        const view = this[this.path[0]].bind(this);
        if (typeof view !== 'function') {
            getHtml(location.pathname)
            .then((page) => {
                if (page instanceof HTMLElement) {
                    el.body.appendChild(page);
                } else if (page instanceof NodeList) {
                    page.forEach((element) => {
                        el.body.appendChild(element);
                    });
                }

                if (el.nav.nextElementSibling === null) {
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