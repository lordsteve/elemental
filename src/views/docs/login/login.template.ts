import Helpers from "@services/helpers";
import codeBlock, { inline } from "../codeBlock";

const html = Helpers.html;

const loginTemplate = () => html`
    <el-docs>
        <div class="content-slate">
            <section>
                <h1>Logging In</h1>
                <p>
                    Elemental comes with logging in already built, using Discord accounts. Nobody has to make yet another password, and you don't have to store any. It's switched off until you set it up, though, because it needs two things: a database to keep track of users, and a Discord application to log in through.
                </p>

                <h4>Setting It Up</h4>
                <ol>
                    <li>Set up a database and put its details in the ${inline('DB_')} variables in your ${inline('.env')} file (see <a href="/docs/the-server">The Server</a>).</li>
                    <li>Run ${inline('npm run migration:run')}. That creates the ${inline('user')} and ${inline('user_session')} tables.</li>
                    <li>Create an application in the <a href="https://discord.com/developers/applications" target="_blank">Discord Developer Portal</a>. Under OAuth2, add a redirect pointing at your site's ${inline('/data/auth-redirect')}, like ${inline('http://localhost:3000/data/auth-redirect')}.</li>
                    <li>Copy the client ID and client secret into ${inline('DISCORD_CLIENT_ID')} and ${inline('DISCORD_CLIENT_SECRET')}, and put that same redirect address in ${inline('LOGIN_REDIRECT_URL')}.</li>
                    <li>Add a login button (there's one below).</li>
                </ol>
                <p>
                    Until the database is there, the login routes answer with a 503 and a note saying so, and the rest of your site keeps on working.
                </p>

                <h4>How It Works</h4>
                <p>
                    Logging in bounces around a bit, so let's follow the data:
                </p>
                <ol>
                    <li>Someone clicks your login button. The front end asks ${inline('/data/get-discord-creds')} for your Discord client ID, and sends along a random ${inline('state')} and the page they're on. The server remembers that page under the ${inline('state')} for five minutes.</li>
                    <li>The browser goes to Discord, where they say yes.</li>
                    <li>Discord sends them to ${inline('/data/auth-redirect')} with a one-time code. The server trades the code for their Discord profile, then finds their ${inline('User')} by Discord id, or creates one. It keeps their username, email, and avatar up to date while it's at it.</li>
                    <li>The server makes a one-time ticket that's good for 60 seconds and redirects to ${inline('/start')} on your site with the ticket and the page they started on.</li>
                    <li>The front end's ${inline("['start']()")} route trades the ticket at ${inline('/data/start')} for a session key and the user. It keeps both in ${inline('localStorage')} and goes back to the page they started on.</li>
                </ol>
                <p>
                    From then on, the <a href="/docs/request-service">Request service</a> sends the session key with every request in the ${inline('Authorization')} header, and the server knows who's asking.
                </p>

                <h4>Sessions</h4>
                <p>
                    A session lasts three months. The server keeps it in memory, so checking it is quick, and also in the ${inline('user_session')} table, so a restart or a deploy doesn't log everybody out. The table only has a hash of each session key, never the key itself, so even someone who got a copy of your database couldn't use it to log in as anybody.
                </p>
                <p>
                    Because the key is in ${inline('localStorage')}, it's shared by every tab, and it's still there after the browser closes. When a page loads, ${inline('main.ts')} asks ${inline('/data/check-auth')} whether the server still knows the key. If it doesn't (it expired, or they logged out somewhere else), the page quietly forgets it.
                </p>
                <p>
                    Sending someone to ${inline('/logout')} ends their session on the server, forgets it in the browser, and takes them back to where they were.
                </p>

                <h4>Who's Logged In</h4>
                <p>
                    On the front end, the <a href="/docs/elements">Elements service</a> keeps track of it:
                </p>
                <ul>
                    <li>${inline('el.currentUser')} is the logged-in user, or ${inline('undefined')}.</li>
                    <li>${inline('el.isAuth')} is ${inline('true')} when somebody's logged in.</li>
                    <li>${inline('el.checkAuth()')} and ${inline('el.checkAdmin()')} return ${inline('true')} or ${inline('false')}. Hand either of them a value or a function, and you get that back instead, but only for a logged-in user or an admin.</li>
                </ul>
                ${codeBlock(`
// Only admins get the edit button
const editButton = el.checkAdmin('<button id="edit">Edit</button>', true) ?? '';

// Greet whoever's logged in
el.checkAuth(user => console.log(\`Welcome back, \${user.username}!\`));
                `)}
                <p>
                    The ${inline('true')} at the end of the first one makes it hand back nothing instead of ${inline('false')} for everybody else, so it drops right into a template.
                </p>
                <p>
                    That's only for showing and hiding things, though. Anybody can open the browser's developer tools and change what's in ${inline('localStorage')}. Whatever actually matters has to be checked on the server, where ${inline('SessionController.getUser(req)')} gives you the user the session key belongs to:
                </p>
                ${codeBlock(`
const currentUser = SessionController.getUser(req);
if (!currentUser?.isAdmin) {
    return {
        response: JSON.stringify('Unauthorized'),
        status: 401
    };
}
                `)}

                <h4>Admins</h4>
                <p>
                    Everybody starts out as a regular user. To make someone an admin, set ${inline('isAdmin')} to 1 on their row in the ${inline('user')} table. The server picks the change up the next time they log in, or the next time it restarts.
                </p>

                <h4>A Login Button</h4>
                <p>
                    Here's a button that logs people in, or out if they already are. Put it in your nav template:
                </p>
                ${codeBlock(`
<button id="login">\${el.isAuth ? 'Log Out' : 'Login with Discord'}</button>
                `, 'html')}
                <p>
                    And this in the nav controller:
                </p>
                ${codeBlock(`
import el from '@elements';
import { getData } from '@services/request';

const loginButton = el.buttons.id('login');
if (loginButton)
    loginButton.addEventListener('click', async () => {
        if (el.isAuth) {
            window.location.href = '/logout';
        } else {
            type DiscordCreds = { client_id: string, redirect_url: string, scope: string };
            const originatingUrl = location.pathname;
            const state = crypto.randomUUID();
            const { client_id, redirect_url, scope } = await getData<DiscordCreds>('/get-discord-creds', { state, originatingUrl });
            window.location.href = \`https://discord.com/oauth2/authorize?client_id=\${encodeURIComponent(client_id)}&response_type=code&redirect_uri=\${encodeURIComponent(redirect_url)}&scope=\${encodeURIComponent(scope)}&state=\${encodeURIComponent(state)}\`;
        }
    }, { signal: el.signal });
                `)}
            </section>
        </div>
    </el-docs>
`;

export default loginTemplate;
