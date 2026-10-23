import Helpers from "@services/helpers";
import codeBlock, { inline } from "../codeBlock";

const html = Helpers.html;

const theServer = () => html`
    <el-docs>
        <div class="content-slate">
            <section>
                <h1>The Server</h1>
                <p>
                    The server is just a simple Node.js application. Elemental is largely focused on the front end, but understanding the backend will help you build more complex applications and, if you want to, integrate a database.
                </p>
                <p>
                    If you've already downloaded Elemental, go ahead and open up ${inline('server/main.ts')} to follow along. Alternatively, you can follow along on <a href="https://github.com/lordsteve/elemental/blob/master/server/main.ts" target="_blank">GitHub</a>.
                </p>

                <h4>Starting Up</h4>
                <p>
                    Start at the bottom of the file, with ${inline('startServer()')}. If ${inline('ENV')} is ${inline('development')}, the server doesn't serve anything itself at first. It starts browser-sync and nodemon, and nodemon starts a second copy of the server that does the actual serving. That's what gets you the page reloading and the server restarting while you work.
                </p>
                <p>
                    The copy that does the serving checks for a database next. If ${inline('DB_HOST')} is set, it connects to the database, and if that fails, it stops right there, because a server that thinks it has a database and doesn't is worse than one that never had one. If ${inline('DB_HOST')} isn't set, it says so in the console and carries on without one. Then it starts listening on ${inline('PORT')}.
                </p>

                <h4>Follow the Data</h4>
                <p>
                    Whenever I'm debugging, I always tell myself to "follow the data". This means to trace through the code in your head and see what parts of it are being hit based on what you believe the data should be. Every request goes through ${inline('makeServer()')}, which takes two arguments: ${inline('req')} and ${inline('res')}. These are the request and response objects that are passed to the server when a request is made. The data that you are following here is the ${inline('req')}.
                </p>
                <p>
                    As you can see, we're extracting three things from the ${inline('req')} object: the ${inline('url')}, the ${inline('headers')}, and the ${inline('method')}. The ${inline('url')} is the path that the user is trying to access, the ${inline('headers')} are the headers that the user is sending with the request, and the ${inline('method')} is the type of request that the user is making (GET, POST, etc.). The ${inline('headers')} and the ${inline('method')} are consts; they should never change. The ${inline('url')}, on the other hand, is a let, because we're going to have to manipulate it a bit to get to what we want.
                </p>

                <h4>CSRF Tokens</h4>
                <p>
                    The first stop is the CSRF check. If the browser doesn't have a ${inline('csrf-token')} cookie yet, the server makes up a random token, remembers it in the cache for a day, and sends it back as a cookie. Then, if the request is anything other than a GET, it has to carry that token in an ${inline('X-CSRF-TOKEN')} header. If the header is missing or doesn't match, the server stops right there with a 403 Forbidden.
                </p>
                <p>
                    The reason this works is that another website can make your user's browser send a request to your site, cookie and all, but it can't read the cookie to copy it into a header. The <a href="/docs/request-service">Request service</a> does the copying for you, so as long as your requests go through ${inline('fetch')} after ${inline('initLoader()')}, you never have to think about it.
                </p>

                <h4>Where It Goes Next</h4>
                <p>
                    The next thing the data hits is a simple switch statement. Based on what the ${inline('url')} is, it will either get the favicon, hand out a CSRF token at ${inline('/csrf-token')}, or, in the default case, look to see if the ${inline('url')} is in the ${inline('/views/')}, ${inline('/storage/')}, or ${inline('/data/')} directories.
                </p>
                <p>
                    <b>Views:</b> When the ${inline('url')} starts with ${inline('/views/')}, the server checks the headers for an ${inline('X-Requested-With')} header of "Elemental". This is just another precaution to make sure that the request is coming from your application and not from somewhere else. If the header is not "Elemental", the server will return a 403 Forbidden error. If it is, the server serves the file from the ${inline('www/views')} directory.
                </p>
                <p>
                    <b>Storage:</b> Storage is real simple. If the ${inline('url')} starts with ${inline('/storage/')}, the server will look for the file in the ${inline('www/storage')} directory and serve it up. This is useful for serving pictures or downloadables like pdfs or docs or whatever. Anything in ${inline('src/storage')} gets copied there when you build.
                </p>
                <p>
                    <b>Data:</b> If the ${inline('url')} starts with ${inline('/data/')}, the server will pass the request to the Routes class and get a response back. I'll get to that in a second.
                </p>
                <p>
                    <b>Everything else:</b> Anything else gets ${inline('index.html')}, ${inline('main.css')}, or ${inline('main.js')}, depending on what it ends in. That's what lets you type ${inline('/docs/the-server')} into the address bar and land on this page: the server hands back ${inline('index.html')}, and the front-end <a href="/docs/routes">Routes</a> take it from there.
                </p>

                <h4>Server Routes</h4>
                <p>
                    I know you learned about a Routes class in the Routes section, but that was for the front end. This one is in ${inline('server/routes.ts')}, and it's based on the same principles. It takes the ${inline('url')} from the request, removes the ${inline('/data/')} part and anything after a ${inline('?')}, and uses what's left to find the function to call:
                </p>
                ${codeBlock(`
@Method('GET')
private ['/get-data'](req: http.IncomingMessage, res: http.ServerResponse): ResponsePromise {
    return BaseController.getData(req, res);
}
                `)}
                <p>
                    So a request to ${inline('/data/get-data')} calls that function. If there isn't a function for the path, the server sends back a 404 Not Found.
                </p>
                <p>
                    You'll also see a ${inline('@Method')} decorator. This is a little bit of TypeScript magic that will check the method of the request and make sure that it's the right one. If it's not, the server will return a 405 Method Not Allowed error. If it is, it calls the function.
                </p>
                <p>
                    Every route returns the same shape of thing:
                </p>
                ${codeBlock(`
{
    response: any;          // the body to send back
    status: number;         // the status code
    header?: string;        // the Content-Type (defaults to application/json)
    headerName?: string;    // send header under a different name instead
}
                `)}
                <p>
                    ${inline('headerName')} is for the odd response that needs a header other than ${inline('Content-Type')}. A redirect, for example, is a 301 status with ${inline("headerName: 'Location'")} and the address in ${inline('header')}.
                </p>

                <h4>Controllers</h4>
                <p>
                    The controller is where the magic happens. It's where the server will take the request and do something with it. All new controllers should inherit from the ${inline('BaseController')} class, which has a few methods that will help you build your controller:
                </p>
                <ul>
                    <li>${inline('readBody(req)')} reads the JSON the client sent and hands it back as an object. Pass ${inline('false')} as a second argument to get the raw ${inline('Buffer')} instead.</li>
                    <li>${inline('parseUrlQuery(req.url)')} hands back the query parameters as an object.</li>
                    <li>${inline('checkAndMakeChanges(obj, newObj)')} copies over whatever changed and tells you whether anything did, so you only save to the database when you need to.</li>
                </ul>
                <p>
                    From there you can just build your own methods based on whatever it is that you need the app to do. A method that saves something might look like this:
                </p>
                ${codeBlock(`
public static async saveLink(req: http.IncomingMessage, res: http.ServerResponse) {
    const body = await this.readBody<Link>(req);
    if (!body?.url) {
        return {
            response: JSON.stringify('A URL is required'),
            status: 400
        };
    }
    const link = await AppDataSource.getRepository(Link).save(body);
    return {
        response: JSON.stringify(link),
        status: 201
    };
}
                `)}
                <p>
                    Add a route for it in ${inline('server/routes.ts')} and it's ready for ${inline("postData('/save-link', link)")}. Check what comes in, too. Anybody can send your server a request, so don't trust the body just because your own page usually sends it.
                </p>

                <h4>HTML From the Server</h4>
                <p>
                    Sometimes it's handy to keep a chunk of HTML on the server, like the form for a modal. Any ${inline('.html')} file under ${inline('server/')} gets copied next to the compiled server code when you build (that's the ${inline('server-html')} script), so a controller can read it and send it back with ${inline("header: 'text/html'")}. On the front end, ${inline('buildModalFromUrl()')} in ${inline('src/views/modal/modal.ctrl.ts')} fetches it from a ${inline('/data/')} route, puts it on the page, and closes it when someone clicks outside it or on its ${inline('.close-button')}.
                </p>

                <h4>The Cache</h4>
                <p>
                    ${inline('server/cache.ts')} is a single NodeCache that the whole server shares. It's where the CSRF tokens live while the server is running, and you can use it too: ${inline("cache.set('key', value, seconds)")} and ${inline("cache.get('key')")}. Just remember it's only memory, so it's empty again after a restart. Anything that has to survive one belongs in the database.
                </p>

                <h4>The Database</h4>
                <p>
                    At its most basic, Elemental doesn't need a database at all. When you do want one, it uses <a href="https://typeorm.io/" target="_blank">TypeORM</a>, which has its own documentation that you can follow, but there are a few things that are specific to Elemental that you should know.
                </p>
                <p>
                    ${inline('server/services/database/data-source.ts')} uses environment variables to connect to the database: ${inline('DB_HOST')}, ${inline('DB_PORT')}, ${inline('DB_USER')}, ${inline('DB_PASS')}, and ${inline('DB_NAME')}. In development those come from your ${inline('.env')} file. By default it connects to MySQL (through the ${inline('mysql2')} package), but you can change the ${inline('type')} to whatever TypeORM supports. The ${inline('pg')} package for PostgreSQL is already installed.
                </p>
                <p>
                    When you create new entities, put them in the ${inline('server/services/database/entity')} directory. Every file in there is picked up on its own, so there's nothing to register. Then use the repository wherever you need it:
                </p>
                ${codeBlock(`
import AppDataSource from 'services/database';
import { User } from 'services/database/entity/User';

const users = await AppDataSource.getRepository(User).find();
                `)}
                <p>
                    TypeORM won't change your tables on its own. After you create or edit your entities, you make a migration for the change. You're not gonna just create a new file for it, though. We've got scripts set up for that:
                </p>
                ${codeBlock(`
npm run migration:generate server/services/database/migration/{migration-name}
npm run migration:run
npm run migration:revert
                `, 'plaintext')}
                <p>
                    The first one compares your entities to the database and writes a migration file in ${inline('server/services/database/migration')} with the changes. The second one applies any migrations that haven't been run yet. And if you mess it up, the third one undoes the last migration. Run ${inline('migration:run')} on your production database before you deploy code that needs the change, or the new code will go looking for tables and columns that aren't there yet.
                </p>
                <p>
                    Elemental comes with an example ${inline('User')} entity and the migration that creates its table, so you can see what both look like.
                </p>
            </section>
        </div>
    </el-docs>
`;

export default theServer;
