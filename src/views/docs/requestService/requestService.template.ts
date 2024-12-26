import { html, escapeHtml } from "@services/elements";

const requestService = () => html`
    <el-docs>
        <div class="content-slate">
            <section>
                <h1>Request Service</h1>
                <p>
                    The request service is a simple service that allows you to make HTTP requests from your application. It's built on top of the Fetch API and provides a simple interface for making requests. This will be your primary way of communicating with the server, but it can also be used to make requests to other APIs.
                </p>
                <h4>initLoader</h4>
                <p>
                    The <code>initLoader</code> function is included in the request service to activate the special <code>loader</code> element in the Elements service. It displays a special loader image when a request is being made, but it also adds a few different security measures to the request. Here's what it looks like:
                </p>
                <code>
                    ${
escapeHtml`export function initLoader() {
    window.fetch = ((oldFetch: typeof window.fetch, input: RequestInfo | URL = '', init?: RequestInit | undefined) => {
        return async (url: RequestInfo | URL = input, options: RequestInit | undefined = init) => {
            el.loader;
            if (options && options.method !== 'GET') {
                el.csrfToken = await oldFetch('/csrf-token').then(response => response.text());
                options.headers
                    ? options.headers['X-CSRF-TOKEN' as keyof HeadersInit] = el.csrfToken
                    : options = {
                        ...options,
                        headers: {
                            'X-CSRF-TOKEN': el.csrfToken
                        }
                    };
            }
            if (options && options.headers) options.headers['X-Requested-With' as keyof HeadersInit] = 'Elemental';
            if (!options) options = { headers: { 'X-Requested-With': 'Elemental' } };
            if (!options.headers) options.headers = { 'X-Requested-With': 'Elemental' };
            const response = await oldFetch(url, options);
            el.loader.remove();
            return response;
        }
    })(window.fetch);

    window.onload = ((oldLoad: typeof window.onload | undefined) => {
        el.loader;
        return (e) => {
            if (!!oldLoad) oldLoad.call(window, e);
            el.loader.remove();
        }
    })(window.onload?.bind(window));
}`}
                </code>
                <p>
                    There's a little bit of fancy syntax going on here, but the basic idea is that it takes the <code>fetch</code> function and wraps it in a new function that adds some extra functionality. It checks if the request is a GET request, and if it's not, it fetches a CSRF token from the server and adds it to the request headers. It also adds a special header to the request to identify it as an Elemental request. Finally, it removes the loader element when the request is complete. With the combination of the CSRF token and the Elemental tag, the server will be able to identify the request as coming from your application and not from a malicious source.
                </p>
                <p>
                    We round it out with a bit of code that adds the loader element to the page when the window loads, and removes it when the window is done loading.
                </p>
                <p>
                    This function is called in the <code>main.ts</code> file first thing so that the fetch function is ready for everything else you wanna do with it.
                </p>
                <h4>Making Requests</h4>
                <p>
                    The <code>request</code> function is the basic way to make requests from your application. It's a simple wrapper around the fetch function that adds some extra functionality. Here's what it looks like:
                </p>
                <code>
                    ${
escapeHtml`export default async function request<T = Response>(
    method: Method,
    path: string,
    data: RequestData | object | null = null,
    evalResult = true,
): Promise<T extends Response ? Response : T> {
    let payLoad: RequestInit | undefined = undefined;

    if (method !== 'GET') payLoad = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        } as HeadersInit,
        body: JSON.stringify(data) as BodyInit,
    };

    const routePostfix = await getPostfix(method, data as RequestData | null);

    const response = await fetch(\`$\{path}$\{routePostfix}\`, payLoad);

    return evalResult
        ? response.json().then(obj => obj as T extends Response ? Response : T)
        : response as T extends Response ? Response : T;
}`}
                </code>
                <p>
                    This takes a method, a path, some data, and an optional flag to evaluate the result. Depending on the method, the data should be built as a RequestData object or a plain object. If the method is GET, the data will be appended to the path as query parameters. If the method is POST, PUT, or DELETE, the data will be sent as JSON in the request. The <code>evalResult</code> flag is used to determine if the response should be evaluated as JSON or returned as is.
                </p>
                <p>
                    This is just the basic request, though. There are other functions in the request service that can be used to make more specific requests. For example, the <code>get</code>, <code>post</code>, <code>put</code>, and <code>delete</code> functions are all wrappers around the <code>request</code> function that make it easier to make specific types of requests. So, most of the time when you see a request being made in a controller, it'll look something like this:
                </p>
                <code>
                    const data = await get('/data/path');
                </code>
            </section>
        </div>
    </el-docs>
`;

export default requestService;