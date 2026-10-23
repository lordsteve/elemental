import el from "@elements";
import { User } from "@entities";
import request, { getHtml } from "@services/request";
import views from "@views";

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

    /**
     * Where the server sends the browser after a Discord login. It trades the
     * one-time ticket for a session key, keeps the key and the user in
     * localStorage, and goes back to the page the login started from.
     */
    ['start']() {
        const url = (this.query.url as string) || '/';
        const ticket = this.query.ticket;
        if (!ticket) {
            console.error('No login ticket provided');
            window.location.href = url;
            return;
        }
        request('GET', '/data/start', { ticket }, false)
            .then((response) => {
                if (response.ok) {
                    const sessionKey = response.headers.get('Authorization');
                    if (!sessionKey) throw new Error('No session key returned');
                    localStorage.setItem('sessionKey', sessionKey);
                    el.sessionKey = sessionKey;
                    return response.json();
                } else {
                    throw new Error(response.statusText);
                }
            })
            .then((user: User | undefined) => {
                if (!user) throw new Error('No user returned');
                delete user.email;
                delete user.discord_id;
                localStorage.setItem('currentUser', JSON.stringify(user));
                el.currentUser = user;
                window.location.href = url;
            })
            .catch((error) => {
                console.error(error.message ?? error);
                window.location.href = url;
            });
    }

    ['logout']() {
        localStorage.removeItem('sessionKey');
        localStorage.removeItem('currentUser');
        request('GET', '/data/logout').then(() => {
            window.history.back();
        });
    }

    view() {
        const view = this[this.path[0]]?.bind(this);
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
