import Helpers from "@services/helpers";
import codeBlock, { inline } from "../codeBlock";

const html = Helpers.html;

const requestService = () => html`
    <el-docs>
        <div class="content-slate">
            <section>
                <h1>Request Service</h1>
                <p>
                    The Request service is a simple service that allows you to make HTTP requests from your application. It's built on top of the Fetch API and provides a simple interface for making requests. This will be your primary way of communicating with the server, but it can also be used to make requests to other APIs.
                </p>

                <h4>initLoader</h4>
                <p>
                    The ${inline('initLoader')} function is included in the Request service to activate the special loader element in the Elements service. It displays a loading spinner while a request is being made, but it also adds a few different security measures to every request. Here's what it looks like:
                </p>
                ${codeBlock(`
export function initLoader() {
    el.loader;
    window.fetch = ((oldFetch: typeof window.fetch, input: RequestInfo | URL = '', init?: RequestInit | undefined) => {
        return async (url: RequestInfo | URL = input, options: RequestInit | undefined = init) => {
            el.loader;
            if (options && options.method && options.method !== 'GET') {
                if (!el.csrfToken) {
                    const cookieToken = CookieJar.get<string>('csrfToken');
                    if (typeof cookieToken === 'string' && cookieToken) {
                        el.csrfToken = cookieToken;
                    } else {
                        el.csrfToken = await oldFetch('/csrf-token').then(response => response.text());
                    }
                }
                // ...adds the token as an X-CSRF-TOKEN header...
            }
            // ...adds an X-Requested-With: Elemental header...
            return oldFetch(url, options).then((resp) => {
                el.loader.remove();
                if (resp.status === 403) {
                    el.csrfToken = '';
                }
                if (!resp.ok) return resp.json().then(err => { throw err; });
                return resp;
            });
        }
    })(window.fetch);
    window.addEventListener('load', () => el.loader.remove(), { signal: el.signal });
}
                `)}
                <p>
                    There's a little bit of fancy syntax going on here, but the basic idea is that it takes the browser's ${inline('fetch')} function and wraps it in a new function that adds some extra functionality. Every time you call ${inline('fetch')} after this, whether through the Request service or on your own, you get all of this for free:
                </p>
                <ul>
                    <li>The loader shows up while the request is running and goes away when it's done.</li>
                    <li>Anything that isn't a GET carries a CSRF token. The server hands one out in a cookie on your first visit, so usually it's already there. If it isn't, ${inline('initLoader')} asks ${inline('/csrf-token')} for one. If the server ever turns the token down with a 403, it's thrown out so the next request fetches a fresh one.</li>
                    <li>Every request carries an ${inline('X-Requested-With: Elemental')} header. The server won't hand out anything from ${inline('/views/')} without it.</li>
                    <li>If the server answers with an error, the promise rejects with whatever the server sent back, so you can ${inline('catch')} it and show it.</li>
                </ul>
                <p>
                    With the combination of the CSRF token and the Elemental header, the server can tell the request came from your application and not from some other site trying to act on your users' behalf.
                </p>
                <p>
                    This function is called in the ${inline('main.ts')} file first thing so that ${inline('fetch')} is ready for everything else you wanna do with it.
                </p>

                <h4>Making Requests</h4>
                <p>
                    The ${inline('request')} function is the basic way to make requests from your application. It's a simple wrapper around the ${inline('fetch')} function that adds some extra functionality. Here's what it looks like:
                </p>
                ${codeBlock(`
export default async function request<T = Response>(
    method: Method,
    path: string,
    data: RequestData | object | null = null,
    evalResult = true,
): Promise<T extends Response ? Response : T> {
    let payLoad: RequestInit | undefined = undefined;

    if (method !== 'GET') payLoad = Object.assign(payLoad ?? {}, {
        method,
        headers: data instanceof FormData ? undefined : {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        } as HeadersInit,
        body: data instanceof FormData ? data : JSON.stringify(data) as BodyInit,
    });

    const routePostfix = getPostfix(method, data);

    const response = await fetch(\`\${path}\${routePostfix}\`, payLoad);

    return evalResult
        ? await response.json().then((obj: T extends Response ? Response : T) => obj)
        : response as T extends Response ? Response : T;
}
                `)}
                <p>
                    This takes a method, a path, some data, and an optional flag to evaluate the result. If the method is GET, the data will be appended to the path as query parameters. If the method is POST, PUT, or DELETE, the data will be sent as JSON in the body of the request. If you pass a ${inline('FormData')} instead, it gets sent as is, which is how you upload files. The ${inline('evalResult')} flag is used to determine if the response should be parsed as JSON or handed back as is.
                </p>
                <p>
                    This is just the basic request, though. Most of the time you'll use one of the shortcuts, which pick the method for you:
                </p>
                <ul>
                    <li>${inline('get()')}, ${inline('post()')}, ${inline('put()')}, and ${inline('del()')} take the whole path.</li>
                    <li>${inline('getData()')}, ${inline('postData()')}, ${inline('putData()')}, and ${inline('delData()')} put ${inline('/data')} in front of the path for you, since that's where all of your server's routes live.</li>
                </ul>
                <p>
                    All of them parse the JSON response for you except the two DELETE ones, which hand back the response itself. You can tell the parsed ones what type to expect, so most of the time when you see a request being made in a controller, it'll look something like this:
                </p>
                ${codeBlock(`
import { getData, postData } from '@services/request';

const links = await getData<Link[]>('/get-links');
const saved = await postData<Link>('/save-link', { url, text });
                `)}
                <p>
                    And since a failed request rejects with whatever the server sent back, handling errors looks like this:
                </p>
                ${codeBlock(`
postData('/save-link', { url, text })
    .then(link => showLink(link))
    .catch(error => alert(error));
                `)}

                <h4>Where Requests Go</h4>
                <p>
                    Another unique thing about making requests has to do with how the server handles them. There are three different URI directories that the server will respond to: ${inline('/views/')}, ${inline('/storage/')}, and ${inline('/data/')}. The ${inline('/views/')} directory is used to serve HTML files (useful for serving modals on top of a page that's already being served). The ${inline('/storage/')} directory is used to serve files from the ${inline('www/storage')} directory (things like pictures and downloadables). The ${inline('/data/')} directory is where your server routes live, which is where you get data from a database or wherever else.
                </p>
                <p>
                    So, if you want to get data from the server, you would make a request like this: ${inline("const data = await getData('/path/to/data');")}. If you want an HTML view, you would use ${inline("getHtml('/views/path/to/view')")}. And files in ${inline('/storage/')} are usually just linked to with a URL in an ${inline('<img>')} or ${inline('<a>')} tag.
                </p>
                <p>
                    You'll notice the ${inline('getHtml')} function in there. This is a special function that's used to fetch HTML. It's a little different from the other request functions because it can return either a single ${inline('HTMLElement')} or a ${inline('NodeListOf<HTMLElement>')}, depending on what the server sends. This is useful for serving modals or other views that need to be added to the page. You can tell it which one you're expecting: ${inline("getHtml<HTMLElement>('/views/my-modal.html')")}.
                </p>
            </section>
        </div>
    </el-docs>
`;

export default requestService;
